import React, { useState } from 'react';
import {
  Server,
  Cpu,
  Layers,
  Network,
  Zap,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { StockFundamentals } from '../../types/stock';

interface NvidiaBespokeViewProps {
  fundamentals: StockFundamentals;
}

export const NvidiaBespokeView: React.FC<NvidiaBespokeViewProps> = ({ fundamentals }) => {
  // Hyperscaler CapEx Top-Down Simulator State
  const [hyperscalerCapexB, setHyperscalerCapexB] = useState<number>(285); // $285B Big 4 + Sovereign AI
  const [aiComputeSharePct, setAiComputeSharePct] = useState<number>(58); // % of CapEx going to AI servers/networking
  const [nvidiaWalletSharePct, setNvidiaWalletSharePct] = useState<number>(80); // NVDA capture rate

  const currentPrice = fundamentals.currentPrice || 213.66;

  // Derived NVDA Data Center Revenue & EPS
  const impliedDcRevB = Math.round((hyperscalerCapexB * (aiComputeSharePct / 100) * (nvidiaWalletSharePct / 100)) * 1.35); // +35% for tier-2 CSPs, sovereigns & enterprise
  const impliedTotalRevB = impliedDcRevB + 18; // Gaming + Auto + ProViz ~$18B
  const impliedNetIncomeB = Math.round(impliedTotalRevB * 0.54); // ~54% net margin
  const impliedEps = (impliedNetIncomeB / 24.5).toFixed(2); // ~24.5B diluted shares
  const impliedFairPrice = (Number(impliedEps) * 32).toFixed(2); // 32x Forward P/E
  const upsidePct = (((Number(impliedFairPrice) - currentPrice) / currentPrice) * 100).toFixed(1);

  const GB200_BOM = [
    {
      component: '72× Blackwell B200 GPU + HBM3E 192GB',
      share: '64%',
      estValue: '$1,920,000',
      supplier: 'TSMC 4NP + SK하이닉스 12단 HBM3E',
      note: '칩 단품이 아닌 컴퓨트 트레이 결합 형태로 매출총이익률 74%+ 창출',
    },
    {
      component: '36× Grace ARM CPU (Superchip 결합)',
      share: '11%',
      estValue: '$330,000',
      supplier: '엔비디아 자체 설계 + LPDDR5X',
      note: '인텔/AMD x86 서버 CPU 몫까지 엔비디아가 내재화하여 랙당 ASP 흡수',
    },
    {
      component: '9× NVLink 5 스위치 트레이 & 구리선(DAC) 백플레인',
      share: '15%',
      estValue: '$450,000',
      supplier: 'Mellanox 사업부 + Amphenol',
      note: '랙 내부 130TB/s 대역폭 연결. 스위치 마진이 GPU 본체 못지않은 핵심 해자',
    },
    {
      component: '수냉식 매니폴드(Liquid Cooling) & 전원공급/랙 섀시',
      share: '10%',
      estValue: '$300,000',
      supplier: 'Vertiv · 홍하이(Foxconn) · 콴타',
      note: '랙당 120kW 전력 밀도 제어를 위한 직수냉(DLC) 필수화',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Bespoke Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/25 dark:border-emerald-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
              NVDA Dedicated Alpha
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              엔비디아 AI 팩토리 공급망 & 하이퍼스케일러 CapEx 역산 모델
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            빅테크 CapEx 수주 전환 시뮬레이터 · GB200 NVL72($3M 랙) 원가 해부 · TSMC CoWoS 독점률
          </h2>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center bg-white/80 dark:bg-zinc-900/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800">
          <div>
            <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">CapEx 기반 적정주가(32x)</div>
            <div className="text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
              ${impliedFairPrice}{' '}
              <span className="text-xs font-bold">
                ({Number(upsidePct) >= 0 ? `+${upsidePct}%` : `${upsidePct}%`})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Module 1: Hyperscaler CapEx -> NVDA Data Center Revenue Simulator */}
      <div className="fintech-card p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                1. 빅테크 4대 하이퍼스케일러(MSFT·META·GOOGL·AMZN) CapEx → 엔비디아 매출 전환 시뮬레이터
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                빅테크 설비투자 가이던스가 엔비디아 데이터센터 매출과 주당순이익(EPS)으로 직결되는 톱다운(Top-Down) 수식 검증
              </p>
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-zinc-300">빅테크 4사 연간 CapEx 합산</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">${hyperscalerCapexB}B</span>
            </div>
            <input
              type="range"
              min={200}
              max={360}
              step={5}
              value={hyperscalerCapexB}
              onChange={(e) => setHyperscalerCapexB(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>보수적 $200B</span>
              <span>컨센서스 $285B</span>
              <span>공격적 $360B</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-zinc-300">CapEx 내 AI 서버/네트워크 비중</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">{aiComputeSharePct}%</span>
            </div>
            <input
              type="range"
              min={45}
              max={70}
              step={1}
              value={aiComputeSharePct}
              onChange={(e) => setAiComputeSharePct(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>45% (토지/건물 위주)</span>
              <span>58% (표준)</span>
              <span>70% (칩 집중)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/70 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-zinc-300">엔비디아 가속기 시장 점유율</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">{nvidiaWalletSharePct}%</span>
            </div>
            <input
              type="range"
              min={65}
              max={90}
              step={1}
              value={nvidiaWalletSharePct}
              onChange={(e) => setNvidiaWalletSharePct(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>65% (ASIC 침투)</span>
              <span>80% (현재)</span>
              <span>90% (독점)</span>
            </div>
          </div>
        </div>

        {/* Output Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">예상 데이터센터 매출</span>
            <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
              ${impliedDcRevB}B
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">전사 연간 총매출</span>
            <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
              ${impliedTotalRevB}B
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">추정 주당순이익 (EPS)</span>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
              ${impliedEps}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">내재 적정주가 (P/E 32x)</span>
            <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
              ${impliedFairPrice}
            </div>
          </div>
        </div>
      </div>

      {/* Module 2 & 3: GB200 NVL72 BOM Breakdown & CoWoS Supply Chain Moat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* GB200 NVL72 $3M Rack Anatomy */}
        <div className="fintech-card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                2. Blackwell GB200 NVL72 ($3.0M 랙) 단가 해부 (BOM 조사 데이터)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                단품 GPU 판매에서 '데이터센터 랙 스케일 시스템' 판매로 전환되며 ASP 퀀텀점프
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {GB200_BOM.map((item) => (
              <div
                key={item.component}
                className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {item.component}
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 shrink-0">
                    {item.estValue} ({item.share})
                  </span>
                </div>
                <div className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">
                  공급망: {item.supplier}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* TSMC CoWoS Wafer Allocation & ASIC vs CUDA TCO */}
        <div className="fintech-card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                3. TSMC CoWoS 패키징 선점률 & 자체 ASIC 대비 실효 TCO 해자
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                경쟁사가 칩을 설계해도 물리적 생산이 불가능한 패키징 병목 장악력
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-zinc-200">
                  2026년 TSMC CoWoS-L 전체 웨이퍼 할당 점유율
                </span>
                <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                  NVDA 63% 독점 선점
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-700 overflow-hidden flex">
                <div className="w-[63%] bg-emerald-500 h-full" title="NVIDIA 63%" />
                <div className="w-[18%] bg-blue-500 h-full" title="Broadcom (TPU/ASIC) 18%" />
                <div className="w-[11%] bg-rose-500 h-full" title="AMD 11%" />
                <div className="w-[8%] bg-amber-500 h-full" title="Marvell/Others 8%" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                <span>🟢 NVDA 63%</span>
                <span>🔵 Broadcom(ASIC) 18%</span>
                <span>🔴 AMD 11%</span>
                <span>🟡 기타 8%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-zinc-200">
                  전력당 추론 토큰 처리량 (Tokens / Watt) 우위
                </span>
                <span className="font-mono font-black text-cyan-600 dark:text-cyan-400">
                  H100 대비 25~30배 향상
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                데이터센터의 최대 병목은 칩 가격이 아니라 <strong>전력 수급(MW 한도)</strong>입니다. GB200 NVL72는 FP4 양자화 엔진과 NVLink 72-GPU 단일 메모리 도메인을 통해 동일 전력에서 토큰 생성량을 극대화하여 빅테크 자체 칩 대비 총소유비용(TCO) 우위를 유지합니다.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-zinc-200">
                  Rubin (R100 / Vera Rubin) 차세대 아키텍처 로드맵
                </span>
                <span className="font-mono font-black text-purple-600 dark:text-purple-400">
                  TSMC N3 + HBM4 8스택
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                1년 주기(One-Year Rhythm) 신제품 출시 전략으로, 경쟁사가 Blackwell을 추격할 시점에는 이미 HBM4 기반 <strong>Vera Rubin</strong>으로 세대 교체를 완료해 70% 중반 총마진율을 방어합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
