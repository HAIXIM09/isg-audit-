/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FindingSeverity, FindingConfidence } from './asoDeepAudit';

export type ScoringPillarId = 
  | 'discoverability'
  | 'conversion'
  | 'visual_quality'
  | 'trust'
  | 'listing_quality'
  | 'competitive_positioning';

export type ScoringDimensionId =
  | 'app_identity_icon'
  | 'title'
  | 'short_description'
  | 'full_description'
  | 'keyword_topic_coverage'
  | 'screenshot_strategy'
  | 'screenshot_quality'
  | 'visual_quality'
  | 'value_proposition'
  | 'feature_communication'
  | 'trust_signals'
  | 'ratings'
  | 'reviews'
  | 'developer_presentation'
  | 'category_positioning'
  | 'differentiation'
  | 'listing_completeness'
  | 'discoverability_potential'
  | 'conversion_potential'
  | 'competitive_positioning';

export interface ScoreObservation {
  type: 'positive' | 'negative' | 'neutral';
  pointDelta: number; // e.g. +15, -10
  observation: string;
  evidence: string;
}

export interface DimensionScore {
  id: ScoringDimensionId;
  name: string;
  pillar: ScoringPillarId;
  pillarName: string;
  score: number; // 0 - 100
  weight: number; // Percentage contribution (sum of all 20 is 100)
  weightedContribution: number; // score * (weight / 100)
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  confidence: FindingConfidence;
  evidence: string; // The factual observed data point(s)
  explanation: string; // Transparent rationale behind the assigned score
  contributingObservations: ScoreObservation[];
  recommendation: string; // Targeted improvement advice
  isEvidenceAvailable: boolean;
  unavailableReason?: string;
}

export interface PillarScore {
  id: ScoringPillarId;
  name: string;
  description: string;
  score: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  dimensionCount: number;
  dimensions: DimensionScore[];
  summary: string;
  primaryStrength: string;
  primaryVulnerability: string;
}

export interface WhatsWrongProblem {
  id: string;
  dimensionId: ScoringDimensionId;
  affectedArea: string;
  severity: FindingSeverity; // 'critical' | 'warning' | 'info'
  evidence: string; // Real observed facts
  whyItMatters: string; // Business/ASO impact
  recommendedFix: string; // Concrete fix
  expectedImpact: 'High' | 'Medium' | 'Low';
  effort: 'Low' | 'Medium' | 'High';
  confidence: FindingConfidence;
  priorityScore: number; // Calculated priority rank score
}

export interface WhatIsGoodStrength {
  id: string;
  dimensionId: ScoringDimensionId;
  area: string;
  evidence: string; // Factual observed positive evidence
  competitiveAdvantage: string; // Why this helps the app stand out
  confidence: FindingConfidence;
}

export interface FixThisFirstAction {
  rank: number; // 1 to 5
  id: string;
  dimensionId: ScoringDimensionId;
  title: string;
  affectedArea: string;
  severity: FindingSeverity;
  evidence: string; // Observed listing fact
  whyItMatters: string;
  actionableStep: string;
  expectedImpact: 'High' | 'Medium' | 'Low';
  effort: 'Low' | 'Medium' | 'High';
  confidence: FindingConfidence;
  priorityScore: number;
  tags: string[];
}

export interface AuditConfidenceReport {
  overallLevel: 'Full Evidence' | 'Partial Evidence' | 'Limited Evidence';
  dataCompletenessPercentage: number;
  verifiedFieldsCount: number;
  totalFieldsCount: number;
  unavailableSignals: {
    signal: string;
    reason: string;
    impactOnScoring: string;
  }[];
  fairnessGuarantee: string;
}

export interface AuditScorecard {
  appName: string;
  appId: string;
  overallScore: number; // 0 - 100 (Calculated mathematically from 20 dimensions)
  overallGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  calculationSummary: {
    formula: string;
    totalDimensionsCount: number;
    weightsSum: number;
    baseCalculation: string;
  };
  pillars: Record<ScoringPillarId, PillarScore>;
  pillarsList: PillarScore[];
  dimensions: Record<ScoringDimensionId, DimensionScore>;
  dimensionsList: DimensionScore[];
  whatsWrong: WhatsWrongProblem[];
  whatIsGood: WhatIsGoodStrength[];
  fixThisFirst: FixThisFirstAction[];
  confidenceReport: AuditConfidenceReport;
}
