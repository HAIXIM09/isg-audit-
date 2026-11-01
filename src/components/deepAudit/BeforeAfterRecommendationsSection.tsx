/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlayStoreListing } from '../../types/playstore';
import { TextAuditSection, ScreenshotIndividualAnalysis } from '../../types/asoDeepAudit';
import { 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  ShieldAlert, 
  Type, 
  FileText, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';

interface BeforeAfterRecommendationsSectionProps {
  listing: PlayStoreListing;
  textAudit: TextAuditSection;
  screenshots: ScreenshotIndividualAnalysis[];
  appName: string;
}

export const BeforeAfterRecommendationsSection: React.FC<BeforeAfterRecommendationsSectionProps> = ({
  listing,
  textAudit,
  screenshots,
  appName,
}) => {
  const [activeTab, setActiveTab] = useState<'title' | 'shortDesc' | 'fullDesc' | 'screenshots'>('title');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const titleAnalysis = textAudit.titleAnalysis;
  const shortDescAnalysis = textAudit.shortDescriptionAnalysis;
  const fullDescAnalysis = textAudit.fullDescriptionAnalysis;
  const category = listing.category || 'App';

  // Deterministic, high-quality Title Recommendations based on the app's real metadata
  const brandClean = (titleAnalysis.brandNameDetected || appName || 'App').trim();
  const categoryDescriptor =
    category.includes('Education') ? 'Learn Fast' :
    category.includes('Productivity') ? 'Notes & Tasks' :
    category.includes('Health') || category.includes('Fitness') ? 'Workouts & Health' :
    category.includes('Music') ? 'Music & Podcasts' :
    category.includes('Finance') ? 'Budget & Money' :
    category.includes('Social') ? 'Chat & Connect' :
    'Daily Assistant';

  const titleOption1 = `${brandClean}: ${categoryDescriptor}`.slice(0, 30);
  const titleOption2 = `${brandClean} - Smart ${category.split(' ')[0] || 'Tool'}`.slice(0, 30);
  const titleOption3 = `${brandClean} | Daily ${category.split(' ')[0] || 'Hub'}`.slice(0, 30);

  // Short Description Recommendations (<= 80 chars)
  const shortDescOption1 = `Boost your daily productivity with smart tools, instant sync, and clean design.`.slice(0, 80);
  const shortDescOption2 = `The all-in-one ${category.toLowerCase()} app. Fast, private, and easy to use.`.slice(0, 80);
  const shortDescOption3 = `Join millions using ${brandClean} for seamless tracking, goals, and insights.`.slice(0, 80);

  return (
    <div id="before-after-recommendations-section" className="space-y-6">
      {/* Header & Disclaimer Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Before → After ASO Copywriting & Visual Blueprint
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Actionable Optimization Recommendations
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Concrete, character-budgeted improvements crafted specifically for {appName} to elevate storefront conversion rate and search intent alignment.
            </p>
          </div>

          {/* Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('title')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'title'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Title (30 Chars)
            </button>
            <button
              onClick={() => setActiveTab('shortDesc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'shortDesc'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Short Desc (80 Chars)
            </button>
            <button
              onClick={() => setActiveTab('fullDesc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'fullDesc'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Full Description Layout
            </button>
            <button
              onClick={() => setActiveTab('screenshots')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'screenshots'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Screenshot Overlays
            </button>
          </div>
        </div>

        {/* Mandatory Transparency & Fairness Notice */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>Advisory Notice & Ethical ASO Standard:</strong> All suggested copy and visual treatments are professional recommendations designed to maximize click-through rate, message clarity, and natural search-intent relevance. Google Play search ranking algorithms are dynamic and multi-factored; ISGWYZE never claims guaranteed keyword rankings or artificial ranking boosts.
          </div>
        </div>

        {/* TAB 1: TITLE BEFORE -> AFTER */}
        {activeTab === 'title' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Current Before Box */}
              <div className="lg:col-span-5 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Current Live Store Title
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      titleAnalysis.charCount > 30 ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {titleAnalysis.charCount} / 30 chars
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    "{titleAnalysis.actualTitle || 'N/A'}"
                  </h4>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Brand Name:</span>
                      <span>{titleAnalysis.brandNameDetected || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Descriptors:</span>
                      <span>{titleAnalysis.descriptorTerms.length > 0 ? titleAnalysis.descriptorTerms.join(', ') : 'None (Brand only)'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Status:</span>
                      <span className={titleAnalysis.charCount > 30 ? 'text-rose-600' : 'text-slate-600 dark:text-slate-300'}>
                        {titleAnalysis.charCount > 30 ? 'Exceeds 30 character limit (truncated)' : 'Within character limit'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                  Google Play weights the first 30 characters in the Title more heavily for semantic search indexing than any other metadata field.
                </div>
              </div>

              {/* Arrow separator on desktop */}
              <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
                <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* Recommended After Options */}
              <div className="lg:col-span-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                  Recommended High-Conversion Title Variations
                </span>

                {/* Option 1: Search-Intent Primary */}
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      Option A: Search Intent & Category Focus
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {titleOption1.length} / 30 chars
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 dark:border-indigo-900">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      "{titleOption1}"
                    </span>
                    <button
                      onClick={() => handleCopy(titleOption1, 'titleA')}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedKey === 'titleA' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Rationale:</strong> Combines brand recognition with high-intent category keyword in under 30 characters without keyword stuffing.
                  </p>
                </div>

                {/* Option 2: Utility Descriptor */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Option B: Utility Descriptor
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                      {titleOption2.length} / 30 chars
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      "{titleOption2}"
                    </span>
                    <button
                      onClick={() => handleCopy(titleOption2, 'titleB')}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedKey === 'titleB' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Rationale:</strong> Clearly articulates the core product value proposition for browse traffic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHORT DESCRIPTION BEFORE -> AFTER */}
        {activeTab === 'shortDesc' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Current Before Box */}
              <div className="lg:col-span-5 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Current Live Short Description
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      shortDescAnalysis.charCount > 80 ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {shortDescAnalysis.charCount} / 80 chars
                    </span>
                  </div>
                  <p className="text-sm italic font-medium text-slate-900 dark:text-white p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 leading-relaxed">
                    "{shortDescAnalysis.actualShortDesc || '(Short description is blank or empty)'}"
                  </p>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Hook Strength:</span>
                      <span>{shortDescAnalysis.hookStrength}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">User Benefit:</span>
                      <span>{shortDescAnalysis.missingBenefits ? 'Feature-only (missing benefit)' : 'Benefit-focused'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                  The short description is prominently displayed on Android devices directly below the screenshot carousel and is critical for above-the-fold conversion.
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
                <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              {/* Recommended Variations */}
              <div className="lg:col-span-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                  Recommended 80-Character Hooks
                </span>

                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                      Option A: Benefit & Outcome Focus
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {shortDescOption1.length} / 80 chars
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 dark:border-indigo-900">
                    <span className="text-xs font-medium text-slate-900 dark:text-white leading-relaxed">
                      "{shortDescOption1}"
                    </span>
                    <button
                      onClick={() => handleCopy(shortDescOption1, 'shortA')}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors shrink-0"
                      title="Copy to clipboard"
                    >
                      {copiedKey === 'shortA' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Directly addresses user pain point and promises immediate utility.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Option B: Social Proof & Clarity
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                      {shortDescOption3.length} / 80 chars
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-medium text-slate-900 dark:text-white leading-relaxed">
                      "{shortDescOption3}"
                    </span>
                    <button
                      onClick={() => handleCopy(shortDescOption3, 'shortB')}
                      className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors shrink-0"
                      title="Copy to clipboard"
                    >
                      {copiedKey === 'shortB' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Leverages social validation and community scale for higher install confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FULL DESCRIPTION BLUEPRINT */}
        {activeTab === 'fullDesc' && (
          <div className="mt-6 space-y-6">
            <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60">
              <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-200 mb-1">
                4-Block High-Conversion Description Framework
              </h4>
              <p className="text-xs text-indigo-900/80 dark:text-indigo-300/80 leading-relaxed">
                Google Play users scan rather than read. Structure your 4,000-character capacity into modular, benefit-driven sections with clean bold headers:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Block 1 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">1</span>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Above-The-Fold Value Hook (First 250 Chars)
                  </h5>
                </div>
                <div className="text-xs font-mono bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed">
                  Welcome to {brandClean} — the simplest way to {categoryDescriptor.toLowerCase()}. Designed to save you time and keep you organized every day.
                </div>
                <p className="text-[11px] text-slate-500">Visible before the user clicks "Read More". Must communicate core utility instantly.</p>
              </div>

              {/* Block 2 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Key Features & Core Benefits (Bulleted)
                  </h5>
                </div>
                <div className="text-xs font-mono bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed space-y-1">
                  <div>🔥 <strong>Fast & Intuitive:</strong> Get started in seconds with zero learning curve.</div>
                  <div>📊 <strong>Smart Analytics:</strong> Track progress with real-time visual dashboards.</div>
                  <div>🔒 <strong>Private & Secure:</strong> Your personal data is encrypted on-device.</div>
                </div>
                <p className="text-[11px] text-slate-500">Use emojis as visual anchor points and bold benefit lead-ins.</p>
              </div>

              {/* Block 3 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">3</span>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Social Proof & Trust Disclosures
                  </h5>
                </div>
                <div className="text-xs font-mono bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed">
                  Trusted by users worldwide. Rated 4.5+ stars with active weekly updates and customer support.
                </div>
                <p className="text-[11px] text-slate-500">Reduces perceived installation risk and reinforces developer credibility.</p>
              </div>

              {/* Block 4 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 flex items-center justify-center text-xs font-bold">4</span>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Call To Action & Feedback Channels
                  </h5>
                </div>
                <div className="text-xs font-mono bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed">
                  Download {brandClean} today and start achieving your goals! Have feedback? Reach our team anytime at {listing.developer?.email || 'support@app.com'}.
                </div>
                <p className="text-[11px] text-slate-500">Includes clear closing CTA and responsive developer contact channel.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SCREENSHOT OVERLAYS */}
        {activeTab === 'screenshots' && (
          <div className="mt-6 space-y-6">
            <div className="p-4 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60">
              <h4 className="text-sm font-bold text-blue-950 dark:text-blue-200 mb-1">
                Per-Frame Headline Overlay Recommendations
              </h4>
              <p className="text-xs text-blue-900/80 dark:text-blue-300/80 leading-relaxed">
                Each screenshot must carry a high-contrast headline banner on the top third answering: <em>"What makes this app worth my storage space?"</em>
              </p>
            </div>

            <div className="space-y-4">
              {screenshots.slice(0, 5).map((s, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                >
                  {/* Thumbnail */}
                  <div className="md:col-span-2 flex items-center gap-3">
                    <img
                      src={s.url}
                      alt={`Frame ${idx + 1}`}
                      className="w-14 h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Frame #{idx + 1}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {idx === 0 ? 'Hero Frame' : `Screen ${idx + 1}`}
                      </span>
                    </div>
                  </div>

                  {/* Current vs Recommended */}
                  <div className="md:col-span-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Before */}
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Current Observed Caption
                      </span>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        {s.headlineDetected || 'No prominent headline detected (raw UI screen capture)'}
                      </p>
                    </div>

                    {/* After */}
                    <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                        Recommended High-Contrast Headline
                      </span>
                      <p className="font-bold text-indigo-950 dark:text-indigo-200">
                        {idx === 0
                          ? `"${categoryDescriptor}: Fast, Simple & Powerful"`
                          : idx === 1
                          ? `"Stay Organized in One Shared Space"`
                          : idx === 2
                          ? `"Track Your Progress in Real-Time"`
                          : `"Customizable for Your Daily Workflow"`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
