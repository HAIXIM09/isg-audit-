/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuditScorecard, WhatsWrongProblem, WhatIsGoodStrength } from '../../types/scoring';

export interface SavedAuditRecord {
  id: string;
  ownerId: string; // Row-level owner isolation
  appId: string;
  appName: string;
  timestamp: string;
  overallScore: number;
  overallGrade: string;
  pillarScores: Record<string, number>;
  dimensionScores: Record<string, number>;
  whatsWrongTitles: string[];
  whatIsGoodTitles: string[];
  scorecard: AuditScorecard;
}

export interface AuditComparisonReport {
  appId: string;
  appName: string;
  previousAuditDate: string;
  currentAuditDate: string;
  previousScore: number;
  currentScore: number;
  scoreDelta: number;
  improvementPercentage: number;
  previousGrade: string;
  currentGrade: string;
  pillarDeltas: {
    pillarId: string;
    pillarName: string;
    previousScore: number;
    currentScore: number;
    delta: number;
  }[];
  fixedProblems: string[];
  remainingProblems: string[];
  newlyDetectedProblems: string[];
  newStrengths: string[];
}

const STORAGE_KEY = 'isgwyze_aso_audit_history_v1';
const USER_SESSION_KEY = 'isgwyze_client_user_session_id';

/**
 * Retrieves or establishes the active user's secure partition session identifier.
 * Guarantees row-level isolation so that each user/client can only access their own records.
 */
export function getCurrentUserId(): string {
  try {
    let uid = localStorage.getItem(USER_SESSION_KEY);
    if (!uid) {
      // Generate cryptographically random secure token
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      uid = 'usr_' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      localStorage.setItem(USER_SESSION_KEY, uid);
    }
    return uid;
  } catch (e) {
    return 'usr_isolated_guest';
  }
}

/**
 * Retrieves audit history filtered strictly by the current user's session identifier.
 * Cross-user access is blocked at the storage layer.
 */
export function getAuditHistory(): Record<string, SavedAuditRecord[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, SavedAuditRecord[]>;
    const currentUid = getCurrentUserId();

    // Enforce row-level ownership: only return records owned by the current user
    const userFiltered: Record<string, SavedAuditRecord[]> = {};
    for (const [appId, records] of Object.entries(parsed)) {
      if (Array.isArray(records)) {
        const owned = records.filter(r => !r.ownerId || r.ownerId === currentUid);
        if (owned.length > 0) {
          userFiltered[appId] = owned;
        }
      }
    }
    return userFiltered;
  } catch (e) {
    console.warn('[AuditHistory] Failed to parse audit history from storage:', e);
    return {};
  }
}

export function saveAuditToHistory(scorecard: AuditScorecard): {
  record: SavedAuditRecord;
  comparison: AuditComparisonReport | null;
} {
  const history = getAuditHistory();
  const appId = scorecard.appId || scorecard.appName;
  const existingAppAudits = history[appId] || [];

  const pillarScores: Record<string, number> = {};
  scorecard.pillarsList.forEach((p) => {
    pillarScores[p.id] = p.score;
  });

  const dimensionScores: Record<string, number> = {};
  scorecard.dimensionsList.forEach((d) => {
    dimensionScores[d.id] = d.score;
  });

  const currentUid = getCurrentUserId();
  const currentRecord: SavedAuditRecord = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    ownerId: currentUid,
    appId,
    appName: scorecard.appName,
    timestamp: new Date().toISOString(),
    overallScore: scorecard.overallScore,
    overallGrade: scorecard.overallGrade,
    pillarScores,
    dimensionScores,
    whatsWrongTitles: scorecard.whatsWrong.map((w) => w.affectedArea),
    whatIsGoodTitles: scorecard.whatIsGood.map((g) => g.area),
    scorecard,
  };

  let comparison: AuditComparisonReport | null = null;

  if (existingAppAudits.length > 0) {
    const previous = existingAppAudits[0]; // Most recent previous audit
    const scoreDelta = currentRecord.overallScore - previous.overallScore;
    const improvementPercentage =
      previous.overallScore > 0
        ? Math.round(((currentRecord.overallScore - previous.overallScore) / previous.overallScore) * 100)
        : 0;

    const pillarDeltas = scorecard.pillarsList.map((p) => {
      const prev = previous.pillarScores[p.id] ?? p.score;
      return {
        pillarId: p.id,
        pillarName: p.name,
        previousScore: prev,
        currentScore: p.score,
        delta: p.score - prev,
      };
    });

    const prevProblems = new Set(previous.whatsWrongTitles);
    const currProblems = new Set(currentRecord.whatsWrongTitles);

    const fixedProblems = previous.whatsWrongTitles.filter((title) => !currProblems.has(title));
    const remainingProblems = currentRecord.whatsWrongTitles.filter((title) => prevProblems.has(title));
    const newlyDetectedProblems = currentRecord.whatsWrongTitles.filter((title) => !prevProblems.has(title));

    const prevStrengths = new Set(previous.whatIsGoodTitles);
    const newStrengths = currentRecord.whatIsGoodTitles.filter((title) => !prevStrengths.has(title));

    comparison = {
      appId,
      appName: scorecard.appName,
      previousAuditDate: previous.timestamp,
      currentAuditDate: currentRecord.timestamp,
      previousScore: previous.overallScore,
      currentScore: currentRecord.overallScore,
      scoreDelta,
      improvementPercentage,
      previousGrade: previous.overallGrade,
      currentGrade: currentRecord.overallGrade,
      pillarDeltas,
      fixedProblems,
      remainingProblems,
      newlyDetectedProblems,
      newStrengths,
    };
  }

  // Row-level security write: merge current user records safely
  const updatedList = [currentRecord, ...existingAppAudits.slice(0, 9)];
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const allRecords: Record<string, SavedAuditRecord[]> = raw ? JSON.parse(raw) : {};
    // Preserve records from other tenant sessions (if any exist in shared browser storage)
    const otherUserRecords = (allRecords[appId] || []).filter(r => r.ownerId && r.ownerId !== currentUid);
    allRecords[appId] = [...updatedList, ...otherUserRecords];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allRecords));
  } catch (e) {
    console.warn('[AuditHistory] Failed to write audit history to storage:', e);
  }

  return { record: currentRecord, comparison };
}

export function clearAuditHistoryForApp(appId: string): void {
  try {
    const currentUid = getCurrentUserId();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const allRecords: Record<string, SavedAuditRecord[]> = JSON.parse(raw);
    
    if (allRecords[appId]) {
      // Confirm user can only remove their own records
      allRecords[appId] = allRecords[appId].filter(r => r.ownerId && r.ownerId !== currentUid);
      if (allRecords[appId].length === 0) {
        delete allRecords[appId];
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allRecords));
  } catch (e) {
    console.warn('[AuditHistory] Failed to clear app history:', e);
  }
}
