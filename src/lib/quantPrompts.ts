import { StockFundamentals } from '../types/stock';

export type SynthesisReportType = 'memo' | 'blackwell_ai' | 'geopolitics_asic' | 'valuation';

/**
 * Real-time synthesis prompt builder injecting NVIDIA's exact live metrics
 */
export function buildPromptForType(
  type: SynthesisReportType,
  nvda: StockFundamentals
): { system: string; user: string } {
  const current = nvda.currentPrice || 207.41;
  const target = nvda.targetMeanPrice || 265.50;
  const fpe = nvda.forwardPE || 30.2;
  const pe = nvda.trailingPE || 45.0;
  const gm = nvda.grossMargins ? (nvda.grossMargins * 100).toFixed(1) : '74.9';

  const system = `당신은 월스트리트 헤지펀드의 시니어 반도체 애널리스트이자 엔비디아(NVIDIA Corporation, NVDA) 전문 수석 퀀트 연구원입니다.
제공된 실시간 주가, 재무제표, 밸류에이션, Blackwell 아키텍처 및 하이퍼스케일러 CapEx 데이터를 바탕으로 엔비디아 투자자를 위한 깊이 있고 통찰력 있는 한국어 분석 보고서를 작성하세요.
답변은 가독성 높은 마크다운(#, ##, 불릿 포인트, 볼드) 형식으로 명확하게 정돈되어야 합니다.`;

  if (type === 'blackwell_ai') {
    const user = `[엔비디아 Blackwell 아키텍처 & 하이퍼스케일러 AI 인프라 해자 심층 분석 요청]
- 현재 주가: $${current} (시가총액: $${((nvda.marketCap || 5.1e12) / 1e12).toFixed(2)}T)
- 데이터센터 매출: 전사 매출의 85%+ 견인, Blackwell GB200 NVL72 랙 양산 가속
- 빅테크 CapEx: 마이크로소프트, 구글, 메타, 아마존 등 하이퍼스케일러 4사 연간 합산 CapEx $200B+ 돌파
- 네트워킹: Spectrum-X 이더넷 및 InfiniBand 연간 수십억 달러 단위 성장
- 공급망: TSMC 첨단 CoWoS 패키징 증설 및 HBM3e 수율 안정화

다음 핵심 항목을 정밀하게 분석해 주세요:
1. GB200 NVL72 랙 시스템(ASP $2~3M) 단위 판매 확대로 인한 매출 단가 퀀텀점프
2. 단순 GPU 제조사를 넘어 수냉식 시스템/네트워킹 풀스택 인프라로의 진화와 해자
3. 2025~2026년 실적 가시성과 TSMC CoWoS 공급망 병목 완화 전망`;
    return { system, user };
  }

  if (type === 'geopolitics_asic') {
    const user = `[엔비디아 대중국 반도체 수출 통제 & 빅테크 자체 ASIC 위협 진단 요청]
- 현재 주가: $${current} | Trailing P/E: ${pe}x | Forward P/E: ${fpe}x
- 지정학적 이슈: 미 상무부 BIS의 대중국 첨단 반도체 수출 통제, H20 칩 규제 노이즈 및 중동 라이선스
- 매출 다변화: 과거 20~25%이던 중국 매출 비중이 한 자릿수대로 축소, 글로벌 대기 수요가 완전 흡수
- 경쟁 구도: 구글 TPU, AWS Trainium, 메타 MTIA 등 자체 실리콘 확대 및 AMD MI325X/MI350 등장
- 소프트웨어 해자: 전 세계 500만 명 이상의 AI 개발자를 락인한 CUDA 생태계

다음 항목을 냉철하게 분석해 주세요:
1. 미-중 기술 패권 전쟁 및 추가 수출 규제가 엔비디아 실질 펀더멘털에 미치는 영향
2. 빅테크 자체 ASIC 대비 CUDA 생태계 및 초거대 프론티어 LLM 사전학습(Pre-training)에서의 대체 불가성
3. 시장의 점유율 잠식 우려와 실제 엔비디아 가속기 지배력 간의 괴리 분석`;
    return { system, user };
  }

  if (type === 'valuation') {
    const user = `[엔비디아 밸류에이션 및 70%+ 마진율 지속가능성 감사 요청]
- 현재가: $${current} | Forward P/E: ${fpe}x | Trailing P/E: ${pe}x
- 수익성 지표: 매출총이익률(Gross Margin) ${gm}% | 영업이익률 60%+
- 현금성 자산: 총 현금 $${((nvda.totalCash || 38.5e9) / 1e9).toFixed(1)}B | 잉여현금흐름(FCF) 연간 수백억 달러 창출
- 월가 목표가: 평균 $${target} (최고 $${nvda.targetHighPrice || 300}, 최저 $${nvda.targetLowPrice || 190})
- 주주환원: 수백억 달러 규모 자사주 매입 집행

다음 항목을 평가해 주세요:
1. 연간 순이익 성장률 대비 주가 멀티플(PEG 0.8x~1.1x)의 건전성 및 역사적 밴드 비교
2. Blackwell 랙 단위 판매 본격화 시 매출총이익률 70%+ 수성 가능성
3. 역(Reverse) DCF 관점의 내재가치와 장기 투자자를 위한 밸류에이션 안전마진`;
    return { system, user };
  }

  // default 'memo'
  const user = `[엔비디아(NVIDIA · NVDA) 종합 퀀트 리서치 메모 작성 요청]
- 현재가: $${current} | 시가총액: $${((nvda.marketCap || 5.1e12) / 1e12).toFixed(2)}T
- 52주 레인지: $${nvda.fiftyTwoWeekLow || 85.0} ~ $${nvda.fiftyTwoWeekHigh || 215.38}
- P/E: ${pe}x | Forward P/E: ${fpe}x | 월가 평균 목표가: $${target}
- 매출총이익률: ${gm}%

다음 순서로 핵심 퀀트 리포트를 작성해 주세요:
1. 📊 최근 공식 실적 팩트체크 및 월가 컨센서스 상회 분석
2. 🚀 핵심 사업 성장 엔진 (Blackwell, Data Center, Spectrum-X 네트워킹)
3. 📉 최근 시장 변동성 및 수급 분석
4. 🎯 최종 투자의견(OUTPERFORM) 및 권장 매수 밴드`;
  return { system, user };
}
