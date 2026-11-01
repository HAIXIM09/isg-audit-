/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuditComparisonReport } from '../../services/playstore/auditHistory';
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  RotateCcw,
  Sparkles,
  Calendar,
  X
} from 'lucide-react';

interface ReauditComparisonBannerProps {
  comparison: AuditComparisonReport;
  onDismiss?: () => void;
  onReauditFresh?: () => void;
}

export const ReauditComparisonBanner: React.FC<ReauditComparisonBannerProps> = ({
  comparison,
  onDismiss,
  onReauditFresh,
}) => {
  const [expanded, setExpanded] = useState(false);

  const isPositiveDelta = comparison.scoreDelta > 0;
  const isNeutralDelta = comparison.scoreDelta === 0;

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      id="reaudit-comparison-banner"
      className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
        isPositiveDelta
          ? 'bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800'
          : isNeutralDelta
          ? 'bg-blue-50/70 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800'
          : 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800'
      }`}
    >
      {/* Banner Top Row */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-xl text-white font-bold shrink-0 ${
              isPositiveDelta ? 'bg-emerald-600' : isNeutralDelta ? 'bg-blue-600' : 'bg-amber-600'
            }`}
          >
            <History className="w-5 h-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                Re-Audit Comparison
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Previous: {formatDate(comparison.previousAuditDate)} → Current: {formatDate(comparison.currentAuditDate)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Score Comparison: {comparison.previousScore} → {comparison.currentScore}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black ${
                  isPositiveDelta
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                    : isNeutralDelta
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                }`}
              >
                {isPositiveDelta ? (
                  <>
                    <TrendingUp className="w-3.5 h-3.5" /> +{comparison.scoreDelta} pts ({comparison.improvementPercentage > 0 ? `+${comparison.improvementPercentage}%` : '+0%'})
                  </>
                ) : isNeutralDelta ? (
                  <>0 pts (Unchanged)</>
                ) : (
                  <>
                    <TrendingDown className="w-3.5 h-3.5" /> {comparison.scoreDelta} pts
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {onReauditFresh && (
            <button
              onClick={onReauditFresh}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Force Live Re-Audit</span>
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <span>{expanded ? 'Hide Breakdown' : 'View Re-Audit Delta'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Dismiss comparison banner"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Breakdown Drawer */}
      {expanded && (
        <div className="p-4 sm:p-5 pt-0 border-t border-slate-200/60 dark:border-slate-800/60 space-y-4">
          {/* Quick Problem Delta Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            {/* Fixed Problems */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Fixed Problems ({comparison.fixedProblems.length})
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  Resolved
                </span>
              </div>
              {comparison.fixedProblems.length > 0 ? (
                <ul className="space-y-1 mt-2 text-xs text-slate-700 dark:text-slate-300">
                  {comparison.fixedProblems.map((p, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">{p}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic mt-1">No previously detected issues marked fixed.</p>
              )}
            </div>

            {/* Remaining Problems */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Remaining Problems ({comparison.remainingProblems.length})
                </span>
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                  Open
                </span>
              </div>
              {comparison.remainingProblems.length > 0 ? (
                <ul className="space-y-1 mt-2 text-xs text-slate-700 dark:text-slate-300">
                  {comparison.remainingProblems.slice(0, 4).map((p, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span className="truncate">{p}</span>
                    </li>
                  ))}
                  {comparison.remainingProblems.length > 4 && (
                    <li className="text-[11px] text-slate-400 pl-3">
                      +{comparison.remainingProblems.length - 4} more remaining
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic mt-1">Zero recurring problems.</p>
              )}
            </div>

            {/* Newly Detected Problems */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  New Detected Issues ({comparison.newlyDetectedProblems.length})
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  New
                </span>
              </div>
              {comparison.newlyDetectedProblems.length > 0 ? (
                <ul className="space-y-1 mt-2 text-xs text-slate-700 dark:text-slate-300">
                  {comparison.newlyDetectedProblems.map((p, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span className="truncate">{p}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  ✓ No new issues introduced.
                </p>
              )}
            </div>
          </div>

          {/* 6 Pillars Delta Grid */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Pillar Score Progression
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {comparison.pillarDeltas.map((p) => (
                <div
                  key={p.pillarId}
                  className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center"
                >
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block truncate">
                    {p.pillarName}
                  </span>
                  <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                    {p.currentScore}
                    <span className="text-[10px] font-normal text-slate-400">/100</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold block mt-0.5 ${
                      p.delta > 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : p.delta < 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {p.delta > 0 ? `+${p.delta} pts` : p.delta < 0 ? `${p.delta} pts` : 'No change'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
