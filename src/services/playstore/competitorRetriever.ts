/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import gplay from 'google-play-scraper';
import { CompetitorListingData } from '../../types/asoDeepAudit';
import { PlayStoreListing } from '../../types/playstore';

/**
 * Calculates a factual, observable listing score (0-100) based on public metadata completeness and visual health.
 */
export function calculateListingScore(
  title: string | null,
  score: number | null,
  screenshotCount: number,
  hasSummary: boolean,
  descLength: number,
  ratingsCount: number | null
): number {
  let total = 0;

  // Title length & structure (30 recommended max)
  const titleLen = title?.length || 0;
  if (titleLen >= 15 && titleLen <= 30) total += 20;
  else if (titleLen > 0 && titleLen < 15) total += 12;
  else if (titleLen > 30) total += 15;

  // Star Rating
  if (score) {
    if (score >= 4.5) total += 25;
    else if (score >= 4.0) total += 20;
    else if (score >= 3.5) total += 14;
    else total += 8;
  } else {
    total += 10;
  }

  // Screenshot count
  if (screenshotCount >= 6) total += 25;
  else if (screenshotCount >= 4) total += 18;
  else if (screenshotCount >= 1) total += 10;
  else total += 0;

  // Short description hook
  if (hasSummary) total += 15;

  // Description depth
  if (descLength >= 1500) total += 15;
  else if (descLength >= 600) total += 10;
  else if (descLength > 0) total += 5;

  return Math.min(100, Math.max(10, total));
}

/**
 * Normalizes a raw scraped competitor app into a clean CompetitorListingData structure.
 */
function normalizeCompetitor(raw: any): CompetitorListingData {
  const title = raw.title || raw.appId || 'Unknown App';
  const score = typeof raw.score === 'number' ? Number(raw.score.toFixed(1)) : null;
  const screenshots = Array.isArray(raw.screenshots) ? raw.screenshots : [];
  const desc = raw.description || '';
  const summary = raw.summary || null;
  const ratingsCount = typeof raw.ratings === 'number' ? raw.ratings : (typeof raw.ratingsCount === 'number' ? raw.ratingsCount : null);
  const reviewsCount = typeof raw.reviews === 'number' ? raw.reviews : (typeof raw.reviewsCount === 'number' ? raw.reviewsCount : null);

  const calculatedListingScore = calculateListingScore(
    title,
    score,
    screenshots.length,
    Boolean(summary),
    desc.length,
    ratingsCount
  );

  // Observable strengths and weaknesses
  const observableStrengths: string[] = [];
  const observableWeaknesses: string[] = [];

  if (score && score >= 4.4) observableStrengths.push(`High public rating (${score}★)`);
  if (screenshots.length >= 6) observableStrengths.push(`Comprehensive ${screenshots.length}-frame screenshot showcase`);
  if (summary && summary.length >= 40) observableStrengths.push('Distinct short description hook');
  if (raw.installs && (raw.installs.includes('M') || raw.installs.includes('100,000') || raw.installs.includes('500,000'))) {
    observableStrengths.push(`Strong established social proof (${raw.installs} installs)`);
  }

  if (screenshots.length < 4) observableWeaknesses.push(`Sparse visual gallery (${screenshots.length} screenshots)`);
  if (!summary) observableWeaknesses.push('Missing explicit short description');
  if (title.length < 15) observableWeaknesses.push('Short title does not target secondary search keywords');
  if (score && score < 4.0) observableWeaknesses.push(`Sub-4.0 rating (${score}★) presents conversion friction`);

  return {
    appId: raw.appId,
    title,
    developer: raw.developer || (typeof raw.developer === 'object' ? raw.developer.name : 'Developer'),
    iconUrl: raw.icon || null,
    score,
    ratingsCount,
    reviewsCount,
    installs: raw.installs || null,
    priceText: raw.priceText || (raw.free ? 'Free' : 'Paid'),
    offersIAP: Boolean(raw.offersIAP),
    summary,
    descriptionSnippet: desc ? desc.slice(0, 300) : null,
    screenshotCount: screenshots.length,
    screenshots,
    updated: raw.updated || null,
    version: raw.version || null,
    category: raw.genre || raw.category || null,
    isUserApp: false,
    calculatedListingScore,
    iconStyleAnalysis: raw.icon ? 'Standard category branded icon asset' : 'No icon detected',
    titleStructureAnalysis: title.length > 30 ? 'Extended title with appended keyword phrases' : title.includes(':') || title.includes('-') ? 'Brand + Keyword Descriptor formula' : 'Brand-only title',
    screenshotStrategyAnalysis: screenshots.length >= 6 ? 'Full swipe narrative sequence' : 'Basic UI preview frames',
    positioningDifferentiator: summary || (desc ? desc.slice(0, 100) : 'Standard category features'),
    observableStrengths,
    observableWeaknesses,
  };
}

/**
 * Discovers and retrieves 3 to 5 real competitor listings from Google Play Store.
 */
export async function retrievePlayStoreCompetitors(
  userListing: PlayStoreListing,
  options?: { country?: string; lang?: string }
): Promise<CompetitorListingData[]> {
  const country = options?.country || 'us';
  const lang = options?.lang || 'en';
  const appId = userListing.appId;

  const competitors: CompetitorListingData[] = [];
  const seenIds = new Set<string>([appId]);

  try {
    // 1. First attempt: gplay.similar
    try {
      const similarPromise = gplay.similar({
        appId,
        lang,
        country,
        throttle: 5,
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SIMILAR_TIMEOUT')), 8000)
      );

      const similarApps: any[] = (await Promise.race([similarPromise, timeoutPromise])) as any[];

      if (Array.isArray(similarApps)) {
        for (const app of similarApps) {
          if (!seenIds.has(app.appId) && competitors.length < 4) {
            seenIds.add(app.appId);
            competitors.push(normalizeCompetitor(app));
          }
        }
      }
    } catch (simErr) {
      console.warn(`[CompetitorRetriever] gplay.similar failed for ${appId}:`, simErr);
    }

    // 2. Second attempt: gplay.search if we need more competitors
    if (competitors.length < 3) {
      const searchTerm = userListing.category || (userListing.title ? userListing.title.split(/[:\-|—]/)[0].trim() : 'tools');
      try {
        const searchPromise = gplay.search({
          term: searchTerm,
          num: 6,
          lang,
          country,
          throttle: 5,
        });

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('SEARCH_TIMEOUT')), 8000)
        );

        const searchApps: any[] = (await Promise.race([searchPromise, timeoutPromise])) as any[];

        if (Array.isArray(searchApps)) {
          for (const app of searchApps) {
            if (!seenIds.has(app.appId) && competitors.length < 4) {
              seenIds.add(app.appId);
              competitors.push(normalizeCompetitor(app));
            }
          }
        }
      } catch (searchErr) {
        console.warn(`[CompetitorRetriever] gplay.search failed for "${searchTerm}":`, searchErr);
      }
    }

    return competitors;
  } catch (err: any) {
    console.error(`[CompetitorRetriever] Overall competitor discovery failed for ${appId}:`, err);
    return [];
  }
}
