/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuditScorecard, DimensionScore } from '../../types/scoring';
import { X, Calculator, ShieldCheck, Check, AlertCircle, Sparkles, Award } from 'lucide-react';

interface ScoreCalculationModalProps {
  scorecard: AuditScorecard;
  selectedDimension?: DimensionScore | null;
  onClose: () => void;
}

export const ScoreCalculationModal: React.FC<ScoreCalculationModalProps> = ({
  scorecard,
  selectedDimension,
  onClose,
}) => {
  const isOverall = !selectedDimension;

  return (
    <div
      id="score-calculation-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                {isOverall ? 'Overall Score Mathematical Proof' : `${selectedDimension.name} Calculation`}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isOverall
                  ? 'Deterministically weighted composite across 20 verified Play Store dimensions'
                  : `Weight: ${selectedDimension.weight}% of overall score • Pillar: ${selectedDimension.pillarName}`}
              </p>
            </div>
          </div>
          <button
            id="close-calc-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="mt-4 space-y-4 text-sm overflow-y-auto pr-1">
          {isOverall ? (
            <>
              {/* Overall Summary Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Mathematical Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {scorecard.overallScore}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">/ 100</span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 ml-2">
                      Grade: {scorecard.overallGrade}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                  <div><strong>Total Dimensions:</strong> 20</div>
                  <div><strong>Total Weight:</strong> 100%</div>
                </div>
              </div>

              {/* Formula & Reproducibility Guarantee */}
              <div className="p-3.5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs space-y-2">
                <div className="font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Deterministic Calculation Formula
                </div>
                <div className="font-mono text-[11px] p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-indigo-200/60 dark:border-indigo-800/40 text-slate-800 dark:text-slate-200 overflow-x-auto whitespace-nowrap">
                  {scorecard.calculationSummary.formula}
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  The overall score is computed purely by taking the sum product of each dimension score multiplied by its specific weight. It is mathematically verified and never independently invented.
                </p>
              </div>

              {/* 20 Dimension Weighted Breakdown Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Weighted Dimension Table (All 20 Dimensions)
                </h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto text-xs touch-pan-x overscroll-x-contain">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2 px-3">Dimension</th>
                        <th className="py-2 px-3 text-center">Score</th>
                        <th className="py-2 px-3 text-center">Weight</th>
                        <th className="py-2 px-3 text-right">Contribution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {scorecard.dimensionsList.map((dim) => (
                        <tr key={dim.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-2 px-3">
                            <span className="font-medium text-slate-900 dark:text-white">
                              {dim.name}
                            </span>
                            <span className="block text-[10px] text-slate-500">
                              {dim.pillarName}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                            {dim.score}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-500">
                            {dim.weight}%
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                            +{dim.weightedContribution.toFixed(2)} pts
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold border-t border-slate-200 dark:border-slate-700">
                      <tr>
                        <td className="py-2 px-3 text-slate-900 dark:text-white">Total Overall Score</td>
                        <td className="py-2 px-3 text-center text-slate-900 dark:text-white">{scorecard.overallScore}</td>
                        <td className="py-2 px-3 text-center text-slate-600 dark:text-slate-300">100%</td>
                        <td className="py-2 px-3 text-right text-indigo-600 dark:text-indigo-400">
                          {scorecard.overallScore}.00 pts
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Single Dimension Proof */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Dimension Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {selectedDimension.score}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">/ 100</span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 ml-2">
                      Grade: {selectedDimension.grade}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                  <div><strong>Contribution:</strong> +{selectedDimension.weightedContribution.toFixed(2)} pts</div>
                  <div><strong>Weight:</strong> {selectedDimension.weight}% of 100%</div>
                </div>
              </div>

              {/* Observed Listing Evidence */}
              <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Observed Storefront Evidence
                </div>
                <p className="font-mono text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  {selectedDimension.evidence}
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  {selectedDimension.explanation}
                </p>
              </div>

              {/* Point Additions and Deductions */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Contributing Point Observations
                </h4>
                <div className="space-y-2">
                  {selectedDimension.contributingObservations.map((obs, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                        obs.type === 'positive'
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                          : obs.type === 'negative'
                          ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/40 text-rose-900 dark:text-rose-200'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{obs.observation}</div>
                        <div className="text-[11px] opacity-80 font-mono">{obs.evidence}</div>
                      </div>
                      <span
                        className={`shrink-0 font-bold font-mono px-2 py-0.5 rounded text-xs ${
                          obs.pointDelta > 0
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                            : obs.pointDelta < 0
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                            : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {obs.pointDelta > 0 ? `+${obs.pointDelta}` : `${obs.pointDelta}`} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendation */}
              <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1.5">
                <div className="font-semibold text-amber-900 dark:text-amber-200">
                  Targeted ASO Recommendation
                </div>
                <p className="text-amber-800/90 dark:text-amber-300/90">
                  {selectedDimension.recommendation}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
          <button
            id="close-score-calc-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white rounded-lg transition-colors"
          >
            Close Proof
          </button>
        </div>
      </div>
    </div>
  );
};
