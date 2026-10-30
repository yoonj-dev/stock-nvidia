import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Radio } from 'lucide-react';
import { StockFundamentals, Candle } from '../../types/stock';
import { SingleStockProfile } from '../../types/stockConfig';
import { formatCurrency, formatLargeNumber, formatPercent } from '../../lib/stockApi';
import { IntradayMiniChart } from './IntradayMiniChart';

interface StockTickerRibbonProps {
  profile: SingleStockProfile;
  fundamentals: StockFundamentals;
  candles?: Candle[];
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export type MarketSession = 'REGULAR' | 'POST' | 'PRE' | 'OVERNIGHT' | 'CLOSED';

export const StockTickerRibbon: React.FC<StockTickerRibbonProps> = ({
  profile,
  fundamentals,
  candles = [],
  isRefreshing = false,
  onRefresh,
}) => {
  // 1. Determine Market Session
  const rawState = (fundamentals.marketState || '').toUpperCase();
  let session: MarketSession = 'CLOSED';
  if (rawState.includes('REGULAR')) session = 'REGULAR';
  else if (rawState.includes('POST')) session = 'POST';
  else if (rawState.includes('PRE')) session = 'PRE';
  else if (rawState.includes('OVERNIGHT')) session = 'OVERNIGHT';
  else if (rawState.includes('CLOSED')) session = 'CLOSED';
  else {
    if (fundamentals.postMarketPrice) session = 'POST';
    else if (fundamentals.preMarketPrice) session = 'PRE';
    else session = 'REGULAR';
  }

  // 2. Regular session metrics
  const regPrice = fundamentals.regularMarketPrice || fundamentals.regularLastPrice || fundamentals.currentPrice;
  const regPrevClose = fundamentals.regularMarketPreviousClose || fundamentals.previousClose || regPrice;
  const regChange = fundamentals.regularMarketChange != null ? fundamentals.regularMarketChange : (regPrice - regPrevClose);
  const regChangePercent = fundamentals.regularMarketChangePercent != null ? fundamentals.regularMarketChangePercent : (regPrevClose > 0 ? (regChange / regPrevClose) * 100 : 0);

  // 3. Extended session metrics
  const hasPre = fundamentals.preMarketPrice != null && fundamentals.preMarketPrice > 0;
  const hasPost = fundamentals.postMarketPrice != null && fundamentals.postMarketPrice > 0;

  let extPrice: number | null = null;
  let extChange: number | null = null;
  let extChangePercent: number | null = null;
  let extLabel = '';

  if (session === 'PRE' || (session === 'CLOSED' && hasPre && !hasPost)) {
    extPrice = fundamentals.preMarketPrice!;
    extChange = fundamentals.preMarketChange != null ? fundamentals.preMarketChange : (extPrice - regPrice);
    extChangePercent = fundamentals.preMarketChangePercent != null ? fundamentals.preMarketChangePercent : (regPrice > 0 ? ((extChange ?? 0) / regPrice) * 100 : 0);
    extLabel = '프리마켓';
  } else if (session === 'POST' || session === 'OVERNIGHT' || (session === 'CLOSED' && hasPost)) {
    extPrice = fundamentals.postMarketPrice!;
    extChange = fundamentals.postMarketChange != null ? fundamentals.postMarketChange : (extPrice - regPrice);
    extChangePercent = fundamentals.postMarketChangePercent != null ? fundamentals.postMarketChangePercent : (regPrice > 0 ? ((extChange ?? 0) / regPrice) * 100 : 0);
    extLabel = session === 'OVERNIGHT' ? '야간장' : '애프터마켓';
  }

  const isExtendedActive = (session === 'PRE' || session === 'POST' || session === 'OVERNIGHT') && extPrice != null;
  const headlinePrice = isExtendedActive ? extPrice! : regPrice;
  const headlineChange = isExtendedActive ? extChange! : regChange;
  const headlineChangePercent = isExtendedActive ? extChangePercent! : regChangePercent;
  const isPositive = headlineChange >= 0;

  // 52-week position
  const low52 = fundamentals.fiftyTwoWeekLow || 85.0;
  const high52 = fundamentals.fiftyTwoWeekHigh || 215.38;
  const pos52 = Math.max(0, Math.min(100, ((headlinePrice - low52) / (high52 - low52)) * 100));

  const targetMean = fundamentals.targetMeanPrice || 265.50;
  const upsidePercent = headlinePrice > 0 ? (((targetMean - headlinePrice) / headlinePrice) * 100).toFixed(1) : '28.0';

  const sessionBadge = {
    REGULAR: { label: '정규장 실시간', dot: 'bg-emerald-500 animate-pulse', bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25' },
    PRE: { label: '프리마켓', dot: 'bg-amber-500 animate-pulse', bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25' },
    POST: { label: '애프터마켓', dot: 'bg-indigo-500 animate-pulse', bg: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/25' },
    OVERNIGHT: { label: '24H 야간장', dot: 'bg-purple-500 animate-pulse', bg: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25' },
    CLOSED: { label: '장 마감', dot: 'bg-slate-400', bg: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border-slate-200 dark:border-zinc-700' },
  }[session];

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-3 sm:p-4 shadow-sm transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Ticker Symbol, Korean Name, Session Badge, and Live Price */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-mono font-black text-lg flex items-center justify-center shadow-xs shrink-0 tracking-tight">
              {profile.symbol}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-zinc-100 tracking-tight">
                  {profile.koreanName}
                </h1>
                <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono hidden sm:inline">
                  {profile.name}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${sessionBadge.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sessionBadge.dot}`} />
                  <span>{sessionBadge.label}</span>
                </span>
                <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                  {profile.sector}
                </span>
              </div>
            </div>
          </div>

          {/* Price & Change Display */}
          <div className="flex items-baseline gap-2.5 pl-0 sm:pl-3 sm:border-l border-slate-200 dark:border-zinc-800">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-100 font-mono tracking-tight tabular-nums">
              {formatCurrency(headlinePrice)}
            </span>
            <div className={`flex items-center gap-1 text-xs sm:text-sm font-black font-mono tabular-nums ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4 stroke-[2.5]" /> : <TrendingDown className="w-4 h-4 stroke-[2.5]" />}
              <span>{isPositive ? '+' : ''}{headlineChange?.toFixed(2)}</span>
              <span>({formatPercent(headlineChangePercent)})</span>
            </div>
          </div>
        </div>

        {/* Center: 5-Min Intraday Mini Sparkline */}
        {candles && candles.length > 0 && (
          <div className="hidden md:block w-48 sm:w-56 h-12 shrink-0">
            <IntradayMiniChart
              candles={candles}
              previousClose={regPrevClose}
              currentPrice={headlinePrice}
              symbol={profile.symbol}
            />
          </div>
        )}

        {/* Right: Key Quick Stats (52W Range, Market Cap, Fwd PE, Target) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap lg:flex-nowrap shrink-0">
          {/* 52W Range Micro Bar */}
          <div className="min-w-[120px] sm:min-w-[140px] p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-[11px]">
            <div className="flex justify-between text-slate-400 dark:text-zinc-500 font-medium mb-1">
              <span>52주 범위</span>
              <span className="font-mono text-slate-700 dark:text-zinc-300 font-bold">{pos52.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pos52}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-1">
              <span>${low52.toFixed(0)}</span>
              <span>${high52.toFixed(0)}</span>
            </div>
          </div>

          {/* Market Cap & Forward PE */}
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-[11px] space-y-0.5">
            <div className="text-slate-400 dark:text-zinc-500">시가총액</div>
            <div className="font-black text-slate-900 dark:text-zinc-100 font-mono text-xs">
              {formatLargeNumber(fundamentals.marketCap || 5.1e12)}
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-[11px] space-y-0.5">
            <div className="text-slate-400 dark:text-zinc-500">Forward PER</div>
            <div className="font-black text-slate-900 dark:text-zinc-100 font-mono text-xs">
              {fundamentals.forwardPE ? `${fundamentals.forwardPE.toFixed(1)}x` : '30.2x'}
            </div>
          </div>

          {/* Wall Street Mean Target */}
          <div className="p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-[11px] space-y-0.5">
            <div className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center justify-between gap-1">
              <span>월가 목표가</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+{upsidePercent}%</span>
            </div>
            <div className="font-black text-emerald-800 dark:text-emerald-300 font-mono text-xs">
              {formatCurrency(targetMean)}
            </div>
          </div>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-zinc-400 dark:hover:text-emerald-400 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 transition-colors cursor-pointer shrink-0"
              title="데이터 실시간 새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
