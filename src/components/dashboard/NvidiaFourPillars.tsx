import React, { useState } from 'react';
import {
  Server,
  Gamepad2,
  Network,
  Bot,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Layers,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface Pillar {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  color: string;
  badge: string;
  icon: React.ReactNode;
  highlights: { label: string; value: string; change?: string }[];
  summary: string;
  catalysts: string[];
  risks: string[];
}

const PILLARS: Pillar[] = [
  {
    id: 'datacenter_ai',
    title: '데이터센터 & Blackwell 가속기',
    subtitle: 'Data Center & Accelerated Computing',
    category: '전사 매출의 85%+',
    color: 'emerald',
    badge: '독점적 성장 엔진',
    icon: <Server className="w-5 h-5 text-emerald-500" />,
    highlights: [
      { label: '매출 비중', value: '87.4%', change: '압도적 기여' },
      { label: '핵심 아키텍처', value: 'GB200 NVL72', change: '랙 단위 판매' },
      { label: '수주 현황', value: '12개월+ 전량 완판', change: '초과수요 지속' },
      { label: '영업 마진', value: '75.0%', change: '가격결정력 독점' },
    ],
    summary:
      '마이크로소프트, 구글, 메타, 아마존 등 글로벌 빅테크의 연간 CapEx $200B+ 설비투자 확대를 독식하며, 단순 GPU 단품 판매에서 수냉식 시스템 랙(ASP $2~3M) 단위 판매로 전사 매출 단가를 폭발적으로 상승시키고 있습니다.',
    catalysts: [
      '차세대 GB200 NVL72 랙 양산 본격화 및 수냉 쿨링 생태계 선점',
      'TSMC CoWoS-L 첨단 패키징 캐파 증설로 출하 병목 점진적 해소',
      '각국 정부 및 통신사 주권 AI(Sovereign AI) 신규 수주 폭증',
    ],
    risks: [
      'TSMC 첨단 패키징 및 HBM3e 공급망 병목 발생 가능성',
      '빅테크 하이퍼스케일러의 중장기 CapEx 투자 피크아웃 우려',
    ],
  },
  {
    id: 'networking_infiniband',
    title: 'AI 네트워킹 & NVLink 인터커넥트',
    subtitle: 'Spectrum-X Ethernet & Quantum InfiniBand',
    category: '연간 수십억 달러 폭풍 성장',
    color: 'blue',
    badge: '차세대 인프라 해자',
    icon: <Network className="w-5 h-5 text-blue-500" />,
    highlights: [
      { label: 'Spectrum-X 성장', value: 'YoY +300%+', change: '초고속 성장' },
      { label: '대역폭 속도', value: '1.8TB/s (NVLink 5)', change: '초저지연 연결' },
      { label: '전략적 의미', value: '풀스택 번들링', change: '경쟁사 진입 차단' },
      { label: '스위치 독점', value: 'InfiniBand 80%+', change: '슈퍼컴 표준' },
    ],
    summary:
      'GPU 성능을 온전히 발휘하기 위해 필수적인 초고속 네트워킹 솔루션입니다. 고가의 인피니밴드 외에 표준 이더넷 환경에서도 무손실 전송을 구현하는 Spectrum-X를 공급하여 데이터센터의 모든 스위치와 케이블까지 수직계열화했습니다.',
    catalysts: [
      '범용 데이터센터의 이더넷 기반 AI 클러스터 구축 가속',
      'NVLink 스위치 기반 수만 개 GPU 초저지연 스케일아웃 기술 독점',
      'GPU와 네트워킹의 통합 번들 판매로 경쟁 칩 진입 원천 봉쇄',
    ],
    risks: [
      '시스코(Cisco), 아리스타(Arista) 등 전통 네트워킹 강자들의 반격',
      'Ultra Ethernet Consortium(UEC) 오픈 스탠다드 진영의 추격',
    ],
  },
  {
    id: 'gaming_rtx',
    title: '게이밍 & 클라이언트 AI',
    subtitle: 'GeForce RTX & DLSS 4.0 Ecosystem',
    category: '캐시카우 & 온디바이스 AI',
    color: 'purple',
    badge: '견고한 현금 창출',
    icon: <Gamepad2 className="w-5 h-5 text-purple-500" />,
    highlights: [
      { label: '외장 GPU 점유율', value: '88%+', change: '압도적 1위' },
      { label: '차세대 라인업', value: 'RTX 50 시리즈', change: 'Blackwell 기반' },
      { label: 'AI 프레임 생성', value: 'DLSS 4.0', change: '기술적 초격차' },
      { label: 'RTX AI PC', value: '1억 대+ 보급', change: '로컬 생태계' },
    ],
    summary:
      '엔비디아의 뿌리이자 1억 대 이상의 글로벌 게이머와 크리에이터를 보유한 본업 캐시카우입니다. 차세대 GeForce RTX 50 시리즈와 텐서 코어를 기반으로 로컬 PC 환경에서의 온디바이스 AI 및 생성형 크리에이티브 워크로드를 주도합니다.',
    catalysts: [
      'Blackwell 아키텍처 기반 GeForce RTX 50 시리즈 출시 교체 수요',
      'AAA급 대작 게임들의 레이 트레이싱 및 DLSS 독점 채택 확대',
      '로컬 LLM 및 이미지 생성 AI를 구동하는 고성능 AI PC 수요 급증',
    ],
    risks: [
      '글로벌 PC 시장의 교체 주기 장기화 및 소비 심리 둔화',
      'TSMC 파운드리 캐파 배분 시 고마진 데이터센터 칩 우선 배정 영향',
    ],
  },
  {
    id: 'auto_robotics',
    title: '오토모티브 & 피지컬 AI 로보틱스',
    subtitle: 'NVIDIA DRIVE Thor & Isaac Robotics',
    category: '미래 신성장 파이프라인',
    color: 'amber',
    badge: '차세대 10년 성장동력',
    icon: <Bot className="w-5 h-5 text-amber-500" />,
    highlights: [
      { label: '자율주행 칩', value: 'DRIVE Thor', change: '2,000 TFLOPS' },
      { label: '로보틱스 엔진', value: 'Isaac Sim & Lab', change: '물리 엔진 표준' },
      { label: '글로벌 파트너', value: '벤츠·볼보·BYD', change: '생태계 완성' },
      { label: '시뮬레이션', value: 'Omniverse', change: '디지털 트윈' },
    ],
    summary:
      '엔비디아가 준비하는 다음 10년의 핵심 먹거리입니다. 2,000 TFLOPS 연산력을 자랑하는 DRIVE Thor 자율주행 컴퓨터와 휴머노이드 로봇 학습을 위한 Isaac 시뮬레이터를 통해 피지컬 AI(Physical AI) 시장을 선점하고 있습니다.',
    catalysts: [
      '글로벌 주요 완성차 및 자율주행 트럭 제조사의 DRIVE Thor 탑재 본격화',
      '휴머노이드 로봇 및 공장 자동화를 위한 Omniverse 디지털 트윈 도입',
      '소프트웨어 구독 및 자율주행 플랫폼 라이선스 매출 본격화',
    ],
    risks: [
      '완전 자율주행 상용화 규제 및 각국 법적 승인 지연 리스크',
      '테슬라 FSD 자체 칩(HW 4/5) 등 완성차 진영의 독자 개발 시도',
    ],
  },
];

export const NvidiaFourPillars: React.FC = () => {
  const [selectedPillarId, setSelectedPillarId] = useState<string>('datacenter_ai');

  const selectedPillar = PILLARS.find((p) => p.id === selectedPillarId) || PILLARS[0];

  return (
    <div className="fintech-card p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#76b900] to-[#10b981] text-white shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              엔비디아 4대 핵심 사업부 및 해자 분석
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              데이터센터 GPU 독점부터 네트워킹 풀스택, 온디바이스 AI, 피지컬 로보틱스까지
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillar Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PILLARS.map((pillar) => {
          const isSelected = pillar.id === selectedPillarId;
          return (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillarId(pillar.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-50 dark:bg-zinc-900/60 border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200/70 dark:border-zinc-700 shadow-xs">
                  {pillar.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                  {pillar.badge}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                {pillar.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5">
                {pillar.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected Pillar Detailed Insight View */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 space-y-4 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {selectedPillar.icon}
            </span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {selectedPillar.title} 심층 진단
            </span>
            <span className="text-xs text-slate-400 dark:text-zinc-500">
              ({selectedPillar.category})
            </span>
          </div>
        </div>

        {/* 4 Metric Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {selectedPillar.highlights.map((h, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 space-y-0.5"
            >
              <div className="text-[10.5px] font-medium text-slate-500 dark:text-zinc-400">
                {h.label}
              </div>
              <div className="text-sm sm:text-base font-black font-mono text-slate-900 dark:text-white">
                {h.value}
              </div>
              {h.change && (
                <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {h.change}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Strategic Summary */}
        <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
          {selectedPillar.summary}
        </p>

        {/* Catalysts & Risks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {/* Catalysts */}
          <div className="p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>핵심 성장 촉매 (Growth Catalysts)</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-zinc-300 space-y-1 list-disc list-inside">
              {selectedPillar.catalysts.map((c, idx) => (
                <li key={idx} className="leading-relaxed">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Risks */}
          <div className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>모니터링 리스크 (Risk Factors)</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-zinc-300 space-y-1 list-disc list-inside">
              {selectedPillar.risks.map((r, idx) => (
                <li key={idx} className="leading-relaxed">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
