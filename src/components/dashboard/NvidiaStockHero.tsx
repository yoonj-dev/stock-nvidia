import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Cpu,
  DollarSign,
  ShieldCheck,
  BarChart2,
  PieChart,
  Target,
} from 'lucide-react';
import { StockFundamentals, Candle } from '../../types/stock';
import { formatCurrency, formatLargeNumber, formatPercent } from '../../lib/stockApi';
import { IntradayMiniChart } from './IntradayMiniChart';
import { MarketVolatilityAlertBanner } from './MarketVolatilityAlertBanner';

interface NvidiaStockHeroProps {
  nvda: StockFundamentals;
  candles?: Candle[];
}

export type MarketSession = 'REGULAR' | 'POST' | 'PRE' | 'OVERNIGHT' | 'CLOSED';

export const NvidiaStockHero: React.FC<NvidiaStockHeroProps> = ({
  nvda,
  candles = [],
}) => {
  // 1. Determine Market Session State
  const rawState = (nvda.marketState || '').toUpperCase();
  let session: MarketSession = 'CLOSED';
  if (rawState.includes('REGULAR')) {
    session = 'REGULAR';
  } else if (rawState.includes('POST')) {
    session = 'POST';
  } else if (rawState.includes('PRE')) {
    session = 'PRE';
  } else if (rawState.includes('OVERNIGHT')) {
    session = 'OVERNIGHT';
  } else if (rawState.includes('CLOSED')) {
    session = 'CLOSED';
  } else {
    if (nvda.postMarketPrice) session = 'POST';
    else if (nvda.preMarketPrice) session = 'PRE';
    else session = 'REGULAR';
  }

  const isRegular = session === 'REGULAR';

  // 2. Regular session metrics (Regular Close vs Previous Close)
  const regPrice = nvda.regularMarketPrice || nvda.regularLastPrice || nvda.currentPrice;
  const regPrevClose = nvda.regularMarketPreviousClose || nvda.previousClose || regPrice;
  const regChange = nvda.regularMarketChange != null ? nvda.regularMarketChange : (regPrice - regPrevClose);
  const regChangePercent = nvda.regularMarketChangePercent != null ? nvda.regularMarketChangePercent : (regPrevClose > 0 ? (regChange / regPrevClose) * 100 : 0);
  const isRegPositive = regChange >= 0;

  // 3. Extended session metrics
  const hasPre = nvda.preMarketPrice != null && nvda.preMarketPrice > 0;
  const hasPost = nvda.postMarketPrice != null && nvda.postMarketPrice > 0;

  let extPrice: number | null = null;
  let extChange: number | null = null;
  let extChangePercent: number | null = null;
  let extLabel = '';

  if (session === 'PRE' || (session === 'CLOSED' && hasPre && !hasPost)) {
    extPrice = nvda.preMarketPrice!;
    extChange = nvda.preMarketChange != null ? nvda.preMarketChange : (extPrice - regPrice);
    extChangePercent = nvda.preMarketChangePercent != null ? nvda.preMarketChangePercent : (regPrice > 0 ? ((extChange ?? 0) / regPrice) * 100 : 0);
    extLabel = '프리마켓';
  } else if (session === 'POST' || session === 'OVERNIGHT' || (session === 'CLOSED' && hasPost)) {
    extPrice = nvda.postMarketPrice!;
    extChange = nvda.postMarketChange != null ? nvda.postMarketChange : (extPrice - regPrice);
    extChangePercent = nvda.postMarketChangePercent != null ? nvda.postMarketChangePercent : (regPrice > 0 ? ((extChange ?? 0) / regPrice) * 100 : 0);
    extLabel = session === 'OVERNIGHT' ? '야간장' : '애프터마켓';
  }

  // 4. Headline Selection: In extended session, display extended price and change
  const isExtendedActive = (session === 'PRE' || session === 'POST' || session === 'OVERNIGHT') && extPrice != null;

  const headlinePrice = isExtendedActive ? extPrice! : regPrice;
  const headlineChange = isExtendedActive ? extChange! : regChange;
  const headlineChangePercent = isExtendedActive ? extChangePercent! : regChangePercent;
  const isHeadlinePositive = headlineChange >= 0;

  // 5. 52-week position calculation
  const low52 = nvda.fiftyTwoWeekLow || 85.0;
  const high52 = nvda.fiftyTwoWeekHigh || 215.38;
  const pos52 = Math.max(0, Math.min(100, ((headlinePrice - low52) / (high52 - low52)) * 100));

  const targetMean = nvda.targetMeanPrice || 265.50;
  const upsidePercent = headlinePrice > 0 ? (((targetMean - headlinePrice) / headlinePrice) * 100).toFixed(1) : '28.0';

  // Session Badge Config
  const sessionConfig: Record<MarketSession, { label: string; dotColor: string; badgeBg: string }> = {
    REGULAR: {
      label: '정규장 실시간',
      dotColor: 'bg-emerald-500 animate-pulse',
      badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-500/25',
    },
    POST: {
      label: '애프터마켓 (시간외)',
      dotColor: 'bg-amber-500 animate-pulse',
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-500/25',
    },
    PRE: {
      label: '프리마켓 (개장전)',
      dotColor: 'bg-amber-500 animate-pulse',
      badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-500/25',
    },
    OVERNIGHT: {
      label: '야간장 (오버나이트 24H)',
      dotColor: 'bg-indigo-500',
      badgeBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400 border border-indigo-500/25',
    },
    CLOSED: {
      label: '장마감',
      dotColor: 'bg-slate-400 dark:bg-zinc-500',
      badgeBg: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700',
    },
  };

  const grossMarginDisplay = nvda.grossMargins ? `${(nvda.grossMargins * 100).toFixed(1)}%` : '74.9%';
  const opMarginDisplay = nvda.operatingMargins ? `${(nvda.operatingMargins * 100).toFixed(1)}%` : '62.1%';

  return (
    <div className="w-full space-y-4">
      {/* 3% 이상 대규모 변동성 긴급 분석 배너 & 공식 실적 배너 허브 */}
      <MarketVolatilityAlertBanner
        alert={nvda.volatilityAlert}
        flash={nvda.earningsBrief || nvda.earningsFlash}
        liveChangePercent={headlineChangePercent}
        ticker="NVDA"
      />

      {/* Main Executive Header Card */}
      <div className="fintech-card p-4 sm:p-6 space-y-4 sm:space-y-5">
        {/* Top: Company Brand */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#76b900] via-[#10b981] to-[#047857] p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[14px] flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#76b900] to-[#10b981] bg-clip-text text-transparent">
                  N
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  NVIDIA Corporation
                </h1>
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  NASDAQ: NVDA
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                AI 가속 컴퓨팅 & 데이터센터 GPU 독점 플랫폼
              </p>
            </div>
          </div>

          {/* Market Status Badge */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${sessionConfig[session].badgeBg}`}>
              <span className={`w-2 h-2 rounded-full ${sessionConfig[session].dotColor}`} />
              <span>{sessionConfig[session].label}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Left: Dynamic Real-time Price */}
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-mono text-slate-900 dark:text-white">
                {formatCurrency(headlinePrice)}
              </span>
              <div
                className={`flex items-center gap-1 text-sm sm:text-base font-extrabold font-mono px-2 py-0.5 rounded-lg ${
                  isHeadlinePositive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                }`}
              >
                {isHeadlinePositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>
                  {isHeadlinePositive ? '+' : ''}
                  {headlineChange.toFixed(2)} ({formatPercent(headlineChangePercent)})
                </span>
              </div>
            </div>

            {/* Context Comparison */}
            <div className="text-xs text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-2 flex-wrap">
              {isExtendedActive ? (
                <>
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">
                    {extLabel} 체결가
                  </span>
                  <span>·</span>
                  <span>정규장 종가 {formatCurrency(regPrice)} ({isRegPositive ? '+' : ''}{regChangePercent.toFixed(2)}%)</span>
                </>
              ) : (
                <>
                  <span>전일 종가 {formatCurrency(regPrevClose)} 대비</span>
                  {hasPost && (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400">
                      (시간외 {formatCurrency(nvda.postMarketPrice)})
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right: Intraday Mini Chart */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm rounded-xl p-2 bg-slate-50/80 dark:bg-zinc-900/60 border border-slate-200/70 dark:border-zinc-800">
              <IntradayMiniChart
                candles={candles}
                previousClose={regPrevClose}
                currentPrice={headlinePrice}
                symbol="NVDA"
              />
            </div>
          </div>
        </div>

        {/* Executive 4-Pillar Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800 text-xs">
          {/* Card 1: Market Cap */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800/80 space-y-1">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 flex items-center justify-between">
              <span>시가총액 (Market Cap)</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
              {formatLargeNumber(nvda.marketCap)}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-zinc-400">
              글로벌 1위 AI 반도체
            </div>
          </div>

          {/* Card 2: Valuation Multiples */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800/80 space-y-1">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 flex items-center justify-between">
              <span>Trailing / Forward P/E</span>
              <BarChart2 className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
              {nvda.trailingPE ? `${nvda.trailingPE.toFixed(1)}x` : '-'} / <span className="text-emerald-600 dark:text-emerald-400">{nvda.forwardPE ? `${nvda.forwardPE.toFixed(1)}x` : '-'}</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-zinc-400">
              이익 성장 대비 건전한 PEG
            </div>
          </div>

          {/* Card 3: Gross Margins */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800/80 space-y-1">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 flex items-center justify-between">
              <span>매출총이익률 / OPM</span>
              <PieChart className="w-3.5 h-3.5 text-purple-500" />
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
              {grossMarginDisplay} / <span className="text-slate-900 dark:text-white">{opMarginDisplay}</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-zinc-400">
              독보적 가격결정력(Pricing Power)
            </div>
          </div>

          {/* Card 4: Wall Street Consensus Target */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/60 dark:border-zinc-800/80 space-y-1">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 flex items-center justify-between">
              <span>월가 목표가 (Target)</span>
              <Target className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
              {formatCurrency(targetMean)}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
              상방 여력 +{upsidePercent}%
            </div>
          </div>
        </div>

        {/* 52-Week Range Bar */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-zinc-800 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
            <span>52주 최저: {formatCurrency(low52)}</span>
            <span className="font-semibold text-slate-700 dark:text-zinc-300">
              52주 레인지 위치: {pos52.toFixed(0)}%
            </span>
            <span>52주 최고: {formatCurrency(high52)}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${pos52}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
