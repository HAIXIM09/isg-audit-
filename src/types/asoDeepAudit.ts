/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuditScorecard } from './scoring';

export type FindingSeverity = 'critical' | 'warning' | 'info' | 'positive';
export type FindingConfidence = 'High' | 'Medium' | 'Low';

export interface StructuredFinding {
  id: string;
  category: string;
  evidence: string; // The observed real data / visual element
  issue: string; // The problem or observed strength
  severity: FindingSeverity;
  explanation: string; // Why it affects conversion or discoverability
  recommendation: string; // Actionable, specific guidance
  confidence: FindingConfidence;
}

export interface IconAuditData {
  iconUrl: string | null;
  recognizability: {
    scoreLevel: 'High' | 'Moderate' | 'Low';
    summary: string;
  };
  visualSimplicity: {
    scoreLevel: 'High' | 'Moderate' | 'Low';
    summary: string;
  };
  smallSizeClarity: {
    scoreLevel: 'Clear' | 'Acceptable' | 'Muddy';
    summary: string;
  };
  textInIcon: {
    hasText: boolean;
    textDetected?: string;
    verdict: string;
  };
  clutterAndDetail: {
    level: 'Minimal & Focused' | 'Balanced' | 'Overloaded / Too Detailed';
    summary: string;
  };
  categoryAlignment: {
    aligned: boolean;
    category: string;
    summary: string;
  };
  professionalism: {
    level: 'High Polish' | 'Standard' | 'Needs Refinement';
    summary: string;
  };
  findings: StructuredFinding[];
}

export interface ScreenshotIndividualAnalysis {
  index: number;
  frameNumber: number;
  url: string;
  headlineDetected?: string;
  visualHierarchy: string;
  headlineClarity: 'Instant (<1s)' | 'Moderate' | 'Unclear / Missing';
  readability: 'High Contrast & Legible' | 'Moderate' | 'Low Contrast / Small Font';
  contrastRating: string;
  uiVisibility: 'Prominent & Genuine' | 'Balanced' | 'Drowned in Graphics / Obscured';
  featureCommunicated: string;
  benefitCommunicated: string;
  informationDensity: 'Optimal' | 'Too Sparse' | 'Overcrowded';
  consistencyWithSequence: string;
  differentiation: string;
  emotionalAppeal: string;
  reasonToContinueSwipe: string;
  findings: StructuredFinding[];
}

export interface ScreenshotSequenceJourney {
  totalFrames: number;
  firstScreenshotHook: {
    effective: boolean;
    mainValuePropSpeed: 'Instant (<2s)' | 'Needs Reading' | 'Weak / Confusing';
    observation: string;
  };
  progressionFlow: {
    narrativeQuality: 'Strong Progressive Story' | 'Repetitive' | 'Disjointed';
    observation: string;
  };
  finalScreenshotsTrust: {
    hasTrustOrCallToAction: boolean;
    elementsDetected: string[];
    observation: string;
  };
  strongestScreenshot: {
    frameNumber: number;
    url: string;
    whyStrongest: string;
    keyTakeaway: string;
  };
  weakestScreenshot: {
    frameNumber: number;
    url: string;
    whyWeakest: string;
    fixRecommendation: string;
  };
  journeySummary: string;
  findings: StructuredFinding[];
}

export interface TextAuditSection {
  titleAnalysis: {
    actualTitle: string;
    charCount: number;
    charBudgetLimit: number; // 30 for Play Store
    brandNameDetected: string;
    descriptorTerms: string[];
    keywordStuffingDetected: boolean;
    vagueMessaging: boolean;
    findings: StructuredFinding[];
  };
  shortDescriptionAnalysis: {
    actualShortDesc: string;
    charCount: number;
    charBudgetLimit: number; // 80 for Play Store
    hookStrength: 'Compelling Value Hook' | 'Moderate Feature Summary' | 'Weak / Generic' | 'Missing';
    missingBenefits: boolean;
    callToActionPresence: boolean;
    findings: StructuredFinding[];
  };
  fullDescriptionAnalysis: {
    charCount: number;
    wordCount: number;
    aboveTheFoldHook: string;
    structureScore: 'Well-Structured (Bullets & Headers)' | 'Dense Paragraph Chunks' | 'Unformatted';
    featureDumpingDetected: boolean;
    missingBenefitsDetected: boolean;
    readabilityIssues: string[];
    unsupportedClaims: string[]; // e.g., "The #1 best app in the world"
    missingTrustSignals: string[]; // e.g., "Privacy policy", "Customer support contact", "Regular update commitments"
    callToAction: string;
    findings: StructuredFinding[];
  };
  searchIntentAndConcepts: {
    naturallyPresentConcepts: {
      concept: string;
      context: string;
      relevanceToIntent: string;
    }[];
    missingHighIntentConcepts: {
      concept: string;
      searchIntentExplanation: string;
      howToIntegrateNaturally: string;
    }[];
    notesOnRanking: string;
  };
}

// ----------------------------------------------------
// REVIEW INTELLIGENCE TYPES
// ----------------------------------------------------

export interface RawPlayStoreReview {
  id: string;
  userName: string;
  userImage?: string;
  date: string;
  score: number;
  title?: string;
  text: string;
  replyDate?: string;
  replyText?: string;
  version?: string;
  thumbsUp?: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface ReviewDatasetStats {
  available: boolean;
  sampleSize: number;
  totalPublicReviews: number | null;
  averageRating: number | null;
  ratingDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number } | null;
  ratingDistributionPercentages: { 1: number; 2: number; 3: number; 4: number; 5: number } | null;
  sentimentBreakdown: {
    positivePercent: number;
    neutralPercent: number;
    negativePercent: number;
    averageSentimentScore: number; // 0-100
  } | null;
  dateRange: { oldest: string | null; newest: string | null };
  developerResponseRatePercent: number | null;
  reasonIfUnavailable?: string;
}

export interface ReviewThemeItem {
  theme: string;
  occurrenceEstimate: string; // e.g. "High frequency (~35% of reviews)"
  sampleQuotes: string[]; // Real quoted user text
  asoAndConversionImpact: string;
  severityOrType: 'strength' | 'friction' | 'feature_request' | 'bug';
  confidence: FindingConfidence;
}

export interface ReviewRecencyAnalysis {
  trendDirection: 'Improving' | 'Stable' | 'Deteriorating' | 'Insufficient Data';
  summary: string;
  recentFeedbackFocus: string;
  olderFeedbackFocus: string;
  versionShiftObservation?: string;
  confidence: FindingConfidence;
}

export interface ConversionBlockerReviewIssue {
  issue: string;
  impactOnProspects: string;
  evidenceQuote: string;
  actionableMitigation: string;
}

export interface ReviewIntelligenceSection {
  stats: ReviewDatasetStats;
  recurringPositiveThemes: ReviewThemeItem[];
  recurringNegativeThemes: ReviewThemeItem[];
  bugsAndUsabilityIssues: ReviewThemeItem[];
  featureRequests: ReviewThemeItem[];
  praisePatterns: ReviewThemeItem[];
  conversionBlockers: ConversionBlockerReviewIssue[];
  recencyAnalysis: ReviewRecencyAnalysis;
  rawReviews: RawPlayStoreReview[];
  findings: StructuredFinding[];
}

// ----------------------------------------------------
// TRUST & REPUTATION TYPES
// ----------------------------------------------------

export interface TrustReputationSection {
  trustIndexScore: number; // 0-100
  trustTier: 'Tier 1 - High Trust' | 'Tier 2 - Good Trust' | 'Tier 3 - Needs Verification' | 'Tier 4 - High Friction';
  ratingHealth: {
    score: number | null;
    volume: number | null;
    status: 'Strong' | 'Average' | 'Vulnerable' | 'Insufficient Ratings';
    verdict: string;
    categoryBenchmarkComparison: string;
  };
  developerPresentation: {
    developerName: string | null;
    email: string | null;
    hasValidEmail: boolean;
    website: string | null;
    isHttpsWebsite: boolean;
    address: string | null;
    transparencyLevel: 'High (Full Contactability)' | 'Standard' | 'Low (Anonymous/Missing Info)';
    summary: string;
  };
  updateCadence: {
    lastUpdatedText: string | null;
    daysSinceLastUpdate: number | null;
    status: 'Actively Maintained (<30d)' | 'Standard Cycle (30-90d)' | 'Stale Maintenance (>90d)' | 'Dormant (>365d)' | 'Unknown';
    currentVersion: string | null;
    whatsNewQuality: 'Detailed & User-Centric' | 'Generic / Boilerplate' | 'Missing';
    summary: string;
  };
  contentAndCommercialDisclosures: {
    contentRating: string | null;
    adSupported: boolean | null;
    offersIAP: boolean | null;
    inAppProductPrice: string | null;
    summary: string;
  };
  observableTrustSignals: {
    privacyPolicyPresent: boolean;
    privacyPolicyUrl: string | null;
    privacyPolicyDomainReputable: boolean;
    dataSafetyDisclosed: boolean;
    securityPromisesInDescription: boolean;
    signalsList: { name: string; present: boolean; note: string }[];
  };
  trustChecklist: {
    item: string;
    status: 'passed' | 'warning' | 'failed';
    recommendation: string;
  }[];
  findings: StructuredFinding[];
}

// ----------------------------------------------------
// COMPETITOR INTELLIGENCE & DISCOVERY TYPES
// ----------------------------------------------------

export interface CompetitorListingData {
  appId: string;
  title: string;
  developer: string;
  iconUrl: string | null;
  score: number | null;
  ratingsCount: number | null;
  reviewsCount: number | null;
  installs: string | null;
  priceText: string | null;
  offersIAP: boolean | null;
  summary: string | null;
  descriptionSnippet: string | null;
  screenshotCount: number;
  screenshots: string[];
  updated: string | number | null;
  version?: string | null;
  category: string | null;
  isUserApp?: boolean;
  calculatedListingScore: number; // 0-100
  iconStyleAnalysis?: string;
  titleStructureAnalysis?: string;
  screenshotStrategyAnalysis?: string;
  positioningDifferentiator?: string;
  observableStrengths?: string[];
  observableWeaknesses?: string[];
}

export type CompetitorListingSummary = CompetitorListingData;

export interface CompetitorComparisonDimension {
  dimension: string;
  userAppScoreOrText: string;
  competitorsOverview: string;
  advantage: 'Your App Wins' | 'Competitor Leads' | 'Even / Neutral';
  evidence: string;
  confidence: FindingConfidence;
}

export interface CompetitorStrategicCounterMeasure {
  focusArea: string;
  opportunity: string;
  actionableTactic: string;
  evidence: string;
}

export interface CompetitorIntelligenceSection {
  categoryName: string;
  discoveredCompetitors: CompetitorListingData[];
  comparisonDimensions: CompetitorComparisonDimension[];
  headToHeadMatrix: {
    featureOrMetric: string;
    userAppVal: string;
    competitorVals: Record<string, string>;
  }[];
  strategicCounterMeasures: CompetitorStrategicCounterMeasure[];
  notesOnPublicData: string;
  findings: StructuredFinding[];
}

// ----------------------------------------------------
// MAIN DEEP AUDIT RESULT
// ----------------------------------------------------

export interface DeepASOAuditResult {
  appName: string;
  appId: string;
  iconAudit: IconAuditData;
  screenshotLab: {
    screenshots: ScreenshotIndividualAnalysis[];
    journey: ScreenshotSequenceJourney;
  };
  textAudit: TextAuditSection;
  reviewIntelligence?: ReviewIntelligenceSection;
  trustReputation?: TrustReputationSection;
  competitorIntelligence?: CompetitorIntelligenceSection;
  overallObservedFindingsCount: {
    critical: number;
    warning: number;
    info: number;
    positive: number;
    total: number;
  };
  scorecard?: AuditScorecard;
}
