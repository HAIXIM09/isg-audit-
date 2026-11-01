/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenshotIndividualAnalysis, ScreenshotSequenceJourney } from '../../types/asoDeepAudit';
import { FindingCard } from './FindingCard';
import { 
  Sparkles, 
  Crown, 
  AlertCircle, 
  TrendingUp, 
  Maximize2, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Eye, 
  Layout, 
  FileText, 
  Layers,
  Shield,
  ChevronLeft,
  ChevronRight,
  ZoomIn
} from 'lucide-react';

interface ScreenshotLabSectionProps {
  screenshots: ScreenshotIndividualAnalysis[];
  journey: ScreenshotSequenceJourney;
  appName: string;
}

export const ScreenshotLabSection: React.FC<ScreenshotLabSectionProps> = ({
  screenshots,
  journey,
  appName,
}) => {
  const [selectedFrameIndex, setSelectedFrameIndex] = useState<number>(0);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const selectedScreenshot = screenshots[selectedFrameIndex] || screenshots[0];

  return (
    <div id="screenshot-lab-section" className="space-y-6">
      {/* Section Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-2">
              <Layers className="w-3.5 h-3.5" />
              Conversion Rate Optimization (CRO) Lab
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Screenshot Sequence & Individual Frame Inspector
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Evaluating all {screenshots.length} preview frames individually for headline clarity, UI prominence, benefit communication, and full conversion narrative.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              Total Frames: <strong className="text-slate-900 dark:text-white">{journey.totalFrames}</strong>
            </span>
          </div>
        </div>

        {/* Strongest vs Weakest Spotlight Row */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strongest Frame Spotlight */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-xs">
                  <Crown className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Highest Conversion Impact
                  </span>
                  <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                    Strongest Frame: Screenshot #{journey.strongestScreenshot.frameNumber}
                  </h3>
                </div>
              </div>
              {journey.strongestScreenshot.url && (
                <img
                  src={journey.strongestScreenshot.url}
                  alt={`Screenshot ${journey.strongestScreenshot.frameNumber}`}
                  className="w-12 h-20 object-cover rounded-lg border border-emerald-300 dark:border-emerald-800 shadow-xs shrink-0 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setLightboxUrl(journey.strongestScreenshot.url)}
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed mb-2">
              {journey.strongestScreenshot.whyStrongest}
            </p>
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Takeaway: {journey.strongestScreenshot.keyTakeaway}</span>
            </div>
          </div>

          {/* Weakest Frame Spotlight */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-600 text-white shadow-xs">
                  <AlertCircle className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    Drop-off / Weakest Link
                  </span>
                  <h3 className="text-sm font-bold text-amber-950 dark:text-amber-100">
                    Weakest Frame: Screenshot #{journey.weakestScreenshot.frameNumber}
                  </h3>
                </div>
              </div>
              {journey.weakestScreenshot.url && (
                <img
                  src={journey.weakestScreenshot.url}
                  alt={`Screenshot ${journey.weakestScreenshot.frameNumber}`}
                  className="w-12 h-20 object-cover rounded-lg border border-amber-300 dark:border-amber-800 shadow-xs shrink-0 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setLightboxUrl(journey.weakestScreenshot.url)}
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed mb-2">
              {journey.weakestScreenshot.whyWeakest}
            </p>
            <div className="text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              <span>Action: {journey.weakestScreenshot.fixRecommendation}</span>
            </div>
          </div>
        </div>

        {/* 3-Stage Conversion Journey Flow */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            The 3-Stage Conversion Journey
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stage 1: Hook */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold">1</span>
                  First Impression Hook
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {journey.firstScreenshotHook.mainValuePropSpeed}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {journey.firstScreenshotHook.observation}
              </p>
            </div>

            {/* Stage 2: Feature Progression */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-[10px] font-bold">2</span>
                  Narrative Progression
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {journey.progressionFlow.narrativeQuality}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {journey.progressionFlow.observation}
              </p>
            </div>

            {/* Stage 3: Trust & CTA */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold">3</span>
                  Trust & Call-to-Action
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {journey.finalScreenshotsTrust.hasTrustOrCallToAction ? 'Reinforced' : 'Needs CTA'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {journey.finalScreenshotsTrust.observation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Frame Carousel Selector & Deep Frame Inspector */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Individual Frame-by-Frame Inspector
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any screenshot below to inspect visual hierarchy, headline clarity, and specific findings:
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFrameIndex(prev => Math.max(0, prev - 1))}
              disabled={selectedFrameIndex === 0}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Frame {selectedFrameIndex + 1} of {screenshots.length}
            </span>
            <button
              onClick={() => setSelectedFrameIndex(prev => Math.min(screenshots.length - 1, prev + 1))}
              disabled={selectedFrameIndex === screenshots.length - 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Carousel Strip */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scroll-smooth snap-x snap-mandatory overscroll-x-contain touch-pan-x">
          {screenshots.map((s, idx) => {
            const isSelected = idx === selectedFrameIndex;
            const isStrong = journey.strongestScreenshot.frameNumber === idx + 1;
            const isWeak = journey.weakestScreenshot.frameNumber === idx + 1;

            return (
              <button
                key={idx}
                onClick={() => setSelectedFrameIndex(idx)}
                className={`snap-start relative shrink-0 flex flex-col items-center rounded-xl p-2 transition-all border text-left ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-50/60 dark:bg-slate-800/40'
                }`}
              >
                <div className="relative">
                  <img
                    src={s.url}
                    alt={`Frame ${idx + 1}`}
                    className="w-20 h-36 object-cover rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  {isStrong && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white rounded-full p-1 shadow-xs" title="Strongest Frame">
                      <Crown className="w-3 h-3" />
                    </span>
                  )}
                  {isWeak && (
                    <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white rounded-full p-1 shadow-xs" title="Weakest Frame">
                      <AlertCircle className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-2">
                  #{idx + 1} {idx === 0 ? '(Hero)' : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed Frame Evaluation Grid */}
        {selectedScreenshot && (
          <div className="mt-6 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Visual Preview */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="relative group cursor-pointer" onClick={() => setLightboxUrl(selectedScreenshot.url)}>
                  <img
                    src={selectedScreenshot.url}
                    alt={`Screenshot #${selectedScreenshot.frameNumber}`}
                    className="max-h-96 w-auto object-contain rounded-xl shadow-md border border-slate-200 dark:border-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white gap-2 font-medium text-xs">
                    <ZoomIn className="w-5 h-5" />
                    Click to Enlarge
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-3">
                  Frame #{selectedScreenshot.frameNumber} of {screenshots.length}
                </span>
              </div>

              {/* Right Column: 10-Point Technical Diagnostic */}
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Frame Diagnostics
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedScreenshot.headlineDetected || `Screenshot #${selectedScreenshot.frameNumber}`}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                      Visual Hierarchy
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200">
                      {selectedScreenshot.visualHierarchy}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                      Headline Clarity
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {selectedScreenshot.headlineClarity}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                      UI Prominence & Visibility
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200">
                      {selectedScreenshot.uiVisibility}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                      Contrast & Readability
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200">
                      {selectedScreenshot.readability}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                      Feature Showcased
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200">
                      {selectedScreenshot.featureCommunicated}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                      Benefit Delivered to User
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200">
                      {selectedScreenshot.benefitCommunicated}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                      Information Density
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200">
                      {selectedScreenshot.informationDensity}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                      Swipe Incentive (Reason to continue)
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200">
                      {selectedScreenshot.reasonToContinueSwipe}
                    </p>
                  </div>
                </div>

                {/* Frame findings */}
                {selectedScreenshot.findings.length > 0 && (
                  <div className="pt-2 space-y-3">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Specific Findings for Frame #{selectedScreenshot.frameNumber}:
                    </span>
                    {selectedScreenshot.findings.map(f => (
                      <FindingCard key={f.id} finding={f} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sequence Journey Findings */}
      {journey.findings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Overall Screenshot Sequence Findings ({journey.findings.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {journey.findings.map(f => (
              <FindingCard key={f.id} finding={f} />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh]">
            <img
              src={lightboxUrl}
              alt="Enlarged screenshot preview"
              className="max-h-[85vh] w-auto rounded-2xl shadow-2xl border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute -top-3 -right-3 bg-white text-slate-900 dark:bg-slate-800 dark:text-white p-2 rounded-full shadow-lg text-xs font-bold"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
