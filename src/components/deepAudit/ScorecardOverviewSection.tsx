/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuditScorecard, PillarScore, DimensionScore, ScoringPillarId } from '../../types/scoring';
import { FairnessConfidenceBadge } from './FairnessConfidenceBadge';
import { ScoreCalculationModal } from './ScoreCalculationModal';
import { DimensionsScoreGrid } from './DimensionsScoreGrid';
import { FixThisFirstSection } from './FixThisFirstSection';
import {
  Compass,
  MousePointerClick,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Calculator,
  ChevronRight,
  Info,
  Layers,
  AlertTriangle,
  AlertCircle,
  Flame,
  Award,
  Zap,
  Check,
  FileCheck2,
  ShieldAlert,
} from 'lucide-react';

interface ScorecardOverviewSectionProps {
  scorecard: AuditScorecard;
  onSelectPillarFilter?: (pillarId: ScoringPillarId | null) => void;
  activePillarFilter?: ScoringPillarId | null;
  onNavigateTab?: (tab: string) => void;
}

export const ScorecardOverviewSection: React.FC<ScorecardOverviewSectionProps> = ({
  scorecard,
  onSelectPillarFilter,
  activePillarFilter,
  onNavigateTab,
}) => {
  const [showOverallCalc, setShowOverallCalc] = useState(false);
  const [selectedDimensionForCalc, setSelectedDimensionForCalc] = useState<DimensionScore | null>(null);

  const biggestProblem = scorecard.whatsWrong && scorecard.whatsWrong.length > 0 ? scorecard.whatsWrong[0] : null;
  const biggestStrength = scorecard.whatIsGood && scorecard.whatIsGood.length > 0 ? scorecard.whatIsGood[0] : null;
  const confidence = scorecard.confidenceReport;

  const getPillarIcon = (pillarId: ScoringPillarId) => {
    switch (pillarId) {
      case 'discoverability':
        return <Compass className="w-5 h-5 text-blue-500" />;
      case 'conversion':
        return <MousePointerClick className="w-5 h-5 text-emerald-500" />;
      case 'visual_quality':
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
      case 'trust':
        return <ShieldCheck className="w-5 h-5 text-amber-500" />;
      case 'listing_quality':
        return <CheckCircle2 className="w-5 h-5 text-teal-500" />;
      case 'competitive_positioning':
        return <TrendingUp className="w-5 h-5 text-purple-500" />;
    }
  };

  const getGradeBadgeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'B':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      case 'C':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'D':
      case 'F':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    }
  };

  return (
    <div id="scorecard-overview-section" className="space-y-8">
      {/* 1. HERO OVERALL SCORE & AUDIT HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 shadow-xl border border-slate-700">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left app metadata summary */}
          <div className="space-y-3 max-w-xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Play Store ASO & CRO Executive Scorecard
              </span>
              <FairnessConfidenceBadge report={confidence} />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {scorecard.appName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                20-dimension storefront audit evaluated mathematically against verified Play Store metadata, visual assets, and user sentiment.
              </p>
            </div>

            {/* Quick stats counter */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-semibold text-white">{scorecard.whatIsGood.length}</span> Verified Strengths
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="font-semibold text-white">{scorecard.whatsWrong.length}</span> Identified Opportunities
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span className="font-semibold text-white">{scorecard.fixThisFirst.length}</span> Top Priority Fixes
              </div>
            </div>
          </div>

          {/* Right overall score display */}
          <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-5 rounded-2xl border border-white/10 shrink-0 self-stretch md:self-auto justify-between md:justify-start">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                {scorecard.overallScore}
                <span className="text-xl text-indigo-300 font-normal">/100</span>
              </div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-indigo-200 mt-0.5">
                Overall Score
              </div>
            </div>

            <div className="h-12 w-px bg-white/20" />

            <div className="flex flex-col items-center gap-1.5">
              <span className={`px-3.5 py-1 rounded-xl text-base font-black border ${getGradeBadgeColor(scorecard.overallGrade)}`}>
                Grade {scorecard.overallGrade}
              </span>
              <button
                id="btn-inspect-math"
                onClick={() => setShowOverallCalc(true)}
                className="inline-flex items-center gap-1 text-[11px] text-indigo-300 hover:text-white transition-colors cursor-pointer"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Inspect Math Proof</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FIRST SCREEN EXECUTIVE SPOTLIGHT: Biggest Problem, Biggest Strength & Confidence/Evidence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Biggest Problem Card */}
        <div
          id="spotlight-biggest-problem"
          className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex flex-col justify-between space-y-4 shadow-2xs"
        >
          <div>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Biggest Problem
              </span>
              <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider bg-rose-50/50 dark:bg-rose-900/30 px-2 py-1 rounded">
                {biggestProblem?.severity || 'Critical'}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-4 leading-snug">
              {biggestProblem ? biggestProblem.title : 'No critical conversion bottlenecks detected'}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              {biggestProblem ? biggestProblem.whyItMatters : 'Storefront elements fulfill standard quality benchmarks.'}
            </p>

            {biggestProblem?.evidence && (
              <div className="mt-4 p-3 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-rose-100 dark:border-rose-900/40 text-xs shadow-sm w-full overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 block mb-1.5">
                  Observed Store Evidence
                </span>
                <p className="font-mono text-[10px] text-slate-700 dark:text-slate-300 break-all whitespace-pre-wrap">
                  {biggestProblem.evidence}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Impact: <strong>High</strong></span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('whatsWrong')}
                className="font-bold text-rose-700 dark:text-rose-300 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                View All {scorecard.whatsWrong.length} Issues <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Biggest Strength Card */}
        <div
          id="spotlight-biggest-strength"
          className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between space-y-4 shadow-2xs"
        >
          <div>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                <Award className="w-3.5 h-3.5 shrink-0" />
                Top Strength
              </span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50/50 dark:bg-emerald-900/30 px-2 py-1 rounded">
                Verified
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-4 leading-snug">
              {biggestStrength ? biggestStrength.title : 'Solid Foundation'}
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              {biggestStrength ? biggestStrength.competitiveAdvantage : 'App provides established storefront presentation.'}
            </p>

            {biggestStrength?.evidence && (
              <div className="mt-4 p-3 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-emerald-100 dark:border-emerald-900/40 text-xs shadow-sm w-full overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-1.5">
                  Verified Store Proof
                </span>
                <p className="font-mono text-[10px] text-slate-700 dark:text-slate-300 break-all whitespace-pre-wrap">
                  {biggestStrength.evidence}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Advantage: <strong>Verified</strong></span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('whatIsGood')}
                className="font-bold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                View All {scorecard.whatIsGood.length} Strengths <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Confidence & Evidence Coverage Card */}
        <div
          id="spotlight-confidence-coverage"
          className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 flex flex-col justify-between space-y-4 shadow-2xs"
        >
          <div>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                Data Integrity
              </span>
              <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 tracking-wider bg-indigo-50/50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                {confidence?.confidenceLevel || 'High'} ({confidence?.scoreConfidencePercentage || 100}%)
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-4 leading-snug">
              Grounding & Coverage
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Every score is computed directly from live Play Store assets with zero fabricated metrics.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">Verified Fields Checked:</span>
                <span className="font-bold text-slate-900 dark:text-white text-[11px] text-right">
                  {confidence?.verifiedFieldsCount || 10} / {confidence?.totalEligibleFields || 10}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/80 dark:bg-slate-900/70 border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
                <span className="text-slate-600 dark:text-slate-400 text-[11px]">Fairness Adjustments:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px] text-right">
                  {confidence?.penaltiesWaivedDueToMissingData && confidence.penaltiesWaivedDueToMissingData.length > 0
                    ? `${confidence.penaltiesWaivedDueToMissingData.length} Waived`
                    : 'Standard Baseline'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-indigo-200/60 dark:border-indigo-900/40 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Evidence Audit: <strong>Verified</strong></span>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('evidence')}
                className="font-bold text-indigo-700 dark:text-indigo-300 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Inspect Raw Evidence <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. FIX THIS FIRST — TOP 5 PRIORITY ACTIONS (Directly on First Screen) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <FixThisFirstSection
          actions={scorecard.fixThisFirst}
          onInspectDimension={(dimId) => {
            const found = scorecard.dimensionsList.find((d) => d.id === dimId);
            if (found) {
              setSelectedDimensionForCalc(found);
            }
          }}
        />
      </div>

      {/* 4. SIX CORE ROLLUP PILLARS GRID */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Six Core ASO Rollup Pillars
            </h3>
          </div>
          {activePillarFilter && (
            <button
              onClick={() => onSelectPillarFilter?.(null)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Clear Filter (Show All 20 Dimensions)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scorecard.pillarsList.map((pillar) => {
            const isSelected = activePillarFilter === pillar.id;

            return (
              <div
                key={pillar.id}
                id={`pillar-card-${pillar.id}`}
                onClick={() => onSelectPillarFilter?.(isSelected ? null : pillar.id)}
                className={`relative p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                }`}
              >
                {/* Pillar Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                      {getPillarIcon(pillar.id)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {pillar.name}
                      </h4>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {pillar.dimensionCount} Dimensions
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {pillar.score}
                    </span>
                    <span className="text-xs text-slate-400">/100</span>
                    <span
                      className={`block px-2 py-0.5 rounded text-[10px] font-bold border mt-0.5 ${getGradeBadgeColor(
                        pillar.grade
                      )}`}
                    >
                      {pillar.grade}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                  {pillar.description}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pillar.score >= 80
                        ? 'bg-emerald-500'
                        : pillar.score >= 65
                        ? 'bg-blue-500'
                        : pillar.score >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>

                {/* Strength & Vulnerability footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                    <span className="font-medium truncate max-w-[180px]">
                      ✓ {pillar.primaryStrength}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[180px]">
                      ! {pillar.primaryVulnerability}
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center">
                      {isSelected ? 'Active Filter' : 'Filter Matrix'} <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. INTERACTIVE 20-DIMENSION SCORECARD MATRIX */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <DimensionsScoreGrid
          dimensions={scorecard.dimensionsList}
          selectedPillarFilter={activePillarFilter}
          onClearPillarFilter={() => onSelectPillarFilter?.(null)}
        />
      </div>

      {/* Modal for Math Proof */}
      {(showOverallCalc || selectedDimensionForCalc) && (
        <ScoreCalculationModal
          scorecard={scorecard}
          selectedDimension={selectedDimensionForCalc}
          onClose={() => {
            setShowOverallCalc(false);
            setSelectedDimensionForCalc(null);
          }}
        />
      )}
    </div>
  );
};
