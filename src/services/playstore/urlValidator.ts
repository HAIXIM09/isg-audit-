/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UrlValidationResult } from '../../types/playstore';

/**
 * Standard Android Package Name validator:
 * - Must contain at least one dot (two segments)
 * - Each segment must begin with a letter or underscore
 * - Characters allowed: alphanumeric and underscore
 */
const PACKAGE_NAME_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*(\.[a-zA-Z_][a-zA-Z0-9_]*)+$/;

export function validatePlayStoreUrl(rawInput: string): UrlValidationResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      isValid: false,
      platform: 'unsupported',
      error: 'Empty or invalid input. Please provide a Google Play Store URL or package ID.',
    };
  }

  const trimmed = rawInput.trim();

  // 1. Check if direct package ID was entered (e.g. "com.spotify.music")
  if (PACKAGE_NAME_REGEX.test(trimmed)) {
    return {
      isValid: true,
      appId: trimmed,
      platform: 'playstore',
      normalizedUrl: `https://play.google.com/store/apps/details?id=${trimmed}`,
      country: 'us',
      lang: 'en',
    };
  }

  // 2. Parse URL
  let parsedUrl: URL;
  try {
    // Handle market:// schemes
    if (trimmed.startsWith('market://details')) {
      parsedUrl = new URL(trimmed.replace('market://', 'https://play.google.com/store/apps/'));
    } else {
      parsedUrl = new URL(trimmed);
    }
  } catch (err) {
    return {
      isValid: false,
      platform: 'unsupported',
      error: 'Malformed URL. Please check the address format.',
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // 3. Apple App Store Detection
  if (hostname.includes('apple.com')) {
    return {
      isValid: false,
      platform: 'appstore',
      error: 'Apple App Store URLs are not yet supported for deep Play Store asset extraction. Please provide a Google Play Store link (e.g., https://play.google.com/store/apps/details?id=...).',
    };
  }

  // 4. Google Play Store Verification
  if (!hostname.includes('play.google.com') && !hostname.includes('google.com')) {
    return {
      isValid: false,
      platform: 'unsupported',
      error: `Unsupported domain "${hostname}". Please provide a valid Google Play Store URL (https://play.google.com/store/apps/details?id=...).`,
    };
  }

  // Check path
  if (!parsedUrl.pathname.includes('/store/apps/details') && !parsedUrl.pathname.includes('/apps/details')) {
    return {
      isValid: false,
      platform: 'playstore',
      error: 'The Google Play URL must point to an app details page (e.g., /store/apps/details?id=...).',
    };
  }

  // Extract 'id' query param
  const appId = parsedUrl.searchParams.get('id');
  if (!appId) {
    return {
      isValid: false,
      platform: 'playstore',
      error: 'No app package ID ("id" parameter) found in the Google Play URL.',
    };
  }

  const cleanAppId = appId.trim();
  if (!PACKAGE_NAME_REGEX.test(cleanAppId)) {
    return {
      isValid: false,
      platform: 'playstore',
      appId: cleanAppId,
      error: `Invalid package ID format "${cleanAppId}". Expected reverse-domain format (e.g., com.example.app).`,
    };
  }

  const gl = parsedUrl.searchParams.get('gl') || 'us';
  const hl = parsedUrl.searchParams.get('hl') || 'en';

  return {
    isValid: true,
    appId: cleanAppId,
    platform: 'playstore',
    normalizedUrl: `https://play.google.com/store/apps/details?id=${cleanAppId}&hl=${hl}&gl=${gl}`,
    country: gl,
    lang: hl,
  };
}
