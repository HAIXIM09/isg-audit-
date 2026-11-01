/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TextAuditSection } from '../../types/asoDeepAudit';
import { FindingCard } from './FindingCard';
import { 
  FileText, 
  Sparkles, 
  AlignLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  ShieldCheck, 
  HelpCircle,
  Tag,
  BookOpen,
  Info,
  Check
} from 'lucide-react';

interface DescriptionAuditSectionProps {
  textAudit: TextAuditSection;
  appName: string;
  category: string;
}

export const DescriptionAuditSection: React.FC<DescriptionAuditSectionProps> = ({
  textAudit,
  appName,
  category,
}) => {
  const [activeTab, setActiveTab] = useState<'title' | 'shortDesc' | 'fullDesc' | 'searchIntent'>('title');

  const { titleAnalysis, shortDescriptionAnalysis, fullDescriptionAnalysis, searchIntentAndConcepts } = textAudit;

  return (
    <div id="description-audit-section" className="space-y-6">
      {/* Section Header with Sub-tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
              <FileText className="w-3.5 h-3.5" />
              Copywriting & Search Semantic Audit
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Title, Summary & Description Deep-Dive
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Granular analysis of Google Play character budgets, above-the-fold value hooks, structure, trust signals, and natural search-intent concepts.
            </p>
          </div>

          {/* Sub-Tab Navigation */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveTab('title')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'title'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Title ({titleAnalysis.charCount}/30)
            </button>
            <button
              onClick={() => setActiveTab('shortDesc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'shortDesc'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Short Desc ({shortDescriptionAnalysis.charCount}/80)
            </button>
            <button
              onClick={() => setActiveTab('fullDesc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'fullDesc'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Full Description
            </button>
            <button
              onClick={() => setActiveTab('searchIntent')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'searchIntent'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Search Intent & Concepts
            </button>
          </div>
        </div>

        {/* TAB 1: TITLE AUDIT */}
        {activeTab === 'title' && (
          <div className="mt-6 space-y-6">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Play Store Title Verification
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    "{titleAnalysis.actualTitle}"
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Character Budget</span>
                    <span className={`text-sm font-bold ${
                      titleAnalysis.charCount > 30 
                        ? 'text-rose-600' 
                        : titleAnalysis.charCount >= 15 
                        ? 'text-emerald-600' 
                        : 'text-amber-600'
                    }`}>
                      {titleAnalysis.charCount} / 30 chars
                    </span>
                  </div>
                  <div className="w-20 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        titleAnalysis.charCount > 30 
                          ? 'bg-rose-500' 
                          : titleAnalysis.charCount >= 15 
                          ? 'bg-emerald-500' 
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (titleAnalysis.charCount / 30) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Title breakdown pill badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                    Brand Name Detected
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {titleAnalysis.brandNameDetected || 'N/A'}
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                    Keyword Descriptors
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {titleAnalysis.descriptorTerms.length > 0 
                      ? titleAnalysis.descriptorTerms.join(', ') 
                      : 'None (Brand-only title)'}
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                    Keyword Stuffing Risk
                  </span>
                  <span className={`text-xs font-semibold ${titleAnalysis.keywordStuffingDetected ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {titleAnalysis.keywordStuffingDetected ? 'Stuffing Detected' : 'Natural Brand + Descriptors'}
                  </span>
                </div>
              </div>
            </div>

            {/* Title findings */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Title Audit Findings ({titleAnalysis.findings.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {titleAnalysis.findings.map(f => (
                  <FindingCard key={f.id} finding={f} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHORT DESCRIPTION AUDIT */}
        {activeTab === 'shortDesc' && (
          <div className="mt-6 space-y-6">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Play Store 80-Character Summary
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white italic">
                    "{shortDescriptionAnalysis.actualShortDesc || '(Short description is blank)'}"
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Character Budget</span>
                    <span className={`text-sm font-bold ${
                      shortDescriptionAnalysis.charCount > 80 
                        ? 'text-rose-600' 
                        : shortDescriptionAnalysis.charCount >= 40 
                        ? 'text-emerald-600' 
                        : 'text-amber-600'
                    }`}>
                      {shortDescriptionAnalysis.charCount} / 80 chars
                    </span>
                  </div>
                  <div className="w-20 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        shortDescriptionAnalysis.charCount > 80 
                          ? 'bg-rose-500' 
                          : shortDescriptionAnalysis.charCount >= 40 
                          ? 'bg-emerald-500' 
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, (shortDescriptionAnalysis.charCount / 80) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Short desc metric pills */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                    Hook Strength
                  </span>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {shortDescriptionAnalysis.hookStrength}
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                    User Benefit Focus
                  </span>
                  <span className={`text-xs font-semibold ${shortDescriptionAnalysis.missingBenefits ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {shortDescriptionAnalysis.missingBenefits ? 'Feature-only (Add benefit)' : 'Benefit-Driven'}
                  </span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                    Call To Action
                  </span>
                  <span className={`text-xs font-semibold ${shortDescriptionAnalysis.callToActionPresence ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {shortDescriptionAnalysis.callToActionPresence ? 'Direct CTA Present' : 'Passive Hook'}
                  </span>
                </div>
              </div>
            </div>

            {/* Short desc findings */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Short Description Findings ({shortDescriptionAnalysis.findings.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shortDescriptionAnalysis.findings.map(f => (
                  <FindingCard key={f.id} finding={f} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FULL DESCRIPTION AUDIT */}
        {activeTab === 'fullDesc' && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Key Diagnostics */}
              <div className="lg:col-span-4 space-y-3">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Description Length
                  </span>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {fullDescriptionAnalysis.charCount.toLocaleString()} chars
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ~{fullDescriptionAnalysis.wordCount} words (4,000 max capacity)
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Structure & Formatting
                  </span>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    {fullDescriptionAnalysis.structureScore}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Feature Dumping Risk
                  </span>
                  <span className={`text-xs font-semibold ${fullDescriptionAnalysis.featureDumpingDetected ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {fullDescriptionAnalysis.featureDumpingDetected ? 'High (Needs benefit translation)' : 'Balanced'}
                  </span>
                </div>
              </div>

              {/* Right Column: Above-The-Fold Hook & Trust Signals */}
              <div className="lg:col-span-8 space-y-4">
                {/* Above The Fold Preview */}
                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 block mb-1">
                    Above-The-Fold Hook (First 250 characters visible before "Read More")
                  </span>
                  <p className="text-xs text-indigo-950 dark:text-indigo-100 font-mono leading-relaxed bg-white/70 dark:bg-slate-900/70 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900">
                    "{fullDescriptionAnalysis.aboveTheFoldHook.slice(0, 250)}..."
                  </p>
                </div>

                {/* Missing Trust Signals */}
                {fullDescriptionAnalysis.missingTrustSignals.length > 0 && (
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-2">
                      Trust & Compliance Signals Evaluation:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      {fullDescriptionAnalysis.missingTrustSignals.map((signal, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Missing explicit note: <strong>{signal}</strong></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Full description findings */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Description Findings ({fullDescriptionAnalysis.findings.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fullDescriptionAnalysis.findings.map(f => (
                  <FindingCard key={f.id} finding={f} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SEARCH INTENT & CONCEPTUAL TERMS */}
        {activeTab === 'searchIntent' && (
          <div className="mt-6 space-y-6">
            {/* Strict Notice banner */}
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <strong>Evidence-Backed Conceptual Relevance:</strong> {searchIntentAndConcepts.notesOnRanking}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Naturally Present Concepts */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Naturally Present Conceptual Themes ({searchIntentAndConcepts.naturallyPresentConcepts.length})
                </h4>
                <div className="space-y-3">
                  {searchIntentAndConcepts.naturallyPresentConcepts.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {item.concept}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                          Natural Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        {item.context}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-500 italic">
                        {item.relevanceToIntent}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing High-Intent Concepts */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Missing High-Intent User Concepts ({searchIntentAndConcepts.missingHighIntentConcepts.length})
                </h4>
                <div className="space-y-3">
                  {searchIntentAndConcepts.missingHighIntentConcepts.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                          {item.concept}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 font-semibold">
                          High User Intent
                        </span>
                      </div>
                      <p className="text-xs text-amber-900 dark:text-amber-300 mb-2">
                        {item.searchIntentExplanation}
                      </p>
                      <div className="text-xs bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-800/60 text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-slate-900 dark:text-white block text-[11px] mb-0.5">
                          How to naturally introduce:
                        </span>
                        {item.howToIntegrateNaturally}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
