/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Star,
  Clock,
  Mail,
  Globe,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  DollarSign,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { TrustReputationSection as TrustReputationType } from '../../types/asoDeepAudit';
import { FindingCard } from './FindingCard';

interface Props {
  trustData?: TrustReputationType;
  appName: string;
}

export const TrustReputationSection: React.FC<Props> = ({ trustData, appName }) => {
  if (!trustData) {
    return (
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl text-center text-slate-400 text-sm">
        Trust & Reputation analysis is pending.
      </div>
    );
  }

  const {
    trustIndexScore,
    trustTier,
    ratingHealth,
    developerPresentation,
    updateCadence,
    contentAndCommercialDisclosures,
    observableTrustSignals,
    trustChecklist,
    findings,
  } = trustData;

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Tier 1 - High Trust':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
        };
      case 'Tier 2 - Good Trust':
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
        };
      case 'Tier 3 - Needs Verification':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
        };
      default:
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          icon: <ShieldX className="w-5 h-5 text-rose-400" />,
        };
    }
  };

  const tierBadge = getTierBadge(trustTier);

  return (
    <div className="space-y-8" id="trust-reputation-section">
      {/* Top Banner: Trust Index Score */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Trust & Developer Reputation Index</h3>
                  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${tierBadge.bg}`}>
                    {trustTier}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evaluates observable developer identity, store rating health, maintenance cadence, and privacy disclosures.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-3.5 self-start md:self-auto">
            <div className="text-right">
              <div className="text-3xl font-black text-white flex items-center justify-end gap-1">
                <span>{trustIndexScore}</span>
                <span className="text-sm font-normal text-slate-500">/100</span>
              </div>
              <div className="text-[11px] font-medium text-slate-400">Trust Index Score</div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
              <svg className="w-12 h-12 -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="4"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="transparent"
                  stroke={trustIndexScore >= 80 ? '#10b981' : trustIndexScore >= 65 ? '#3b82f6' : trustIndexScore >= 50 ? '#f59e0b' : '#ef4444'}
                  strokeWidth="4"
                  strokeDasharray={`${(trustIndexScore / 100) * 125.6} 125.6`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xs font-bold text-slate-300">
                {trustIndexScore >= 80 ? 'A' : trustIndexScore >= 65 ? 'B' : trustIndexScore >= 50 ? 'C' : 'D'}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Trust Quadrants */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          {/* 1. Rating Health */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" /> Rating Health
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  ratingHealth?.status === 'Strong'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : ratingHealth?.status === 'Average'
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}
              >
                {ratingHealth?.status || 'Unrated'}
              </span>
            </div>
            <div className="text-xl font-bold text-white flex items-baseline gap-1">
              <span>{ratingHealth?.score ? ratingHealth.score.toFixed(1) : 'N/A'}</span>
              <span className="text-xs text-slate-400 font-normal">
                {ratingHealth?.score ? '★ rating' : ''}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-snug">
              {ratingHealth?.volume ? `${ratingHealth.volume.toLocaleString()} ratings recorded.` : ''} {ratingHealth?.verdict}
            </p>
          </div>

          {/* 2. Developer Presentation */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> Developer Profile
              </span>
              <span className="text-[11px] font-medium text-slate-300">
                {developerPresentation?.transparencyLevel?.split(' ')[0] || 'Standard'}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-200 truncate">
              {developerPresentation?.developerName || 'Unknown Developer'}
            </div>
            <div className="space-y-1 text-xs text-slate-400">
              {developerPresentation?.email && (
                <div className="flex items-center gap-1 text-[11px] truncate">
                  <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                  <a
                    href={`mailto:${developerPresentation.email}`}
                    className="text-blue-400 hover:underline truncate"
                  >
                    {developerPresentation.email}
                  </a>
                </div>
              )}
              {developerPresentation?.website && (
                <div className="flex items-center gap-1 text-[11px] truncate">
                  <Globe className="w-3 h-3 text-slate-500 shrink-0" />
                  <a
                    href={developerPresentation.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline truncate flex items-center gap-0.5"
                  >
                    {developerPresentation.website.replace(/^https?:\/\//, '')}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 3. Update Cadence */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" /> Update Cadence
              </span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  updateCadence?.status?.startsWith('Actively')
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : updateCadence?.status?.startsWith('Standard')
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}
              >
                {updateCadence?.status?.split(' ')[0] || 'Maintained'}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-200">
              {updateCadence?.daysSinceLastUpdate !== null && updateCadence?.daysSinceLastUpdate !== undefined
                ? `${updateCadence.daysSinceLastUpdate} days ago`
                : updateCadence?.lastUpdatedText || 'Recent'}
            </div>
            <p className="text-xs text-slate-400 leading-snug">
              {updateCadence?.summary}
            </p>
          </div>

          {/* 4. Commercial Disclosures */}
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Commercial Status
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                {contentAndCommercialDisclosures?.contentRating || 'Everyone'}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-200">
              {contentAndCommercialDisclosures?.offersIAP ? 'In-App Purchases' : 'Standard Model'}
            </div>
            <p className="text-xs text-slate-400 leading-snug">
              {contentAndCommercialDisclosures?.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Trust Checklist & Observable Signals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Observable Signals Breakdown */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Observable Trust Assets & Policies
            </h4>
          </div>

          <div className="space-y-3">
            {/* Privacy Policy */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">Privacy Policy Link</span>
                  {observableTrustSignals?.privacyPolicyUrl ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Missing
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {observableTrustSignals?.privacyPolicyUrl ? (
                    <a
                      href={observableTrustSignals.privacyPolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-1 truncate max-w-xs"
                    >
                      {observableTrustSignals.privacyPolicyUrl}
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    'No public privacy policy URL is registered in this Google Play Store listing.'
                  )}
                </p>
              </div>
              {observableTrustSignals?.privacyPolicyUrl ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
            </div>

            {/* HTTPS Developer Domain */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">Secure Developer Domain (HTTPS)</span>
                  {developerPresentation?.isHttpsWebsite ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Secure
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Insecure or Missing
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {developerPresentation?.isHttpsWebsite
                    ? 'Developer website uses valid SSL/TLS encryption for user security.'
                    : 'Developer website is missing or uses unencrypted HTTP protocol.'}
                </p>
              </div>
              {developerPresentation?.isHttpsWebsite ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              )}
            </div>

            {/* Data Safety Disclosure */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">Google Play Data Safety Section</span>
                  {observableTrustSignals?.dataSafetyDisclosed ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Disclosed
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Standard Google Play Data Safety compliance declaration.
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>

            {/* Security Promises in Description */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">Store Copy Privacy Claims</span>
                  {observableTrustSignals?.securityPromisesInDescription ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Claims Present
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-400">
                      None in Copy
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {observableTrustSignals?.securityPromisesInDescription
                    ? 'Explicit user security, encryption, or privacy statements found in the public listing text.'
                    : 'No explicit data safety or privacy reassurances included in the public app description.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Trust Checklist */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Actionable Store Trust Checklist
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              {trustChecklist?.filter((c) => c.status === 'passed').length || 0}/{trustChecklist?.length || 0} Passed
            </span>
          </div>

          <div className="space-y-3">
            {trustChecklist?.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-lg border text-xs space-y-1.5 ${
                  item.status === 'passed'
                    ? 'bg-slate-950/60 border-slate-800'
                    : item.status === 'warning'
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.status === 'passed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : item.status === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span className="font-semibold text-slate-200">{item.item}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                      item.status === 'passed'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : item.status === 'warning'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {item.recommendation && (
                  <div className="text-blue-300 pl-6 pt-0.5">
                    <strong>Action:</strong> {item.recommendation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Findings */}
      {findings && findings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Evidence-Based Trust & Reputation Findings ({findings.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {findings.map((f) => (
              <FindingCard key={f.id} finding={f} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
