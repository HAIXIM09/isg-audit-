/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayStoreListing, DataQualityReport, FieldAuditStatus } from '../../types/playstore';

/**
 * Evaluates the presence, validity, and depth of all fields in the normalized PlayStoreListing.
 * Outputs a full data quality report with confidence scores and field-by-field verification.
 */
export function generateDataQualityReport(listing: PlayStoreListing): DataQualityReport {
  const fieldStatus: Record<string, FieldAuditStatus> = {};
  const notes: string[] = [];

  // Core metadata fields to evaluate
  const coreFields: { key: keyof PlayStoreListing; label: string; weight: number; isOptional?: boolean }[] = [
    { key: 'title', label: 'App Title', weight: 10 },
    { key: 'developer', label: 'Developer Name & Info', weight: 8 },
    { key: 'icon', label: 'App Icon Asset', weight: 10 },
    { key: 'screenshots', label: 'Store Screenshots', weight: 12 },
    { key: 'featureGraphic', label: 'Feature Graphic Banner', weight: 5, isOptional: true },
    { key: 'category', label: 'Category & Genre', weight: 6 },
    { key: 'score', label: 'Rating Score (Stars)', weight: 8 },
    { key: 'ratingsCount', label: 'Total Ratings Count', weight: 6 },
    { key: 'reviewsCount', label: 'Written Reviews Count', weight: 5 },
    { key: 'histogram', label: 'Rating Distribution Histogram', weight: 4 },
    { key: 'installs', label: 'Public Install Volume Range', weight: 6 },
    { key: 'summary', label: 'Short Description / Promo Text', weight: 8 },
    { key: 'description', label: 'Full Store Description', weight: 10 },
    { key: 'contentRating', label: 'Content Age Rating', weight: 4 },
    { key: 'updated', label: 'Last Updated Date', weight: 5 },
    { key: 'recentChanges', label: "What's New / Release Notes", weight: 4, isOptional: true },
    { key: 'privacyPolicy', label: 'Privacy Policy Link', weight: 3, isOptional: true },
    { key: 'offersIAP', label: 'In-App Purchases Indicator', weight: 3 },
    { key: 'price', label: 'Pricing Information', weight: 3 },
  ];

  let totalWeight = 0;
  let earnedWeight = 0;
  let retrievedCount = 0;
  let missingCount = 0;

  for (const field of coreFields) {
    totalWeight += field.weight;
    const value = listing[field.key];
    let isRetrieved = false;
    let valueSummary = '';
    let reasonIfNotRetrieved = '';

    if (field.key === 'screenshots') {
      const count = listing.screenshots.length;
      if (count > 0) {
        isRetrieved = true;
        valueSummary = `${count} high-resolution screenshot${count > 1 ? 's' : ''} retrieved`;
      } else {
        isRetrieved = false;
        reasonIfNotRetrieved = 'No preview screenshots found on public listing.';
      }
    } else if (field.key === 'developer') {
      if (listing.developer.name) {
        isRetrieved = true;
        valueSummary = listing.developer.name + (listing.developer.email ? ` (${listing.developer.email})` : '');
      } else {
        isRetrieved = false;
        reasonIfNotRetrieved = 'Developer name is unavailable.';
      }
    } else if (field.key === 'icon') {
      if (listing.icon?.url) {
        isRetrieved = true;
        valueSummary = 'High-resolution 512x512 icon asset retrieved';
      } else {
        isRetrieved = false;
        reasonIfNotRetrieved = 'App icon asset could not be loaded.';
      }
    } else if (field.key === 'featureGraphic') {
      if (listing.featureGraphic?.url) {
        isRetrieved = true;
        valueSummary = 'Feature banner graphic retrieved';
      } else {
        isRetrieved = false;
        reasonIfNotRetrieved = 'No feature banner graphic uploaded by developer (optional).';
      }
    } else if (field.key === 'histogram') {
      if (listing.histogram) {
        isRetrieved = true;
        valueSummary = `5★: ${listing.histogram[5].toLocaleString()} | 1★: ${listing.histogram[1].toLocaleString()}`;
      } else {
        isRetrieved = false;
        reasonIfNotRetrieved = 'Rating star breakdown histogram not publicly displayed by Play Store for this listing.';
      }
    } else if (field.key === 'price') {
      if (listing.free !== null || listing.price !== null) {
        isRetrieved = true;
        valueSummary = listing.free ? 'Free' : `${listing.currency || '$'}${listing.price}`;
      } else {
        isRetrieved = false;
        reasonIfNotRetrieved = 'Pricing details not found.';
      }
    } else if (field.key === 'description') {
      if (listing.description && listing.description.length > 20) {
        isRetrieved = true;
        valueSummary = `${listing.description.length} characters parsed`;
      } else {
        isRetrieved = false;
        reasonIfNotRetrieved = 'Full description is missing or empty.';
      }
    } else if (field.key === 'summary') {
      if (listing.summary && listing.summary.length > 0) {
        isRetrieved = true;
        valueSummary = `"${listing.summary.slice(0, 50)}${listing.summary.length > 50 ? '...' : ''}"`;
      } else {
        isRetrieved = false;
        reasonIfNotRetrieved = 'Short description is not provided or not separated from main text.';
      }
    } else {
      if (value !== null && value !== undefined && value !== '') {
        isRetrieved = true;
        valueSummary = String(value);
      } else {
        isRetrieved = false;
        reasonIfNotRetrieved = field.isOptional ? 'Not provided by developer (optional field).' : 'Field unavailable from store page.';
      }
    }

    if (isRetrieved) {
      earnedWeight += field.weight;
      retrievedCount++;
    } else {
      missingCount++;
    }

    fieldStatus[field.key] = {
      retrieved: isRetrieved,
      valueSummary: isRetrieved ? valueSummary : undefined,
      reasonIfNotRetrieved: !isRetrieved ? reasonIfNotRetrieved : undefined,
    };
  }

  const qualityScore = Math.min(100, Math.round((earnedWeight / totalWeight) * 100));
  const completenessPercentage = Math.round((retrievedCount / coreFields.length) * 100);

  let confidenceLevel: 'High' | 'Medium' | 'Low' = 'High';
  if (qualityScore < 60) {
    confidenceLevel = 'Low';
  } else if (qualityScore < 85) {
    confidenceLevel = 'Medium';
  }

  // Summary notes
  if (listing.screenshots.length >= 4) {
    notes.push(`Rich visual asset set: ${listing.screenshots.length} screenshots available for conversion analysis.`);
  } else if (listing.screenshots.length > 0) {
    notes.push(`Limited visual asset set: Only ${listing.screenshots.length} screenshot(s) found.`);
  } else {
    notes.push('Missing screenshots: Visual conversion audit will have reduced accuracy.');
  }

  if (listing.description && listing.description.length > 200) {
    notes.push(`Comprehensive full description (${listing.description.length} chars) ready for keyword density evaluation.`);
  }

  if (!listing.summary) {
    notes.push('Short description / promo text was not detected on listing.');
  }

  const status: 'complete' | 'partial' | 'failed' = qualityScore >= 80 ? 'complete' : qualityScore >= 40 ? 'partial' : 'failed';

  return {
    status,
    totalFields: coreFields.length,
    retrievedFieldsCount: retrievedCount,
    missingFieldsCount: missingCount,
    completenessPercentage,
    dataQualityScore: qualityScore,
    confidenceLevel,
    fieldStatus,
    assetsSummary: {
      iconFound: Boolean(listing.icon?.url),
      screenshotsFound: listing.screenshots.length,
      featureGraphicFound: Boolean(listing.featureGraphic?.url),
      videoFound: Boolean(listing.video?.url),
    },
    notes,
  };
}
