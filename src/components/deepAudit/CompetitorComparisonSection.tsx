/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Swords,
  Trophy,
  Star,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Info,
  Sparkles,
} from 'lucide-react';
import {
  CompetitorIntelligenceSection as CompetitorIntelType,
  CompetitorListingSummary,
} from '../../types/asoDeepAudit';
import { FindingCard } from './FindingCard';

interface Props {
  competitorData?: CompetitorIntelType;
  appName: string;
}

export const CompetitorComparisonSection: React.FC<Props> = ({ competitorData, appName }) => {
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);

  if (!competitorData) {
    return (
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl text-center text-slate-400 text-sm">
        Competitor intelligence is pending.
      </div>
    );
  }

  const {
    categoryName,
    discoveredCompetitors,
    headToHeadMatrix,
    comparisonDimensions,
    strategicCounterMeasures,
    findings,
  } = competitorData;

  const compRatings = discoveredCompetitors.map(c => c.score).filter(s => s !== null && s !== undefined) as number[];
  const medianRating = compRatings.length ? compRatings.sort()[Math.floor(compRatings.length / 2)] : 4.2;

  const compScreenshots = discoveredCompetitors.map(c => c.screenshotCount || 0).filter(s => s > 0);
  const medianScreenshots = compScreenshots.length ? compScreenshots.sort()[Math.floor(compScreenshots.length / 2)] : 6;

  const activeCompetitor =
    discoveredCompetitors.find((c) => c.appId === selectedCompId) || discoveredCompetitors[0] || null;

  return (
    <div className="space-y-8" id="competitor-comparison-section">
      {/* Category & Discovered Competitors Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
                <Swords className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-white">Competitor & Market Landscape Intelligence</h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {discoveredCompetitors.length} Discovered Competitors
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real competitors indexed in Category:{' '}
              <span className="text-slate-200 font-semibold">{categoryName}</span>. Benchmarked across
              public visual density, title structure, store ratings, and listing hooks.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Category Median Rating</span>
              <span className="text-sm font-bold text-amber-400">
                {medianRating ? `${medianRating.toFixed(1)} ★` : '4.2 ★'}
              </span>
            </div>
            <div className="bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Median Screenshots</span>
              <span className="text-sm font-bold text-blue-400">{medianScreenshots || 6} Frames</span>
            </div>
          </div>
        </div>

        {/* Competitor Chips / Selector */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Discovered Category Contenders:
          </div>
          <div className="flex flex-wrap gap-2.5">
            {discoveredCompetitors.map((comp) => {
              const isSelected = activeCompetitor?.appId === comp.appId;
              return (
                <button
                  key={comp.appId}
                  onClick={() => setSelectedCompId(comp.appId)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs transition-all ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {comp.iconUrl ? (
                    <img
                      src={comp.iconUrl}
                      alt={comp.title}
                      className="w-5 h-5 rounded-md object-cover border border-slate-700/50"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded bg-slate-800 text-[10px] flex items-center justify-center font-bold">
                      {comp.title.charAt(0)}
                    </div>
                  )}
                  <span className="font-medium truncate max-w-[140px]">{comp.title}</span>
                  <span className="text-[11px] text-amber-400 font-semibold">{comp.score ? `${comp.score.toFixed(1)}★` : ''}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Head-to-Head Comparison Matrix */}
      {headToHeadMatrix && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Head-to-Head Storefront Comparison Matrix
              </h4>
              <p className="text-xs text-slate-400">
                Direct side-by-side inspection of publicly observable Google Play listing parameters
              </p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              Live Store Assets
            </span>
          </div>

          <div className="overflow-x-auto touch-pan-x overscroll-x-contain pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-3 font-semibold uppercase text-[11px] min-w-[160px] sticky left-0 bg-[#0f172a] z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] border-r border-slate-800">Store Asset & Metric</th>
                  <th className="py-3 px-3 font-bold text-blue-400 bg-blue-950/20 rounded-t min-w-[180px]">
                    {appName} <span className="text-[10px] font-normal text-blue-300">(Your App)</span>
                  </th>
                  {headToHeadMatrix.competitors.map((comp) => (
                    <th key={comp.appId} className="py-3 px-3 font-semibold text-slate-200 min-w-[170px]">
                      <div className="truncate max-w-[160px]">{comp.appName}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {/* 1. App Icon Row */}
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 sticky left-0 bg-[#0f172a] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] border-r border-slate-800">App Icon</td>
                  <td className="py-3 px-3 bg-blue-950/10">
                    {headToHeadMatrix.userApp.iconUrl ? (
                      <img
                        src={headToHeadMatrix.userApp.iconUrl}
                        alt="Your icon"
                        className="w-10 h-10 rounded-lg object-cover border border-blue-500/40 shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-slate-500">No Icon</span>
                    )}
                  </td>
                  {headToHeadMatrix.competitors.map((comp) => (
                    <td key={comp.appId} className="py-3 px-3">
                      {comp.iconUrl ? (
                        <img
                          src={comp.iconUrl}
                          alt={comp.appName}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-700 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-slate-500">No Icon</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 2. Rating & Volume */}
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 sticky left-0 bg-[#0f172a] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] border-r border-slate-800">Rating & Volume</td>
                  <td className="py-3 px-3 bg-blue-950/10 font-bold text-white">
                    <span className="text-amber-400">
                      {headToHeadMatrix.userApp.rating ? `${headToHeadMatrix.userApp.rating.toFixed(1)} ★` : 'N/A'}
                    </span>
                    <div className="text-[11px] font-normal text-slate-400">
                      {headToHeadMatrix.userApp.ratingsCount
                        ? `${headToHeadMatrix.userApp.ratingsCount.toLocaleString()} ratings`
                        : 'N/A'}
                    </div>
                  </td>
                  {headToHeadMatrix.competitors.map((comp) => (
                    <td key={comp.appId} className="py-3 px-3">
                      <span className="font-semibold text-amber-400">
                        {comp.rating ? `${comp.rating.toFixed(1)} ★` : 'N/A'}
                      </span>
                      <div className="text-[11px] text-slate-400">
                        {comp.ratingsCount ? `${comp.ratingsCount.toLocaleString()} ratings` : 'N/A'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 3. Install Scale */}
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 sticky left-0 bg-[#0f172a] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] border-r border-slate-800">Public Install Tier</td>
                  <td className="py-3 px-3 bg-blue-950/10 font-semibold text-white">
                    {headToHeadMatrix.userApp.installs || 'N/A'}
                  </td>
                  {headToHeadMatrix.competitors.map((comp) => (
                    <td key={comp.appId} className="py-3 px-3 font-medium text-slate-300">
                      {comp.installs || 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* 4. Title Length & Formula */}
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 sticky left-0 bg-[#0f172a] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] border-r border-slate-800">Title Length & Formula</td>
                  <td className="py-3 px-3 bg-blue-950/10">
                    <div className="font-mono text-xs text-blue-300">
                      {headToHeadMatrix.userApp.titleLength}/30 chars
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[170px]" title={headToHeadMatrix.userApp.titleFormula}>
                      {headToHeadMatrix.userApp.titleFormula}
                    </div>
                  </td>
                  {headToHeadMatrix.competitors.map((comp) => (
                    <td key={comp.appId} className="py-3 px-3">
                      <div className="font-mono text-xs text-slate-300">
                        {comp.titleLength}/30 chars
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[160px]" title={comp.titleFormula}>
                        {comp.titleFormula}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 5. Screenshot Carousel Count */}
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 sticky left-0 bg-[#0f172a] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] border-r border-slate-800">Screenshot Frames</td>
                  <td className="py-3 px-3 bg-blue-950/10 font-bold text-white">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        headToHeadMatrix.userApp.screenshotCount >= 6
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {headToHeadMatrix.userApp.screenshotCount} Frames
                    </span>
                  </td>
                  {headToHeadMatrix.competitors.map((comp) => (
                    <td key={comp.appId} className="py-3 px-3">
                      <span className="font-semibold text-slate-300">{comp.screenshotCount} Frames</span>
                    </td>
                  ))}
                </tr>

                {/* 6. Short Description Hook */}
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 sticky left-0 bg-[#0f172a] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] border-r border-slate-800">Short Description Hook</td>
                  <td className="py-3 px-3 bg-blue-950/10">
                    <div className="font-mono text-xs text-blue-300">
                      {headToHeadMatrix.userApp.shortDescriptionLength}/80 chars
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {headToHeadMatrix.userApp.hasHookInShortDesc ? 'Hook detected' : 'Missing clear hook'}
                    </div>
                  </td>
                  {headToHeadMatrix.competitors.map((comp) => (
                    <td key={comp.appId} className="py-3 px-3">
                      <div className="font-mono text-xs text-slate-300">
                        {comp.shortDescriptionLength}/80 chars
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {comp.hasHookInShortDesc ? 'Hook detected' : 'Missing hook'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 7. Listing Quality Score */}
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-400 sticky left-0 bg-[#0f172a] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.3)] border-r border-slate-800">Listing Quality Score</td>
                  <td className="py-3 px-3 bg-blue-950/10 font-black text-blue-300 text-sm">
                    {headToHeadMatrix.userApp.listingQualityScore}/100
                  </td>
                  {headToHeadMatrix.competitors.map((comp) => (
                    <td key={comp.appId} className="py-3 px-3 font-bold text-slate-300 text-sm">
                      {comp.listingQualityScore}/100
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dimension Advantage Breakdown (4 Pillars) */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          Dimension Advantage & Vulnerability Analysis
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparisonDimensions.map((dim, idx) => {
            const isUserAdvantage = dim.verdict === 'Your App Wins';
            const isCompAdvantage = dim.verdict === 'Competitor Leads';
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border space-y-2.5 ${
                  isUserAdvantage
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : isCompAdvantage
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{dim.dimension}</span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                      isUserAdvantage
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : isCompAdvantage
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {dim.verdict}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{dim.evidence}</p>

                <div className="text-xs text-blue-300 pt-1 border-t border-slate-800 flex items-start gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>
                    <strong>Strategic Counter:</strong> {dim.actionableCounter}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Competitor Deep-Dive Card */}
      {activeCompetitor && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              {activeCompetitor.iconUrl && (
                <img
                  src={activeCompetitor.iconUrl}
                  alt={activeCompetitor.title}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm"
                  referrerPolicy="no-referrer"
                />
              )}
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  {activeCompetitor.title}
                  <a
                    href={activeCompetitor.playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </h4>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>Developer: {activeCompetitor.developer}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-semibold">
                    {activeCompetitor.score ? `${activeCompetitor.score.toFixed(1)} ★` : 'N/A'}
                  </span>
                  <span>•</span>
                  <span>{activeCompetitor.installs || 'N/A'} installs</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 font-mono">
                {activeCompetitor.screenshots?.length || 0} Screenshots
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Observable Strengths */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Observable Competitor Strengths
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeCompetitor.observableStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Observable Weaknesses / Vulnerabilities */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 space-y-2">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Exploit-Ready Vulnerabilities
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeCompetitor.observableWeaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Competitor Screenshots Preview */}
          {activeCompetitor.screenshots && activeCompetitor.screenshots.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Public Screenshot Carousel Preview:
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {activeCompetitor.screenshots.slice(0, 6).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Competitor frame ${idx + 1}`}
                    className="h-36 w-auto rounded-lg border border-slate-800 object-cover shrink-0 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Strategic Counter-Measures & Opportunities */}
      {strategicCounterMeasures && strategicCounterMeasures.length > 0 && (
        <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Strategic Competitive Opportunities</h4>
              <p className="text-xs text-purple-300/80">
                Actionable tactics to exploit market gaps and outperform competitor listings
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategicCounterMeasures.map((strat, idx) => (
              <div key={idx} className="bg-slate-900/90 border border-purple-500/20 rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-sm font-semibold text-purple-200">{strat.title}</h5>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-purple-500/20 text-purple-300">
                    High Impact
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300">Market Gap:</strong> {strat.marketGapIdentified}
                </p>
                <div className="pt-2 border-t border-slate-800 text-xs text-emerald-400 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>
                    <strong>Execution Playbook:</strong> {strat.strategicPlaybook}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1">
                  <strong>Expected ASO Win:</strong> {strat.expectedAdvantage}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grounding & Evidence Notice */}
      <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-300">Public Listing Grounding:</strong> All competitor rankings, ratings, and
          asset counts are verified against publicly indexed Google Play Store listing pages in the specified store
          region. No private download volumes, revenue, or proprietary analytics have been fabricated.
        </p>
      </div>

      {/* Structured Findings */}
      {findings && findings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Evidence-Based Competitor Findings ({findings.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {findings.map((f) => (
              <FindingCard key={f.id} finding={f} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
