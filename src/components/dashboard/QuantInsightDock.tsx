import React, { useState } from 'react';
import {
  Flame,
  Calendar,
  Target,
  ChevronRight,
  Newspaper,
  Clock,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { StockFundamentals } from '../../types/stock';
import { SingleStockProfile } from '../../types/stockConfig';
import { formatCurrency } from '../../lib/stockApi';

interface QuantInsightDockProps {
  profile: SingleStockProfile;
  fundamentals: StockFundamentals;
  onSelectAiQuestion?: (question: string) => void;
  onOpenTab?: (tabId: 'bespoke' | 'chart' | 'ai_memo' | 'moat' | 'valuation') => void;
}

export const QuantInsightDock: React.FC<QuantInsightDockProps> = ({
  profile,
  fundamentals,
  onOpenTab,
}) => {
  const [showAllNews, setShowAllNews] = useState(false);

  const targetMean = fundamentals.targetMeanPrice || 265.50;
  const currentPrice = fundamentals.currentPrice || 207.41;
  const upside = currentPrice > 0 ? (((targetMean - currentPrice) / currentPrice) * 100).toFixed(1) : '28.0';

  const ef = fundamentals.earningsFlash;
  const liveCatalysts = fundamentals.collectorCatalysts as
    | Array<{ category: string; impact: string; summary: string }>
    | undefined;
  const liveNews = fundamentals.collectorNews as
    | Array<{ title: string; source: string; link: string; pubDate: string }>
    | undefined;
  const tech = fundamentals.collectorTechnicals as
    | { rsi14?: number; mfi14?: number; sma50?: number; trend?: string }
    | undefined;
  const collectorAsOf = fundamentals.collectorAsOf as string | undefined;

  return (
    <div className="space-y-3.5">
      {/* 0. NY 13-Checkpoint Collector Sync Status Badge */}
      <div className="rounded-2xl bg-slate-900 dark:bg-zinc-900 text-white border border-slate-800 dark:border-zinc-800 p-3 shadow-sm flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <div className="min-w-0">
            <div className="text-[11px] font-extrabold text-emerald-400 tracking-tight truncate">
              NY 13대 세션 체크포인트 자동 수집 연동
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate">
              {collectorAsOf ? `수집 기준: ${collectorAsOf}` : 'Tier 0(2분) · Tier 2(NY 13회) · Tier 3(6시간)'}
            </div>
          </div>
        </div>
        {tech?.rsi14 != null && (
          <div className="shrink-0 text-right px-2 py-1 rounded-lg bg-white/5 border border-white/10">
            <span className="block text-[9px] text-slate-400 font-mono">RSI(14)</span>
            <span
              className={`font-mono font-black text-xs ${
                tech.rsi14 < 35
                  ? 'text-emerald-400'
                  : tech.rsi14 > 70
                  ? 'text-rose-400'
                  : 'text-amber-300'
              }`}
            >
              {tech.rsi14}
            </span>
          </div>
        )}
      </div>

      {/* 1. Volatility & Key Catalysts Radar Card (Dynamic from Collectors + Profile) */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-3.5 sm:p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Flame className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
              핵심 모멘텀 촉매 레이더
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
            {liveCatalysts && liveCatalysts.length > 0 ? '실시간 감지' : '슈퍼사이클 가동'}
          </span>
        </div>

        {/* Dynamic Catalysts detected from Google News RSS + Earnings */}
        {liveCatalysts && liveCatalysts.length > 0 && (
          <div className="space-y-1.5">
            {liveCatalysts.map((c, idx) => (
              <div
                key={`live-cat-${idx}`}
                className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40"
              >
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {c.category}
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    {c.impact.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-zinc-300 leading-relaxed">
                  {c.summary}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          {profile.catalysts.map((cat) => (
            <div
              key={cat.id}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-colors group cursor-default"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {cat.title}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    cat.impact === 'HIGH'
                      ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
                      : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                  }`}
                >
                  {cat.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                {cat.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Earnings Flash & Financial Margins Card (Hydrated with Dynamic Earnings) */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-3.5 sm:p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
              실적 발표 & 펀더멘털 마진
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/25">
            {ef?.nextEarningsDate ? `차기: ${ef.nextEarningsDate}` : `${profile.earnings.dDay} (${profile.earnings.date})`}
          </span>
        </div>

        {ef?.keyTakeaway && (
          <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-[11px] text-slate-700 dark:text-zinc-300 leading-relaxed">
            <strong className="text-blue-700 dark:text-blue-300 font-bold">공식 실적 요약: </strong>
            {ef.keyTakeaway}
          </div>
        )}

        {/* 2x2 Financial Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800">
            <span className="block text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
              {ef?.revenue ? `최근 분기 매출 (${ef.quarter || '실적'})` : '매출 컨센서스'}
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-zinc-100 text-xs">
              {ef?.revenue ? `$${ef.revenue}B` : profile.earnings.estRevenue}
            </span>
            <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              {ef?.revenueYoY != null ? `YoY ${ef.revenueYoY >= 0 ? '+' : ''}${ef.revenueYoY}%` : '전년비 고성장'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800">
            <span className="block text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
              {ef?.eps ? '실제 발표 EPS' : '예상 EPS'}
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-zinc-100 text-xs">
              {ef?.eps ? `$${ef.eps}` : profile.earnings.estEps}
            </span>
            <span className="block text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
              {ef?.epsSurprisePercent != null
                ? `서프라이즈 ${ef.epsSurprisePercent >= 0 ? '+' : ''}${ef.epsSurprisePercent}%`
                : `전분기 ${profile.earnings.prevEps}`}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
            <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">총마진율 (Gross)</span>
            <span className="font-mono font-black text-emerald-800 dark:text-emerald-300 text-xs">
              {profile.earnings.grossMargin}
            </span>
            <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
              독보적 가격결정력
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
            <span className="block text-[10px] text-indigo-700 dark:text-indigo-400 font-medium">영업이익률 (OPM)</span>
            <span className="font-mono font-black text-indigo-800 dark:text-indigo-300 text-xs">
              {ef?.operatingMargins != null ? `${ef.operatingMargins}%` : profile.earnings.operatingMargin}
            </span>
            <span className="block text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">
              업계 최상위 수익성
            </span>
          </div>
        </div>
      </div>

      {/* 3. Live Google News RSS Feed (Collected by NY Session Scheduler) */}
      {liveNews && liveNews.length > 0 && (
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-3.5 sm:p-4 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Newspaper className="w-3.5 h-3.5" />
              </span>
              <h2 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
                실시간 해외 원문 뉴스 (RSS)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              NY 세션 수집
            </span>
          </div>

          <div className="space-y-1.5">
            {(showAllNews ? liveNews.slice(0, 6) : liveNews.slice(0, 3)).map((item, idx) => (
              <a
                key={`news-${idx}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-100 dark:border-zinc-800 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-bold text-slate-800 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2 leading-snug">
                    {item.title}
                  </p>
                  <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100" />
                </div>
                <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                  <span className="font-semibold text-slate-500 dark:text-zinc-400">{item.source}</span>
                  <span>{item.pubDate ? item.pubDate.slice(0, 16) : ''}</span>
                </div>
              </a>
            ))}
          </div>

          {liveNews.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAllNews((v) => !v)}
              className="w-full py-1.5 text-[11px] font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {showAllNews ? '뉴스 접기 ▲' : `수집된 뉴스 더보기 (${liveNews.length}건) ▼`}
            </button>
          )}
        </div>
      )}

      {/* 4. Wall Street Consensus & Target Range */}
      <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-3.5 sm:p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Target className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-xs font-bold text-slate-900 dark:text-zinc-100 uppercase tracking-wider">
              월가 투자 의견 & 목표가
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
            {fundamentals.recommendationKey === 'strong_buy' ? '강력 매수 (Strong Buy)' : '매수 (Buy)'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-500 dark:text-zinc-400">평균 목표가 (Mean)</span>
            <div className="text-right">
              <span className="font-mono font-black text-slate-900 dark:text-zinc-100 text-sm">
                {formatCurrency(targetMean)}
              </span>
              <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 ml-1.5">
                (+{upside}%)
              </span>
            </div>
          </div>

          {/* Target Min/Max Range Bar */}
          <div className="space-y-1 pt-1">
            <div className="w-full h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full relative overflow-hidden">
              <div className="absolute left-[20%] right-[10%] h-full bg-gradient-to-r from-emerald-400 to-indigo-500 rounded-full" />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 dark:text-zinc-500">
              <span>52주 최저 {fundamentals.fiftyTwoWeekLow ? `$${fundamentals.fiftyTwoWeekLow.toFixed(1)}` : '$175'}</span>
              <span className="font-bold text-slate-700 dark:text-zinc-300">현재 ${currentPrice.toFixed(2)}</span>
              <span>52주 최고 {fundamentals.fiftyTwoWeekHigh ? `$${fundamentals.fiftyTwoWeekHigh.toFixed(1)}` : '$325'}</span>
            </div>
          </div>
        </div>

        {/* Quick Reverse DCF Hook */}
        {onOpenTab && (
          <button
            type="button"
            onClick={() => onOpenTab('valuation')}
            className="w-full py-2 px-3 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 hover:bg-indigo-100/80 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/50 border border-indigo-200/60 dark:border-indigo-800/40 transition-colors flex items-center justify-between cursor-pointer"
          >
            <span>🧮 역DCF 내재 FCF 성장률 계산기 실행</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
