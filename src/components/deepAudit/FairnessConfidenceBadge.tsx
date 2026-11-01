/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuditConfidenceReport } from '../../types/scoring';
import { ShieldCheck, AlertTriangle, HelpCircle, X, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface FairnessConfidenceBadgeProps {
  report: AuditConfidenceReport;
}

export const FairnessConfidenceBadge: React.FC<FairnessConfidenceBadgeProps> = ({ report }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getBadgeStyle = () => {
    switch (report.overallLevel) {
      case 'Full Evidence':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          dot: 'bg-emerald-500',
        };
      case 'Partial Evidence':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
          dot: 'bg-amber-500',
        };
      case 'Limited Evidence':
      default:
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200',
          icon: <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
          dot: 'bg-rose-500',
        };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <>
      <div
        id="fairness-confidence-trigger"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-150 hover:shadow-sm ${badgeStyle.bg}`}
        title="Click to view Audit Fairness & Evidence Fidelity details"
      >
        <span className={`w-2 h-2 rounded-full ${badgeStyle.dot} animate-pulse`} />
        {badgeStyle.icon}
        <span>
          <strong>{report.overallLevel}</strong> ({report.dataCompletenessPercentage}% Verified)
        </span>
        <HelpCircle className="w-3.5 h-3.5 opacity-60 ml-0.5" />
      </div>

      {isOpen && (
        <div
          id="fairness-confidence-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    Fairness & Evidence Fidelity Guarantee
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Transparent, reproducible scoring with zero fabricated assumptions
                  </p>
                </div>
              </div>
              <button
                id="close-fairness-modal"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-4 text-sm max-h-[70vh] overflow-y-auto pr-1">
              {/* Status Overview Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Audit Confidence Level
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badgeStyle.bg}`}>
                    {report.overallLevel}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    {report.dataCompletenessPercentage}%
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ({report.verifiedFieldsCount} of {report.totalFieldsCount} listing data fields verified)
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${report.dataCompletenessPercentage}%` }}
                  />
                </div>
              </div>

              {/* Anti-Fabrication Principles */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-blue-900 dark:text-blue-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-800 dark:text-blue-300">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Anti-Fabrication & Fairness Rules
                </div>
                <ul className="text-xs space-y-1.5 text-blue-800/90 dark:text-blue-300/90 list-disc list-inside">
                  <li>
                    <strong>Observable Evidence Only:</strong> All scores are derived from real Play Store metadata, images, and user ratings.
                  </li>
                  <li>
                    <strong>No Negative Bias:</strong> Legitimate strengths are surfaced objectively to ensure fair audits.
                  </li>
                  <li>
                    <strong>Missing Data Policy:</strong> If a signal is unavailable (e.g. unrated app), the engine lowers confidence rather than assuming negative performance.
                  </li>
                </ul>
              </div>

              {/* Unavailable Signals Section if any */}
              {report.unavailableSignals && report.unavailableSignals.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Signals Handled With Reduced Confidence ({report.unavailableSignals.length})
                  </h4>
                  <div className="space-y-2">
                    {report.unavailableSignals.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 text-xs space-y-1"
                      >
                        <div className="font-semibold text-amber-900 dark:text-amber-200">
                          {item.signal}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400">
                          <strong>Reason:</strong> {item.reason}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400">
                          <strong>Scoring Impact:</strong> {item.impactOnScoring}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-xs text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>All 20 scoring signals were verified against live Google Play storefront data.</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                id="close-fairness-btn"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-lg transition-colors"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
