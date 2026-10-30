import React, { useState } from 'react';
import {
  BarChart3,
  Gauge,
  Layers,
  LineChart,
  Calendar,
} from 'lucide-react';
import { TradingViewChart } from '../tradingview/TradingViewChart';
import { TradingViewTechGauge } from '../tradingview/TradingViewTechGauge';
import { TradingViewFinancials } from '../tradingview/TradingViewFinancials';
import { TradingViewComparison } from '../tradingview/TradingViewComparison';

interface TradingViewSectionProps {
  theme: 'dark' | 'light';
}

type ChartTab = 'candlestick' | 'gauge' | 'comparison' | 'financials';

export const TradingViewSection: React.FC<TradingViewSectionProps> = ({
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<ChartTab>('candlestick');
  const [interval, setInterval] = useState<string>('D');

  return (
    <div className="fintech-card p-5 space-y-4">
      {/* Top Header & Ticker / Interval Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              트레이딩뷰(TradingView) 실시간 인텔리전스
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              기관급 실시간 차트, 보조지표, 기술적 게이지 및 AI 반도체 피어 그룹 비교
            </p>
          </div>
        </div>

        {/* Ticker Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl text-xs font-bold">
            <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-xs">
              NVDA (NVIDIA)
            </span>
          </div>

          {/* Timeframe intervals (only active for candlestick chart) */}
          {activeTab === 'candlestick' && (
            <div className="flex items-center bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl text-xs font-semibold">
              {[
                { label: '5분', val: '5' },
                { label: '15분', val: '15' },
                { label: '1시간', val: '60' },
                { label: '일봉', val: 'D' },
                { label: '주봉', val: 'W' },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setInterval(item.val)}
                  className={`px-2 py-1 rounded-lg transition-all ${
                    interval === item.val
                      ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl text-xs font-medium w-fit">
        <button
          onClick={() => setActiveTab('candlestick')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'candlestick'
              ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>실시간 캔들차트</span>
        </button>

        <button
          onClick={() => setActiveTab('gauge')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'gauge'
              ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>기술적 지표 게이지</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'comparison'
              ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>AI 반도체 피어 수익률 비교</span>
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'financials'
              ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>재무제표 & 마진 시각화</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="w-full">
        {activeTab === 'candlestick' && (
          <TradingViewChart
            symbol="NVDA"
            theme={theme}
            interval={interval}
            height={520}
          />
        )}

        {activeTab === 'gauge' && (
          <TradingViewTechGauge
            symbol="NVDA"
            theme={theme}
            height={460}
          />
        )}

        {activeTab === 'comparison' && (
          <TradingViewComparison
            theme={theme}
            height={480}
          />
        )}

        {activeTab === 'financials' && (
          <TradingViewFinancials
            symbol="NVDA"
            theme={theme}
            height={520}
          />
        )}
      </div>
    </div>
  );
};
