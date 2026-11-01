/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FixThisFirstAction } from '../../types/scoring';
import {
  Flame,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

interface FixThisFirstSectionProps {
  actions: FixThisFirstAction[];
  onInspectDimension?: (dimensionId: string) => void;
}

export const FixThisFirstSection: React.FC<FixThisFirstSectionProps> = ({
  actions,
  onInspectDimension,
}) => {
  if (!actions || actions.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
        <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
          No Critical Fixes Required
        </h4>
        <p className="text-xs text-emerald-700 dark:text-emerald-400">
          The listing fulfills all high-priority Google Play conversion and discoverability criteria.
        </p>
      </div>
    );
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <AlertCircle className="w-3 h-3" /> Critical
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3" /> Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Info className="w-3 h-3" /> Optimization
          </span>
        );
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            High Impact
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Medium Impact
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Low Impact
          </span>
        );
    }
  };

  const getEffortBadge = (effort: string) => {
    switch (effort) {
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Zap className="w-3 h-3 text-emerald-500" /> Quick Win (Low Effort)
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3 text-amber-500" /> Moderate Effort
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Strategic Effort
          </span>
        );
    }
  };

  return (
    <div id="fix-this-first-section" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Fix This First — Top 5 Priority Actions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked mathematically using severity, expected conversion impact, implementation effort, and evidence confidence
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 self-start sm:self-auto">
          Ranked 1 to {actions.length}
        </span>
      </div>

      {/* 5 Priority Cards */}
      <div className="space-y-3">
        {actions.map((action) => (
          <div
            key={action.id}
            id={`fix-action-rank-${action.rank}`}
            className="group relative p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all duration-200 shadow-xs hover:shadow-md"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              {/* Left rank badge + info */}
              <div className="flex items-start gap-3.5">
                {/* Priority Rank Number */}
                <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white dark:bg-slate-800 dark:text-white font-black text-lg shrink-0 shadow-xs">
                  <span>#{action.rank}</span>
                </div>

                <div className="space-y-2">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2">
                    {getSeverityBadge(action.severity)}
                    {getImpactBadge(action.expectedImpact)}
                    {getEffortBadge(action.effort)}
                    <span className="text-[11px] text-slate-400 font-medium">
                      Confidence: {action.confidence}
                    </span>
                  </div>

                  {/* Title & Area */}
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {action.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <strong>Why it matters:</strong> {action.whyItMatters}
                    </p>
                  </div>

                  {/* Evidence vs Recommendation Dual Box */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
                    {/* Evidence Box */}
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Observed Listing Evidence
                      </div>
                      <p className="font-mono text-[11px] text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-900/60 p-1.5 rounded border border-slate-200/50 dark:border-slate-800">
                        {action.evidence}
                      </p>
                    </div>

                    {/* Actionable Step Box */}
                    <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-indigo-900 dark:text-indigo-200">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Recommended Implementation
                      </div>
                      <p className="text-indigo-900/90 dark:text-indigo-200/90 leading-relaxed font-medium">
                        {action.actionableStep}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Priority Score details */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Priority Score</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {action.priorityScore}
                    <span className="text-xs text-slate-400 font-normal"> / 100</span>
                  </div>
                </div>

                {onInspectDimension && (
                  <button
                    onClick={() => onInspectDimension(action.dimensionId)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    View Dimension <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
