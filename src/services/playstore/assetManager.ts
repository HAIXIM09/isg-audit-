/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayStoreAsset } from '../../types/playstore';

/**
 * Optimizes Google Play image URLs for high-resolution inspection.
 * Google's image CDN supports dimension modifiers like =w512-h512, =s180-rw, etc.
 */
export function optimizeGooglePlayImageUrl(rawUrl: string, targetSize: number = 1024): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();
  if (url.startsWith('//')) {
    url = `https:${url}`;
  }

  // Remove existing resizing params if present and normalize
  if (url.includes('googleusercontent.com') || url.includes('ggpht.com')) {
    // If it ends with =w... or =s...
    const baseWithoutModifiers = url.split('=')[0];
    return `${baseWithoutModifiers}=s0`; // '=s0' requests original full-res
  }

  return url;
}

export function extractIconAsset(rawIconUrl?: string | null): PlayStoreAsset | null {
  if (!rawIconUrl || typeof rawIconUrl !== 'string') return null;
  const cleanUrl = optimizeGooglePlayImageUrl(rawIconUrl, 512);
  if (!cleanUrl) return null;

  return {
    type: 'icon',
    url: cleanUrl,
    width: 512,
    height: 512,
    altText: 'App Icon',
    isAvailable: true,
  };
}

export function extractScreenshotAssets(rawScreenshots?: string[] | null): PlayStoreAsset[] {
  if (!Array.isArray(rawScreenshots) || rawScreenshots.length === 0) {
    return [];
  }

  return rawScreenshots
    .filter((url): url is string => Boolean(url && typeof url === 'string' && url.trim().length > 0))
    .map((url, idx) => {
      const cleanUrl = optimizeGooglePlayImageUrl(url, 1920);
      return {
        type: 'screenshot',
        url: cleanUrl,
        index: idx + 1,
        altText: `Store Screenshot #${idx + 1}`,
        isAvailable: true,
      };
    });
}

export function extractFeatureGraphicAsset(rawHeaderUrl?: string | null): PlayStoreAsset | null {
  if (!rawHeaderUrl || typeof rawHeaderUrl !== 'string') return null;
  const cleanUrl = optimizeGooglePlayImageUrl(rawHeaderUrl, 1024);
  if (!cleanUrl) return null;

  return {
    type: 'featureGraphic',
    url: cleanUrl,
    altText: 'Feature Graphic Banner',
    isAvailable: true,
  };
}

export function extractVideoInfo(rawVideoUrl?: string | null, rawVideoImage?: string | null): { url: string | null; previewUrl: string | null } | null {
  const hasVideo = Boolean(rawVideoUrl && typeof rawVideoUrl === 'string');
  const hasPreview = Boolean(rawVideoImage && typeof rawVideoImage === 'string');

  if (!hasVideo && !hasPreview) return null;

  return {
    url: hasVideo ? (rawVideoUrl as string) : null,
    previewUrl: hasPreview ? optimizeGooglePlayImageUrl(rawVideoImage as string, 1024) : null,
  };
}
