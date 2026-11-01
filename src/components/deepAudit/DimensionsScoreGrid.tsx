/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DimensionScore, ScoringPillarId } from '../../types/scoring';
import { ScoreCalculationModal } from './ScoreCalculationModal';
import {
  Calculator,
  ShieldCheck,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronRight,
  ExternalLink,
  Plus,
  Minus,
} from 'lucide-react';

interface DimensionsScoreGridProps {
  dimensions: DimensionScore[];
  selectedPillarFilter?: ScoringPillarId | null;
  onClearPillarFilter?: () => void;
}

export const DimensionsScoreGrid: React.FC<DimensionsScoreGridProps> = ({
  dimensions,
  selectedPillarFilter,
  onClearPillarFilter,
}) => {
  const [selectedDimensionForProof, setSelectedDimensionForProof] = useState<DimensionScore | null>(null);
  const [activeTab, setActiveTab] = useState<ScoringPillarId | 'all'>(selectedPillarFilter || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDimId, setExpandedDimId] = useState<string | null>(null);

  // Sync with prop when changed
  React.useEffect(() => {
    if (selectedPillarFilter) {
      setActiveTab(selectedPillarFilter);
    } else {
      setActiveTab('all');
    }
  }, [selectedPillarFilter]);

  const pillars: { id: ScoringPillarId | 'all'; label: string }[] = [
    { id: 'all', label: 'All 20 Dimensions' },
    { id: 'discoverability', label: 'Discoverability' },
    { id: 'conversion', label: 'Conversion' },
    { id: 'visual_quality', label: 'Visual Quality' },
    { id: 'trust', label: 'Trust & Reputation' },
    { id: 'listing_quality', label: 'Listing Quality' },
    { id: 'competitive_positioning', label: 'Competitive' },
  ];

  const filteredDimensions = dimensions.filter((dim) => {
    if (activeTab !== 'all' && dim.pillar !== activeTab) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        dim.name.toLowerCase().includes(q) ||
        dim.evidence.toLowerCase().includes(q) ||
        dim.recommendation.toLowerCase().includes(q)
      );
    }
    return true;
  });

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

  const toggleExpand = (id: string) => {
    setExpandedDimId(expandedDimId === id ? null : id);
  };

  return (
    <div id="dimensions-score-grid-section" className="space-y-4">
      {/* Section Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            20-Dimension ASO Scoring Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Weighted, evidence-backed evaluation with clear Evidence vs Recommendation distinction
          </p>
        </div>

        {/* Search & Filter bar */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter dimensions..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Pillar Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar touch-pan-x overscroll-x-contain scroll-smooth snap-x snap-mandatory">
        {pillars.map((tab) => (
          <button
            key={tab.id}
            id={`tab-pillar-${tab.id}`}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === 'all') onClearPillarFilter?.();
            }}
            className={`snap-start px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 20 Dimension Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDimensions.map((dim) => {
          const isExpanded = expandedDimId === dim.id;

          return (
            <div
              key={dim.id}
              id={`dimension-card-${dim.id}`}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 shadow-2xs space-y-3"
            >
              {/* Card Top: Title, Pillar, Score & Grade */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {dim.pillarName}
                    </span>
                    <span className="text-xs text-slate-400">
                      Weight: <strong>{dim.weight}%</strong>
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {dim.name}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {dim.score}
                    </span>
                    <span className="text-xs text-slate-400">/100</span>
                    <span
                      className={`block px-2 py-0.5 rounded text-[10px] font-bold border mt-0.5 ${getGradeBadgeColor(
                        dim.grade
                      )}`}
                    >
                      Grade {dim.grade}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Contribution */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Calculated Score</span>
                  <span className="font-mono font-medium text-indigo-600 dark:text-indigo-400">
                    +{dim.weightedContribution.toFixed(2)} pts to total
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      dim.score >= 80
                        ? 'bg-emerald-500'
                        : dim.score >= 65
                        ? 'bg-blue-500'
                        : dim.score >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>

              {/* Clear Evidence vs Recommendation Distinction */}
              <div className="space-y-2.5 pt-1">
                {/* 1. Evidence (Observed Real Data) */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Observed Store Evidence
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Confidence: {dim.confidence}
                    </span>
                  </div>
                  <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 p-2 rounded border border-slate-200/50 dark:border-slate-800">
                    {dim.evidence}
                  </p>
                </div>

                {/* 2. Recommendation (Actionable Guidance) */}
                <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs space-y-1">
                  <span className="flex items-center gap-1 font-semibold text-indigo-900 dark:text-indigo-200">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Targeted Recommendation
                  </span>
                  <p className="text-indigo-900/90 dark:text-indigo-200/90 font-medium">
                    {dim.recommendation}
                  </p>
                </div>
              </div>

              {/* Contributing Point Observations (Expandable) */}
              {dim.contributingObservations && dim.contributingObservations.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <button
                    onClick={() => toggleExpand(dim.id)}
                    className="flex items-center justify-between w-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    <span>
                      {dim.contributingObservations.length} Point Factor Observations
                    </span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400">
                      {isExpanded ? 'Hide Factors' : 'View Factors'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="mt-2 space-y-1.5">
                      {dim.contributingObservations.map((obs, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-[11px] p-2 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                        >
                          <span className="text-slate-700 dark:text-slate-300 pr-2">
                            {obs.observation}
                          </span>
                          <span
                            className={`font-mono font-bold shrink-0 px-1.5 py-0.5 rounded text-[10px] ${
                              obs.pointDelta > 0
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                : obs.pointDelta < 0
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                                : 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {obs.pointDelta > 0 ? `+${obs.pointDelta}` : `${obs.pointDelta}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Inspect Math Proof Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  id={`inspect-proof-${dim.id}`}
                  onClick={() => setSelectedDimensionForProof(dim)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Inspect Calculation Proof</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Proof Modal */}
      {selectedDimensionForProof && (
        <ScoreCalculationModal
          scorecard={null as any}
          selectedDimension={selectedDimensionForProof}
          onClose={() => setSelectedDimensionForProof(null)}
        />
      )}
    </div>
  );
};
