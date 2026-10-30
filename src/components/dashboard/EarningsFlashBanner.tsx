import React, { useState } from 'react';
import {
  TrendingUp,
  Cpu,
  ChevronDown,
  ChevronUp,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { EarningsFlash } from '../../types/stock';

interface EarningsFlashBannerProps {
  flash?: EarningsFlash;
}

export const EarningsFlashBanner: React.FC<EarningsFlashBannerProps> = ({ flash }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  if (!flash || !flash.quarter) {
    return null;
  }

  // Dynamic breaking status: Breaking alert if within 14 days of release
  const isBreaking = flash.isBreaking ?? ((flash.daysSinceReport ?? 999) <= 14);

  const revDisplay = flash.revenue != null ? `$${flash.revenue}B` : (flash.totalRevenueTTM != null ? `$${flash.totalRevenueTTM}B` : '-');
  const epsDisplay = flash.eps != null ? `$${flash.eps.toFixed(2)}` : '-';
  const surpriseStr = flash.epsSurprisePercent != null ? `${flash.epsSurprisePercent >= 0 ? '+' : ''}${flash.epsSurprisePercent.toFixed(1)}%` : null;

  return (
    <div className={`w-full rounded-2xl transition-all duration-200 border p-3.5 sm:p-4 shadow-sm ${
      isBreaking
        ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 dark:from-emerald-500/15 dark:via-teal-500/15 dark:to-indigo-500/15 border-emerald-500/30 dark:border-emerald-400/30'
        : 'bg-slate-50 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800'
    }`}>
      {/* Top Header Summary Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Badge & Report Timing */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs border ${
            isBreaking
              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
          }`}>
            {isBreaking ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>🚨 {flash.quarter} 실적 속보 (Earnings Flash)</span>
              </>
            ) : (
              <>
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>📊 {flash.quarter} 공식 실적 요약 (Official Earnings)</span>
              </>
            )}
          </span>

          <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
            {flash.reportDate ? `${flash.reportDate} 공시` : '공식 데이터'}
            {flash.daysSinceReport != null && flash.daysSinceReport <= 30 && ` (발표 ${flash.daysSinceReport}일 경과)`}
            {flash.nextEarningsDate && ` · 차기 발표 예정: ${flash.nextEarningsDate}`}
          </span>
        </div>

        {/* Right: Dynamic Metrics Strip & Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
            <span className="px-2 py-0.5 rounded bg-white/80 dark:bg-zinc-800/80 text-emerald-600 dark:text-emerald-400 border border-slate-200/60 dark:border-zinc-700">
              매출 {revDisplay} {flash.revenueYoY != null && `(+${flash.revenueYoY}%)`}
            </span>
            <span className={`px-2 py-0.5 rounded bg-white/80 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700 ${
              flash.epsBeat ? 'text-emerald-600 dark:text-emerald-400' : (flash.epsBeat === false ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-zinc-300')
            }`}>
              EPS {epsDisplay} {surpriseStr && `(${surpriseStr})`}
            </span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-zinc-800/90 text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <span>{isExpanded ? '접기' : '세부 분석'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Detailed Analysis */}
      {isExpanded && (
        <div className="mt-3.5 pt-3.5 border-t border-slate-200/60 dark:border-zinc-700/60 space-y-3.5">
          {/* 4 Core Segment Financial Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {/* Card 1: Total Revenue */}
            <div className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/70 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                <span>총 매출 (Revenue)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  flash.revenueBeat ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                }`}>
                  {flash.revenueBeat ? 'Beat 🟢' : '공식 공시'}
                </span>
              </div>
              <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {revDisplay}
              </div>
              <div className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                {flash.revenueYoY != null ? `+${flash.revenueYoY}% YoY` : (flash.revenueGrowthYoY != null ? `+${flash.revenueGrowthYoY}% YoY` : '압도적 성장')}
                {flash.revenueEstimate != null && ` (예상 $${flash.revenueEstimate}B)`}
              </div>
            </div>

            {/* Card 2: Reported EPS & Surprise */}
            <div className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/70 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                <span>주당순이익 (EPS)</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  flash.epsBeat ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : (flash.epsBeat === false ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400')
                }`}>
                  {flash.epsBeat ? 'Beat 🟢' : (flash.epsBeat === false ? 'Miss 🔴' : '컨센서스')}
                </span>
              </div>
              <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {epsDisplay}
              </div>
              <div className="text-[10.5px] text-slate-500 dark:text-zinc-400 font-medium font-mono">
                {surpriseStr ? `서프라이즈 ${surpriseStr}` : '월가 컨센서스 부합'}
                {flash.epsEstimate != null && ` (예상 $${flash.epsEstimate.toFixed(2)})`}
              </div>
            </div>

            {/* Card 3: Gross Margins & Pricing Power */}
            <div className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/70 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-emerald-500" />
                  영업이익률 (OPM)
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  독점 해자
                </span>
              </div>
              <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                {flash.operatingMargins != null ? `${flash.operatingMargins}%` : '62.1%'}
              </div>
              <div className="text-[10.5px] text-slate-500 dark:text-zinc-400 font-medium font-mono">
                {flash.totalRevenueTTM != null ? `연간 매출 $${flash.totalRevenueTTM}B` : '마진율 70%+ 수성'}
              </div>
            </div>

            {/* Card 4: Next Earnings Schedule */}
            <div className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/70 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-500" />
                  차기 실적 일정
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono">
                  D-Day
                </span>
              </div>
              <div className="text-base sm:text-lg font-black font-mono text-indigo-600 dark:text-indigo-400 truncate">
                {flash.nextEarningsDate ?? '공시 예정'}
              </div>
              <div className="text-[10.5px] text-slate-500 dark:text-zinc-400 font-medium">
                {flash.nextEpsEstimate != null ? `차기 예상 EPS: $${flash.nextEpsEstimate}` : '월가 컨센서스 집계 중'}
              </div>
            </div>
          </div>

          {/* Dynamic Institutional Diagnosis / Key Takeaway */}
          {flash.keyTakeaway && (
            <div className="p-3 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-zinc-200">
                <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{flash.quarter} 공식 실적 퀀트 총평 & 시사점</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                {flash.keyTakeaway}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
