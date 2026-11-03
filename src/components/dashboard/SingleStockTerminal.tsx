import React, { useState } from 'react';
import {
  Sparkles,
  BrainCircuit,
  Layers,
  Calculator,
} from 'lucide-react';
import { StockFundamentals, Candle } from '../../types/stock';
import { SingleStockProfile } from '../../types/stockConfig';
import { StockTickerRibbon } from './StockTickerRibbon';
import { QuantInsightDock } from './QuantInsightDock';
import { LocalLlmSynthesizer } from './LocalLlmSynthesizer';
import { NvidiaFourPillars } from './NvidiaFourPillars';
import { CompanyPillars } from './CompanyPillars';
import { ValuationCalculator } from './ValuationCalculator';
import { BespokeStockSlot } from '../bespoke/BespokeStockSlot';

export type WorkspaceTabId = 'bespoke' | 'moat' | 'ai_memo' | 'valuation' | 'chart';

interface SingleStockTerminalProps {
  profile: SingleStockProfile;
  fundamentals: StockFundamentals;
  candles?: Candle[];
  resolvedTheme: 'dark' | 'light';
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onSelectSymbol?: (symbol: string) => void;
}

export const SingleStockTerminal: React.FC<SingleStockTerminalProps> = ({
  profile,
  fundamentals,
  candles = [],
  isRefreshing = false,
  onRefresh,
  onSelectSymbol,
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTabId>('bespoke');

  const TABS = [
    {
      id: 'bespoke' as const,
      domId: 'section-bespoke',
      label: `${profile.koreanName} 특화 딥다이브`,
      shortLabel: '특화 데이터',
      icon: <Sparkles className="w-4 h-4" />,
      badge: '독자조사',
    },
    {
      id: 'moat' as const,
      domId: 'section-moat',
      label: '핵심 비즈니스 엔진 & 해자',
      shortLabel: '사업부 해자',
      icon: <Layers className="w-4 h-4" />,
      badge: 'Moat',
    },
    {
      id: 'ai_memo' as const,
      domId: 'section-ai-memo',
      label: 'AI 기관 리서치 메모',
      shortLabel: 'AI 리포트',
      icon: <BrainCircuit className="w-4 h-4" />,
      badge: 'Gemma 4',
    },
    {
      id: 'valuation' as const,
      domId: 'section-valuation',
      label: '역DCF 내재가치 모델',
      shortLabel: '역DCF 모델',
      icon: <Calculator className="w-4 h-4" />,
      badge: '내재성장률',
    },
  ];

  const scrollToSection = (tabId: WorkspaceTabId, domId: string) => {
    setActiveTab(tabId);
    const el = document.getElementById(domId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Base Header: Stock Switcher, Live Ground-Truth Price & Stock on Tap Jump */}
      <StockTickerRibbon
        profile={profile}
        fundamentals={fundamentals}
        candles={candles}
        isRefreshing={isRefreshing}
        onRefresh={onRefresh}
        onSelectSymbol={onSelectSymbol}
      />

      {/* 2. Bento Interactive Terminal (12-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
        {/* Left Column (8 cols): Bespoke Stock Slot + Common Deep Research Modules */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick-Jump Navigation Ribbon (Sticky) */}
          <div className="sticky top-16 z-20 p-1.5 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200/90 dark:border-zinc-800 shadow-sm flex items-center justify-between overflow-x-auto no-scrollbar gap-1">
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => scrollToSection(tab.id, tab.domId)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? `${profile.themeClasses.activeTab} shadow-xs`
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                    <span
                      className={`text-[9px] font-mono px-1 rounded ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 hidden md:inline px-2 font-medium">
              종목별 특화 딥다이브 슬롯
            </span>
          </div>

          {/* Section 1 (BESPOKE SLOT): Stock-Specific Custom UI & Proprietary Researched Data */}
          <section id="section-bespoke" className="scroll-mt-32 space-y-2">
            <BespokeStockSlot profile={profile} fundamentals={fundamentals} />
          </section>

          {/* Section 2: Core Business Engines & Moats */}
          <section id="section-moat" className="scroll-mt-32 space-y-2">
            <div className="flex items-center justify-between px-1 pt-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <Layers className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  {profile.koreanName} 핵심 비즈니스 엔진 및 기술적 해자
                </h3>
              </div>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 font-mono">
                사업부별 구조적 Moat
              </span>
            </div>
            {profile.symbol === 'GOOGL' || profile.symbol === 'GOOG' ? (
              <CompanyPillars profile={profile} />
            ) : profile.pillars && profile.pillars.length > 0 ? (
              <CompanyPillars profile={profile} />
            ) : (
              <NvidiaFourPillars />
            )}
          </section>

          {/* Section 3: AI Institutional Research Memo */}
          <section id="section-ai-memo" className="scroll-mt-32 space-y-2">
            <div className="flex items-center justify-between px-1 pt-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                  <BrainCircuit className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  AI 기관 퀀트 리서치 메모
                </h3>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                Gemma 4 로컬 리서치 모델 합성
              </span>
            </div>
            <LocalLlmSynthesizer nvda={fundamentals} />
          </section>

          {/* Section 4: Reverse DCF Valuation Model */}
          <section id="section-valuation" className="scroll-mt-32 space-y-2">
            <div className="flex items-center justify-between px-1 pt-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                  <Calculator className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  역DCF(Reverse DCF) 내재 기대성장률 역산 모델
                </h3>
              </div>
              <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 font-mono">
                현재 주가가 요구하는 10년 FCF 성장률 검증
              </span>
            </div>
            <ValuationCalculator nvda={fundamentals} />
          </section>
        </div>

        {/* Right Column (4 cols): Sticky Quant Insight Dock */}
        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
          <QuantInsightDock
            profile={profile}
            fundamentals={fundamentals}
            onOpenTab={(tabId) => {
              const matched = TABS.find((t) => t.id === tabId);
              if (matched) scrollToSection(matched.id, matched.domId);
            }}
          />
        </div>
      </div>
    </div>
  );
};
