/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, Brain, Zap, Search, Image as ImageIcon, 
  MessageSquare, Upload, ArrowRight, CheckCircle2, 
  Star, ShieldAlert, Award, RefreshCw, X, Send, Cpu,
  KeyRound, Eye, FileText, CheckSquare, Layers,
  ExternalLink, Check, AlertTriangle, HelpCircle,
  Smartphone, ChevronRight, Crown, TrendingUp, ShieldCheck, Shield
} from 'lucide-react';
import { quantum } from 'ldrs';
import { PlayStoreListing, DataQualityReport } from './types/playstore';
import { DeepASOAuditResult } from './types/asoDeepAudit';
import { ScoringPillarId } from './types/scoring';
import { IconAuditSection } from './components/deepAudit/IconAuditSection';
import { ScreenshotLabSection } from './components/deepAudit/ScreenshotLabSection';
import { DescriptionAuditSection } from './components/deepAudit/DescriptionAuditSection';
import { ReviewIntelligenceSection } from './components/deepAudit/ReviewIntelligenceSection';
import { TrustReputationSection } from './components/deepAudit/TrustReputationSection';
import { CompetitorComparisonSection } from './components/deepAudit/CompetitorComparisonSection';
import { ScorecardOverviewSection } from './components/deepAudit/ScorecardOverviewSection';
import { FixThisFirstSection } from './components/deepAudit/FixThisFirstSection';
import { WhatsWrongSection } from './components/deepAudit/WhatsWrongSection';
import { WhatIsGoodSection } from './components/deepAudit/WhatIsGoodSection';
import { DimensionsScoreGrid } from './components/deepAudit/DimensionsScoreGrid';
import { getAuditHistory, saveAuditToHistory, AuditComparisonReport } from './services/playstore/auditHistory';
import { ReauditComparisonBanner } from './components/deepAudit/ReauditComparisonBanner';
import { BeforeAfterRecommendationsSection } from './components/deepAudit/BeforeAfterRecommendationsSection';
import { SecurityPostureModal } from './components/SecurityPostureModal';

quantum.register();


declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface AuditResult {
  appName: string;
  overallScore: number;
  summary: string;
  listing?: PlayStoreListing;
  dataQuality?: DataQualityReport;
  deepAudit?: DeepASOAuditResult;
  categories: {
    title: string;
    score: number;
    icon: string;
    text: string;
  }[];
  competitorComparison?: {
    metric: string;
    yourApp: string;
    competitorA: string;
    competitorB: string;
  }[];
  screenshotScores?: {
    screenshot: string;
    clarity: number;
    visualAppeal: number;
    valueProp: number;
    readability: number;
    comment: string;
  }[];
  growthBlockers?: {
    title: string;
    description: string;
    likelihood: string;
  }[];
  actionPlan?: {
    priority: string;
    title: string;
    action: string;
    impact: string;
    effort: string;
    confidence: string;
    evidence: string;
  }[];
  positives?: string[];
  negatives?: string[];
  improvementGuide?: string[];
  quickWins: string[];
  searchInsights?: string;
  isCached?: boolean;
  cachedAt?: string;
  cacheAgeSeconds?: number;
}

interface AuditErrorState {
  message: string;
  stage?: string;
  code?: string;
}

export default function App() {
  const [storeUrl, setStoreUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditError, setAuditError] = useState<AuditErrorState | null>(null);
  const [stepStage, setStepStage] = useState<1 | 2 | 3>(1);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number>(0);
  const [showDataQualityDetails, setShowDataQualityDetails] = useState(false);
  const [activeAuditTab, setActiveAuditTab] = useState<'overview' | 'icon' | 'screenshots' | 'descriptions' | 'reviews' | 'trust' | 'competitors' | 'tools'>('overview');
  const [activePillarFilter, setActivePillarFilter] = useState<ScoringPillarId | null>(null);

  // Reaudit & History States
  const [recentComparison, setRecentComparison] = useState<AuditComparisonReport | null>(null);
  const [showComparisonBanner, setShowComparisonBanner] = useState(false);

  // Advanced AI Intelligence Options
  const [highThinking, setHighThinking] = useState(false);
  const [lowLatency, setLowLatency] = useState(false);
  const [useSearch, setUseSearch] = useState(false);

  // Modal / Feature States
  const [activeModal, setActiveModal] = useState<'chat' | 'image' | 'asset' | 'search' | null>(null);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Hello! I am your ISGWYZE AI ASO Advisor. Ask me anything about keyword rankings, screenshot conversion, or app store guidelines.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Image analysis state
  const [analysisImage, setAnalysisImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [analyzingImage, setAnalyzingImage] = useState(false);

  // Security & Compliance Monitor Modal State
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  // Asset generator state
  const [assetPrompt, setAssetPrompt] = useState('');
  const [assetSize, setAssetSize] = useState('1K');
  const [assetAspect, setAssetAspect] = useState('1:1');
  const [generatedAssetUrl, setGeneratedAssetUrl] = useState('');
  const [generatingAsset, setGeneratingAsset] = useState(false);
  const [assetError, setAssetError] = useState<string | null>(null);

  // Search grounding state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleRunAudit = async (e?: React.FormEvent, forceFresh = false) => {
    if (e) e.preventDefault();
    if (!storeUrl.trim()) return;

    // Smooth scroll transport effect
    const auditEl = document.getElementById('audit');
    if (auditEl) {
      auditEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setLoading(true);
    setAuditError(null);
    setStepStage(2);
    setShowComparisonBanner(false);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: storeUrl, highThinking, lowLatency, useSearch, forceFresh, bypassCache: forceFresh }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuditResult(data);
        
        // Save to audit history and get comparison if available
        if (data.deepAudit?.scorecard) {
          const { comparison } = saveAuditToHistory(data.deepAudit.scorecard);
          if (comparison) {
            setRecentComparison(comparison);
            setShowComparisonBanner(true);
          } else {
            setRecentComparison(null);
          }
        }

        setStepStage(3);
        setSelectedScreenshotIndex(0);
        setTimeout(() => {
          const resultsEl = document.getElementById('results');
          if (resultsEl) {
            resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }, 100);
      } else {
        setAuditError({
          message: data.error || 'Failed to complete listing audit.',
          stage: data.stage,
          code: data.code,
        });
        setStepStage(1);
      }
    } catch (err: any) {
      console.error(err);
      setAuditError({
        message: 'Could not connect to the audit data pipeline. Please check your network connection and retry.',
        code: 'NETWORK_DISCONNECTED',
      });
      setStepStage(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages(prev => [...prev, { role: 'model', text: data.reply }]);
      } else {
        setChatMessages(prev => [...prev, { 
          role: 'model', 
          text: `⚠️ ${data.error || 'The ASO advisor encountered a rate limit or processing issue. Please try again shortly.'}` 
        }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'model', text: 'Network error connecting to ASO chatbot.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const mime = file.type;
      setAnalysisImage(reader.result as string);
      setAnalyzingImage(true);
      setAnalysisResult('');

      try {
        const res = await fetch('/api/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType: mime }),
        });
        const data = await res.json();
        if (res.ok) {
          setAnalysisResult(data.analysis);
        } else {
          setAnalysisResult(`⚠️ ${data.error || 'Failed to analyze image. Please ensure valid image format and size under 10MB.'}`);
        }
      } catch (err) {
        setAnalysisResult('Error uploading/analyzing image.');
      } finally {
        setAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetPrompt.trim() || generatingAsset) return;

    setGeneratingAsset(true);
    setGeneratedAssetUrl('');
    setAssetError(null);

    try {
      const res = await fetch('/api/generate-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: assetPrompt,
          imageSize: assetSize,
          aspectRatio: assetAspect,
        }),
      });
      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setGeneratedAssetUrl(data.imageUrl);
      } else {
        setAssetError(data.error || 'Failed to generate visual asset. Please check prompt and rate limits.');
      }
    } catch (err) {
      setAssetError('Network connection issue generating asset.');
    } finally {
      setGeneratingAsset(false);
    }
  };

  const handleSearchGrounding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searching) return;

    setSearching(true);
    setSearchResult(null);

    try {
      const res = await fetch('/api/search-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (res.ok) {
        setSearchResult({ text: data.text, sources: data.sources });
      } else {
        setSearchError(data.error || 'Search trends request failed or rate limit reached.');
      }
    } catch (err) {
      setSearchError('Network connection issue searching market trends.');
    } finally {
      setSearching(false);
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'good';
    if (score >= 65) return 'mid';
    return 'low';
  };

  const listing = auditResult?.listing;
  const dataQuality = auditResult?.dataQuality;
  const deepAudit: DeepASOAuditResult | null = auditResult?.deepAudit || null;

  return (
    <div className="min-h-screen bg-[#EACEAA] text-[#34150F] font-['Inter',sans-serif]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#EACEAA]/92 backdrop-blur-md border-b border-[#34150F]/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-bold text-xl text-[#34150F] no-underline">
            <span className="text-[#85431E]">✦</span>
            ISGWYZE
          </a>
          <nav className="flex items-center gap-6">
            <a href="#how-it-works" className="text-[#85431E] font-medium text-sm hover:text-[#34150F]">How it works</a>
            <a href="#features" className="text-[#85431E] font-medium text-sm hover:text-[#34150F]">Features</a>

            <button 
              onClick={() => setActiveModal('chat')}
              className="text-[#85431E] font-medium text-sm hover:text-[#34150F] flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" /> AI Advisor
            </button>

            <button
              onClick={() => setShowSecurityModal(true)}
              className="bg-[#2E7D32]/10 border border-[#2E7D32]/30 text-[#1B5E20] hover:bg-[#2E7D32] hover:text-white px-3 py-1.5 rounded-full font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
              title="Review Active Security, Secrets Protection, Rate Limits, and Billing Guards"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Security Posture</span>
            </button>

            <a href="#audit" className="bg-[#85431E] text-white px-4 py-2 rounded-full font-semibold text-sm hover:bg-[#34150F] transition shadow-sm">
              Run Audit
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <div className="inline-block bg-[#85431E]/15 text-[#85431E] text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5 tracking-wide">
              Real Play Store Data Extraction & Pipeline • Powered by Advanced AI
            </div>
            <h1 className="text-4xl md:text-6xl font-['Playfair_Display',Georgia,serif] leading-[1.15] mb-5 text-[#34150F]">
              Build the listing<br />
              your <span className="text-[#85431E]">app grows</span> in.
            </h1>
            <p className="text-lg text-[#85431E]/80 max-w-md mb-8">
              Paste your Google Play Store link. Our reliable data pipeline retrieves live store metadata, inspects screenshot assets, and generates a genuine ASO audit.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#audit" className="bg-[#85431E] hover:bg-[#34150F] text-white px-7 py-3.5 rounded-full font-semibold text-base shadow-md transition flex items-center gap-2">
                Run Free Audit <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#how-it-works" className="border-1.5 border-[#34150F]/20 hover:bg-[#34150F]/5 text-[#34150F] px-7 py-3.5 rounded-full font-semibold text-base transition">
                See how it works
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="bg-[#FDFBF7] rounded-[28px] p-6 shadow-xl w-full max-w-[340px] border-3 border-[#34150F] relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#D39858]/20 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#34150F]/10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#85431E] to-[#34150F] rounded-2xl flex items-center justify-center text-white shadow-md font-bold text-xl">
                  IS
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#34150F]">Live Data Pipeline</h4>
                  <p className="text-[11px] text-[#85431E]">Grounded Play Store Extraction</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 mb-4 border border-[#34150F]/10 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#85431E] uppercase tracking-wider">Pipeline Status</span>
                  <div className="text-2xl font-black text-[#85431E]">100%<span className="text-xs font-normal text-[#85431E]/80"> Live Data</span></div>
                </div>
                <div className="bg-[#85431E]/10 text-[#85431E] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between bg-[#EACEAA]/40 p-2.5 rounded-xl border border-[#34150F]/5">
                  <span className="text-[#34150F]">Asset Extraction</span>
                  <span className="font-bold text-[#85431E]">Icons & Screenshots</span>
                </div>
                <div className="flex justify-between bg-[#EACEAA]/40 p-2.5 rounded-xl border border-[#34150F]/5">
                  <span className="text-[#34150F]">Data Quality Report</span>
                  <span className="font-bold text-[#85431E]">Field-by-Field Audit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Tool */}
      <section id="audit" className="py-10 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#FDFBF7] rounded-[28px] p-8 md:p-12 shadow-xl border-2 border-[#34150F]/10">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-0 mb-8">
              <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center font-semibold text-sm ${stepStage >= 1 ? (stepStage > 1 ? 'bg-[#34150F] text-white' : 'bg-[#85431E] text-white shadow-md') : 'bg-[#D39858]/40 text-[#34150F]'}`}>1</div>
              <div className={`w-[42px] h-[2px] ${stepStage >= 2 ? 'bg-[#85431E]' : 'bg-[#D39858]/40'}`}></div>
              <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center font-semibold text-sm ${stepStage >= 2 ? (stepStage > 2 ? 'bg-[#34150F] text-white' : 'bg-[#85431E] text-white shadow-md') : 'bg-[#D39858]/40 text-[#34150F]'}`}>2</div>
              <div className={`w-[42px] h-[2px] ${stepStage >= 3 ? 'bg-[#85431E]' : 'bg-[#D39858]/40'}`}></div>
              <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center font-semibold text-sm ${stepStage >= 3 ? 'bg-[#85431E] text-white shadow-md' : 'bg-[#D39858]/40 text-[#34150F]'}`}>3</div>
            </div>

            <h2 className="text-center text-2xl md:text-3xl font-bold mb-2 text-[#34150F]">Which app are we analyzing today?</h2>
            <p className="text-center text-[#85431E] mb-8">Paste a Google Play Store URL or package ID (e.g. <code className="bg-[#EACEAA]/50 px-2 py-0.5 rounded text-xs">com.spotify.music</code>). Our pipeline retrieves the live listing for genuine analysis.</p>

            {/* Error Message Display */}
            {auditError && (
              <div className="mb-6 p-5 bg-red-50 border-2 border-red-200 rounded-2xl text-red-900 shadow-sm animate-fadeIn">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-1">Data Retrieval Issue</h4>
                    <p className="text-xs text-red-800 leading-relaxed">{auditError.message}</p>
                    {auditError.stage && (
                      <div className="mt-2 text-[11px] text-red-700 bg-red-100/70 px-2.5 py-1 rounded inline-block font-mono">
                        Pipeline Stage: {auditError.stage} {auditError.code ? `• Code: ${auditError.code}` : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Audit Form */}
            {stepStage !== 3 && !loading && (
              <form onSubmit={handleRunAudit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={storeUrl}
                    onChange={e => setStoreUrl(e.target.value)}
                    placeholder="https://play.google.com/store/apps/details?id=com.example.app"
                    required
                    className="flex-1 px-5 py-4 border-2 border-[#E8E0A0] rounded-2xl text-base bg-white focus:border-[#4CAF50] focus:ring-4 focus:ring-[#4CAF50]/15 outline-none transition"
                  />
                  <button type="submit" className="bg-[#4CAF50] hover:bg-[#2E7D32] text-white px-8 py-4 rounded-2xl font-semibold text-base shadow-md transition flex items-center justify-center gap-2">
                    Run Audit <Sparkles className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-between text-xs text-[#5A5A5A] pt-2 px-1">
                  <span>Supported: Google Play Store listings & package IDs</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={highThinking} 
                        onChange={e => setHighThinking(e.target.checked)} 
                        className="rounded text-[#4CAF50]"
                      />
                      <span>Deep Reasoning</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={useSearch} 
                        onChange={e => setUseSearch(e.target.checked)} 
                        className="rounded text-[#4CAF50]"
                      />
                      <span>Live Search Grounding</span>
                    </label>
                  </div>
                </div>
              </form>
            )}

            {/* Loading state */}
            {loading && (
              <div className="py-12 text-center space-y-4 animate-fadeIn">
                <div className="flex justify-center">
                  <l-quantum
                    size="65"
                    speed="1.75"
                    color="#85431E"
                  ></l-quantum>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-[#34150F]">Extracting verified store listing data...</p>
                  <p className="text-xs text-[#85431E]">Validating package ID • Fetching metadata • Inspecting screenshot assets • Auditing ASO</p>
                </div>
              </div>
            )}

            {/* Results Section */}
            {auditResult && stepStage === 3 && !loading && (
              <div id="results" className="mt-6 border-t border-[#E8E0A0] pt-6 animate-fadeIn space-y-8">
                
                {/* Cache Status Indicator */}
                {auditResult.isCached && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-200 shadow-sm mb-4">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold text-blue-900">
                        Loaded from Cache ({Math.floor((auditResult.cacheAgeSeconds || 0) / 60)} minutes old)
                      </span>
                    </div>
                    <button
                      onClick={() => handleRunAudit(undefined, true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Force Live Re-Audit
                    </button>
                  </div>
                )}

                {/* Re-Audit Comparison Banner */}
                {showComparisonBanner && recentComparison && (
                  <div className="mb-6">
                    <ReauditComparisonBanner
                      comparison={recentComparison}
                      onDismiss={() => setShowComparisonBanner(false)}
                      onReauditFresh={() => handleRunAudit(undefined, true)}
                    />
                  </div>
                )}

                {/* 1. App Header Card with Real Extracted Details */}
                <div className="bg-white rounded-2xl p-6 border border-[#34150F]/10 shadow-sm">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      {listing?.icon?.url ? (
                        <img 
                          src={listing.icon.url} 
                          alt={listing.title || 'App Icon'} 
                          className="w-20 h-20 rounded-2xl shadow-md border border-black/10 object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#85431E] to-[#34150F] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
                          {auditResult.appName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-xl md:text-2xl font-bold text-[#34150F]">
                            {listing?.title || auditResult.appName}
                          </h3>
                          {listing?.category && (
                            <span className="bg-[#EACEAA]/50 text-[#85431E] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              {listing.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#85431E] mb-2 font-medium">
                          {listing?.developer.name ? `by ${listing.developer.name}` : 'Developer info verified'}
                          {listing?.appId ? ` • ID: ${listing.appId}` : ''}
                        </p>
                        
                        {/* Real Store Metadata Badges */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {listing?.score !== null && listing?.score !== undefined ? (
                            <span className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              {listing.score}★ {listing.ratingsCount ? `(${listing.ratingsCount.toLocaleString()})` : ''}
                            </span>
                          ) : null}

                          {listing?.installs && (
                            <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-lg font-medium">
                              📥 {listing.installs} installs
                            </span>
                          )}

                          {listing?.priceText && (
                            <span className="bg-green-50 text-green-800 border border-green-200 px-2.5 py-1 rounded-lg font-medium">
                              🏷️ {listing.priceText}
                            </span>
                          )}

                          {listing?.contentRating && (
                            <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-lg font-medium">
                              🔞 {listing.contentRating}
                            </span>
                          )}

                          {listing?.url && (
                            <a 
                              href={listing.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[#85431E] hover:underline flex items-center gap-1 font-medium px-2 py-1"
                            >
                              View on Play Store <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Overall Score Badge */}
                    <div className="flex flex-col items-center md:items-end justify-center self-stretch md:self-auto border-t md:border-t-0 md:border-l border-[#34150F]/10 pt-4 md:pt-0 md:pl-6">
                      <span className="text-[11px] font-bold text-[#85431E] uppercase tracking-wider mb-1">Overall ASO Score</span>
                      <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center text-white font-bold text-2xl shadow-lg ${
                        auditResult.overallScore >= 80 ? 'bg-gradient-to-br from-[#4CAF50] to-[#2E7D32]' :
                        auditResult.overallScore >= 65 ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                        'bg-gradient-to-br from-red-500 to-red-600'
                      }`}>
                        {auditResult.overallScore}
                        <small className="text-[10px] font-medium opacity-90">/100</small>
                      </div>
                    </div>
                  </div>

                  {/* Summary & Search Grounding */}
                  <div className="mt-4 pt-4 border-t border-[#34150F]/5">
                    <p className="text-sm text-[#34150F]/90 leading-relaxed">{auditResult.summary}</p>
                    {auditResult.searchInsights && (
                      <p className="mt-3 text-xs bg-blue-50 text-blue-900 p-3 rounded-xl border border-blue-200">
                        <strong>Live Search Grounding Insight:</strong> {auditResult.searchInsights}
                      </p>
                    )}
                  </div>
                </div>

                {/* Audit Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-[#34150F]/10 pb-2">
                  <button
                    onClick={() => setActiveAuditTab('overview')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeAuditTab === 'overview'
                        ? 'bg-[#85431E] text-white shadow-sm'
                        : 'bg-[#FDFBF7] text-[#34150F] hover:bg-[#EACEAA]/40 border border-[#34150F]/10'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    ASO Scorecard & Matrix
                    {deepAudit?.scorecard && (
                      <span className="ml-1 text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-inherit font-bold">
                        {deepAudit.scorecard.overallScore}/100 Grade {deepAudit.scorecard.overallGrade}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveAuditTab('icon')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeAuditTab === 'icon'
                        ? 'bg-[#85431E] text-white shadow-sm'
                        : 'bg-[#FDFBF7] text-[#34150F] hover:bg-[#EACEAA]/40 border border-[#34150F]/10'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Icon Audit
                    {deepAudit && (
                      <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 text-inherit font-bold">
                        {deepAudit.iconAudit.findings.length} findings
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveAuditTab('screenshots')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeAuditTab === 'screenshots'
                        ? 'bg-[#85431E] text-white shadow-sm'
                        : 'bg-[#FDFBF7] text-[#34150F] hover:bg-[#EACEAA]/40 border border-[#34150F]/10'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    Screenshot Lab
                    {deepAudit && (
                      <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 text-inherit font-bold">
                        {deepAudit.screenshotLab.screenshots.length} frames
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveAuditTab('descriptions')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeAuditTab === 'descriptions'
                        ? 'bg-[#85431E] text-white shadow-sm'
                        : 'bg-[#FDFBF7] text-[#34150F] hover:bg-[#EACEAA]/40 border border-[#34150F]/10'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Description & Search
                    {deepAudit && (
                      <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 text-inherit font-bold">
                        {deepAudit.textAudit.titleAnalysis.findings.length +
                          deepAudit.textAudit.shortDescriptionAnalysis.findings.length +
                          deepAudit.textAudit.fullDescriptionAnalysis.findings.length} findings
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveAuditTab('reviews')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeAuditTab === 'reviews'
                        ? 'bg-[#85431E] text-white shadow-sm'
                        : 'bg-[#FDFBF7] text-[#34150F] hover:bg-[#EACEAA]/40 border border-[#34150F]/10'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Review Intelligence
                    {deepAudit?.reviewIntelligence?.stats.available && (
                      <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 text-inherit font-bold">
                        {deepAudit.reviewIntelligence.stats.sampleSize} reviews
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveAuditTab('trust')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeAuditTab === 'trust'
                        ? 'bg-[#85431E] text-white shadow-sm'
                        : 'bg-[#FDFBF7] text-[#34150F] hover:bg-[#EACEAA]/40 border border-[#34150F]/10'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    Trust & Reputation
                    {deepAudit?.trustReputation && (
                      <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 text-inherit font-bold">
                        {deepAudit.trustReputation.trustIndexScore}/100
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveAuditTab('competitors')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeAuditTab === 'competitors'
                        ? 'bg-[#85431E] text-white shadow-sm'
                        : 'bg-[#FDFBF7] text-[#34150F] hover:bg-[#EACEAA]/40 border border-[#34150F]/10'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Competitor Matrix
                    {deepAudit?.competitorIntelligence && (
                      <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-black/10 text-inherit font-bold">
                        {deepAudit.competitorIntelligence.discoveredCompetitors.length} comps
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveAuditTab('tools')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeAuditTab === 'tools'
                        ? 'bg-[#85431E] text-white shadow-sm'
                        : 'bg-[#FDFBF7] text-[#34150F] hover:bg-[#EACEAA]/40 border border-[#34150F]/10'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Advisor & Tools
                  </button>
                </div>

                {/* TAB CONTENT: 1. OVERVIEW & ASO SCORECARD */}
                {activeAuditTab === 'overview' && (
                  <div className="space-y-10 animate-fadeIn">
                    {/* If Deep Audit Scorecard is available, render the complete 20-dimension scoring engine */}
                    {deepAudit?.scorecard ? (
                      <>
                        {/* 1. Scorecard Overview, Spotlight & Grid */}
                        <ScorecardOverviewSection
                          scorecard={deepAudit.scorecard}
                          activePillarFilter={activePillarFilter}
                          onSelectPillarFilter={setActivePillarFilter}
                          onNavigateTab={setActiveAuditTab}
                        />

                        {/* 2. Before -> After Recommendations */}
                        {listing && (
                          <BeforeAfterRecommendationsSection
                            listing={listing}
                            textAudit={deepAudit.textAudit}
                            screenshots={deepAudit.screenshotLab.screenshots}
                            appName={auditResult.appName}
                          />
                        )}
                      </>
                    ) : null}

                    {/* Live Screenshots Strip */}
                    {listing?.screenshots && listing.screenshots.length > 0 && (
                      <div className="bg-white rounded-2xl p-6 border border-[#34150F]/10 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-base text-[#34150F] flex items-center gap-2">
                              <ImageIcon className="w-5 h-5 text-[#85431E]" /> Extracted Store Screenshots ({listing.screenshots.length})
                            </h4>
                            <p className="text-xs text-[#5A5A5A]">Actual high-resolution screenshot assets inspected during this audit.</p>
                          </div>
                          <button
                            onClick={() => setActiveAuditTab('screenshots')}
                            className="text-xs font-bold text-[#85431E] hover:underline flex items-center gap-1 bg-[#EACEAA]/40 px-3 py-1.5 rounded-full"
                          >
                            Open Screenshot Lab <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin">
                          {listing.screenshots.map((s, idx) => (
                            <div 
                              key={idx} 
                              className={`shrink-0 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shadow-sm ${
                                selectedScreenshotIndex === idx ? 'border-[#85431E] ring-2 ring-[#85431E]/20 scale-[1.02]' : 'border-black/10 hover:border-[#85431E]/50'
                              }`}
                              onClick={() => setSelectedScreenshotIndex(idx)}
                            >
                              <img 
                                src={s.url} 
                                alt={`Screenshot ${idx + 1}`}
                                className="h-64 w-auto max-w-[170px] object-cover bg-black/5"
                                referrerPolicy="no-referrer"
                              />
                              <div className="p-2 text-center text-[11px] font-bold bg-[#FDFBF7] text-[#34150F]">
                                Frame #{idx + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pipeline Data Quality */}
                    {dataQuality && (
                      <div className="bg-[#FDFBF7] rounded-2xl p-6 border-2 border-[#85431E]/20 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#85431E]/10 text-[#85431E] flex items-center justify-center font-bold">
                              <Layers className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm text-[#34150F]">Pipeline Data Quality & Audit Confidence</h4>
                              <p className="text-xs text-[#85431E]">Live field retrieval verification metrics</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                              dataQuality.confidenceLevel === 'High' ? 'bg-green-100 text-green-800 border-green-300' :
                              dataQuality.confidenceLevel === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                              'bg-red-100 text-red-800 border-red-300'
                            }`}>
                              {dataQuality.confidenceLevel} Confidence ({dataQuality.dataQualityScore}/100)
                            </span>
                            <button
                              onClick={() => setShowDataQualityDetails(!showDataQualityDetails)}
                              className="text-xs font-semibold text-[#85431E] hover:underline bg-[#EACEAA]/40 px-3 py-1 rounded-full"
                            >
                              {showDataQualityDetails ? 'Hide Details' : 'View Verified Fields'}
                            </button>
                          </div>
                        </div>

                        {/* Assets Quick Summary */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                          <div className="bg-white p-3 rounded-xl border border-[#34150F]/10 flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${dataQuality.assetsSummary.iconFound ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <div>
                              <span className="font-bold block text-[#34150F]">App Icon</span>
                              <span className="text-[11px] text-[#5A5A5A]">{dataQuality.assetsSummary.iconFound ? '512x512 Loaded' : 'Unavailable'}</span>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-[#34150F]/10 flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${dataQuality.assetsSummary.screenshotsFound > 0 ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                            <div>
                              <span className="font-bold block text-[#34150F]">Screenshots</span>
                              <span className="text-[11px] text-[#5A5A5A]">{dataQuality.assetsSummary.screenshotsFound} Frames Audited</span>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-[#34150F]/10 flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${dataQuality.assetsSummary.featureGraphicFound ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <div>
                              <span className="font-bold block text-[#34150F]">Feature Graphic</span>
                              <span className="text-[11px] text-[#5A5A5A]">{dataQuality.assetsSummary.featureGraphicFound ? 'Present' : 'Not Set (Optional)'}</span>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-[#34150F]/10 flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${dataQuality.assetsSummary.videoFound ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            <div>
                              <span className="font-bold block text-[#34150F]">Video Preview</span>
                              <span className="text-[11px] text-[#5A5A5A]">{dataQuality.assetsSummary.videoFound ? 'Trailer Verified' : 'None Provided'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Expandable Field Breakdown */}
                        {showDataQualityDetails && (
                          <div className="bg-white rounded-xl p-4 border border-[#34150F]/10 text-xs space-y-2 mt-4 animate-fadeIn">
                            <div className="font-bold text-[#34150F] mb-2">Field-by-Field Retrieval Status ({dataQuality.retrievedFieldsCount}/{dataQuality.totalFields} fields verified):</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {Object.entries(dataQuality.fieldStatus).map(([fieldKey, statVal]) => {
                                const stat = statVal as { retrieved: boolean; reasonIfNotRetrieved?: string };
                                return (
                                  <div key={fieldKey} className="flex items-center justify-between p-2 rounded-lg bg-[#FDFBF7] border border-[#34150F]/5">
                                    <span className="capitalize font-medium text-[#34150F]">{fieldKey.replace(/([A-Z])/g, ' $1')}</span>
                                    {stat.retrieved ? (
                                      <span className="text-green-700 font-semibold flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5 text-green-600" /> Verified
                                      </span>
                                    ) : (
                                      <span className="text-[#85431E] italic">
                                        {stat.reasonIfNotRetrieved || 'Unavailable'}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: 2. ICON AUDIT */}
                {activeAuditTab === 'icon' && (
                  <div className="animate-fadeIn">
                    {deepAudit?.iconAudit ? (
                      <IconAuditSection
                        iconAudit={deepAudit.iconAudit}
                        appName={listing?.title || auditResult.appName}
                        category={listing?.category || 'App'}
                      />
                    ) : (
                      <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
                        <p className="text-sm text-slate-600">Icon asset analysis unavailable for this listing.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: 3. SCREENSHOT LAB */}
                {activeAuditTab === 'screenshots' && (
                  <div className="animate-fadeIn">
                    {deepAudit?.screenshotLab ? (
                      <ScreenshotLabSection
                        screenshots={deepAudit.screenshotLab.screenshots}
                        journey={deepAudit.screenshotLab.journey}
                        appName={listing?.title || auditResult.appName}
                      />
                    ) : (
                      <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
                        <p className="text-sm text-slate-600">Screenshot analysis unavailable for this listing.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: 4. DESCRIPTIONS AUDIT */}
                {activeAuditTab === 'descriptions' && (
                  <div className="animate-fadeIn">
                    {deepAudit?.textAudit ? (
                      <DescriptionAuditSection
                        textAudit={deepAudit.textAudit}
                        appName={listing?.title || auditResult.appName}
                        category={listing?.category || 'App'}
                      />
                    ) : (
                      <div className="bg-white p-8 rounded-2xl text-center border border-slate-200">
                        <p className="text-sm text-slate-600">Text analysis unavailable for this listing.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: 5. REVIEWS INTELLIGENCE */}
                {activeAuditTab === 'reviews' && (
                  <div className="animate-fadeIn">
                    <ReviewIntelligenceSection
                      reviewData={deepAudit?.reviewIntelligence}
                      appName={listing?.title || auditResult.appName}
                    />
                  </div>
                )}

                {/* TAB CONTENT: 6. TRUST & REPUTATION */}
                {activeAuditTab === 'trust' && (
                  <div className="animate-fadeIn">
                    <TrustReputationSection
                      trustData={deepAudit?.trustReputation}
                      appName={listing?.title || auditResult.appName}
                    />
                  </div>
                )}

                {/* TAB CONTENT: 7. COMPETITORS & ROADMAP */}
                {activeAuditTab === 'competitors' && (
                  <div className="space-y-8 animate-fadeIn">
                    {/* Deep Competitor Intelligence (Matrix, Visual Volume, Dimension Comparison) */}
                    <CompetitorComparisonSection
                      competitorData={deepAudit?.competitorIntelligence}
                      appName={listing?.title || auditResult.appName}
                    />

                    {/* Competitor Comparison Table Fallback/Summary */}
                    {auditResult.competitorComparison && auditResult.competitorComparison.length > 0 && (
                      <div className="bg-white rounded-2xl p-6 border border-[#F0EBB0] shadow-sm">
                        <h4 className="font-bold text-base text-[#34150F] mb-1 flex items-center gap-2">
                          🥊 Competitor Metric Overview
                        </h4>
                        <p className="text-xs text-[#5A5A5A] mb-4">Summary benchmarks against top category rivals.</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="border-b border-[#34150F]/10 text-[#34150F]">
                                <th className="py-2.5 px-3 font-bold">Metric</th>
                                <th className="py-2.5 px-3 font-bold text-[#85431E]">Your App</th>
                                <th className="py-2.5 px-3 font-bold">Competitor A</th>
                                <th className="py-2.5 px-3 font-bold">Competitor B</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#34150F]/5">
                              {auditResult.competitorComparison.map((comp, idx) => (
                                <tr key={idx} className="hover:bg-black/[0.01]">
                                  <td className="py-3 px-3 font-medium text-[#34150F]">{comp.metric}</td>
                                  <td className="py-3 px-3 font-semibold text-[#85431E] bg-[#EACEAA]/10">{comp.yourApp}</td>
                                  <td className="py-3 px-3 text-[#5A5A5A]">{comp.competitorA}</td>
                                  <td className="py-3 px-3 text-[#5A5A5A]">{comp.competitorB}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Growth Blockers */}
                    {auditResult.growthBlockers && auditResult.growthBlockers.length > 0 && (
                      <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="font-bold text-base text-amber-900 mb-1 flex items-center gap-2">
                          ⚠️ Identified Growth Blockers & Discoverability Hurdles
                        </h4>
                        <p className="text-xs text-amber-900/80 mb-4">Grounded in verified public metadata and keyword density metrics:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {auditResult.growthBlockers.map((gb, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-amber-200">
                              <div className="flex justify-between items-start mb-1">
                                <h5 className="font-bold text-xs text-amber-950">{gb.title}</h5>
                                <span className="text-[10px] bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded-full">{gb.likelihood}</span>
                              </div>
                              <p className="text-xs text-[#5A5A5A]">{gb.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prioritized Action Plan */}
                    {auditResult.actionPlan && auditResult.actionPlan.length > 0 && (
                      <div className="bg-[#34150F] text-[#FDFBF7] rounded-2xl p-6 shadow-lg">
                        <h4 className="font-bold text-lg mb-1 text-white flex items-center gap-2">
                          🎯 Prioritized Action Plan
                        </h4>
                        <p className="text-xs text-[#EACEAA] mb-6">Step-by-step optimization recommendations prioritized by impact and effort.</p>
                        <div className="space-y-4">
                          {auditResult.actionPlan.map((item, idx) => (
                            <div key={idx} className="bg-white/10 rounded-xl p-4 border border-white/10">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#D39858] text-[#34150F]">
                                    {item.priority}
                                  </span>
                                  <h5 className="font-bold text-sm text-white">{item.title}</h5>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded">Impact: {item.impact}</span>
                                  <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Effort: {item.effort}</span>
                                  <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">Confidence: {item.confidence}</span>
                                </div>
                              </div>
                              <p className="text-xs text-white/90 mb-2">{item.action}</p>
                              {item.evidence && (
                                <p className="text-[11px] text-[#EACEAA] italic bg-black/20 p-2 rounded border border-white/5">
                                  <strong>Evidence / Rationale:</strong> {item.evidence}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step-by-Step Improvement Guide */}
                    {auditResult.improvementGuide && auditResult.improvementGuide.length > 0 && (
                      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-sm">
                        <h4 className="font-bold text-base text-amber-900 mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-600" /> Step-by-Step Improvement Guide
                        </h4>
                        <div className="space-y-3 text-sm text-amber-900/90">
                          {auditResult.improvementGuide.map((step, idx) => (
                            <div key={idx} className="bg-white/80 p-3.5 rounded-xl border border-amber-200 shadow-xs" dangerouslySetInnerHTML={{ __html: step }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT: 6. INTERACTIVE AI TOOLS */}
                {activeAuditTab === 'tools' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeIn">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-base text-slate-900 mb-1">ASO AI Advisor Chat</h4>
                        <p className="text-xs text-slate-600 mb-4">Ask strategic questions regarding Google Play search indexing, conversion rate optimization, and localization.</p>
                      </div>
                      <button
                        onClick={() => setActiveModal('chat')}
                        className="bg-[#85431E] hover:bg-[#34150F] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition text-center shadow-xs"
                      >
                        Launch Interactive Advisor
                      </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-base text-slate-900 mb-1">Custom Vision Asset Inspector</h4>
                        <p className="text-xs text-slate-600 mb-4">Upload new proposed screenshot drafts or icon variants to receive instant visual hierarchy feedback.</p>
                      </div>
                      <button
                        onClick={() => setActiveModal('image')}
                        className="bg-[#85431E] hover:bg-[#34150F] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition text-center shadow-xs"
                      >
                        Upload & Inspect Visuals
                      </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-base text-slate-900 mb-1">Creative Asset Generator</h4>
                        <p className="text-xs text-slate-600 mb-4">Generate conceptual icon mockups or feature banner concepts aligned with current category trends.</p>
                      </div>
                      <button
                        onClick={() => setActiveModal('asset')}
                        className="bg-[#85431E] hover:bg-[#34150F] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition text-center shadow-xs"
                      >
                        Generate Asset Concepts
                      </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                          <Search className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-base text-slate-900 mb-1">Live Search Grounding Trends</h4>
                        <p className="text-xs text-slate-600 mb-4">Explore high-intent keyword search trends and competitor positioning in Google search.</p>
                      </div>
                      <button
                        onClick={() => setActiveModal('search')}
                        className="bg-[#85431E] hover:bg-[#34150F] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition text-center shadow-xs"
                      >
                        Search Grounding Explorer
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-[#34150F]/10">
                  <button 
                    onClick={() => { setAuditResult(null); setStoreUrl(''); setStepStage(1); setAuditError(null); }}
                    className="bg-[#85431E] hover:bg-[#34150F] text-white px-6 py-3 rounded-full font-semibold text-sm transition shadow-sm"
                  >
                    Audit another app
                  </button>

                  <button 
                    onClick={() => setActiveModal('chat')}
                    className="border border-[#34150F]/20 hover:bg-[#34150F]/5 text-[#34150F] px-6 py-3 rounded-full font-semibold text-sm transition flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-[#85431E]" /> Chat with ASO Advisor
                  </button>

                  <button 
                    onClick={() => setActiveModal('image')}
                    className="border border-[#34150F]/20 hover:bg-[#34150F]/5 text-[#34150F] px-6 py-3 rounded-full font-semibold text-sm transition flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4 text-[#85431E]" /> Deep Vision Analyzer
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-12 bg-[#FDFBF7]/40 border-y border-[#34150F]/10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl font-['Playfair_Display',Georgia,serif] mb-12 text-[#34150F]">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FDFBF7] rounded-[24px] p-8 text-center shadow-md border border-[#34150F]/10">
              <div className="w-12 h-12 bg-[#85431E] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-5 shadow">1</div>
              <h3 className="font-bold text-lg mb-2 text-[#34150F]">Paste Google Play Link</h3>
              <p className="text-sm text-[#85431E]">URL validator extracts package ID and retrieves verified public metadata from store servers.</p>
            </div>
            <div className="bg-[#FDFBF7] rounded-[24px] p-8 text-center shadow-md border border-[#34150F]/10">
              <div className="w-12 h-12 bg-[#85431E] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-5 shadow">2</div>
              <h3 className="font-bold text-lg mb-2 text-[#34150F]">Asset & Metadata Normalization</h3>
              <p className="text-sm text-[#85431E]">Fetches high-res icons and screenshot assets with a transparent data-quality score.</p>
            </div>
            <div className="bg-[#FDFBF7] rounded-[24px] p-8 text-center shadow-md border border-[#34150F]/10">
              <div className="w-12 h-12 bg-[#85431E] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-5 shadow">3</div>
              <h3 className="font-bold text-lg mb-2 text-[#34150F]">Grounded ASO Audit</h3>
              <p className="text-sm text-[#85431E]">Generates an evidence-backed audit report and prioritized action plan tailored to your app.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl font-['Playfair_Display',Georgia,serif] mb-12 text-[#34150F]">What you get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FDFBF7] rounded-[24px] p-7 text-center shadow-md border border-[#34150F]/10">
              <div className="w-14 h-14 bg-[#85431E]/15 text-[#85431E] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <KeyRound className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base mb-2 text-[#34150F]">Keyword Health</h3>
              <p className="text-xs text-[#85431E]">See which terms drive visibility and which ones waste title and description character space.</p>
            </div>
            <div className="bg-[#FDFBF7] rounded-[24px] p-7 text-center shadow-md border border-[#34150F]/10">
              <div className="w-14 h-14 bg-[#D39858]/20 text-[#85431E] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base mb-2 text-[#34150F]">Visual Conversion</h3>
              <p className="text-xs text-[#85431E]">Screenshot & icon analysis focused on high-conversion preview headlines.</p>
            </div>
            <div className="bg-[#FDFBF7] rounded-[24px] p-7 text-center shadow-md border border-[#34150F]/10">
              <div className="w-14 h-14 bg-[#85431E]/15 text-[#85431E] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base mb-2 text-[#34150F]">Data Quality Report</h3>
              <p className="text-xs text-[#85431E]">Field-by-field verification ensuring audits are calculated on real, verified data.</p>
            </div>
            <div className="bg-[#FDFBF7] rounded-[24px] p-7 text-center shadow-md border border-[#34150F]/10">
              <div className="w-14 h-14 bg-[#D39858]/20 text-[#85431E] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base mb-2 text-[#34150F]">AI Action Plan</h3>
              <p className="text-xs text-[#85431E]">Prioritized list of changes ranked by impact and effort using deep AI reasoning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#34150F] text-[#EACEAA] py-10 border-t border-[#34150F]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-lg text-white">
            <span className="text-[#D39858]">✦</span> ISGWYZE
            <span className="font-normal text-xs text-[#EACEAA]/80 ml-2">App Store Optimization made reliable with live data & AI.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSecurityModal(true)}
              className="flex items-center gap-1.5 text-xs text-[#EACEAA]/90 hover:text-white underline underline-offset-4 decoration-[#D39858] cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#81C784]" />
              Production Security & Cost Guard
            </button>
            <p className="text-xs text-[#EACEAA]/70">© 2026 ISGWYZE. Built with care.</p>
          </div>
        </div>
      </footer>

      {/* Security Posture & Compliance Modal */}
      <SecurityPostureModal 
        isOpen={showSecurityModal} 
        onClose={() => setShowSecurityModal(false)} 
      />

      {/* MODALS */}

      {/* 1. Chat Modal */}
      {activeModal === 'chat' && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFFEF5] rounded-3xl w-full max-w-lg h-[600px] flex flex-col shadow-2xl border-2 border-black/10 overflow-hidden">
            <div className="p-4 bg-[#2E7D32] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <MessageSquare className="w-5 h-5" /> ASO AI Advisor Chat
              </div>
              <button onClick={() => setActiveModal(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-[#4CAF50] text-white' : 'bg-white border border-black/10 text-[#1A1A1A]'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-black/10 rounded-2xl px-4 py-3 text-sm text-[#5A5A5A] animate-pulse">
                    Thinking…
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSendChat} className="p-3 border-t border-black/10 bg-white flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask about keywords, descriptions, rankings..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-black/15 text-sm outline-none focus:border-[#4CAF50]"
              />
              <button type="submit" className="bg-[#4CAF50] text-white px-4 py-2.5 rounded-xl hover:bg-[#2E7D32] transition">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Image Analysis Modal */}
      {activeModal === 'image' && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFFEF5] rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border-2 border-black/10 overflow-hidden">
            <div className="p-4 bg-[#2E7D32] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <ImageIcon className="w-5 h-5" /> Vision Analyzer (Screenshots & Icons)
              </div>
              <button onClick={() => setActiveModal(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <label className="border-2 border-dashed border-black/15 hover:border-[#4CAF50] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-white transition">
                <Upload className="w-8 h-8 text-[#5A5A5A] mb-2" />
                <span className="text-sm font-semibold text-[#1A1A1A]">Click to upload screenshot or icon</span>
                <span className="text-xs text-[#5A5A5A]">PNG, JPG up to 10MB</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {analysisImage && (
                <div className="text-center">
                  <img src={analysisImage} alt="Uploaded preview" className="max-h-48 mx-auto rounded-xl border shadow-sm" />
                </div>
              )}

              {analyzingImage && (
                <div className="text-center py-4">
                  <div className="w-8 h-8 border-3 border-[#E8E0A0] border-t-[#4CAF50] rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-[#5A5A5A]">Analyzing visual contrast, focal points, and typography...</p>
                </div>
              )}

              {analysisResult && (
                <div className="bg-white rounded-xl p-4 border border-black/10 text-xs text-[#1A1A1A] whitespace-pre-wrap leading-relaxed">
                  {analysisResult}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. Asset Generator Modal */}
      {activeModal === 'asset' && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFFEF5] rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border-2 border-black/10 overflow-hidden">
            <div className="p-4 bg-[#2E7D32] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <Sparkles className="w-5 h-5" /> Generate App Store Graphics
              </div>
              <button onClick={() => setActiveModal(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleGenerateAsset} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Visual Concept Prompt</label>
                <textarea
                  value={assetPrompt}
                  onChange={e => setAssetPrompt(e.target.value)}
                  placeholder="e.g. Modern minimalist fintech wallet app icon, vibrant emerald green, 3D soft gloss..."
                  required
                  className="w-full px-4 py-3 rounded-xl border border-black/15 text-sm bg-white outline-none focus:border-[#4CAF50] h-24"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Aspect Ratio</label>
                  <select 
                    value={assetAspect} 
                    onChange={e => setAssetAspect(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-black/15 text-xs bg-white"
                  >
                    <option value="1:1">1:1 (App Icon / Square)</option>
                    <option value="9:16">9:16 (Phone Screenshot)</option>
                    <option value="16:9">16:9 (Feature Graphic Banner)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Quality Level</label>
                  <select 
                    value={assetSize} 
                    onChange={e => setAssetSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-black/15 text-xs bg-white"
                  >
                    <option value="1K">1K Standard</option>
                    <option value="2K">2K Ultra HD</option>
                  </select>
                </div>
              </div>

              {assetError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{assetError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={generatingAsset}
                className="w-full bg-[#4CAF50] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#2E7D32] transition flex items-center justify-center gap-2"
              >
                {generatingAsset ? 'Generating Visual...' : 'Generate Asset'}
              </button>

              {generatingAsset && (
                <div className="text-center py-6">
                  <div className="w-8 h-8 border-3 border-[#E8E0A0] border-t-[#4CAF50] rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-[#5A5A5A]">AI is painting your app asset in high resolution...</p>
                </div>
              )}

              {generatedAssetUrl && (
                <div className="text-center space-y-3">
                  <img src={generatedAssetUrl} alt="Generated Asset" className="max-h-64 mx-auto rounded-xl border shadow-md" />
                  <a
                    href={generatedAssetUrl}
                    download="app-asset.png"
                    className="inline-block bg-[#2E7D32] text-white px-4 py-2 rounded-lg text-xs font-semibold"
                  >
                    Download Asset
                  </a>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* 4. Search Grounding Modal */}
      {activeModal === 'search' && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFFEF5] rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border-2 border-black/10 overflow-hidden">
            <div className="p-4 bg-[#2E7D32] text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <Search className="w-5 h-5" /> Search Grounding Market Trends
              </div>
              <button onClick={() => setActiveModal(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearchGrounding} className="p-6 overflow-y-auto space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="e.g. Top fitness app store ranking strategies 2026"
                  required
                  className="flex-1 px-4 py-3 rounded-xl border border-black/15 text-sm bg-white outline-none focus:border-[#4CAF50]"
                />
                <button type="submit" className="bg-[#4CAF50] text-white px-5 py-3 rounded-xl hover:bg-[#2E7D32] transition">
                  Search
                </button>
              </div>

              {searchError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{searchError}</span>
                </div>
              )}

              {searching && (
                <div className="text-center py-6">
                  <div className="w-8 h-8 border-3 border-[#E8E0A0] border-t-[#4CAF50] rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-xs text-[#5A5A5A]">Searching live web data with Google Search grounding...</p>
                </div>
              )}

              {searchResult && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border border-black/10 text-sm leading-relaxed">
                    {searchResult.text}
                  </div>
                  {searchResult.sources.length > 0 && (
                    <div className="text-xs text-[#5A5A5A]">
                      <span className="font-semibold block mb-1">Sources:</span>
                      <ul className="space-y-1">
                        {searchResult.sources.map((s, idx) => (
                          <li key={idx}>
                            <a href={s.uri} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                              {s.title || s.uri}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
