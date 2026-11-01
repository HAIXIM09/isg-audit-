/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PipelineResult } from '../../types/playstore';
import { validatePlayStoreUrl } from './urlValidator';
import { retrievePlayStoreListing } from './retriever';
import { normalizePlayStoreData } from './normalizer';
import { generateDataQualityReport } from './qualityReport';

export interface RunPipelineOptions {
  country?: string;
  lang?: string;
}

/**
 * Master modular pipeline:
 * Stage 1: URL & Package Validation
 * Stage 2: Store Listing & Assets Retrieval
 * Stage 3: Metadata & Asset Normalization
 * Stage 4: Data Quality & Confidence Assessment
 */
export async function runPlayStoreDataPipeline(
  inputUrlOrAppId: string,
  options?: RunPipelineOptions
): Promise<PipelineResult> {
  // STAGE 1: URL Validation
  const validation = validatePlayStoreUrl(inputUrlOrAppId);

  if (!validation.isValid || !validation.appId) {
    return {
      success: false,
      validation,
      error: {
        stage: 'url_validation',
        code: validation.platform === 'appstore' ? 'UNSUPPORTED_PLATFORM' : 'INVALID_URL',
        message: validation.error || 'Invalid Google Play Store URL provided.',
      },
    };
  }

  const appId = validation.appId;
  const country = options?.country || validation.country || 'us';
  const lang = options?.lang || validation.lang || 'en';

  // STAGE 2: Play Store Retrieval
  let rawData: any;
  try {
    rawData = await retrievePlayStoreListing(appId, { country, lang });
  } catch (retrievalErr: any) {
    return {
      success: false,
      validation,
      error: {
        stage: 'playstore_retrieval',
        code: retrievalErr.code || 'RETRIEVAL_FAILED',
        message: retrievalErr.message || `Unable to fetch listing for "${appId}".`,
        details: retrievalErr.originalError?.message,
      },
    };
  }

  // STAGE 3: Metadata & Asset Normalization
  let normalizedListing;
  try {
    normalizedListing = normalizePlayStoreData(rawData, appId, validation.normalizedUrl || inputUrlOrAppId);
  } catch (normErr: any) {
    return {
      success: false,
      validation,
      error: {
        stage: 'normalization',
        code: 'NORMALIZATION_FAILED',
        message: normErr.message || 'Failed to normalize Play Store listing data.',
      },
    };
  }

  // STAGE 4: Data Quality & Confidence Report
  const dataQuality = generateDataQualityReport(normalizedListing);

  return {
    success: true,
    validation,
    listing: normalizedListing,
    dataQuality,
  };
}
