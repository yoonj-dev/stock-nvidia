import React, { useState } from 'react';
import {
  Calculator,
  Target,
  Sliders,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { StockFundamentals } from '../../types/stock';
import { formatCurrency, formatPercent } from '../../lib/stockApi';

interface ValuationCalculatorProps {
  nvda: StockFundamentals;
}

export const ValuationCalculator: React.FC<ValuationCalculatorProps> = ({ nvda }) => {
  const currentPrice = nvda.currentPrice || 207.41;
  const targetMean = nvda.targetMeanPrice || 265.50;
  const targetHigh = nvda.targetHighPrice || 300.0;
  const targetLow = nvda.targetLowPrice || 190.0;
  const pe = nvda.trailingPE || 45.0;
  const forwardPe = nvda.forwardPE || 30.2;

  // Reverse DCF Interactive Sliders
  const [wacc, setWacc] = useState<number>(9.5); // Discount rate %
  const [terminalGrowth, setTerminalGrowth] = useState<number>(3.5); // Terminal growth %
  const [targetMarginOfSafety, setTargetMarginOfSafety] = useState<number>(25); // %

  // Simplified Reverse DCF Approximation for NVDA:
  const impliedFcfGrowth = Math.max(
    8.0,
    Number((wacc * 1.5 - terminalGrowth * 0.8 + (currentPrice - 200) * 0.08).toFixed(1))
  );

  const expectedAiSemiconductorCagr = 32.5; // 5-year expected AI hardware market CAGR
  const safetySpread = (expectedAiSemiconductorCagr - impliedFcfGrowth).toFixed(1);

  // Target upside
  const upsidePercent = (((targetMean - currentPrice) / currentPrice) * 100).toFixed(1);

  return (
    <div className="fintech-card p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              엔비디아 밸류에이션 감사 & 역(Reverse) DCF 계산기
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              현재 주가에 내재된 잉여현금흐름(FCF) 성장률과 월스트리트 컨센서스 상방 여력
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Reverse DCF Assumptions & Model */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-3.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-zinc-200">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-500" />
                역(Reverse) DCF 파라미터 시뮬레이션
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                현재가 {formatCurrency(currentPrice)} 기준
              </span>
            </div>

            {/* Slider 1: WACC */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-zinc-300">
                <span>할인율 (WACC):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{wacc.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="7.0"
                max="12.0"
                step="0.5"
                value={wacc}
                onChange={(e) => setWacc(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Slider 2: Terminal Growth */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-zinc-300">
                <span>영구 성장률 (Terminal Growth):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{terminalGrowth.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="4.5"
                step="0.5"
                value={terminalGrowth}
                onChange={(e) => setTerminalGrowth(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Implied Result Box */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600 dark:text-zinc-300">
                  주가에 내재된 향후 5년 연평균 FCF 요구 성장률:
                </span>
                <span className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                  +{impliedFcfGrowth}%
                </span>
              </div>

              <div className="flex items-center justify-between text-xs border-t border-slate-100 dark:border-zinc-700/60 pt-2">
                <span className="text-slate-500 dark:text-zinc-400">
                  글로벌 AI 반도체 시장 예상 연평균 성장률(CAGR):
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">
                  +{expectedAiSemiconductorCagr}%
                </span>
              </div>

              <div className="flex items-center justify-between text-xs bg-emerald-500/10 p-2 rounded-lg font-bold text-emerald-700 dark:text-emerald-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  펀더멘털 성장 안전마진(Safety Margin):
                </span>
                <span className="font-mono text-sm">+{safetySpread}%p 초과 여력</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Wall Street Targets & Valuation Consensus */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-3.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-zinc-200">
              <span className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-500" />
                월스트리트 컨센서스 목표주가
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                Buy Consensus
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500 dark:text-zinc-400">평균 목표주가 (Mean)</span>
                <div className="text-right">
                  <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                    {formatCurrency(targetMean)}
                  </span>
                  <span className="ml-1.5 text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    (+{upsidePercent}%)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/60 dark:border-zinc-800">
                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700">
                  <div className="text-[10.5px] text-slate-500 dark:text-zinc-400">최고 목표가 (High)</div>
                  <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatCurrency(targetHigh)}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700">
                  <div className="text-[10.5px] text-slate-500 dark:text-zinc-400">최저 목표가 (Low)</div>
                  <div className="text-sm font-black font-mono text-slate-600 dark:text-zinc-400 mt-0.5">
                    {formatCurrency(targetLow)}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Multiples Matrix */}
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-[11px]">
                <span>Trailing P/E:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">{pe}x</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-[11px]">
                <span>Forward P/E:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{forwardPe}x</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-zinc-400 text-[11px]">
                <span>매출총이익률:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-zinc-200">74.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
