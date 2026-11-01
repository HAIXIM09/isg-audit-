/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PlayStoreAsset {
  type: 'icon' | 'screenshot' | 'featureGraphic' | 'videoPreview';
  url: string;
  index?: number;
  width?: number;
  height?: number;
  altText?: string;
  isAvailable: boolean;
}

export interface PlayStoreDeveloperInfo {
  name: string | null;
  id?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
}

export interface PlayStoreHistogram {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface PlayStoreListing {
  appId: string;
  url: string;
  title: string | null;
  developer: PlayStoreDeveloperInfo;
  icon: PlayStoreAsset | null;
  screenshots: PlayStoreAsset[];
  featureGraphic: PlayStoreAsset | null;
  video: {
    url: string | null;
    previewUrl: string | null;
  } | null;
  category: string | null;
  genres: string[];
  score: number | null;
  scoreText?: string | null;
  ratingsCount: number | null;
  reviewsCount: number | null;
  histogram: PlayStoreHistogram | null;
  installs: string | null;
  minInstalls: number | null;
  maxInstalls: number | null;
  price: number | null;
  free: boolean | null;
  currency: string | null;
  priceText: string | null;
  offersIAP: boolean | null;
  inAppProductPrice: string | null;
  summary: string | null;
  description: string | null;
  descriptionHTML: string | null;
  recentChanges: string | null;
  contentRating: string | null;
  contentRatingDescription?: string | null;
  released: string | null;
  updated: number | string | null;
  version: string | null;
  androidVersion: string | null;
  androidVersionText?: string | null;
  size?: string | null;
  privacyPolicy: string | null;
  developerInternalID?: string | null;
  adSupported: boolean | null;
  headerImage?: string | null;
  rawRetrievedAt: string;
}

export interface FieldAuditStatus {
  retrieved: boolean;
  valueSummary?: string;
  reasonIfNotRetrieved?: string;
}

export interface DataQualityReport {
  status: 'complete' | 'partial' | 'failed';
  totalFields: number;
  retrievedFieldsCount: number;
  missingFieldsCount: number;
  completenessPercentage: number;
  dataQualityScore: number;
  confidenceLevel: 'High' | 'Medium' | 'Low';
  fieldStatus: Record<string, FieldAuditStatus>;
  assetsSummary: {
    iconFound: boolean;
    screenshotsFound: number;
    featureGraphicFound: boolean;
    videoFound: boolean;
  };
  notes: string[];
}

export interface UrlValidationResult {
  isValid: boolean;
  appId?: string;
  platform: 'playstore' | 'appstore' | 'unsupported';
  normalizedUrl?: string;
  country?: string;
  lang?: string;
  error?: string;
}

export interface PipelineResult {
  success: boolean;
  validation: UrlValidationResult;
  listing?: PlayStoreListing;
  dataQuality?: DataQualityReport;
  error?: {
    code: string;
    message: string;
    stage: 'url_validation' | 'playstore_retrieval' | 'asset_normalization' | 'normalization' | 'analysis';
    details?: any;
  };
}
