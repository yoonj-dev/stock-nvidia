import React, { useState, useRef, useEffect } from 'react';
import {
  MoreVertical,
  Sun,
  Moon,
  Laptop,
  Beer,
  ExternalLink,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { ThemeMode, applyThemeToDom } from '../../lib/theme';
import { formatCurrency, formatPercent } from '../../lib/stockApi';
import { StockFundamentals } from '../../types/stock';

interface HeaderProps {
  currentThemeMode: ThemeMode;
  onThemeModeChanged: (mode: ThemeMode) => void;
  nvda: StockFundamentals;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentThemeMode,
  onThemeModeChanged,
  nvda,
  isRefreshing,
  onRefresh,
}) => {
  // Rule 6: Responsive dropdown target separation to avoid dual mount collisions
  const [menuTarget, setMenuTarget] = useState<'mobile' | 'desktop' | null>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuTarget === 'desktop' &&
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(target)
      ) {
        setMenuTarget(null);
      }
      if (
        menuTarget === 'mobile' &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        setMenuTarget(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuTarget]);

  const handleSelectThemeMode = (mode: ThemeMode) => {
    onThemeModeChanged(mode);
    applyThemeToDom(mode);
    setMenuTarget(null);
  };

  // Rule 2: Open donate modal via BrandUI or fallback
  const handleOpenDonate = () => {
    setMenuTarget(null);
    if ((window as any).BrandUI?.openDonate) {
      (window as any).BrandUI.openDonate();
      return;
    }
    const beerBtn = document.getElementById('beer-btn');
    if (beerBtn) {
      beerBtn.click();
      return;
    }
    window.open('https://brand-ui.on-tap.xyz/donate', '_blank', 'noopener,noreferrer');
  };

  const getHeaderTickerMetrics = (stock: StockFundamentals) => {
    const state = (stock.marketState || '').toUpperCase();
    if (state.includes('PRE') && stock.preMarketPrice) {
      return {
        price: stock.preMarketPrice,
        changePercent: stock.preMarketChangePercent ?? stock.changePercent,
        tag: 'PRE',
      };
    }
    if (state.includes('POST') && stock.postMarketPrice) {
      return {
        price: stock.postMarketPrice,
        changePercent: stock.postMarketChangePercent ?? stock.changePercent,
        tag: 'POST',
      };
    }
    if (state.includes('OVERNIGHT') && (stock.postMarketPrice || stock.preMarketPrice)) {
      return {
        price: stock.postMarketPrice || stock.preMarketPrice!,
        changePercent: stock.postMarketChangePercent ?? stock.changePercent,
        tag: '24H',
      };
    }
    return {
      price: stock.regularMarketPrice ?? stock.currentPrice,
      changePercent: stock.regularMarketChangePercent ?? stock.changePercent,
      tag: null,
    };
  };

  const nvdaMetrics = getHeaderTickerMetrics(nvda);

  const renderThemePill = (mode: ThemeMode, label: string, icon: React.ReactNode) => {
    const isSelected = currentThemeMode === mode;
    return (
      <button
        onClick={() => handleSelectThemeMode(mode)}
        className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
          isSelected
            ? 'bg-emerald-600 text-white font-bold shadow-xs'
            : 'text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  const renderDropdownMenu = () => (
    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl z-50 p-2 text-xs divide-y divide-slate-100 dark:divide-zinc-800 animate-in fade-in slide-in-from-top-2 duration-150">
      {/* 3-State Theme Selector */}
      <div className="p-2 space-y-1.5">
        <div className="text-[10px] font-semibold text-slate-400 dark:text-zinc-400 uppercase tracking-wider">
          테마 모드 (3-State)
        </div>
        <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl">
          {renderThemePill('auto', '자동', <Laptop className="w-3.5 h-3.5" />)}
          {renderThemePill('light', '라이트', <Sun className="w-3.5 h-3.5" />)}
          {renderThemePill('dark', '다크', <Moon className="w-3.5 h-3.5" />)}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-2 space-y-1">
        <button
          onClick={() => {
            setMenuTarget(null);
            onRefresh();
          }}
          disabled={isRefreshing}
          className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-left"
        >
          <span className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 text-emerald-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>실시간 시세 갱신</span>
          </span>
        </button>
      </div>

      {/* Mandatory Support & Ecosystem section per UI/UX Standard */}
      <div className="p-2 space-y-1">
        <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 dark:text-zinc-400 uppercase tracking-wider">
          Support & Ecosystem
        </div>
        <a
          href="https://stock.on-tap.xyz/?symbol=NVDA"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuTarget(null)}
          className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 transition-colors font-medium"
        >
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>📈 Stock on Tap (NVDA 퀀트)</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </a>
        <a
          href="https://google.on-tap.xyz"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMenuTarget(null)}
          className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 transition-colors font-medium"
        >
          <span className="flex items-center gap-2">
            <span>🌐 Alphabet on Tap</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </a>
        <button
          onClick={handleOpenDonate}
          data-brand-open-donate="true"
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-700 dark:text-amber-400 transition-colors text-left font-medium"
        >
          <Beer className="w-4 h-4 text-amber-500" />
          <span>🍺 Buy me a beer (후원하기)</span>
        </button>
        <a
          href="https://dev.on-tap.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>🚀 개발자 페이지 (On Tap)</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </a>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#76b900] via-[#10b981] to-[#047857] p-0.5 shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[10px] flex items-center justify-center">
                <span className="text-base font-black bg-gradient-to-r from-[#76b900] to-[#10b981] bg-clip-text text-transparent">
                  N
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  NVIDIA
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  ON TAP
                </span>
              </div>
              <p className="text-[10.5px] font-mono text-slate-400 dark:text-zinc-400 hidden sm:block">
                NVIDIA (NVDA) INVESTOR INTELLIGENCE HUB
              </p>
            </div>
          </a>
        </div>

        {/* Center: Real-time NVDA Ticker Quick Pill */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-900/90 border border-slate-200/80 dark:border-zinc-800 px-3 py-1.5 rounded-xl text-xs">
          <span className="font-bold text-slate-900 dark:text-white">NVDA</span>
          <span className="font-mono font-semibold text-slate-800 dark:text-zinc-200">
            {formatCurrency(nvdaMetrics.price)}
          </span>
          <span
            className={`font-mono text-[11px] font-bold ${
              (nvdaMetrics.changePercent || 0) >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {formatPercent(nvdaMetrics.changePercent)}
          </span>
          {nvdaMetrics.tag && (
            <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {nvdaMetrics.tag}
            </span>
          )}
        </div>

        {/* Right: Stock on Tap Link, Refresh & 3-Dot Context Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Stock on Tap Header Link */}
          <a
            href="https://stock.on-tap.xyz/?symbol=NVDA"
            target="_blank"
            rel="noopener noreferrer"
            title="Stock on Tap 전체 주식 퀀트 플랫폼으로 이동"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/70 hover:bg-emerald-100/80 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all shrink-0 shadow-2xs"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-[11.5px] sm:text-xs font-bold whitespace-nowrap">Stock on Tap</span>
            <ExternalLink className="w-3 h-3 opacity-60 hidden sm:inline shrink-0" />
          </a>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="실시간 시세 새로고침"
            className="p-2 rounded-xl text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors hidden sm:flex items-center justify-center cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
          </button>

          {/* Desktop ⋯ Context Menu */}
          <div className="relative hidden md:block" ref={desktopMenuRef}>
            <button
              onClick={() => setMenuTarget((prev) => (prev === 'desktop' ? null : 'desktop'))}
              data-brand-context-menu="true"
              className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-200 dark:border-zinc-800 transition-colors"
              aria-label="더보기 메뉴"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuTarget === 'desktop' && renderDropdownMenu()}
          </div>

          {/* Mobile ⋯ Context Menu */}
          <div className="relative md:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => setMenuTarget((prev) => (prev === 'mobile' ? null : 'mobile'))}
              data-brand-context-menu="true"
              className="p-2 rounded-xl text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 border border-slate-200 dark:border-zinc-800 transition-colors"
              aria-label="더보기 메뉴"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuTarget === 'mobile' && renderDropdownMenu()}
          </div>
        </div>
      </div>
    </header>
  );
};
