/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Filter,
  Search,
  Calendar,
  Layers,
  MessageCircle,
  HelpCircle,
  ShieldAlert,
  Bug,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ReviewIntelligenceSection as ReviewIntelType, RawPlayStoreReview } from '../../types/asoDeepAudit';
import { FindingCard } from './FindingCard';

interface Props {
  reviewData?: ReviewIntelType;
  appName: string;
}

export const ReviewIntelligenceSection: React.FC<Props> = ({ reviewData, appName }) => {
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState<string>('all');
  const [hasReplyOnly, setHasReplyOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'thumbs' | 'rating'>('date');
  const [expandedQuotes, setExpandedQuotes] = useState<Record<string, boolean>>({});

  const stats = reviewData?.stats;
  const rawReviews = reviewData?.rawReviews || [];

  const toggleQuote = (id: string) => {
    setExpandedQuotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered reviews for Explorer
  const filteredReviews = useMemo(() => {
    return rawReviews
      .filter((r) => {
        if (selectedRatingFilter !== 'all' && Math.round(r.score) !== selectedRatingFilter) return false;
        if (selectedSentimentFilter !== 'all' && r.sentiment !== selectedSentimentFilter) return false;
        if (hasReplyOnly && !r.replyText) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchText = r.text.toLowerCase().includes(q);
          const matchUser = r.userName.toLowerCase().includes(q);
          const matchVersion = r.version?.toLowerCase().includes(q);
          if (!matchText && !matchUser && !matchVersion) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'thumbs') {
          return (b.thumbsUp || 0) - (a.thumbsUp || 0);
        }
        if (sortBy === 'rating') {
          return b.score - a.score;
        }
        return 0;
      });
  }, [rawReviews, selectedRatingFilter, selectedSentimentFilter, hasReplyOnly, searchQuery, sortBy]);

  // If no review data or unavailable
  if (!stats || !stats.available || rawReviews.length === 0) {
    return (
      <div className="space-y-6" id="review-intelligence-unavailable">
        <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-6 text-slate-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">Review Intelligence Data Unavailable</h3>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Confidence: Reduced
                </span>
              </div>
              <p className="text-sm text-slate-300">
                {stats?.reasonIfUnavailable ||
                  `Public review pagination was restricted by Google Play Store servers for "${appName}". In accordance with our anti-fabrication guidelines, no simulated reviews or speculative sentiment statistics have been generated.`}
              </p>
              <div className="mt-4 p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">Why does this happen?</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                  <li>The app is newly published and has not yet accrued sufficient public store reviews.</li>
                  <li>Google Play Store regional throttling or IP rate limiting temporarily restricted review feed queries.</li>
                  <li>The app is currently in closed testing or regional rollout track.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {reviewData?.findings && reviewData.findings.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Observed Findings</h4>
            <div className="grid grid-cols-1 gap-3">
              {reviewData.findings.map((f) => (
                <FindingCard key={f.id} finding={f} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8" id="review-intelligence-section">
      {/* Top Banner: Dataset Overview */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
                <MessageSquare className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-white">Public Reviews Dataset Intelligence</h3>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified Sample: {stats.sampleSize} Reviews
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Analyzed {stats.sampleSize} verified public Google Play reviews collected between{' '}
              <span className="text-slate-300 font-medium">{stats.dateRange.oldest || 'N/A'}</span> and{' '}
              <span className="text-slate-300 font-medium">{stats.dateRange.newest || 'N/A'}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-black text-white flex items-center justify-end gap-1">
                <span>{stats.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}</span>
                <span className="text-amber-400 text-lg">★</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Total Store Ratings: {stats.totalPublicReviews ? stats.totalPublicReviews.toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* 3 Metric Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          {/* Sentiment Breakdown */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">Sentiment Distribution</span>
              <span className="text-emerald-400 font-medium">
                {stats.sentimentBreakdown?.positivePercent || 0}% Positive
              </span>
            </div>
            {/* Visual Sentiment Multi-Bar */}
            <div className="h-2.5 w-full bg-slate-800 rounded-full flex overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{ width: `${stats.sentimentBreakdown?.positivePercent || 0}%` }}
                title={`Positive: ${stats.sentimentBreakdown?.positivePercent || 0}%`}
              />
              <div
                className="bg-amber-500 h-full transition-all"
                style={{ width: `${stats.sentimentBreakdown?.neutralPercent || 0}%` }}
                title={`Neutral: ${stats.sentimentBreakdown?.neutralPercent || 0}%`}
              />
              <div
                className="bg-rose-500 h-full transition-all"
                style={{ width: `${stats.sentimentBreakdown?.negativePercent || 0}%` }}
                title={`Negative: ${stats.sentimentBreakdown?.negativePercent || 0}%`}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> {stats.sentimentBreakdown?.positivePercent}% Pos
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> {stats.sentimentBreakdown?.neutralPercent}% Neu
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> {stats.sentimentBreakdown?.negativePercent}% Neg
              </span>
            </div>
          </div>

          {/* Recency Velocity */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold text-slate-300">Recent Sentiment Trend</span>
              {reviewData?.recencyAnalysis.trendDirection === 'Improving' ? (
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" /> Improving
                </span>
              ) : reviewData?.recencyAnalysis.trendDirection === 'Deteriorating' ? (
                <span className="flex items-center gap-1 text-rose-400 font-medium">
                  <TrendingDown className="w-3.5 h-3.5" /> Deteriorating
                </span>
              ) : (
                <span className="flex items-center gap-1 text-slate-400 font-medium">
                  <Minus className="w-3.5 h-3.5" /> Stable
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1 line-clamp-2">
              {reviewData?.recencyAnalysis.summary || 'Recent review sentiment is consistent with historical ratings.'}
            </p>
            <div className="text-[10px] text-slate-500 mt-1">
              {reviewData?.recencyAnalysis.versionShiftObservation}
            </div>
          </div>

          {/* Developer Response Rate */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-semibold text-slate-300">Developer Response Rate</span>
              <span
                className={`font-semibold ${
                  (stats.developerResponseRatePercent || 0) >= 30
                    ? 'text-emerald-400'
                    : (stats.developerResponseRatePercent || 0) >= 10
                    ? 'text-amber-400'
                    : 'text-slate-400'
                }`}
              >
                {stats.developerResponseRatePercent !== null ? `${stats.developerResponseRatePercent}%` : 'N/A'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {(stats.developerResponseRatePercent || 0) >= 30
                ? 'Active developer responses reinforce user trust and boost retention.'
                : 'Responding to low-star reviews within 48h converts up to 20% into positive ratings.'}
            </p>
            <div className="text-[10px] text-slate-500 mt-1">
              Google Play public replies detected in audited sample
            </div>
          </div>
        </div>

        {/* Rating Distribution Histogram */}
        {stats.ratingDistributionPercentages && (
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="text-xs font-semibold text-slate-300 mb-2">Rating Distribution Breakdown</div>
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const s = star as 1 | 2 | 3 | 4 | 5;
                const pct = stats.ratingDistributionPercentages ? stats.ratingDistributionPercentages[s] || 0 : 0;
                const count = stats.ratingDistribution ? stats.ratingDistribution[s] || 0 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-7 font-mono text-slate-400 text-right">{star}★</span>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          star >= 4 ? 'bg-emerald-500' : star === 3 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 font-mono text-slate-400 text-right">{pct}%</span>
                    <span className="w-16 text-slate-500 text-[11px] text-right">({count.toLocaleString()})</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Conversion Blockers & Churn Hazards */}
      {reviewData?.conversionBlockers && reviewData.conversionBlockers.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Conversion-Critical Review Issues</h4>
              <p className="text-xs text-rose-300/80">
                Issues identified in reviews that create direct install hesitation for store visitors
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reviewData.conversionBlockers.map((b, idx) => (
              <div key={idx} className="bg-slate-900/90 border border-rose-500/20 rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h5 className="text-sm font-semibold text-rose-200">{b.issue}</h5>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-rose-500/20 text-rose-300">
                    High Churn Risk
                  </span>
                </div>
                <div className="p-2.5 bg-slate-950/80 rounded border border-slate-800 text-xs italic text-slate-300">
                  &ldquo;{b.evidenceQuote}&rdquo;
                </div>
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300">Impact on Prospects:</strong> {b.impactOnProspects}
                </p>
                <div className="pt-2 border-t border-slate-800 text-xs text-emerald-400 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>
                    <strong>Actionable Fix:</strong> {b.actionableMitigation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recurring Positive & Negative Themes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Positive Themes & Praise Patterns */}
        <div className="bg-slate-900/70 border border-emerald-500/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                <ThumbsUp className="w-4 h-4" />
              </span>
              <h4 className="text-base font-bold text-white">Recurring Praise & Strengths</h4>
            </div>
            <span className="text-xs text-emerald-400 font-medium">
              {reviewData?.recurringPositiveThemes.length || 0} Themes Identified
            </span>
          </div>

          <div className="space-y-3">
            {reviewData?.recurringPositiveThemes.map((item, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-emerald-300">{item.theme}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.occurrenceEstimate}
                  </span>
                </div>

                {item.sampleQuotes && item.sampleQuotes.length > 0 && (
                  <div className="space-y-1">
                    {item.sampleQuotes.slice(0, 2).map((q, qIdx) => (
                      <p key={qIdx} className="text-xs italic text-slate-400 border-l-2 border-emerald-500/40 pl-2">
                        {q}
                      </p>
                    ))}
                  </div>
                )}

                <div className="text-xs text-slate-300 pt-1">
                  <strong className="text-slate-400">ASO & Marketing Angle:</strong> {item.asoAndConversionImpact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Negative Themes & User Complaints */}
        <div className="bg-slate-900/70 border border-rose-500/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
                <ThumbsDown className="w-4 h-4" />
              </span>
              <h4 className="text-base font-bold text-white">Recurring Friction & Complaints</h4>
            </div>
            <span className="text-xs text-rose-400 font-medium">
              {reviewData?.recurringNegativeThemes.length || 0} Themes Identified
            </span>
          </div>

          <div className="space-y-3">
            {reviewData?.recurringNegativeThemes.map((item, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-rose-300">{item.theme}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {item.occurrenceEstimate}
                  </span>
                </div>

                {item.sampleQuotes && item.sampleQuotes.length > 0 && (
                  <div className="space-y-1">
                    {item.sampleQuotes.slice(0, 2).map((q, qIdx) => (
                      <p key={qIdx} className="text-xs italic text-slate-400 border-l-2 border-rose-500/40 pl-2">
                        {q}
                      </p>
                    ))}
                  </div>
                )}

                <div className="text-xs text-slate-300 pt-1">
                  <strong className="text-slate-400">Conversion Impact:</strong> {item.asoAndConversionImpact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bugs & Feature Requests Sub-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bugs & Usability Problems */}
        {reviewData?.bugsAndUsabilityIssues && reviewData.bugsAndUsabilityIssues.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-amber-500/10 text-amber-400 rounded">
                <Bug className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-white">Reported Bugs & Usability Glitches</h4>
            </div>
            <div className="space-y-2.5">
              {reviewData.bugsAndUsabilityIssues.map((bug, idx) => (
                <div key={idx} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                  <div className="font-semibold text-amber-300">{bug.theme}</div>
                  {bug.sampleQuotes?.map((q, qIdx) => (
                    <p key={qIdx} className="italic text-slate-400 pl-2 border-l border-amber-500/40">
                      {q}
                    </p>
                  ))}
                  <p className="text-slate-300 pt-1">{bug.asoAndConversionImpact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feature Requests */}
        {reviewData?.featureRequests && reviewData.featureRequests.length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-cyan-500/10 text-cyan-400 rounded">
                <Lightbulb className="w-4 h-4" />
              </span>
              <h4 className="text-sm font-bold text-white">User-Requested Features & Roadmap Signals</h4>
            </div>
            <div className="space-y-2.5">
              {reviewData.featureRequests.map((req, idx) => (
                <div key={idx} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5">
                  <div className="font-semibold text-cyan-300">{req.theme}</div>
                  {req.sampleQuotes?.map((q, qIdx) => (
                    <p key={qIdx} className="italic text-slate-400 pl-2 border-l border-cyan-500/40">
                      {q}
                    </p>
                  ))}
                  <p className="text-slate-300 pt-1">{req.asoAndConversionImpact}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Review Explorer */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4" id="review-explorer">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-400" />
              Interactive Review Explorer
            </h4>
            <p className="text-xs text-slate-400">
              Filter and inspect the actual public reviews extracted from Google Play Store
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Showing {filteredReviews.length} of {rawReviews.length} reviews
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Star Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase">Rating</label>
            <select
              value={selectedRatingFilter}
              onChange={(e) =>
                setSelectedRatingFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Ratings (1★-5★)</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars only</option>
              <option value="3">3 Stars only</option>
              <option value="2">2 Stars only</option>
              <option value="1">1 Star only</option>
            </select>
          </div>

          {/* Sentiment Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase">Sentiment</label>
            <select
              value={selectedSentimentFilter}
              onChange={(e) => setSelectedSentimentFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive only</option>
              <option value="neutral">Neutral only</option>
              <option value="negative">Negative only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="date">Date (Newest First)</option>
              <option value="thumbs">Helpfulness (Most Thumbs Up)</option>
              <option value="rating">Rating (Highest First)</option>
            </select>
          </div>

          {/* Search text */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 uppercase">Search Keywords</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., crash, update, login..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Developer reply toggle */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="reply-toggle"
            checked={hasReplyOnly}
            onChange={(e) => setHasReplyOnly(e.target.checked)}
            className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 w-3.5 h-3.5"
          />
          <label htmlFor="reply-toggle" className="text-xs text-slate-400 cursor-pointer select-none">
            Show only reviews with public Developer Replies
          </label>
        </div>

        {/* Reviews List */}
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {filteredReviews.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/50 rounded-lg border border-slate-800/80 text-slate-400 text-xs">
              No reviews match the selected filter criteria.
            </div>
          ) : (
            filteredReviews.map((r) => (
              <div
                key={r.id}
                className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center">
                      {r.userName ? r.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200">{r.userName}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                        <span>{r.date ? r.date.split('T')[0] : 'N/A'}</span>
                        {r.version && <span>• v{r.version}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`text-xs font-mono px-2 py-0.5 rounded font-semibold ${
                        r.score >= 4
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : r.score === 3
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {r.score} ★
                    </div>
                    {r.thumbsUp ? (
                      <span className="text-[10px] text-slate-400 flex items-center gap-0.5" title="Helpful votes">
                        <ThumbsUp className="w-3 h-3" /> {r.thumbsUp}
                      </span>
                    ) : null}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{r.text}</p>

                {r.replyText && (
                  <div className="mt-2 p-2.5 bg-slate-900/90 rounded border border-blue-500/20 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-blue-400 font-semibold">
                      <span>Developer Response</span>
                      <span className="text-slate-500 font-normal">{r.replyDate ? r.replyDate.split('T')[0] : ''}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-normal">{r.replyText}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Structured Findings */}
      {reviewData?.findings && reviewData.findings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Evidence-Based Review Findings ({reviewData.findings.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {reviewData.findings.map((f) => (
              <FindingCard key={f.id} finding={f} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
