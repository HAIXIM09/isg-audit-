/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WhatIsGoodStrength } from '../../types/scoring';
import { CheckCircle2, ShieldCheck, Award, Sparkles, ThumbsUp } from 'lucide-react';

interface WhatIsGoodSectionProps {
  strengths: WhatIsGoodStrength[];
}

export const WhatIsGoodSection: React.FC<WhatIsGoodSectionProps> = ({ strengths }) => {
  if (!strengths || strengths.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
        No distinctive strengths verified on the public storefront.
      </div>
    );
  }

  return (
    <div id="what-is-good-section" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What Is Good — Verified Strengths & Assets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Objective, evidence-backed showcase of what this app is doing right on the Google Play Store
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
          {strengths.length} Verified Strengths
        </span>
      </div>

      {/* Strengths Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {strengths.map((strength) => (
          <div
            key={strength.id}
            id={`strength-card-${strength.id}`}
            className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all duration-200 space-y-2.5"
          >
            {/* Header Area */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {strength.area}
                </h4>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                Confidence: {strength.confidence}
              </span>
            </div>

            {/* Evidence Note */}
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/30 text-xs space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Evidence
              </div>
              <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                {strength.evidence}
              </p>
            </div>

            {/* Competitive Advantage */}
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-emerald-800 dark:text-emerald-300 font-semibold">
                Why this helps:
              </strong>{' '}
              {strength.competitiveAdvantage}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
