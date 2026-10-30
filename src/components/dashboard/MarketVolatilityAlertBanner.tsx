import React, { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Compass,
  FileText,
  Sparkles,
  Scale,
  Cpu,
  Server,
  Globe2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { MarketVolatilityAlert, EarningsFlash, MajorIssueCategory } from '../../types/stock';
import { EarningsFlashBanner } from './EarningsFlashBanner';

interface MarketVolatilityAlertBannerProps {
  alert?: MarketVolatilityAlert;
  flash?: EarningsFlash;
  liveChangePercent?: number;
  ticker?: string;
}

export const MarketVolatilityAlertBanner: React.FC<MarketVolatilityAlertBannerProps> = ({
  alert,
  flash,
  liveChangePercent = 0,
  ticker = 'NVDA',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showEarningsModal, setShowEarningsModal] = useState<boolean>(false);

  // Trigger if backend marked triggered (price volatility OR major catalyst) OR client-side live change >= 3%
  const isTriggered = Boolean(alert?.triggered || Math.abs(liveChangePercent) >= 3.0);

  // If no major alert is active (< 3% change and no major issues), render standard earnings / schedule banner
  if (!isTriggered) {
    return <EarningsFlashBanner flash={flash} />;
  }

  const category: MajorIssueCategory = alert?.category || 'PRICE_VOLATILITY';
  const isPlunge = (alert?.direction === 'PLUNGE') || liveChangePercent < 0;
  const pctDisplay = alert?.changePercent != null
    ? `${alert.changePercent > 0 ? '+' : ''}${alert.changePercent.toFixed(2)}%`
    : `${liveChangePercent > 0 ? '+' : ''}${liveChangePercent.toFixed(2)}%`;

  // Theme configuration based on detected major issue category
  const getThemeClasses = () => {
    switch (category) {
      case 'BLACKWELL_AI_CHIPS':
        return {
          wrapper: 'bg-gradient-to-r from-emerald-500/12 via-teal-500/10 to-indigo-500/10 dark:from-emerald-500/20 dark:via-teal-500/15 dark:to-zinc-900 border-emerald-500/35 dark:border-emerald-400/35',
          badge: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
          icon: <Cpu className="w-3.5 h-3.5 stroke-[2.5]" />,
          title: `🚀 [Blackwell 차세대 칩 양산 혁신] GB200 NVL72 랙 양산 및 수율 모멘텀 (${pctDisplay})`,
        };
      case 'DATACENTER_HYPERSCALER':
        return {
          wrapper: 'bg-gradient-to-r from-blue-500/12 via-cyan-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:via-cyan-500/15 dark:to-zinc-900 border-blue-500/35 dark:border-blue-400/35',
          badge: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
          icon: <Server className="w-3.5 h-3.5 stroke-[2.5]" />,
          title: `🏢 [데이터센터 수주 폭발] 빅테크 AI CapEx 상향 및 가속기 독점 수주 (${pctDisplay})`,
        };
      case 'EXPORT_CONTROLS_GEOPOLITICS':
        return {
          wrapper: 'bg-gradient-to-r from-purple-500/12 via-indigo-500/10 to-slate-500/10 dark:from-purple-500/20 dark:via-indigo-500/15 dark:to-zinc-900 border-purple-500/35 dark:border-purple-400/35',
          badge: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
          icon: <Globe2 className="w-3.5 h-3.5 stroke-[2.5]" />,
          title: `⚠️ [지정학·수출 통제] 미 상무부 대중국 반도체 규제 및 라이선스 이슈 (${pctDisplay})`,
        };
      case 'CUSTOM_SILICON_COMPETITION':
        return {
          wrapper: 'bg-gradient-to-r from-amber-500/12 via-orange-500/10 to-slate-500/10 dark:from-amber-500/20 dark:via-orange-500/15 dark:to-zinc-900 border-amber-500/35 dark:border-amber-400/35',
          badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
          icon: <Scale className="w-3.5 h-3.5 stroke-[2.5]" />,
          title: `⚡ [경쟁 구도 점검] 빅테크 자체 ASIC 대비 CUDA 소프트웨어 해자 (${pctDisplay})`,
        };
      case 'EARNINGS_CATALYST':
        return {
          wrapper: 'bg-gradient-to-r from-amber-500/12 via-rose-500/10 to-indigo-500/10 dark:from-amber-500/20 dark:via-rose-500/15 dark:to-zinc-900 border-amber-500/35 dark:border-amber-400/35',
          badge: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
          icon: <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />,
          title: `📊 [공식 실적 속보] ${flash?.quarter || '최근 분기'} 실적 및 마진율 가이던스 진단 (${pctDisplay})`,
        };
      case 'PRICE_VOLATILITY':
      default:
        if (isPlunge) {
          return {
            wrapper: 'bg-gradient-to-r from-rose-500/12 via-amber-500/10 to-slate-500/10 dark:from-rose-500/20 dark:via-amber-500/15 dark:to-zinc-900 border-rose-500/35 dark:border-rose-400/35',
            badge: 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
            icon: <TrendingDown className="w-3.5 h-3.5 animate-bounce stroke-[2.5]" />,
            title: `🚨 3% 이상 대규모 급락 긴급 진단 (${pctDisplay})`,
          };
        } else {
          return {
            wrapper: 'bg-gradient-to-r from-emerald-500/12 via-blue-500/10 to-indigo-500/10 dark:from-emerald-500/20 dark:via-blue-500/15 dark:to-zinc-900 border-emerald-500/35 dark:border-emerald-400/35',
            badge: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
            icon: <TrendingUp className="w-3.5 h-3.5 animate-bounce stroke-[2.5]" />,
            title: `🚀 3% 이상 대규모 급등 랠리 긴급 진단 (${pctDisplay})`,
          };
        }
    }
  };

  const theme = getThemeClasses();

  return (
    <div className="w-full space-y-2">
      <div className={`w-full rounded-2xl transition-all duration-200 border p-3.5 sm:p-4 shadow-sm ${theme.wrapper}`}>
        {/* Top Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Badge & Quick Headline */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs border ${theme.badge}`}>
              {theme.icon}
              <span>{theme.title}</span>
            </span>

            <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
              {alert?.triggerReason === 'BOTH'
                ? '대규모 가격 급변 및 중대 촉매 동시 감지'
                : alert?.triggerReason === 'MAJOR_CATALYST'
                ? '글로벌 주요 이슈 감지'
                : '변동성 임계치(3.0%) 초과 감지'}{' '}
              · {alert?.detectedAt || '실시간 퀀트 조사'}
            </span>
          </div>

          {/* Right: Quick Action Buttons & Expand Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {flash?.quarter && (
              <button
                onClick={() => setShowEarningsModal(!showEarningsModal)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-zinc-800/90 text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-xs font-semibold transition-all cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>공식 실적 지표</span>
              </button>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-zinc-800/90 text-slate-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <span>{isExpanded ? '접기' : '상세 원인 보기'}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Headline & Primary Cause Banner */}
        <div className="mt-2.5 space-y-1">
          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{alert?.headline || `${ticker} 중대 시장 이슈`}</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
            {alert?.primaryReason}
          </p>
        </div>

        {/* Collapsible Content: Drivers + Verdict + Action Guide */}
        {isExpanded && (
          <div className="mt-4 pt-3.5 border-t border-slate-200/60 dark:border-zinc-700/60 space-y-3.5 animate-in fade-in duration-200">
            {/* 3 Major Structural Drivers */}
            {alert?.drivers && alert.drivers.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-zinc-200">
                  <FileText className="w-3.5 h-3.5 text-emerald-500" />
                  <span>핵심 3대 분석 동인 (Key Catalysts & Drivers)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {alert.drivers.map((d, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-1"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-zinc-200">
                        <span className={`w-2 h-2 rounded-full ${
                          d.type === 'positive'
                            ? 'bg-emerald-500'
                            : d.type === 'negative'
                            ? 'bg-rose-500'
                            : d.type === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`} />
                        <span>{d.title}</span>
                      </div>
                      <p className="text-[11.5px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                        {d.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Institutional Verdict & Action Guide (Side-by-side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {/* Verdict */}
              <div className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>기관 퀀트 최종 진단 (Institutional Verdict)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {alert?.institutionalVerdict}
                </p>
              </div>

              {/* Action Guide */}
              <div className="p-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <Compass className="w-3.5 h-3.5" />
                  <span>투자자 대응 가이드라인 (Action Guide)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">
                  {alert?.actionGuide}
                </p>
              </div>
            </div>

            {/* Breaking News Feed Triggering the Alert */}
            {alert?.relatedNews && alert.relatedNews.length > 0 && (
              <div className="p-2.5 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/60 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-emerald-500" />
                    관련 실시간 속보 및 시장 반응
                  </span>
                  <span>최신 피드</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {alert.relatedNews.slice(0, 4).map((n, idx) => (
                    <a
                      key={idx}
                      href={n.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800 text-[11px] text-slate-700 dark:text-zinc-300 transition-colors group"
                    >
                      <span className="truncate pr-2 font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {n.title}
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 group-hover:text-emerald-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optional Integrated Earnings Flash Toggle Modal / View */}
      {showEarningsModal && flash && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-150">
          <EarningsFlashBanner flash={flash} />
        </div>
      )}
    </div>
  );
};
