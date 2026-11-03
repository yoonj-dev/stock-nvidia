import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  Zap,
  Car,
  Bot,
  Cpu,
  Globe2,
  Rocket,
  Flame,
  Shield,
  Users,
  Server,
  Network,
} from 'lucide-react';
import { SingleStockProfile, PillarConfig } from '../../types/stockConfig';

interface CompanyPillarsProps {
  profile: SingleStockProfile;
}

const getPillarIcon = (name?: string) => {
  switch (name) {
    case 'Car': return <Car className="w-5 h-5 text-rose-500" />;
    case 'Zap': return <Zap className="w-5 h-5 text-amber-500" />;
    case 'Bot': return <Bot className="w-5 h-5 text-indigo-500" />;
    case 'Cpu': return <Cpu className="w-5 h-5 text-purple-500" />;
    case 'Globe2': return <Globe2 className="w-5 h-5 text-blue-500" />;
    case 'Rocket': return <Rocket className="w-5 h-5 text-purple-500" />;
    case 'Flame': return <Flame className="w-5 h-5 text-orange-500" />;
    case 'Shield': return <Shield className="w-5 h-5 text-emerald-500" />;
    case 'Users': return <Users className="w-5 h-5 text-sky-500" />;
    case 'Server': return <Server className="w-5 h-5 text-emerald-500" />;
    case 'Network': return <Network className="w-5 h-5 text-cyan-500" />;
    default: return <Layers className="w-5 h-5 text-blue-500" />;
  }
};

export const CompanyPillars: React.FC<CompanyPillarsProps> = ({ profile }) => {
  const pillars = profile.pillars || [];
  const [expandedId, setExpandedId] = useState<string | null>(pillars[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="fintech-card p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {profile.koreanName} 핵심 비즈니스 엔진 & 해자 (Business Pillars)
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              {profile.name} - 주요 사업부별 핵심 성장 동력, 기술적 해자 및 퀀트 팩트시트
            </p>
          </div>
        </div>

        <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 self-start sm:self-auto">
          포트폴리오 다각화 지수: <span className="text-rose-600 dark:text-rose-400 font-bold">최우수 (AAA)</span>
        </div>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {pillars.map((pillar) => {
          const isExpanded = expandedId === pillar.id;

          return (
            <div
              key={pillar.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                isExpanded
                  ? 'border-rose-500/40 dark:border-rose-500/40 bg-white dark:bg-zinc-900 shadow-md ring-1 ring-rose-500/20'
                  : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              {/* Card Header */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-slate-100 dark:bg-zinc-800">
                      {getPillarIcon(pillar.iconName)}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-wider">
                      {pillar.category}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    {pillar.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    {pillar.subtitle}
                  </p>
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {pillar.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-100 dark:border-zinc-800 shadow-2xs"
                    >
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium block">
                        {h.label}
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-zinc-100 font-mono block mt-0.5">
                        {h.value}
                      </span>
                      {h.change && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                          {h.change}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed pt-1">
                  {pillar.summary}
                </p>

                {/* Expandable Details: Catalysts & Risks */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-3">
                    {pillar.catalysts && pillar.catalysts.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>주요 성장 촉매 (Catalysts)</span>
                        </div>
                        <ul className="space-y-1">
                          {pillar.catalysts.map((c, idx) => (
                            <li
                              key={idx}
                              className="text-[11.5px] text-slate-600 dark:text-zinc-300 flex items-start gap-1.5 leading-snug"
                            >
                              <span className="text-emerald-500 mt-0.5">•</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {pillar.risks && pillar.risks.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>모니터링 리스크 (Key Risks)</span>
                        </div>
                        <ul className="space-y-1">
                          {pillar.risks.map((r, idx) => (
                            <li
                              key={idx}
                              className="text-[11.5px] text-slate-600 dark:text-zinc-300 flex items-start gap-1.5 leading-snug"
                            >
                              <span className="text-amber-500 mt-0.5">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Expand Toggle Bar */}
              <button
                type="button"
                onClick={() => toggleExpand(pillar.id)}
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/60 hover:bg-slate-100 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/80 border-t border-slate-100 dark:border-zinc-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>{isExpanded ? '상세 해자 접기' : '촉매 및 리스크 자세히 보기'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
