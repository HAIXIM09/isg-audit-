/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WhatsWrongProblem } from '../../types/scoring';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  Filter,
  ShieldCheck,
  Sparkles,
  Zap,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface WhatsWrongSectionProps {
  problems: WhatsWrongProblem[];
}

export const WhatsWrongSection: React.FC<WhatsWrongSectionProps> = ({ problems }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProblemId, setExpandedProblemId] = useState<string | null>(null);

  const filteredProblems = problems.filter((p) => {
    if (selectedSeverity !== 'all' && p.severity !== selectedSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.affectedArea.toLowerCase().includes(q) ||
        p.evidence.toLowerCase().includes(q) ||
        p.recommendedFix.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const criticalCount = problems.filter((p) => p.severity === 'critical').length;
  const warningCount = problems.filter((p) => p.severity === 'warning').length;
  const infoCount = problems.filter((p) => p.severity === 'info').length;

  const toggleExpand = (id: string) => {
    setExpandedProblemId(expandedProblemId === id ? null : id);
  };

  return (
    <div id="whats-wrong-section" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What&apos;s Wrong — Issues & Vulnerabilities
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear breakdown of listing friction points backed by observed Google Play storefront evidence
            </p>
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setSelectedSeverity('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedSeverity === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All ({problems.length})
          </button>
          <button
            onClick={() => setSelectedSeverity('critical')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedSeverity === 'critical'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 hover:bg-rose-100'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setSelectedSeverity('warning')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedSeverity === 'warning'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 hover:bg-amber-100'
            }`}
          >
            Warnings ({warningCount})
          </button>
          <button
            onClick={() => setSelectedSeverity('info')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedSeverity === 'info'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 hover:bg-blue-100'
            }`}
          >
            Observations ({infoCount})
          </button>
        </div>
      </div>

      {/* Problems List */}
      {filteredProblems.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
          No issues found matching the selected filter criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProblems.map((problem) => {
            const isExpanded = expandedProblemId === problem.id;

            return (
              <div
                key={problem.id}
                id={`problem-card-${problem.id}`}
                className={`p-4 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-900 ${
                  problem.severity === 'critical'
                    ? 'border-rose-200 dark:border-rose-900/60 shadow-2xs'
                    : problem.severity === 'warning'
                    ? 'border-amber-200 dark:border-amber-900/60 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => toggleExpand(problem.id)}
                  className="flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          problem.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : problem.severity === 'warning'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {problem.severity === 'critical' ? (
                          <AlertCircle className="w-3 h-3" />
                        ) : problem.severity === 'warning' ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <Info className="w-3 h-3" />
                        )}
                        {problem.severity}
                      </span>

                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {problem.affectedArea}
                      </span>

                      <span className="text-[11px] text-slate-400">
                        • Impact: <strong>{problem.expectedImpact}</strong> • Effort: <strong>{problem.effort}</strong>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      {problem.whyItMatters}
                    </p>
                  </div>

                  <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded Details: Evidence vs Recommended Fix */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Real Evidence */}
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Observed Storefront Evidence
                    </div>
                    <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-2 rounded border border-slate-200/50 dark:border-slate-800">
                      {problem.evidence}
                    </p>
                  </div>

                  {/* Recommended Fix */}
                  <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-indigo-900 dark:text-indigo-200">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Recommended Fix
                    </div>
                    <p className="text-indigo-900/90 dark:text-indigo-200/90 font-medium">
                      {problem.recommendedFix}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
