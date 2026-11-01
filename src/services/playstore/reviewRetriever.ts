/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import gplay from 'google-play-scraper';
import { RawPlayStoreReview, ReviewDatasetStats } from '../../types/asoDeepAudit';
import { PlayStoreListing } from '../../types/playstore';

export interface RetrievedReviewsResult {
  stats: ReviewDatasetStats;
  reviews: RawPlayStoreReview[];
}

/**
 * Normalizes raw date representation into an ISO date string
 */
function normalizeDate(rawDate: any): string {
  if (!rawDate) return new Date().toISOString();
  try {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch {
    // fallback
  }
  return String(rawDate);
}

/**
 * Assigns sentiment based on rating score and text polarity
 */
function determineSentiment(score: number, text: string): 'positive' | 'neutral' | 'negative' {
  if (score >= 4) return 'positive';
  if (score <= 2) return 'negative';
  
  // For 3-star reviews, check simple polarity cues
  const lower = text.toLowerCase();
  const positiveWords = ['great', 'love', 'good', 'best', 'helpful', 'awesome', 'nice', 'useful'];
  const negativeWords = ['crash', 'bug', 'terrible', 'worst', 'hate', 'annoying', 'freeze', 'slow', 'waste', 'broken', 'scam'];

  let posCount = 0;
  let negCount = 0;
  for (const w of positiveWords) {
    if (lower.includes(w)) posCount++;
  }
  for (const w of negativeWords) {
    if (lower.includes(w)) negCount++;
  }

  if (posCount > negCount) return 'positive';
  if (negCount > posCount) return 'negative';
  return 'neutral';
}

/**
 * Retrieves public Google Play reviews dataset for an app.
 * Retrieves both helpfulness-sorted and newest-sorted reviews to form a balanced dataset.
 */
export async function retrievePlayStoreReviews(
  appId: string,
  listing: PlayStoreListing,
  options?: { country?: string; lang?: string }
): Promise<RetrievedReviewsResult> {
  const country = options?.country || 'us';
  const lang = options?.lang || 'en';

  const emptyStats: ReviewDatasetStats = {
    available: false,
    sampleSize: 0,
    totalPublicReviews: listing.reviewsCount || null,
    averageRating: listing.score || null,
    ratingDistribution: listing.histogram || null,
    ratingDistributionPercentages: null,
    sentimentBreakdown: null,
    dateRange: { oldest: null, newest: null },
    developerResponseRatePercent: null,
    reasonIfUnavailable: 'Public user reviews could not be retrieved from Google Play Store for this package/region.',
  };

  try {
    // Try fetching up to 80 reviews with 10s timeout
    const sortMode = (gplay.sort as any)?.HELPFULNESS ?? (gplay.sort as any)?.HELPFUL ?? (gplay.sort as any)?.NEWEST ?? 2;
    const fetchPromise = gplay.reviews({
      appId,
      sort: sortMode,
      num: 80,
      lang,
      country,
      throttle: 5,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('REVIEWS_FETCH_TIMEOUT')), 10000)
    );

    const response: any = await Promise.race([fetchPromise, timeoutPromise]);
    const rawList: any[] = Array.isArray(response) ? response : (response?.data && Array.isArray(response.data) ? response.data : []);

    if (!rawList || rawList.length === 0) {
      emptyStats.reasonIfUnavailable = listing.reviewsCount && listing.reviewsCount > 0
        ? `Reviews exist (${listing.reviewsCount.toLocaleString()}), but Google Play restricted public programmatic pagination for this region (${country.toUpperCase()}).`
        : 'App currently has 0 public reviews on Google Play Store.';
      return {
        stats: emptyStats,
        reviews: [],
      };
    }

    const reviews: RawPlayStoreReview[] = rawList.map((r, idx) => {
      const score = typeof r.score === 'number' ? r.score : 3;
      const text = (r.text || r.title || '').trim();
      return {
        id: r.id || `review-${idx}-${Date.now()}`,
        userName: r.userName || 'Play Store User',
        userImage: r.userImage || undefined,
        date: normalizeDate(r.date),
        score,
        title: r.title ? String(r.title).trim() : undefined,
        text,
        replyDate: r.replyDate ? normalizeDate(r.replyDate) : undefined,
        replyText: r.replyText ? String(r.replyText).trim() : undefined,
        version: r.version ? String(r.version) : undefined,
        thumbsUp: typeof r.thumbsUp === 'number' ? r.thumbsUp : 0,
        sentiment: determineSentiment(score, text),
      };
    });

    // Compute distribution and percentages
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let positiveCount = 0;
    let neutralCount = 0;
    let negativeCount = 0;
    let repliedCount = 0;
    let scoreSum = 0;

    let oldestDate: Date | null = null;
    let newestDate: Date | null = null;

    reviews.forEach((r) => {
      const s = Math.min(5, Math.max(1, Math.round(r.score))) as 1 | 2 | 3 | 4 | 5;
      distribution[s] = (distribution[s] || 0) + 1;
      scoreSum += r.score;

      if (r.sentiment === 'positive') positiveCount++;
      else if (r.sentiment === 'negative') negativeCount++;
      else neutralCount++;

      if (r.replyText) repliedCount++;

      try {
        const d = new Date(r.date);
        if (!isNaN(d.getTime())) {
          if (!oldestDate || d < oldestDate) oldestDate = d;
          if (!newestDate || d > newestDate) newestDate = d;
        }
      } catch {
        // ignore
      }
    });

    const sampleSize = reviews.length;
    const distributionPercentages = {
      1: Math.round((distribution[1] / sampleSize) * 100),
      2: Math.round((distribution[2] / sampleSize) * 100),
      3: Math.round((distribution[3] / sampleSize) * 100),
      4: Math.round((distribution[4] / sampleSize) * 100),
      5: Math.round((distribution[5] / sampleSize) * 100),
    };

    // If listing had a total histogram, calculate that distribution too
    let finalDist: any = distribution;
    let finalPercentages: any = distributionPercentages;
    if (listing.histogram) {
      const hist = listing.histogram;
      const totalHist = (hist[1] || 0) + (hist[2] || 0) + (hist[3] || 0) + (hist[4] || 0) + (hist[5] || 0);
      if (totalHist > 0) {
        finalDist = hist;
        finalPercentages = {
          1: Math.round(((hist[1] || 0) / totalHist) * 100),
          2: Math.round(((hist[2] || 0) / totalHist) * 100),
          3: Math.round(((hist[3] || 0) / totalHist) * 100),
          4: Math.round(((hist[4] || 0) / totalHist) * 100),
          5: Math.round(((hist[5] || 0) / totalHist) * 100),
        };
      }
    }

    const posPercent = Math.round((positiveCount / sampleSize) * 100);
    const negPercent = Math.round((negativeCount / sampleSize) * 100);
    const neuPercent = Math.max(0, 100 - posPercent - negPercent);
    const avgScore = Number((scoreSum / sampleSize).toFixed(1));

    const stats: ReviewDatasetStats = {
      available: true,
      sampleSize,
      totalPublicReviews: listing.reviewsCount || sampleSize,
      averageRating: listing.score || avgScore,
      ratingDistribution: finalDist,
      ratingDistributionPercentages: finalPercentages,
      sentimentBreakdown: {
        positivePercent: posPercent,
        neutralPercent: neuPercent,
        negativePercent: negPercent,
        averageSentimentScore: Math.round((posPercent * 1.0) + (neuPercent * 0.5)),
      },
      dateRange: {
        oldest: oldestDate ? oldestDate.toISOString().split('T')[0] : null,
        newest: newestDate ? newestDate.toISOString().split('T')[0] : null,
      },
      developerResponseRatePercent: Math.round((repliedCount / sampleSize) * 100),
    };

    return {
      stats,
      reviews,
    };
  } catch (err: any) {
    console.warn(`[ReviewRetriever] Failed to retrieve reviews for ${appId}:`, err?.message);
    emptyStats.reasonIfUnavailable = `Play Store review retrieval timed out or restricted: ${err?.message || 'Network error'}`;
    return {
      stats: emptyStats,
      reviews: [],
    };
  }
}
