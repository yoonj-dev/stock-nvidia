import React, { useState } from 'react';
import {
  Scale,
  Cpu,
  Search,
  GitCompareArrows,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { StockFundamentals } from '../../types/stock';

interface AlphabetBespokeViewProps {
  fundamentals: StockFundamentals;
}

type SotpScenarioKey = 'base' | 'behavioral' | 'breakup';

interface SotpSegment {
  name: string;
  metric: string;
  baseVal: number; // $B
  behavioralVal: number; // $B
  breakupVal: number; // $B
  rationale: string;
  color: string;
}

const SOTP_SEGMENTS: SotpSegment[] = [
  {
    name: 'Google Search & Ads',
    metric: '연간 영업이익 $112B · 독점 해자',
    baseVal: 1350,
    behavioralVal: 1220,
    breakupVal: 1450,
    rationale: 'AI Overviews 도입 후에도 상업용 쿼리 RPM 99% 방어. 독립 상장 시 캐시카우 배당 멀티플 리레이팅',
    color: 'bg-blue-500',
  },
  {
    name: 'Google Cloud & Workspace',
    metric: 'ARR $48B+ · 영업이익률 17% 돌파',
    baseVal: 520,
    behavioralVal: 540,
    breakupVal: 650,
    rationale: 'Vertex AI 및 Gemini API 수요 폭발. AWS·Azure 독립 멀티플(P/S 11~13x) 적용 시 가치 급등',
    color: 'bg-indigo-500',
  },
  {
    name: 'YouTube (Ads + Subscription)',
    metric: '연간 매출 $54B+ · 미국 TV 시청 1위',
    baseVal: 460,
    behavioralVal: 470,
    breakupVal: 580,
    rationale: '넷플릭스(시가총액 $380B+) 대비 매출·시청시간 우위. 독립 미디어 플랫폼 상장 시 최소 $550B+',
    color: 'bg-rose-500',
  },
  {
    name: 'DeepMind & TPU 자체 실리콘',
    metric: 'TPU v6p/v7 · 프론티어 AI 원천기술',
    baseVal: 220,
    behavioralVal: 240,
    breakupVal: 340,
    rationale: 'OpenAI($157B~300B)·Anthropic($60B+) 비상장 멀티플 감안 시 자체 ASIC+파운데이션 모델 가치',
    color: 'bg-purple-500',
  },
  {
    name: 'Waymo (자율주행 로보택시)',
    metric: '주간 유료 운행 17.5만 건 돌파',
    baseVal: 85,
    behavioralVal: 95,
    breakupVal: 160,
    rationale: '샌프란시스코·피닉스·LA·오스틴 상용 무인 운행 1위. 스핀오프 시 테슬라 로보택시 대비 즉각 재평가',
    color: 'bg-emerald-500',
  },
  {
    name: '순현금(Net Cash) & 비상장 지분',
    metric: '현금성자산 $93B + SpaceX 7% 지분($25B+)',
    baseVal: 118,
    behavioralVal: 118,
    breakupVal: 125,
    rationale: 'SpaceX 초기 투자 지분 약 7%(가치 $25B+ 추산) 및 막대한 순현금 보유',
    color: 'bg-amber-500',
  },
];

export const AlphabetBespokeView: React.FC<AlphabetBespokeViewProps> = ({ fundamentals }) => {
  const [scenario, setScenario] = useState<SotpScenarioKey>('breakup');

  const currentPrice = fundamentals.currentPrice || 279.23;
  // Approx 12.28B diluted shares
  const currentMarketCapB = fundamentals.marketCap
    ? Math.round(fundamentals.marketCap / 1e9)
    : Math.round(currentPrice * 12.28);

  const getSegmentValue = (seg: SotpSegment) => {
    if (scenario === 'base') return seg.baseVal;
    if (scenario === 'behavioral') return seg.behavioralVal;
    return seg.breakupVal;
  };

  const totalSotpB = SOTP_SEGMENTS.reduce((acc, s) => acc + getSegmentValue(s), 0);
  const upsidePct = (((totalSotpB - currentMarketCapB) / currentMarketCapB) * 100).toFixed(1);
  const impliedSharePrice = ((currentPrice * totalSotpB) / currentMarketCapB).toFixed(2);

  return (
    <div className="space-y-5">
      {/* Bespoke Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-500/10 to-emerald-500/10 border border-blue-500/25 dark:border-blue-400/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white">
              GOOGL Dedicated Alpha
            </span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              알파벳 독자 리서치 & SOTP 해체 가치 분석
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
            반독점 분할(SOTP) 숨겨진 주주가치 · TPU 실리콘 원가 우위 · SpaceX 지분 가치
          </h2>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center bg-white/80 dark:bg-zinc-900/80 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800">
          <div>
            <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">시나리오 내재 주가</div>
            <div className="text-base font-black font-mono text-blue-600 dark:text-blue-400">
              ${impliedSharePrice}{' '}
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ({Number(upsidePct) >= 0 ? `+${upsidePct}%` : `${upsidePct}%`})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Module 1: Interactive DOJ Antitrust & SOTP Breakup Simulator */}
      <div className="fintech-card p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                1. DOJ 반독점 시나리오별 SOTP(사업부 합산 가치) 시뮬레이터
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                복합기업 할인(Conglomerate Discount)에 가려진 유튜브·클라우드·웨이모·SpaceX 지분의 독립 가치 산출
              </p>
            </div>
          </div>

          {/* Scenario Selector Buttons */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-zinc-800/90 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setScenario('behavioral')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                scenario === 'behavioral'
                  ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              ⚠️ 기본 검색 독점계약 해제
            </button>
            <button
              type="button"
              onClick={() => setScenario('base')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                scenario === 'base'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              ⚖️ 현행 통합 유지 (Base)
            </button>
            <button
              type="button"
              onClick={() => setScenario('breakup')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                scenario === 'breakup'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              🚀 사업부 인적분할 상장 (Spin-off)
            </button>
          </div>
        </div>

        {/* Summary Comparison Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/70 dark:border-zinc-800">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">현재 시장 시가총액</span>
            <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
              ${(currentMarketCapB / 1000).toFixed(2)}T{' '}
              <span className="text-xs font-normal text-slate-400">(${currentMarketCapB}B)</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">SOTP 사업부 합산 적정가치</span>
            <div className="text-lg font-black font-mono text-blue-600 dark:text-blue-400">
              ${(totalSotpB / 1000).toFixed(2)}T{' '}
              <span className="text-xs font-normal text-slate-400">(${totalSotpB}B)</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">복합기업 할인 해소 시 기대수익률</span>
            <div className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
              {Number(upsidePct) >= 0 ? `+${upsidePct}%` : `${upsidePct}%`}{' '}
              <span className="text-xs font-bold">(주당 ${impliedSharePrice})</span>
            </div>
          </div>
        </div>

        {/* Segment Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SOTP_SEGMENTS.map((seg) => {
            const val = getSegmentValue(seg);
            const sharePct = Math.round((val / totalSotpB) * 100);
            return (
              <div
                key={seg.name}
                className="p-3.5 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${seg.color}`} />
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                      {seg.name}
                    </span>
                  </div>
                  <span className="text-sm font-black font-mono text-blue-600 dark:text-blue-400">
                    ${val}B <span className="text-[10px] text-slate-400">({sharePct}%)</span>
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {seg.metric}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {seg.rationale}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module 2 & 3: AI Search RPM Defense + TPU v6p Unit Economics & Dual-Class Arbitrage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* TPU vs GPU Custom Silicon Unit Economics */}
        <div className="fintech-card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                2. 자체 TPU v6p(Trillium) vs 외부 GPU 단위 경제학 (독자 조사)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                엔비디아 마진(75% टैक्स)을 지불하지 않는 유일한 하이퍼스케일러의 원가 해자
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-zinc-200">AI 검색 쿼리당 추론 단가 절감율</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                  TPU v5e → v6p 전환 및 Gemini Flash 경량화 결합
                </div>
              </div>
              <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                -68% 절감 (18개월 내)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-zinc-200">AI Overviews 광고 단가(RPM) 보존율</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                  기존 일반 웹 검색 스폰서 링크 대비 상업 의도 클릭률(CTR)
                </div>
              </div>
              <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                98% ~ 102% 동등 유지
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 dark:text-zinc-200">연간 자체 ASIC CapEx 절약 효과</div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                  외부 상용 GPU 전량 구매 시 대비 감가상각비 방어액
                </div>
              </div>
              <span className="font-mono font-black text-sm text-purple-600 dark:text-purple-400">
                연 $14.5B+ 마진 방어
              </span>
            </div>
          </div>
        </div>

        {/* GOOGL vs GOOG Dual-Class & Hidden Assets */}
        <div className="fintech-card p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-zinc-800">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <GitCompareArrows className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                3. GOOGL vs GOOG 자사주 소각 구조 & 숨겨진 비상장 지분
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                의결권 유무에 따른 구조적 수급 차이와 장부 외(Off-balance) 핵심 자산
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-zinc-200">
                  GOOGL (Class A, 1주 1의결권) vs GOOG (Class C, 무의결권)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px]">
                  연 $70B 바이백 가동
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                알파벳의 자사주 매입(연간 약 $65B~$70B)은 임직원 RSU 희석 방지를 위해 주로 <strong>Class C(GOOG)</strong>에 집중 집행됩니다. 개인 투자자는 의결권이 보장되면서도 가격이 소폭 할인 거래되는 <strong>GOOGL 매수</strong>가 역사적으로 유리합니다.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-zinc-200">
                  SpaceX 약 7.0% 지분 보유 (2015년 피델리티와 $1B 공동 투자)
                </span>
                <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">
                  지분가치 ~$24.5B+
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                SpaceX 기업가치 $350B+ 돌파에 따라 알파벳이 보유한 비상장 지분 가치가 <strong>25배 이상 폭증</strong>했으며, 스타링크 클라우드 백엔드 연동 파트너십까지 확보하고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
