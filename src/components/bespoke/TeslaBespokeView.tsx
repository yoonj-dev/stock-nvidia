import React, { useState } from 'react';
import {
  Car,
  Zap,
  Bot,
  Cpu,
  TrendingUp,
  Layers,
} from 'lucide-react';
import { StockFundamentals } from '../../types/stock';

interface TeslaBespokeViewProps {
  fundamentals: StockFundamentals;
}

export const TeslaBespokeView: React.FC<TeslaBespokeViewProps> = ({ fundamentals }) => {
  // Robotaxi Fleet Economics Simulator State
  const [fleetSizeK, setFleetSizeK] = useState<number>(500); // 500,000 autonomous vehicles
  const [dailyMilesPerCar, setDailyMilesPerCar] = useState<number>(145); // 145 paid miles/day
  const [teslaPlatformTakeRatePct, setTeslaPlatformTakeRatePct] = useState<number>(40); // 40% blended take rate (owned + network)

  const currentPrice = fundamentals.currentPrice || 248.98;

  // Derived Annual Robotaxi Network Economics
  // Price per mile to rider: $0.95/mile, Operating cost: $0.32/mile -> Gross Profit $0.63/mile
  const annualFleetMilesB = (fleetSizeK * 1000 * dailyMilesPerCar * 350) / 1e9; // in Billions of miles
  const annualNetworkGrossRevB = Math.round(annualFleetMilesB * 0.95 * 10) / 10;
  const annualTeslaEbitB = Math.round(annualNetworkGrossRevB * (teslaPlatformTakeRatePct / 100) * 10) / 10;
  // Applying 25x SaaS/Network multiple to Robotaxi EBIT + $450B Core Auto & Energy base
  const impliedRobotaxiValuationB = Math.round(annualTeslaEbitB * 25);
  const totalImpliedMarketCapB = 480 + impliedRobotaxiValuationB;
  const impliedSharePrice = Math.round(totalImpliedMarketCapB / 3.48); // ~3.48B diluted shares

  const COST_PER_MILE_COMPARISON = [
    {
      provider: 'Uber / Lyft (유인 승차공유)',
      costPerMile: '$2.55 / mile',
      vehicleCapex: '$35,000 (운전자 인건비 70%)',
      sensorStack: '인간 운전자',
      barWidth: 'w-full',
      color: 'bg-slate-400 dark:bg-zinc-600',
    },
    {
      provider: 'Waymo 6세대 (라이다 무인 로보택시)',
      costPerMile: '$1.65 / mile',
      vehicleCapex: '$130,000 ~ $150,000',
      sensorStack: 'LiDAR 4개 + 레이더 6개 + 카메라 13개 + 고성능 연산랙',
      barWidth: 'w-[65%]',
      color: 'bg-blue-500',
    },
    {
      provider: '지하철 · 시내버스 (대중교통 보조금 포함)',
      costPerMile: '$0.85 / mile',
      vehicleCapex: '공공 인프라',
      sensorStack: '고정 노선 대중교통',
      barWidth: 'w-[34%]',
      color: 'bg-amber-500',
    },
    {
      provider: 'Tesla Cybercab (비전 전용 Unboxed 공정)',
      costPerMile: '$0.32 / mile',
      vehicleCapex: '$25,000 ~ $28,000 목표',
      sensorStack: 'AI4/AI5 추론 칩 + 카메라 8개 (순수 End-to-End 신경망)',
      barWidth: 'w-[14%]',
      color: 'bg-rose-500',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Bespoke Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-600/10 via-amber-500/10 to-indigo-500/10 border border-rose-500/25 dark:border-rose-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white">
              TSLA Dedicated Alpha
            </span>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
              테슬라 자율주행 단위 경제학 · 메가팩 80GWh 마진 · 옵티머스 BOM 분석
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            사이버캡($0.32/마일) vs 웨이모 원가 비교 · 로보택시 플릿 수익 시뮬레이터 · 메가팩 30.5% 마진
          </h2>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center bg-white/80 dark:bg-zinc-900/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800">
          <div>
            <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">플릿 시나리오 주가(현재 ${currentPrice.toFixed(0)})</div>
            <div className="text-base font-black font-mono text-rose-600 dark:text-rose-400">
              ${impliedSharePrice}{' '}
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                (시총 ${(totalImpliedMarketCapB / 1000).toFixed(2)}T)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Module 1: Cybercab Cost-per-Mile Comparison & Fleet Profit Simulator */}
      <div className="fintech-card p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                1. 사이버캡(Cybercab) 마일당 원가($/mile) 비교 & 로보택시 플릿 영업이익 시뮬레이터
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                왜 라이다(LiDAR) 없이 순수 비전(Vision-only)을 고집하는가? — 대당 제조원가 1/5 절감을 통한 압도적 스케일링
              </p>
            </div>
          </div>
        </div>

        {/* Cost per Mile Visual Bars */}
        <div className="space-y-2.5">
          {COST_PER_MILE_COMPARISON.map((item) => (
            <div
              key={item.provider}
              className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-1.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-extrabold text-slate-900 dark:text-white">{item.provider}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                    차량 원가: <strong>{item.vehicleCapex}</strong>
                  </span>
                  <span className="font-mono font-black text-rose-600 dark:text-rose-400">
                    {item.costPerMile}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.barWidth} ${item.color}`} />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-zinc-400">
                센서 및 구조: {item.sensorStack}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Fleet Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-zinc-300">글로벌 로보택시 가동 대수</span>
              <span className="font-mono text-rose-600 dark:text-rose-400">
                {(fleetSizeK / 100).toFixed(1)}십만 대 ({fleetSizeK.toLocaleString()}K)
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={3000}
              step={100}
              value={fleetSizeK}
              onChange={(e) => setFleetSizeK(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>초기 10만 대</span>
              <span>중기 50만 대</span>
              <span>성숙기 300만 대</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-zinc-300">대당 일평균 유료 주행거리</span>
              <span className="font-mono text-rose-600 dark:text-rose-400">{dailyMilesPerCar} miles/일</span>
            </div>
            <input
              type="range"
              min={80}
              max={240}
              step={5}
              value={dailyMilesPerCar}
              onChange={(e) => setDailyMilesPerCar(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>80mi (가동률 30%)</span>
              <span>145mi (표준)</span>
              <span>240mi (풀가동)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-zinc-300">테슬라 플랫폼 순이익 귀속률</span>
              <span className="font-mono text-rose-600 dark:text-rose-400">{teslaPlatformTakeRatePct}%</span>
            </div>
            <input
              type="range"
              min={25}
              max={60}
              step={5}
              value={teslaPlatformTakeRatePct}
              onChange={(e) => setTeslaPlatformTakeRatePct(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>25% (외부 차주 위주)</span>
              <span>40% (혼합 플릿)</span>
              <span>60% (직영 위주)</span>
            </div>
          </div>
        </div>

        {/* Fleet Output Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">연간 유료 주행거리</span>
            <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
              {annualFleetMilesB.toFixed(1)}B miles
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">네트워크 총운임(GMV)</span>
            <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
              ${annualNetworkGrossRevB}B
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">로보택시 연간 영업이익</span>
            <div className="text-base sm:text-lg font-black font-mono text-rose-600 dark:text-rose-400">
              +${annualTeslaEbitB}B
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">로보택시 사업부 가치(25x)</span>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
              +${impliedRobotaxiValuationB}B
            </div>
          </div>
        </div>
      </div>

      {/* Module 2 & 3: Megapack Energy 30.5% Margin & Optimus Humanoid BOM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Megapack ESS Margin Engine */}
        <div className="fintech-card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                2. 메가팩(Megapack) ESS 80GWh 확장 & 30.5% 고마진 캐시카우 (독자 조사)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                자동차 부문 마진 둔화를 완벽히 방어하는 AI 데이터센터 전력망 안정화 수혜주
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-zinc-200">에너지 사업부 매출총이익률 (Gross Margin)</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                  오토모티브 마진(17.1%) 대비 약 1.8배 높은 고수익 구조 달성
                </div>
              </div>
              <span className="font-mono font-black text-sm text-amber-600 dark:text-amber-400">
                30.5% 역대 최고
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-zinc-200">라스롭(40GWh) + 상하이(40GWh) 연간 캐파</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                  메가팩 1기(3.9MWh) 당 판매단가 약 $1.2M~$1.5M + Autobidder SW 구독
                </div>
              </div>
              <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                연 80GWh+ 체제
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-zinc-200">2026~2027 에너지 부문 단독 영업이익 기여</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                  LFP 배터리 셀 원가 하락분 대부분을 테슬라가 마진으로 흡수
                </div>
              </div>
              <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                연 $4.5B ~ $6.0B+
              </span>
            </div>
          </div>
        </div>

        {/* Optimus Humanoid BOM & FSD v13 Trajectory */}
        <div className="fintech-card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                3. 옵티머스(Optimus Gen 3) BOM 원가 해부 & FSD v13 무개입 추이
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                자체 설계 액추에이터 28종 내재화와 22자유도(DoF) 로봇 손의 양산 경제학
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-zinc-200">
                  옵티머스 대당 양산 목표 원가 (BOM Breakdown)
                </span>
                <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">
                  원가 $19,500 / 판가 $30,000
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                전체 부품 원가의 <strong>55%($10.7K)를 차지하는 회전·선형 액추에이터 및 유성롤러스크류</strong>를 기가팩토리 라인에서 자체 양산하여 상용 로봇 대비 원가를 1/5로 압축했습니다.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-zinc-200">
                  FSD v13.x 치명적 개입 주기 (Miles per Critical Intervention)
                </span>
                <span className="font-mono font-black text-rose-600 dark:text-rose-400">
                  클러스터 H100/H200 10만 장 가동
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                기가 텍사스 <strong>Cortex 슈퍼클러스터</strong> 가동으로 AI4 카메라 36Hz 비압축 영상을 직접 학습하며, 텍사스·캘리포니아 무감독(Unsupervised) 로보택시 상용화 임계치를 돌파 중입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
