import React, { useState } from 'react';
import {
  Rocket,
  Globe2,
  Shield,
  Flame,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { StockFundamentals } from '../../types/stock';

interface SpaceXBespokeViewProps {
  fundamentals: StockFundamentals;
}

export const SpaceXBespokeView: React.FC<SpaceXBespokeViewProps> = ({ fundamentals }) => {
  // Starlink Cashflow & Valuation Simulator State
  const [subscribersM, setSubscribersM] = useState<number>(6.5); // 6.5M global subscribers
  const [blendedArpuUsd, setBlendedArpuUsd] = useState<number>(135); // $135/month blended (Residential + Aviation/Maritime B2B)
  const [ebitdaMarginPct, setEbitdaMarginPct] = useState<number>(42); // 42% EBITDA margin

  const currentPrice = fundamentals.currentPrice || 185.0; // Secondary share price ($)

  // Derived Annual Starlink + Launch Revenue & Valuation
  const starlinkAnnualRevB = Math.round(((subscribersM * 1e6 * blendedArpuUsd * 12) / 1e9) * 10) / 10;
  const launchAndStarshieldRevB = 6.2; // Commercial Falcon 9 + NASA + NRO Starshield
  const totalSpaceXRevB = Math.round((starlinkAnnualRevB + launchAndStarshieldRevB) * 10) / 10;
  const starlinkEbitdaB = Math.round(starlinkAnnualRevB * (ebitdaMarginPct / 100) * 10) / 10;
  // 22x P/S for monopolistic space infrastructure
  const impliedEnterpriseValueB = Math.round(totalSpaceXRevB * 21.5);
  const impliedSecondarySharePrice = Math.round((impliedEnterpriseValueB / 350) * 185);

  const LAUNCH_COST_REVOLUTION = [
    {
      vehicle: 'NASA 우주왕복선 (Space Shuttle, 1981~2011)',
      costPerKg: '$54,500 / kg',
      payloadLeo: '27.5 톤',
      reusability: '부분 정비 (수개월 소요)',
      barWidth: 'w-full',
      color: 'bg-slate-400 dark:bg-zinc-600',
    },
    {
      vehicle: 'ULA Atlas V / 유럽 Ariane 5 (전통 소모성 로켓)',
      costPerKg: '$10,500 / kg',
      payloadLeo: '18 ~ 21 톤',
      reusability: '1회용 소모 (바다 폐기)',
      barWidth: 'w-[45%]',
      color: 'bg-amber-500',
    },
    {
      vehicle: 'SpaceX Falcon 9 Block 5 (1단 부스터 20회+ 재사용)',
      costPerKg: '$1,800 / kg (내부원가)',
      payloadLeo: '18.4 톤 (재사용 시)',
      reusability: '1단 및 페어링 상시 회수',
      barWidth: 'w-[16%]',
      color: 'bg-blue-500',
    },
    {
      vehicle: 'SpaceX Starship V2/V3 (메카질라 젓가락 캐치 완전 재사용)',
      costPerKg: '$60 ~ $150 / kg 목표',
      payloadLeo: '100 ~ 200 톤',
      reusability: '슈퍼헤비 1단 + 스타십 2단 100% 재사용',
      barWidth: 'w-[4%]',
      color: 'bg-purple-500',
    },
  ];

  const PUBLIC_MARKET_PROXIES = [
    {
      ticker: 'GOOGL (알파벳)',
      exposureType: '2015년 $1B 초기 투자 → SpaceX 지분 약 7.0% 보유',
      navPremium: '할인 거래 (본업 가치만 반영)',
      verdict: '가장 안전하고 수수료 없는 기관급 우회 보유 수단 ($25B+ 지분가치)',
    },
    {
      ticker: 'XOVR (ERShares ETF)',
      exposureType: '상장 개방형 ETF 내 SpaceX 비상장 SPV 편입 (~8~10% 비중)',
      navPremium: 'NAV 수준 (연 보수 0.75%)',
      verdict: '일반 계좌에서 NAV 괴리율 없이 SpaceX 비중을 담을 수 있는 실용적 ETF',
    },
    {
      ticker: 'DXYZ (Destiny Tech100)',
      exposureType: '폐쇄형 펀드(CEF) 내 SpaceX 약 35~40% 편입',
      navPremium: '순자산(NAV) 대비 +200%~400% 고평가 주의',
      verdict: '유동성 부족으로 실제 SpaceX 지분가치 대비 과도한 프리미엄 거래 — 단기 트레이딩 전용',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Bespoke Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-600/10 via-indigo-500/10 to-sky-500/10 border border-purple-500/25 dark:border-purple-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white">
              SPCX Dedicated Alpha
            </span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
              스페이스X 비상장 텐더오퍼($350B+) · 스타링크 현금흐름 · 스타십 원가 혁명
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            스타링크 FCF 시뮬레이터 · kg당 궤도 발사 단가 1/100 붕괴 · 상장 시장 우회 투자(Proxy) 비교
          </h2>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center bg-white/80 dark:bg-zinc-900/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800">
          <div>
            <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">추정 비상장 기업가치</div>
            <div className="text-base font-black font-mono text-purple-600 dark:text-purple-400">
              ${impliedEnterpriseValueB}B{' '}
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                (세컨더리 ~${impliedSecondarySharePrice}/주)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Module 1: Starlink Subscriber & Cashflow Simulator */}
      <div className="fintech-card p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                1. 스타링크(Starlink) 글로벌 가입자 & B2B 엔터프라이즈 현금흐름 시뮬레이터
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                저궤도(LEO) 위성 7,000기+ 군집 완성으로 고정비 레버리지 구간 진입 — 가입자 증가가 곧바로 순현금으로 직결
              </p>
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-zinc-300">스타링크 글로벌 활성 가입자</span>
              <span className="font-mono text-purple-600 dark:text-purple-400">{subscribersM.toFixed(1)}M (백만 명)</span>
            </div>
            <input
              type="range"
              min={4.0}
              max={15.0}
              step={0.5}
              value={subscribersM}
              onChange={(e) => setSubscribersM(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>4.0M (기존)</span>
              <span>6.5M (현재 추산)</span>
              <span>15.0M (D2D 확장)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-zinc-300">월평균 복합 객단가 (Blended ARPU)</span>
              <span className="font-mono text-purple-600 dark:text-purple-400">${blendedArpuUsd} / 월</span>
            </div>
            <input
              type="range"
              min={95}
              max={220}
              step={5}
              value={blendedArpuUsd}
              onChange={(e) => setBlendedArpuUsd(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>$95 (가정용 위주)</span>
              <span>$135 (항공/해운 혼합)</span>
              <span>$220 (B2B/국방 확대)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-zinc-300">스타링크 EBITDA 마진율</span>
              <span className="font-mono text-purple-600 dark:text-purple-400">{ebitdaMarginPct}%</span>
            </div>
            <input
              type="range"
              min={25}
              max={60}
              step={1}
              value={ebitdaMarginPct}
              onChange={(e) => setEbitdaMarginPct(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>25% (초기)</span>
              <span>42% (현재)</span>
              <span>60% (성숙기)</span>
            </div>
          </div>
        </div>

        {/* Output Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">스타링크 연간 매출(ARR)</span>
            <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
              ${starlinkAnnualRevB}B
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">발사체 + 스타실드(국방)</span>
            <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
              ${launchAndStarshieldRevB}B
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">스타링크 연간 EBITDA</span>
            <div className="text-base sm:text-lg font-black font-mono text-purple-600 dark:text-purple-400">
              ${starlinkEbitdaB}B
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">전사 내재 기업가치</span>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
              ${impliedEnterpriseValueB}B
            </div>
          </div>
        </div>
      </div>

      {/* Module 2 & 3: Launch Cost/kg Revolution & Public Market Proxy Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Launch Cost per kg Curve */}
        <div className="fintech-card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                2. kg당 저궤도(LEO) 투입 비용 혁명 & 글로벌 궤도 질량 88% 독점
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                전 세계 국가·기업이 우주로 올리는 총화물 무게의 약 90%를 단일 기업이 수송
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {LAUNCH_COST_REVOLUTION.map((item) => (
              <div
                key={item.vehicle}
                className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-extrabold text-slate-900 dark:text-white">{item.vehicle}</span>
                  <span className="font-mono font-black text-purple-600 dark:text-purple-400 shrink-0">
                    {item.costPerKg}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.barWidth} ${item.color}`} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-400">
                  <span>수송량: {item.payloadLeo}</span>
                  <span>방식: {item.reusability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public Market Proxy Guide */}
        <div className="fintech-card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                3. 비상장 SpaceX 상장 시장 우회 투자(Proxy) 수단 비교 (독자 조사)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                세컨더리 마켓 직접 접근이 어려운 일반 투자자를 위한 3대 우회 경로 및 NAV 괴리율 경고
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            {PUBLIC_MARKET_PROXIES.map((p) => (
              <div
                key={p.ticker}
                className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                    {p.ticker}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    {p.navPremium}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {p.exposureType}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {p.verdict}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
