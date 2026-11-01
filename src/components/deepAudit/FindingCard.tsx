/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StructuredFinding, FindingSeverity } from '../../types/asoDeepAudit';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface FindingCardProps {
  finding: StructuredFinding;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding }) => {
  const getSeverityBadge = (severity: FindingSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800">
            <AlertCircle className="w-3.5 h-3.5" />
            Critical Issue
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            Warning
          </span>
        );
      case 'positive':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Strength
          </span>
        );
      case 'info':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800">
            <Info className="w-3.5 h-3.5" />
            Observation
          </span>
        );
    }
  };

  const getBorderColor = (severity: FindingSeverity) => {
    switch (severity) {
      case 'critical':
        return 'border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/10';
      case 'warning':
        return 'border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/10';
      case 'positive':
        return 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/10';
      case 'info':
      default:
        return 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900';
    }
  };

  return (
    <div
      id={`finding-${finding.id}`}
      className={`rounded-xl border p-4 transition-all hover:shadow-sm ${getBorderColor(finding.severity)}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          {getSeverityBadge(finding.severity)}
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {finding.category}
          </span>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          Confidence: <strong className="text-slate-700 dark:text-slate-200">{finding.confidence}</strong>
        </span>
      </div>

      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
        {finding.issue}
      </h4>

      {/* Concrete evidence */}
      <div className="bg-slate-100/80 dark:bg-slate-800/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 mb-2.5">
        <span className="font-sans font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
          Real Evidence:
        </span>
        {finding.evidence}
      </div>

      {/* Explanation */}
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
        {finding.explanation}
      </p>

      {/* Recommendation */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/40 rounded-lg p-3 border border-indigo-100 dark:border-indigo-900/50">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 block mb-0.5">
              Actionable Guidance:
            </span>
            <p className="text-xs text-indigo-800 dark:text-indigo-200 leading-relaxed">
              {finding.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
