/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { IconAuditData } from '../../types/asoDeepAudit';
import { FindingCard } from './FindingCard';
import { 
  Sparkles, 
  Eye, 
  Layers, 
  Maximize2, 
  Type, 
  Tag, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Smartphone,
  Sun,
  Moon
} from 'lucide-react';

interface IconAuditSectionProps {
  iconAudit: IconAuditData;
  appName: string;
  category: string;
}

export const IconAuditSection: React.FC<IconAuditSectionProps> = ({ iconAudit, appName, category }) => {
  const [bgMode, setBgMode] = useState<'light' | 'dark' | 'grid'>('light');
  const iconUrl = iconAudit.iconUrl;

  return (
    <div id="icon-audit-section" className="space-y-6">
      {/* Section Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Visual Asset Inspector
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              App Icon & Visual Distinction Audit
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Analysis of the real 512×512 Google Play icon across small-size legibility, simplicity, category alignment, and competitive cut-through.
            </p>
          </div>

          {/* Theme preview selector for icon test */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl self-start md:self-auto">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2">
              Test Background:
            </span>
            <button
              onClick={() => setBgMode('light')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                bgMode === 'light'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Light background test"
            >
              <Sun className="w-3.5 h-3.5" />
              Light
            </button>
            <button
              onClick={() => setBgMode('dark')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                bgMode === 'dark'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Dark background test"
            >
              <Moon className="w-3.5 h-3.5" />
              Dark
            </button>
            <button
              onClick={() => setBgMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                bgMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
              title="Checkerboard transparency test"
            >
              <Layers className="w-3.5 h-3.5" />
              Grid
            </button>
          </div>
        </div>

        {/* Multi-Size Visual Lab Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Real Icon Display & Scaling Matrix */}
          <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Asset Resolution & Scaling Test
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Simulating Android launcher, store listing, and search thumbnail densities:
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl flex flex-col items-center justify-center gap-6 transition-colors ${
                bgMode === 'light'
                  ? 'bg-white border border-slate-200 shadow-inner'
                  : bgMode === 'dark'
                  ? 'bg-slate-900 border border-slate-800 shadow-inner'
                  : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800'
              }`}
            >
              {iconUrl ? (
                <div className="flex flex-wrap items-end justify-center gap-6">
                  {/* Store Detail Scale (120px) */}
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={iconUrl}
                      alt={`${appName} icon store scale`}
                      className="w-28 h-28 rounded-2xl shadow-md object-cover border border-slate-200/50 dark:border-slate-700/50"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">112px (Store)</span>
                  </div>

                  {/* Home Screen Scale (64px) */}
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={iconUrl}
                      alt={`${appName} icon launcher scale`}
                      className="w-16 h-16 rounded-xl shadow-sm object-cover border border-slate-200/50 dark:border-slate-700/50"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">64px (Home)</span>
                  </div>

                  {/* Search Result Scale (36px) */}
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={iconUrl}
                      alt={`${appName} icon search scale`}
                      className="w-9 h-9 rounded-lg shadow-xs object-cover border border-slate-200/50 dark:border-slate-700/50"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">36px (Search)</span>
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Smartphone className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Source: Google Play High-Res CDN</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Format: 512×512 PNG</span>
            </div>
          </div>

          {/* Metric Evaluation Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Recognizability */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <Eye className="w-4 h-4 text-indigo-500" />
                  Recognizability
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  iconAudit.recognizability.scoreLevel === 'High'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                }`}>
                  {iconAudit.recognizability.scoreLevel}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {iconAudit.recognizability.summary}
              </p>
            </div>

            {/* Visual Simplicity */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <Layers className="w-4 h-4 text-blue-500" />
                  Visual Simplicity
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  iconAudit.visualSimplicity.scoreLevel === 'High'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                }`}>
                  {iconAudit.visualSimplicity.scoreLevel}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {iconAudit.visualSimplicity.summary}
              </p>
            </div>

            {/* Small-Size Clarity */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <Maximize2 className="w-4 h-4 text-purple-500" />
                  Small-Size Clarity (32px)
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  iconAudit.smallSizeClarity.scoreLevel === 'Clear'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                }`}>
                  {iconAudit.smallSizeClarity.scoreLevel}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {iconAudit.smallSizeClarity.summary}
              </p>
            </div>

            {/* Text In Icon */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <Type className="w-4 h-4 text-rose-500" />
                  Text In Icon
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  !iconAudit.textInIcon.hasText
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                }`}>
                  {iconAudit.textInIcon.hasText ? 'Text Detected' : 'Clean (No Microtext)'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {iconAudit.textInIcon.verdict}
              </p>
            </div>

            {/* Category Alignment */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <Tag className="w-4 h-4 text-emerald-500" />
                  Category Fit ({category})
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {iconAudit.categoryAlignment.aligned ? 'Aligned' : 'Divergent'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {iconAudit.categoryAlignment.summary}
              </p>
            </div>

            {/* Professionalism & Polish */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                  <Award className="w-4 h-4 text-amber-500" />
                  Professional Polish
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  {iconAudit.professionalism.level}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {iconAudit.professionalism.summary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Findings List */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Icon Findings & Evidence ({iconAudit.findings.length})</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {iconAudit.findings.map(finding => (
            <FindingCard key={finding.id} finding={finding} />
          ))}
        </div>
      </div>
    </div>
  );
};
