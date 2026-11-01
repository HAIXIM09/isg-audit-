/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';
import {
  RawPlayStoreReview,
  ReviewDatasetStats,
  ReviewIntelligenceSection,
  ReviewThemeItem,
  ReviewRecencyAnalysis,
  ConversionBlockerReviewIssue,
  StructuredFinding,
} from '../../types/asoDeepAudit';
import { PlayStoreListing } from '../../types/playstore';

/**
 * Deterministic Review Intelligence generator for when AI is offline or as baseline.
 */
export function generateDeterministicReviewIntelligence(
  stats: ReviewDatasetStats,
  reviews: RawPlayStoreReview[],
  listing: PlayStoreListing
): ReviewIntelligenceSection {
  const findings: StructuredFinding[] = [];

  if (!stats.available || reviews.length === 0) {
    findings.push({
      id: 'rev-unavailable-1',
      category: 'Ratings & Reviews',
      evidence: stats.reasonIfUnavailable || 'No public reviews available for this listing.',
      issue: 'Public reviews could not be extracted for this app package.',
      severity: 'info',
      explanation: 'Review sentiment and recurring user themes cannot be computed without verified public review data.',
      recommendation: 'Encourage early beta testers and engaged users to leave genuine ratings on Google Play.',
      confidence: 'High',
    });

    return {
      stats,
      recurringPositiveThemes: [],
      recurringNegativeThemes: [],
      bugsAndUsabilityIssues: [],
      featureRequests: [],
      praisePatterns: [],
      conversionBlockers: [],
      recencyAnalysis: {
        trendDirection: 'Insufficient Data',
        summary: stats.reasonIfUnavailable || 'No review data available to evaluate recency trends.',
        recentFeedbackFocus: 'N/A',
        olderFeedbackFocus: 'N/A',
        confidence: 'Low',
      },
      rawReviews: [],
      findings,
    };
  }

  // Filter positive and negative reviews
  const positiveReviews = reviews.filter((r) => r.score >= 4);
  const negativeReviews = reviews.filter((r) => r.score <= 2);
  const neutralReviews = reviews.filter((r) => r.score === 3);

  // 1. Positive themes extraction
  const positiveThemes: ReviewThemeItem[] = [];
  if (positiveReviews.length > 0) {
    const samplePraise = positiveReviews.slice(0, 3).map((r) => `"${r.text.slice(0, 120)}..."`);
    positiveThemes.push({
      theme: 'Core Utility & User Satisfaction',
      occurrenceEstimate: `High (~${stats.sentimentBreakdown?.positivePercent || 70}% of analyzed reviews)`,
      sampleQuotes: samplePraise,
      asoAndConversionImpact: 'Provides positive social proof. Highlight the most praised features in Screenshot #1 and promo text.',
      severityOrType: 'strength',
      confidence: stats.sampleSize >= 20 ? 'High' : 'Medium',
    });
  }

  // 2. Negative themes extraction
  const negativeThemes: ReviewThemeItem[] = [];
  const bugIssues: ReviewThemeItem[] = [];
  const conversionBlockers: ConversionBlockerReviewIssue[] = [];

  const bugKeywords = ['crash', 'bug', 'freeze', 'error', 'login', 'update', 'broken', 'slow', 'ad', 'ads', 'battery'];
  const bugReviews = reviews.filter((r) =>
    bugKeywords.some((k) => r.text.toLowerCase().includes(k))
  );

  if (bugReviews.length > 0) {
    const quotes = bugReviews.slice(0, 3).map((r) => `"${r.text.slice(0, 120)}..."`);
    bugIssues.push({
      theme: 'Stability, Performance & Ads Complaints',
      occurrenceEstimate: `${bugReviews.length} out of ${reviews.length} reviews mentioned technical friction or ads`,
      sampleQuotes: quotes,
      asoAndConversionImpact: 'Critical. Prospective users who read reviews before downloading often bounce when seeing unaddressed crash or ad complaints.',
      severityOrType: 'bug',
      confidence: 'High',
    });

    conversionBlockers.push({
      issue: 'Reported Performance or Advertising Friction',
      impactOnProspects: 'High churn risk for new visitors reading store reviews prior to tapping Install.',
      evidenceQuote: quotes[0] || 'App freezes on launch.',
      actionableMitigation: 'Reply to affected users in Play Console, patch identified bugs, and communicate fixes in the "What\'s New" release notes.',
    });
  }

  if (negativeReviews.length > 0) {
    const negQuotes = negativeReviews.slice(0, 3).map((r) => `"${r.text.slice(0, 120)}..."`);
    negativeThemes.push({
      theme: 'Critical User Friction & Unmet Expectations',
      occurrenceEstimate: `~${stats.sentimentBreakdown?.negativePercent || 15}% of sample`,
      sampleQuotes: negQuotes,
      asoAndConversionImpact: 'Lower star ratings drag down search visibility algorithms and suppress keyword ranking momentum.',
      severityOrType: 'friction',
      confidence: 'High',
    });
  }

  // 3. Feature Requests
  const requestKeywords = ['please add', 'would love', 'wish', 'need', 'feature', 'option', 'support for'];
  const requestReviews = reviews.filter((r) =>
    requestKeywords.some((k) => r.text.toLowerCase().includes(k))
  );
  const featureRequests: ReviewThemeItem[] = [];
  if (requestReviews.length > 0) {
    featureRequests.push({
      theme: 'User-Requested Features & Enhancements',
      occurrenceEstimate: `${requestReviews.length} reviews requested additions`,
      sampleQuotes: requestReviews.slice(0, 3).map((r) => `"${r.text.slice(0, 120)}..."`),
      asoAndConversionImpact: 'Incorporating high-demand features and announcing them in release notes directly boosts review sentiment and retention.',
      severityOrType: 'feature_request',
      confidence: 'Medium',
    });
  }

  // 4. Recency Analysis
  // Split reviews into recent half and older half by date
  const sortedByDate = [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const half = Math.floor(sortedByDate.length / 2);
  const recentSlice = sortedByDate.slice(0, Math.max(1, half));
  const olderSlice = sortedByDate.slice(half);

  const recentAvg = recentSlice.reduce((sum, r) => sum + r.score, 0) / (recentSlice.length || 1);
  const olderAvg = olderSlice.length > 0 ? olderSlice.reduce((sum, r) => sum + r.score, 0) / olderSlice.length : recentAvg;

  let trendDirection: 'Improving' | 'Stable' | 'Deteriorating' | 'Insufficient Data' = 'Stable';
  if (recentAvg - olderAvg >= 0.3) trendDirection = 'Improving';
  else if (olderAvg - recentAvg >= 0.3) trendDirection = 'Deteriorating';

  const recencyAnalysis: ReviewRecencyAnalysis = {
    trendDirection,
    summary: `Recent review sample average is ${recentAvg.toFixed(1)}★ compared to earlier sample average of ${olderAvg.toFixed(1)}★.`,
    recentFeedbackFocus: recentSlice.length > 0 ? recentSlice[0].text.slice(0, 100) + '...' : 'General usage feedback',
    olderFeedbackFocus: olderSlice.length > 0 ? olderSlice[0].text.slice(0, 100) + '...' : 'Initial launch impressions',
    versionShiftObservation: `Sample includes versions: ${Array.from(new Set(reviews.map((r) => r.version).filter(Boolean))).slice(0, 3).join(', ') || 'Various builds'}`,
    confidence: stats.sampleSize >= 20 ? 'High' : 'Medium',
  };

  // Structured Findings
  if (stats.sentimentBreakdown && stats.sentimentBreakdown.negativePercent > 20) {
    findings.push({
      id: 'rev-neg-high',
      category: 'Review Sentiment',
      evidence: `${stats.sentimentBreakdown.negativePercent}% negative reviews in verified sample of ${stats.sampleSize} reviews.`,
      issue: 'High negative review concentration.',
      severity: 'critical',
      explanation: 'Google Play algorithm de-prioritizes listings with high negative review velocity in search and explore carousels.',
      recommendation: 'Prioritize bug fixes reported in 1★ reviews and actively respond with helpful developer replies to show prospective users you support the app.',
      confidence: 'High',
    });
  }

  if (stats.developerResponseRatePercent !== null && stats.developerResponseRatePercent < 15 && stats.sampleSize > 10) {
    findings.push({
      id: 'rev-dev-reply-low',
      category: 'Developer Responsiveness',
      evidence: `Developer response rate is ${stats.developerResponseRatePercent}% across the audited review dataset.`,
      issue: 'Low public developer response rate on store reviews.',
      severity: 'warning',
      explanation: 'Responding to negative reviews within 48 hours converts up to 20% of 1-star ratings into 4 or 5-star ratings.',
      recommendation: 'Implement a routine to reply to all 1-star and 2-star reviews with polite troubleshooting steps and contact information.',
      confidence: 'High',
    });
  }

  return {
    stats,
    recurringPositiveThemes: positiveThemes,
    recurringNegativeThemes: negativeThemes,
    bugsAndUsabilityIssues: bugIssues,
    featureRequests,
    praisePatterns: positiveThemes,
    conversionBlockers,
    recencyAnalysis,
    rawReviews: reviews,
    findings,
  };
}

/**
 * AI-Enhanced Review Intelligence Analyzer with Advanced AI and fallback.
 */
export async function analyzeReviewDataset(
  stats: ReviewDatasetStats,
  reviews: RawPlayStoreReview[],
  listing: PlayStoreListing,
  ai?: GoogleGenAI,
  options?: { highThinking?: boolean; lowLatency?: boolean; useSearch?: boolean }
): Promise<ReviewIntelligenceSection> {
  const fallback = generateDeterministicReviewIntelligence(stats, reviews, listing);

  if (!stats.available || reviews.length === 0 || !ai) {
    return fallback;
  }

  try {
    const reviewsSampleForPrompt = reviews.slice(0, 40).map((r, i) => ({
      index: i + 1,
      rating: `${r.score}★`,
      date: r.date.split('T')[0],
      version: r.version || 'unspecified',
      text: r.text.slice(0, 250),
      hasDevReply: Boolean(r.replyText),
    }));

    const prompt = `You are a Senior App Store Optimization (ASO) Review Intelligence Analyst.
Analyze the following REAL, VERIFIED Google Play reviews dataset for "${listing.title || listing.appId}":

Dataset Statistics:
- Total Sample Size: ${stats.sampleSize} reviews
- Average Star Rating: ${stats.averageRating}★
- Positive Reviews: ${stats.sentimentBreakdown?.positivePercent}%
- Neutral Reviews: ${stats.sentimentBreakdown?.neutralPercent}%
- Negative Reviews: ${stats.sentimentBreakdown?.negativePercent}%
- Developer Response Rate: ${stats.developerResponseRatePercent}%

Extracted Reviews Sample (first 40 reviews):
${JSON.stringify(reviewsSampleForPrompt, null, 2)}

Provide an evidence-based Review Intelligence report in JSON format:
1. recurringPositiveThemes: Top 2-4 positive themes with theme title, occurrenceEstimate, sampleQuotes (exact quotes from reviews), asoAndConversionImpact, severityOrType: "strength", confidence: "High"|"Medium"
2. recurringNegativeThemes: Top 2-4 negative themes with theme title, occurrenceEstimate, sampleQuotes (exact quotes), asoAndConversionImpact, severityOrType: "friction", confidence: "High"|"Medium"
3. bugsAndUsabilityIssues: Concrete bugs or UI confusion with exact quotes
4. featureRequests: Real user feature requests with exact quotes
5. praisePatterns: What users praise most
6. conversionBlockers: List of issues that could scare prospective installers reading the reviews, with issue, impactOnProspects, evidenceQuote, actionableMitigation
7. recencyAnalysis: trendDirection ("Improving"|"Stable"|"Deteriorating"|"Insufficient Data"), summary, recentFeedbackFocus, olderFeedbackFocus, versionShiftObservation, confidence
8. findings: 2-4 structured findings (id, category, evidence, issue, severity: "critical"|"warning"|"info"|"positive", explanation, recommendation, confidence)

CRITICAL RULES:
- Never fabricate reviews or quotes. Only use words that appear in the provided sample.
- If an issue is absent, do not invent it.
- Mark confidence accurately.`;

    const model = options?.highThinking ? 'gemini-3.1-pro-preview' : 'gemini-3.7-flash';
    const config: any = {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recurringPositiveThemes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                theme: { type: Type.STRING },
                occurrenceEstimate: { type: Type.STRING },
                sampleQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                asoAndConversionImpact: { type: Type.STRING },
                severityOrType: { type: Type.STRING },
                confidence: { type: Type.STRING },
              },
            },
          },
          recurringNegativeThemes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                theme: { type: Type.STRING },
                occurrenceEstimate: { type: Type.STRING },
                sampleQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                asoAndConversionImpact: { type: Type.STRING },
                severityOrType: { type: Type.STRING },
                confidence: { type: Type.STRING },
              },
            },
          },
          bugsAndUsabilityIssues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                theme: { type: Type.STRING },
                occurrenceEstimate: { type: Type.STRING },
                sampleQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                asoAndConversionImpact: { type: Type.STRING },
                severityOrType: { type: Type.STRING },
                confidence: { type: Type.STRING },
              },
            },
          },
          featureRequests: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                theme: { type: Type.STRING },
                occurrenceEstimate: { type: Type.STRING },
                sampleQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                asoAndConversionImpact: { type: Type.STRING },
                severityOrType: { type: Type.STRING },
                confidence: { type: Type.STRING },
              },
            },
          },
          praisePatterns: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                theme: { type: Type.STRING },
                occurrenceEstimate: { type: Type.STRING },
                sampleQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                asoAndConversionImpact: { type: Type.STRING },
                severityOrType: { type: Type.STRING },
                confidence: { type: Type.STRING },
              },
            },
          },
          conversionBlockers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                issue: { type: Type.STRING },
                impactOnProspects: { type: Type.STRING },
                evidenceQuote: { type: Type.STRING },
                actionableMitigation: { type: Type.STRING },
              },
            },
          },
          recencyAnalysis: {
            type: Type.OBJECT,
            properties: {
              trendDirection: { type: Type.STRING },
              summary: { type: Type.STRING },
              recentFeedbackFocus: { type: Type.STRING },
              olderFeedbackFocus: { type: Type.STRING },
              versionShiftObservation: { type: Type.STRING },
              confidence: { type: Type.STRING },
            },
          },
          findings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                category: { type: Type.STRING },
                evidence: { type: Type.STRING },
                issue: { type: Type.STRING },
                severity: { type: Type.STRING },
                explanation: { type: Type.STRING },
                recommendation: { type: Type.STRING },
                confidence: { type: Type.STRING },
              },
            },
          },
        },
      },
    };

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI_REVIEWS_TIMEOUT')), 15000)
    );

    const apiPromise = ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    const resp = (await Promise.race([apiPromise, timeoutPromise])) as any;
    const parsed = JSON.parse(resp.text || '{}');

    return {
      stats,
      recurringPositiveThemes: parsed.recurringPositiveThemes || fallback.recurringPositiveThemes,
      recurringNegativeThemes: parsed.recurringNegativeThemes || fallback.recurringNegativeThemes,
      bugsAndUsabilityIssues: parsed.bugsAndUsabilityIssues || fallback.bugsAndUsabilityIssues,
      featureRequests: parsed.featureRequests || fallback.featureRequests,
      praisePatterns: parsed.praisePatterns || fallback.praisePatterns,
      conversionBlockers: parsed.conversionBlockers || fallback.conversionBlockers,
      recencyAnalysis: parsed.recencyAnalysis || fallback.recencyAnalysis,
      rawReviews: reviews,
      findings: parsed.findings?.length > 0 ? parsed.findings : fallback.findings,
    };
  } catch (err: any) {
    console.warn('[ReviewAnalyzer] AI analysis failed, using deterministic review intelligence:', err?.message);
    return fallback;
  }
}
