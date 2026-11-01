/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayStoreListing, PlayStoreHistogram } from '../../types/playstore';
import { extractIconAsset, extractScreenshotAssets, extractFeatureGraphicAsset, extractVideoInfo } from './assetManager';

/**
 * Strips HTML tags cleanly for plain-text analysis while preserving whitespace/newlines.
 */
export function stripHtml(htmlStr?: string | null): string {
  if (!htmlStr || typeof htmlStr !== 'string') return '';
  return htmlStr
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/**
 * Normalizes raw Google Play Store data into a structured, strictly-typed PlayStoreListing object.
 * Missing fields remain null — NEVER invented or fabricated.
 */
export function normalizePlayStoreData(rawData: any, appId: string, requestedUrl: string): PlayStoreListing {
  if (!rawData || typeof rawData !== 'object') {
    throw new Error('Invalid raw Play Store data payload.');
  }

  // Developer info
  const developer = {
    name: rawData.developer ? String(rawData.developer).trim() : null,
    id: rawData.developerId ? String(rawData.developerId).trim() : null,
    email: rawData.developerEmail ? String(rawData.developerEmail).trim() : null,
    website: rawData.developerWebsite ? String(rawData.developerWebsite).trim() : null,
    address: rawData.developerAddress ? String(rawData.developerAddress).trim() : null,
  };

  // Assets
  const icon = extractIconAsset(rawData.icon);
  const screenshots = extractScreenshotAssets(rawData.screenshots);
  const featureGraphic = extractFeatureGraphicAsset(rawData.headerImage || rawData.featureGraphic);
  const video = extractVideoInfo(rawData.video, rawData.videoImage);

  // Ratings & Histogram
  let histogram: PlayStoreHistogram | null = null;
  if (rawData.histogram && typeof rawData.histogram === 'object') {
    histogram = {
      1: Number(rawData.histogram[1]) || 0,
      2: Number(rawData.histogram[2]) || 0,
      3: Number(rawData.histogram[3]) || 0,
      4: Number(rawData.histogram[4]) || 0,
      5: Number(rawData.histogram[5]) || 0,
    };
  }

  // Genres
  let genres: string[] = [];
  if (Array.isArray(rawData.genres)) {
    genres = rawData.genres.map((g: any) => (typeof g === 'string' ? g : g?.name || '')).filter(Boolean);
  } else if (rawData.genre) {
    genres = [String(rawData.genre)];
  }

  // Description
  const rawDescription = rawData.description || '';
  const descriptionPlain = stripHtml(rawDescription) || null;
  const summaryPlain = rawData.summary ? stripHtml(rawData.summary) : null;
  const recentChangesPlain = rawData.recentChanges ? stripHtml(rawData.recentChanges) : null;

  return {
    appId: appId.trim(),
    url: rawData.url || requestedUrl,
    title: rawData.title ? String(rawData.title).trim() : null,
    developer,
    icon,
    screenshots,
    featureGraphic,
    video,
    category: rawData.genre || (genres.length > 0 ? genres[0] : null) || null,
    genres,
    score: typeof rawData.score === 'number' && !isNaN(rawData.score) ? Number(rawData.score.toFixed(2)) : null,
    scoreText: rawData.scoreText ? String(rawData.scoreText).trim() : (rawData.score ? `${rawData.score.toFixed(1)} ★` : null),
    ratingsCount: typeof rawData.ratings === 'number' && !isNaN(rawData.ratings) ? rawData.ratings : null,
    reviewsCount: typeof rawData.reviews === 'number' && !isNaN(rawData.reviews) ? rawData.reviews : null,
    histogram,
    installs: rawData.installs ? String(rawData.installs).trim() : null,
    minInstalls: typeof rawData.minInstalls === 'number' ? rawData.minInstalls : null,
    maxInstalls: typeof rawData.maxInstalls === 'number' ? rawData.maxInstalls : null,
    price: typeof rawData.price === 'number' ? rawData.price : (rawData.free ? 0 : null),
    free: typeof rawData.free === 'boolean' ? rawData.free : (rawData.price === 0),
    currency: rawData.currency ? String(rawData.currency).trim() : null,
    priceText: rawData.priceText ? String(rawData.priceText).trim() : (rawData.free ? 'Free' : null),
    offersIAP: typeof rawData.offersIAP === 'boolean' ? rawData.offersIAP : null,
    inAppProductPrice: rawData.inAppProductPrice ? String(rawData.inAppProductPrice).trim() : null,
    summary: summaryPlain,
    description: descriptionPlain,
    descriptionHTML: rawDescription || null,
    recentChanges: recentChangesPlain,
    contentRating: rawData.contentRating ? String(rawData.contentRating).trim() : null,
    contentRatingDescription: rawData.contentRatingDescription ? String(rawData.contentRatingDescription).trim() : null,
    released: rawData.released ? String(rawData.released).trim() : null,
    updated: rawData.updated || rawData.updatedDate || null,
    version: rawData.version ? String(rawData.version).trim() : null,
    androidVersion: rawData.androidVersion ? String(rawData.androidVersion).trim() : null,
    androidVersionText: rawData.androidVersionText ? String(rawData.androidVersionText).trim() : null,
    size: rawData.size ? String(rawData.size).trim() : null,
    privacyPolicy: rawData.privacyPolicy ? String(rawData.privacyPolicy).trim() : null,
    developerInternalID: rawData.developerInternalID ? String(rawData.developerInternalID).trim() : null,
    adSupported: typeof rawData.adSupported === 'boolean' ? rawData.adSupported : null,
    headerImage: rawData.headerImage || null,
    rawRetrievedAt: new Date().toISOString(),
  };
}
