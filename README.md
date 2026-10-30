# NVIDIA on Tap (stock-nvidia)

> **엔비디아(NVIDIA · NVDA) 올인원 주식 인텔리전스, 로컬 Gemma LLM 퀀트 취합 & 트레이딩뷰 허브**  
> **공식 서비스 도메인**: `https://nvda.on-tap.xyz` · `https://nvidia.on-tap.xyz`  
> **생태계**: [Stock on Tap](https://stock.on-tap.xyz) · [Alphabet on Tap](https://google.on-tap.xyz) · [Alpha on Tap](https://alpha.on-tap.xyz) · [On Tap Dev](https://dev.on-tap.xyz)

---

## 1. 개요 (Overview)

**NVIDIA on Tap**은 글로벌 AI 가속 컴퓨팅과 데이터센터 GPU 시장을 사실상 독점하고 있는 **엔비디아(NVIDIA Corporation · NASDAQ: NVDA)**의 모든 펀더멘털, 실시간 시세, 기술적 보조지표, 4대 사업부 해자 분석을 총망라한 전문 핀테크 웹 애플리케이션입니다.

맥미니 온디바이스 거대언어모델(**Ollama × Google Gemma**)을 파이프라인에 연결하여 실시간 체결가, Blackwell GB200 양산 수율, 하이퍼스케일러 CapEx, 재무제표 데이터를 즉시 취합 및 스트리밍 추론하는 **실시간 로컬 LLM 퀀트 취합 스테이션**을 탑재하였습니다.

---

## 2. 핵심 기능 (Key Capabilities)

### 2.1 ⚡ 온디바이스 로컬 LLM 실시간 퀀트 취합 스테이션 (Local Ollama Integration)
- **로컬 Gemma 모델 연동**: `gemma4-daily:latest`, `gemma4-agent:latest`, `gemma4-coding:latest`
- **4대 핵심 심층 투자 보고서**:
  1. **종합 퀀트 리서치 메모 (Institutional Memo)**: 2026 Q2 공식 실적 팩트체크, OPM 62%+, PEG 0.8x~1.1x 매수 밴드
  2. **Blackwell & AI 인프라 해자 (Blackwell AI Moat)**: GB200 NVL72 랙 단위 풀스택(ASP $2~3M) 판매 및 CoWoS-L 공급망 분석
  3. **수출 통제 & ASIC 위협 진단 (Geopolitics & ASIC)**: 미 상무부 대중국 반도체 규제 영향 축소 및 500만 개발자 CUDA 생태계 해자
  4. **밸류에이션 & 70%+ 마진 감사 (Valuation Audit)**: 70%+ 매출총이익률 지속 가능성과 역(Reverse) DCF 밸류에이션
- **스마트 폴백 엔진**: 로컬 Ollama 미실행 시에도 내장 퀀트 규칙 엔진을 통해 즉각적인 분석 제공
- **AI 네이티브 앱 딥링크 연동 (`aiAppLauncher.ts`)**: Google Gemini, ChatGPT, Claude, Perplexity, Grok 앱 원클릭 실행

### 2.2 🚨 3% 이상 변동성 & 주요 촉매 감지 레이더 (Volatility Alert Hub)
- 일중 3% 이상 급변동 시 촉매(Blackwell 수율, 빅테크 CapEx, 대중국 규제, 실적)를 자동 감지하고 구조적 동인과 기관 퀀트 의견을 즉시 브리핑

### 2.3 📈 트레이딩뷰(TradingView) 풀스택 차트 & 피어 비교 스위트
- **실시간 캔들스틱 인터랙티브 차트**: 5분/15분/1시간/일봉/주봉 타임프레임, RSI 및 이동평균선 내장
- **기술적 분석 게이지 (Technical Analysis Gauge)**: 종합 매수/매도/중립 시그널
- **AI 반도체 피어 비교**: NVDA vs TSM, AVGO, AMD, MSFT, GOOGL, SMH, QQQ 상대수익률 오버레이

### 2.4 🏰 엔비디아 4대 사업부 해자 분석 (4 Pillars)
- **데이터센터 & Blackwell 가속기** (매출 85%+ 견인, GB200 랙 판매)
- **AI 네트워킹 & NVLink 인터커넥트** (Spectrum-X 이더넷, Quantum InfiniBand)
- **게이밍 & 클라이언트 AI** (GeForce RTX 50 시리즈, DLSS 4.0)
- **오토모티브 & 피지컬 AI 로보틱스** (DRIVE Thor, Isaac Robotics, Omniverse)

### 2.5 🧮 역(Reverse) DCF 계산기 & 밸류에이션 감사
- 할인율(WACC), 영구 성장률 슬라이더를 통한 주가 내재 FCF 성장률 역산
- 월가 평균/최고/최저 목표주가 및 밸류에이션 안전마진(Safety Margin) 시각화

---

## 3. 기술 스택 & 표준 준수

- **프론트엔드**: React 19, TypeScript, Vite 6, Tailwind CSS v4 (`@custom-variant dark`)
- **다크/라이트 테마**: 3-State (`auto` | `light` | `dark`), DOM 듀얼 동기화, `color-scheme: only light` 모바일 보호
- **UI/UX 표준**: 헤더 `⋯` 컨텍스트 메뉴 (`data-brand-context-menu="true"`), `🍺 Buy me a beer` 후원 모달 연동
- **인프라**: Cloudflare Pages / Workers (`wrangler.toml` assets SPA 라우팅)
- **데이터 파이프라인**: Python 3.15, `yfinance`, Local Ollama (`gemma4-daily`)
