/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import gplay from 'google-play-scraper';
import * as cheerio from 'cheerio';

export interface ScraperError {
  code: 'APP_NOT_FOUND' | 'RATE_LIMITED' | 'NETWORK_ERROR' | 'UNAVAILABLE_REGION' | 'PARSING_ERROR' | 'UNKNOWN';
  message: string;
  originalError?: any;
}

/**
 * Direct HTML Scraper fallback for Google Play Store pages.
 * Inspects both DOM and embedded AF_initDataCallback JSON payloads.
 */
async function fetchDirectPlayStoreHtml(appId: string, country: string = 'us', lang: string = 'en'): Promise<any> {
  const url = `https://play.google.com/store/apps/details?id=${encodeURIComponent(appId)}&hl=${encodeURIComponent(lang)}&gl=${encodeURIComponent(country)}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': `${lang}-${country.toUpperCase()},${lang};q=0.9,en;q=0.8`,
        'Cache-Control': 'no-cache',
      },
    });

    clearTimeout(timeoutId);

    if (res.status === 404) {
      const err: ScraperError = {
        code: 'APP_NOT_FOUND',
        message: `App with package ID "${appId}" was not found on Google Play Store in region "${country}". It may have been unpublished or removed.`,
      };
      throw err;
    }

    if (res.status === 429) {
      const err: ScraperError = {
        code: 'RATE_LIMITED',
        message: 'Google Play Store rate limit reached. Please wait a moment and try again.',
      };
      throw err;
    }

    if (!res.ok) {
      const err: ScraperError = {
        code: 'NETWORK_ERROR',
        message: `Google Play Store responded with HTTP ${res.status}: ${res.statusText}`,
      };
      throw err;
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Extract title from meta or DOM
    const title = $('meta[property="og:title"]').attr('content') || $('h1[itemprop="name"]').text() || $('h1').first().text() || null;
    const description = $('meta[property="og:description"]').attr('content') || $('div[data-g-id="description"]').text() || null;
    const icon = $('meta[property="og:image"]').attr('content') || $('img[alt="Cover art"]').attr('src') || $('img[itemprop="image"]').attr('src') || null;

    // Collect screenshots from img tags
    const screenshots: string[] = [];
    $('img[srcset], img[data-src], img[src*="googleusercontent.com"]').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src && (src.includes('=w') || src.includes('=h') || src.includes('ggpht') || src.includes('googleusercontent')) && !src.includes('googleplay_logo')) {
        if (!screenshots.includes(src) && src !== icon) {
          screenshots.push(src);
        }
      }
    });

    // Rating and review count
    const ratingText = $('div[itemprop="starRating"]').text() || $('div:contains("star")').text();
    let score: number | null = null;
    const scoreMatch = ratingText.match(/([0-5]\.[0-9])/);
    if (scoreMatch) {
      score = parseFloat(scoreMatch[1]);
    }

    // Developer name
    let developer: string | null = null;
    $('a[href*="/store/apps/dev"], a[href*="/store/apps/developer"]').first().each((_, el) => {
      developer = $(el).text().trim() || null;
    });

    // Genre/Category
    let genre: string | null = null;
    $('a[itemprop="genre"], a[href*="/store/apps/category/"]').first().each((_, el) => {
      genre = $(el).text().trim() || null;
    });

    return {
      appId,
      url,
      title: title ? title.replace(/ - Apps on Google Play$/i, '').trim() : null,
      description,
      summary: null,
      developer,
      icon,
      screenshots: screenshots.slice(0, 12),
      score,
      genre,
      free: true,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.code) throw err;
    if (err.name === 'AbortError') {
      const timeoutErr: ScraperError = {
        code: 'NETWORK_ERROR',
        message: 'Connection timed out while fetching Play Store page.',
      };
      throw timeoutErr;
    }
    throw err;
  }
}

/**
 * Primary Play Store data retrieval function.
 * Attempts google-play-scraper first with timeout and falls back to resilient direct HTML parsing.
 */
export async function retrievePlayStoreListing(
  appId: string,
  options?: { country?: string; lang?: string }
): Promise<any> {
  const country = options?.country || 'us';
  const lang = options?.lang || 'en';

  try {
    // 1. Try google-play-scraper with a 15s timeout
    const scraperPromise = gplay.app({
      appId,
      country,
      lang,
      throttle: 5,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SCRAPER_TIMEOUT')), 15000)
    );

    const data = await Promise.race([scraperPromise, timeoutPromise]);
    return data;
  } catch (err: any) {
    const errMsg = err?.message || String(err);

    if (errMsg.includes('404') || errMsg.includes('App not found') || errMsg.includes('not found')) {
      const appNotFoundErr: ScraperError = {
        code: 'APP_NOT_FOUND',
        message: `App with package ID "${appId}" does not exist or is not available on Google Play in region "${country}".`,
        originalError: err,
      };
      throw appNotFoundErr;
    }

    if (errMsg.includes('429') || errMsg.includes('Too Many Requests')) {
      const rateLimitErr: ScraperError = {
        code: 'RATE_LIMITED',
        message: 'Google Play Store rate limit encountered. Please wait a few seconds and try again.',
        originalError: err,
      };
      throw rateLimitErr;
    }

    console.warn(`[PlayStoreRetriever] google-play-scraper failed for ${appId} (${errMsg}), trying direct HTML scraper fallback...`);

    // 2. Direct HTML Scraper Fallback
    try {
      const directData = await fetchDirectPlayStoreHtml(appId, country, lang);
      if (directData && (directData.title || directData.icon)) {
        return directData;
      }
    } catch (directErr: any) {
      if (directErr.code) throw directErr;
    }

    const genericErr: ScraperError = {
      code: 'NETWORK_ERROR',
      message: `Failed to retrieve Play Store listing for "${appId}". Error: ${errMsg}`,
      originalError: err,
    };
    throw genericErr;
  }
}
