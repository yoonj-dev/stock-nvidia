import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw, ExternalLink, Sparkles } from 'lucide-react';
import { StockFundamentals, Candle } from '../../types/stock';
import { SingleStockProfile } from '../../types/stockConfig';
import { formatCurrency, formatPercent } from '../../lib/stockApi';

interface StockTickerRibbonProps {
  profile: SingleStockProfile;
  fundamentals: StockFundamentals;
  candles?: Candle[];
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onSelectSymbol?: (symbol: string) => void;
}

export type MarketSession = 'REGULAR' | 'POST' | 'PRE' | 'OVERNIGHT' | 'CLOSED';

const DEEP_STOCK_ITEMS = [
  { symbol: 'GOOGL', label: 'GOOGL · 알파벳' },
  { symbol: 'NVDA', label: 'NVDA · 엔비디아' },
  { symbol: 'TSLA', label: 'TSLA · 테슬라' },
  { symbol: 'SPCX', label: 'SPCX · 스페이스X' },
];

export const StockTickerRibbon: React.FC<StockTickerRibbonProps> = ({
  profile,
  fundamentals,
  isRefreshing = false,
  onRefresh,
  onSelectSymbol,
}) => {
  // 1. Determine Market Session (REGULAR / PRE / POST / OVERNIGHT / CLOSED)
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

  // 2. Ground-Truth Live Price & Change (synced from stock-api)
  const headlinePrice = fundamentals.currentPrice || fundamentals.regularMarketPrice || 0;
  const prevClose = fundamentals.previousClose || fundamentals.regularMarketPreviousClose || headlinePrice;
  const headlineChange =
    fundamentals.change != null ? fundamentals.change : headlinePrice - prevClose;
  const headlineChangePercent =
    fundamentals.changePercent != null
      ? fundamentals.changePercent
      : prevClose > 0
      ? (headlineChange / prevClose) * 100
      : 0;
  const isPositive = headlineChange >= 0;

  const sessionBadge = {
    REGULAR: {
      label: 'REG · 정규장 실시간',
      dot: 'bg-emerald-500 animate-pulse',
      bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    },
    PRE: {
      label: 'PRE · 프리마켓',
      dot: 'bg-amber-500 animate-pulse',
      bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
    },
    POST: {
      label: 'POST · 애프터마켓',
      dot: 'bg-indigo-500 animate-pulse',
      bg: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/25',
    },
    OVERNIGHT: {
      label: 'OVE · 오버나이트',
      dot: 'bg-purple-500',
      bg: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/25',
    },
    CLOSED: {
      label: 'CLOSED · 장 마감',
      dot: 'bg-slate-400',
      bg: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border-slate-200 dark:border-zinc-700',
    },
  }[session];

  const handleSwitchStock = (sym: string) => {
    if (onSelectSymbol) {
      onSelectSymbol(sym);
    } else {
      const domainMap: Record<string, string> = { GOOGL: "https://google.on-tap.xyz", NVDA: "https://nvda.on-tap.xyz", TSLA: "https://tsla.on-tap.xyz", SPCX: "https://spacex.on-tap.xyz" }; if (window.location.hostname.includes("deep.stock")) { window.location.hash = `company/${sym}`; } else if (domainMap[sym]) { window.location.href = domainMap[sym]; }
    }
  };

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 p-3.5 sm:p-4 shadow-sm space-y-3">
      {/* Top Row: Quick Deep Stock Switcher & Stock on Tap Link */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-slate-500 dark:text-zinc-400 mr-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>개별주식 Deep Stock:</span>
          </span>
          {DEEP_STOCK_ITEMS.map((item) => {
            const active =
              profile.symbol.toUpperCase() === item.symbol ||
              (profile.symbol.toUpperCase() === 'GOOG' && item.symbol === 'GOOGL');
            return (
              <button
                key={item.symbol}
                type="button"
                onClick={() => handleSwitchStock(item.symbol)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  active
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`https://stock.on-tap.xyz/?symbol=${profile.symbol}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 transition-colors shadow-xs"
            title="일반 차트·보조지표·기본 재무제표는 Stock on Tap에서 확인"
          >
            <span>📊 Stock on Tap (기본 시세·차트)</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:text-zinc-400 dark:hover:text-teal-400 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 transition-colors cursor-pointer"
              title="stock-api 최신 가격 동기화"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-teal-600' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Main Row: Company Identity + Single Ground-Truth Price */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-teal-600 text-white font-mono font-black text-base flex items-center justify-center shadow-xs shrink-0">
            {profile.symbol}
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
                {profile.koreanName}
              </h1>
              <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
                {profile.name}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${sessionBadge.bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${sessionBadge.dot}`} />
                <span>{sessionBadge.label}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              기본 시세·차트 너머의 <strong>기업별 특화 단위 경제학 · 독자 조사 데이터 · SOTP/역DCF</strong> 심층 분석 워크스페이스
            </p>
          </div>
        </div>

        {/* Ground-Truth Live Price Block */}
        <div className="flex items-baseline gap-2.5 sm:text-right">
          <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-100 font-mono tracking-tight tabular-nums">
            {formatCurrency(headlinePrice)}
          </span>
          <div
            className={`flex items-center gap-1 text-xs sm:text-sm font-black font-mono tabular-nums ${
              isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            ) : (
              <TrendingDown className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>
              {isPositive ? '+' : ''}
              {headlineChange.toFixed(2)}
            </span>
            <span>({formatPercent(headlineChangePercent)})</span>
          </div>
          {prevClose > 0 && (
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 hidden md:inline">
              전일종가 ${prevClose.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
