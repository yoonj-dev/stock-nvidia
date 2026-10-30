import React from 'react';
import { ExternalLink, Heart, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 py-8 safe-bottom transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                NVIDIA on Tap
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                v1.0.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              엔비디아(NVIDIA · NVDA) 올인원 주식 퀀트 리서치 & 기관 인텔리전스 허브
            </p>
          </div>

          {/* Ecosystem Navigation */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-600 dark:text-zinc-400">
            <a
              href="https://stock.on-tap.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <span>Stock on Tap</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300 dark:text-zinc-700">·</span>
            <a
              href="https://google.on-tap.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
            >
              <span>Alphabet on Tap</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300 dark:text-zinc-700">·</span>
            <a
              href="https://alpha.on-tap.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <span>Alpha on Tap</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300 dark:text-zinc-700">·</span>
            <a
              href="https://dev.on-tap.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors"
            >
              <span>🚀 On Tap Developer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 rounded-xl bg-slate-100/60 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/60 text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed space-y-1">
          <div className="flex items-center gap-1 font-bold text-slate-700 dark:text-zinc-300">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>투자 유의사항 및 면책 조항</span>
          </div>
          <p>
            본 웹 서비스는 엔비디아(NVIDIA Corporation) 투자자 및 주식 연구자를 위한 퀀트 데이터 분석 및 AI 리서치 보조 도구이며, 어떠한 금융 투자 권유나 종목 추천을 목적으로 하지 않습니다. 모든 데이터와 AI 리서치 분석 결과는 시장 상황에 따라 지연 및 오차가 발생할 수 있으므로 최종 투자 결정과 책임은 투자자 본인에게 있습니다.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-zinc-400 pt-2 border-t border-slate-100 dark:border-zinc-900">
          <p>© {new Date().getFullYear()} NVIDIA on Tap · Built for AI Semiconductor Investors.</p>
          <p className="flex items-center gap-1 mt-1 sm:mt-0">
            Crafted with <Heart className="w-3 h-3 text-rose-500 fill-current" /> by YoonJ Dev & Antigravity
          </p>
        </div>
      </div>
    </footer>
  );
};
