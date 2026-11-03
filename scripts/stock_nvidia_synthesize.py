#!/usr/bin/env python3
"""
NVIDIA (NVIDIA Corporation · NVDA) Local LLM Quantitative Synthesis Engine
- Reads fresh market and official filings data from public/data/NVDA.json
- Connects to local Ollama (http://127.0.0.1:11434) using Gemma (e.g. gemma4-daily:latest, gemma4-agent)
- Dynamically injects whatever the latest reported quarter, consensus surprise, and upcoming earnings dates are
- Generates 4 institutional investment reports:
  1. memo: Comprehensive Institutional Quant Memo
  2. blackwell_ai: Blackwell & Datacenter AI Infrastructure Moat
  3. geopolitics_asic: US-China Export Controls & Custom ASIC Threat Assessment
  4. valuation: Multiples, 70%+ Gross Margin Sustainability & Reverse DCF
- Writes output to public/data/synthesis.json
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error
from datetime import datetime
from zoneinfo import ZoneInfo

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
PUBLIC_DATA_DIR = os.path.join(PROJECT_ROOT, "public", "data")
SYNTHESIS_FILE = os.path.join(PUBLIC_DATA_DIR, "synthesis.json")

raw_host = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434").strip()
if not raw_host.startswith(("http://", "https://")):
    if ":" not in raw_host:
        raw_host = "http://127.0.0.1:11434"
    else:
        raw_host = f"http://{raw_host}"
if "0.0.0.0" in raw_host:
    raw_host = raw_host.replace("0.0.0.0", "127.0.0.1")
OLLAMA_HOST = raw_host.rstrip("/")

PREFERRED_MODELS = [
    "gemma4-daily:latest",
    "gemma4-agent:latest",
    "gemma4-coding:latest",
    "gemma4:26b-a4b",
    "llama3.3:latest",
    "llama3:latest",
]

def load_json(filepath):
    if not os.path.exists(filepath):
        return None
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"[WARN] Failed to load {filepath}: {e}")
        return None

def detect_ollama_model():
    """Finds best available model on local Ollama."""
    url = f"{OLLAMA_HOST}/api/tags"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            installed = [m.get("name") for m in data.get("models", [])]
            for pref in PREFERRED_MODELS:
                if pref in installed:
                    return pref
            if installed:
                return installed[0]
    except Exception as e:
        print(f"[INFO] Local Ollama not reachable at {url}: {e}")
    return None

def call_ollama(model: str, system_prompt: str, user_prompt: str, timeout: int = 70) -> str:
    """Calls Ollama chat endpoint."""
    url = f"{OLLAMA_HOST}/api/chat"
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "stream": False,
        "options": {
            "temperature": 0.3,
            "top_p": 0.9,
        },
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})

    t0 = time.time()
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        elapsed = round(time.time() - t0, 2)
        content = res.get("message", {}).get("content", "").strip()
        print(f"[{model}] Generated report in {elapsed}s ({len(content)} chars)")
        return content

def generate_algorithmic_fallback(nvda, earnings):
    """Robust quant rules fallback using live dynamic metrics when Ollama is offline."""
    p_a = nvda.get("currentPrice", 207.41)
    pe = nvda.get("trailingPE", 45.0)
    fpe = round(nvda.get("forwardPE", 30.2), 1)
    target = nvda.get("targetMeanPrice", 265.50)
    upside = round(((target - p_a) / p_a) * 100, 1) if p_a else 28.0

    quarter = earnings.get("quarter", "최신 공식 분기")
    rep_date = earnings.get("reportDate", "최근 공시")
    eps = earnings.get("eps", 0.81)
    eps_est = earnings.get("epsEstimate", 0.75)
    surprise = earnings.get("epsSurprisePercent", 8.0)
    rev = earnings.get("revenue", 35.1)
    rev_yoy = earnings.get("revenueYoY", 93.6)
    opm = earnings.get("operatingMargins", 62.1)
    gross_margin = nvda.get("grossMargins", 0.749)
    gm_pct = round(gross_margin * 100, 1) if gross_margin else 75.0
    next_date = earnings.get("nextEarningsDate", "차기 분기 공시 예정")

    memo = f"""### 📊 엔비디아(NVIDIA · NVDA) {quarter} 공식 실적 및 실시간 퀀트 메모

**기준 시세**: NVDA 현재가 ${p_a} | 52주 레인지: ${nvda.get('fiftyTwoWeekLow', 85.0)} ~ ${nvda.get('fiftyTwoWeekHigh', 215.38)}
**공식 발표일**: {rep_date} (차기 실적 발표: {next_date})

#### 1. 📊 {quarter} 핵심 실적 팩트체크
- **매출 성과**: 분기 매출 **${rev}B (+{rev_yoy}% YoY)**로 압도적인 초고속 성장세를 지속하고 있습니다.
- **주당순이익(EPS)**: **${eps}** (월가 예상치 ${eps_est}, 서프라이즈 +{surprise}%).
- **수익성 체력**: 매출총이익률(Gross Margin) **{gm_pct}%**, 영업이익률(OPM) **{opm}%** 수준으로 독보적인 가격결정력(Pricing Power)을 입증했습니다.

#### 2. 🚀 핵심 사업 성장 엔진 (Data Center & Blackwell)
- **Data Center 가속기 독점**: 마이크로소프트, 구글, 메타, AWS 등 하이퍼스케일러의 AI CapEx 확대에 힘입어 전사 매출의 85% 이상을 견인하고 있습니다.
- **Blackwell GB200 NVL72 랙 양산**: 단순 GPU 판매를 넘어 액체 냉각 시스템 및 NVLink 네트워킹을 통합한 랙 단위 판매(ASP $2~3M)로 매출 단가를 퀀텀점프시켰습니다.

#### 3. 🎯 밸류에이션 및 투자 전략
- **투자의견**: **OUTPERFORM (적극 분할 매수)**
- **진단**: Trailing P/E {pe}x 및 Forward P/E {fpe}x는 90%+ 매출 성장률 대비 PEG 1.0x 내외의 합리적 밸류에이션 구간에 위치합니다.
- **월가 컨센서스 목표가**: **${target}** (+{upside}% 상방 여력)"""

    blackwell_ai = f"""### 🚀 Blackwell 아키텍처 & 하이퍼스케일러 AI 인프라 해자 심층 분석

#### 1. ⚡ GB200 NVL72 랙 스케일 혁신과 초과수요
- **데이터센터 단위 컴퓨팅 전환**: 72개 Blackwell GPU와 36개 Grace CPU를 액체 냉각 랙 하나로 통합하여, 기존 Hopper 대비 LLM 추론 성능을 최대 30배 향상시켰습니다.
- **12개월 이상 전량 완판 수주**: 빅테크 하이퍼스케일러들의 사전 발주로 차세대 랙 시스템의 공급 물량이 이미 1년 이상 백로그로 채워져 있습니다.

#### 2. 🌐 네트워킹 풀스택(Spectrum-X & InfiniBand) 시너지
- **Spectrum-X 이더넷 급성장**: 기존 초고가 InfiniBand 외에도 범용 이더넷 환경에서 초저지연 AI 클러스터를 구축할 수 있는 Spectrum-X 매출이 연간 수십억 달러 규모로 폭증했습니다.
- **GPU + 스위치 + 광모듈 번들링**: 칩 단위 경쟁을 시스템 아키텍처 단위 경쟁으로 전환하여 경쟁사의 진입 장벽을 극대화했습니다.

#### 3. 🎯 퀀트 결론
- TSMC CoWoS-L 첨단 패키징 증설과 함께 Blackwell 출하가 본격화됨에 따라, 2025~2026년 실적 가시성은 빅테크 중 가장 확고합니다."""

    geopolitics_asic = f"""### 🛡️ 대중국 반도체 수출 통제 & 빅테크 자체 ASIC 위협 진단

#### 1. 🔍 미 상무부 수출 규제 영향과 포트폴리오 다변화
- **중국 비중의 구조적 축소**: 과거 전사 매출의 20~25%를 차지하던 중국 비중이 미 정부 규제로 인해 한 자릿수대로 축소되었으나, 미국 및 유럽, 중동 하이퍼스케일러의 대기 수요가 이를 완전히 흡수했습니다.
- **H20 칩 규제 불확실성**: 규제 변화에 따른 단기 변동성은 불가피하나, 글로벌 전체 AI 칩 초과수요 상태가 하방을 방어합니다.

#### 2. ⚡ 빅테크 자체 ASIC(TPU/Trainium) 대비 CUDA 소프트웨어 해자
- **500만 AI 개발자의 CUDA 락인**: 전 세계 프론티어 AI 연구원과 엔지니어가 CUDA 라이브러리(TensorRT, cuDNN)에 종속되어 있어 다른 아키텍처로의 전환 비용이 천문학적입니다.
- **특화 추론 vs 범용 프론티어 학습**: 자체 ASIC은 내부 특화 추론 워크로드에 한정되며, 수만 개 파라미터의 차세대 초거대 파운데이션 모델 사전학습(Pre-training)에서는 엔비디아 가속기 대체가 사실상 불가능합니다.

#### 3. 🎯 결론
- 자체 실리콘 도입 확대는 엔비디아의 성장을 가로막는 위협이 아니라, AI 전체 인프라 파이(TAM)의 폭발적 팽창 과정에서 동반 성장하는 국면입니다."""

    valuation = f"""### 💎 엔비디아(NVDA) 실시간 밸류에이션 & 70%+ 마진율 지속가능성 감사

#### 1. 📊 주가 멀티플 및 PEG 관점의 밸류에이션
- **Trailing P/E**: **{pe}x** | **Forward P/E**: **{fpe}x**
- **PEG Ratio (주가수익성장비율)**: 연간 50~90% 수준의 순이익 성장률을 감안할 때 PEG는 **0.8x ~ 1.1x** 수준으로 역사적 평균 대비 과열되지 않은 건전한 구간입니다.
- **월가 목표주가**: 평균 **${target}** (현재가 ${p_a} 대비 **+{upside}%** 상승 여력)

#### 2. 🏰 70%+ 매출총이익률(Gross Margin)의 지속성
- 시스템 랙(GB200) 비중 확대로 초기 마진율이 일시적으로 70% 초반대로 수렴할 수 있으나, 소프트웨어(NVIDIA AI Enterprise) 라이선스 및 고마진 네트워킹 매출 믹스 개선으로 70% 중반대 마진 방어력이 유지될 전망입니다.
- 연간 수백억 달러 규모의 잉여현금흐름(FCF) 창출과 지속적인 자사주 매입이 강력한 주당 가치 상승을 견인합니다.

#### 3. 📈 역(Reverse) DCF 관점
- 현재 주가는 향후 5년간 연평균 FCF 성장률 약 15~18%를 반영하고 있으며, AI 산업의 구조적 성장 사이클(연평균 30%+)을 고려할 때 중장기 상승 여력이 충분합니다."""

    return memo, blackwell_ai, geopolitics_asic, valuation

def main():
    print("=== NVIDIA (NVIDIA Corporation · NVDA) Dynamic Synthesis Engine ===")

    # 1. Load data
    nvda_data = load_json(os.path.join(PUBLIC_DATA_DIR, "NVDA.json")) or {}
    nvda_f = nvda_data.get("fundamentals", {})

    p_a = nvda_f.get("currentPrice", 207.41)

    # 2. Extract dynamic official earnings data & volatility alert
    earnings = nvda_data.get("earnings_brief") or nvda_data.get("earnings_flash") or {}
    quarter = earnings.get("quarter", "최신 공식 분기")
    rep_date = earnings.get("reportDate", "최근 공시")
    eps = earnings.get("eps", 0.81)
    eps_est = earnings.get("epsEstimate", 0.75)
    surprise = earnings.get("epsSurprisePercent", 8.0)
    rev = earnings.get("revenue", 35.1)
    rev_yoy = earnings.get("revenueYoY", 93.6)
    opm = earnings.get("operatingMargins", 62.1)
    gross_margin = nvda_f.get("grossMargins", 0.749)
    gm_pct = round(gross_margin * 100, 1) if gross_margin else 75.0
    next_date = earnings.get("nextEarningsDate", "차기 분기 공시 예정")

    # Volatility Alert context (>= 3.0% moves or catalyst)
    vol_alert = nvda_data.get("volatility_alert") or {}
    vol_triggered = vol_alert.get("triggered", False)
    vol_pct = vol_alert.get("changePercent", nvda_f.get("changePercent", 0.0))
    vol_headline = vol_alert.get("headline", "")
    vol_reason = vol_alert.get("primaryReason", "")

    pe = nvda_f.get("trailingPE", 45.0)
    fpe = round(nvda_f.get("forwardPE", 30.2), 1)
    target = nvda_f.get("targetMeanPrice", 265.50)
    market_cap_t = nvda_f.get("marketCap", 5.1e12) / 1e12
    upside = round(((target - p_a) / p_a) * 100, 1) if p_a else 28.0

    # 3. Check local Ollama
    model = detect_ollama_model()
    now_kst = datetime.now(ZoneInfo("Asia/Seoul")).isoformat()
    now_ny = datetime.now(ZoneInfo("America/New_York")).isoformat()

    system_prompt = (
        "당신은 월스트리트 헤지펀드의 시니어 반도체 애널리스트이자 엔비디아(NVIDIA Corporation, NVDA) 전문 수석 퀀트 연구원입니다. "
        "제공된 실시간 주가, 재무제표, 밸류에이션, Blackwell 아키텍처 및 하이퍼스케일러 CapEx 데이터를 바탕으로 엔비디아 투자자를 위한 깊이 있고 통찰력 있는 한국어 분석 보고서를 작성하세요. "
        "답변은 가독성 높은 마크다운(#, ##, 불릿 포인트, 볼드) 형식으로 명확하게 정돈되어야 합니다."
    )

    memo_text = None
    blackwell_ai_text = None
    geopolitics_asic_text = None
    valuation_text = None
    engine_used = "offline_quant"

    if model:
        print(f"[Ollama] Detected local model: {model}. Synthesizing 4 NVIDIA investor reports with dynamic official metrics ({quarter})...")
        try:
            # 1. Memo
            vol_snippet = f"- [🚨 긴급 시장 변동성/촉매 경보]: {vol_headline} | 원인: {vol_reason}\n" if vol_triggered else ""
            u_memo = f"""[엔비디아(NVIDIA · NVDA) {quarter} 최신 공식 실적 및 실시간 퀀트 리서치 메모 작성]
- 기준 시세: NVDA 현재가 ${p_a} | 52주 범위: ${nvda_f.get('fiftyTwoWeekLow', 85.0)} ~ ${nvda_f.get('fiftyTwoWeekHigh', 215.38)}
{vol_snippet}- 공식 실적 데이터 ({quarter}, 발표일: {rep_date}):
  * 매출: ${rev}B (성장률: +{rev_yoy}% YoY)
  * 주당순이익(EPS): ${eps} (월가 예상: ${eps_est}, 서프라이즈: +{surprise}%)
  * 매출총이익률: {gm_pct}% | 영업이익률: {opm}%
  * 차기 실적 발표 예정일: {next_date}
- 시가총액: ${market_cap_t:.2f}T | Trailing P/E: {pe}x | Forward P/E: {fpe}x
- 월가 컨센서스 목표가: ${target} (+{upside}% 상방 여력)

핵심 내용을 다음 순서로 간결하고 임팩트 있게 요약해 주세요:
1. 📊 {quarter} 실적 팩트체크: 매출, EPS 성과 및 마진율({gm_pct}%)과 월가 컨센서스 비교
2. 🚀 핵심 사업 성장 엔진 (Data Center, Blackwell GB200, Spectrum-X 네트워킹)
3. 📉 최근 시장 주가 변동성({vol_pct:+.2f}%) 심층 원인 진단 및 수급 분석
4. 🎯 최종 투자 의견(OUTPERFORM) 및 추천 매수 밴드"""
            memo_text = call_ollama(model, system_prompt, u_memo)

            # 2. Blackwell & Datacenter
            u_blackwell = f"""[엔비디아 Blackwell 아키텍처 & 하이퍼스케일러 AI 인프라 해자 심층 분석 보고서 작성]
- 데이터센터 매출 비중 85%+ | 차세대 GB200 NVL72 랙 양산 본격화 (ASP $2~3M)
- 빅테크 하이퍼스케일러(MSFT, META, GOOGL, AMZN) 합산 연간 CapEx $200B+ 돌파 수혜
- TSMC 첨단 CoWoS 패키징 캐파 증설 및 HBM3e 공급망 안정화
- Spectrum-X 이더넷 및 InfiniBand 풀스택 네트워킹 번들링 독점력

다음 항목을 심층적으로 다루어 주세요:
1. ⚡ GB200 NVL72 랙 스케일 아키텍처와 전량 완판 수주 모멘텀
2. 🌐 GPU를 넘어 시스템/네트워킹 풀스택 인프라로의 진화 (Spectrum-X의 고성장)
3. 🎯 2025~2026년 실적 퀀텀점프 가시성과 공급망 병목 완화 전망"""
            blackwell_ai_text = call_ollama(model, system_prompt, u_blackwell)

            # 3. Geopolitics & Custom ASIC
            u_geopolitics = f"""[엔비디아 대중국 반도체 수출 통제 & 빅테크 자체 ASIC 위협 진단 보고서 작성]
- 미 상무부 BIS의 대중국 첨단 반도체 수출 통제 및 중동 라이선스 규제 노이즈
- 중국 매출 비중 과거 20~25%에서 한 자릿수대로 축소 및 글로벌 대체 수요의 흡수
- 빅테크 자체 실리콘(구글 TPU, AWS Trainium, 메타 MTIA) 및 AMD MI325X/MI350 경쟁 구도
- 500만 명 이상의 AI 개발자를 락인한 CUDA 소프트웨어 생태계 해자

다음 항목을 객관적이고 균형 있게 분석해 주세요:
1. 🔍 미-중 기술 패권 전쟁 및 수출 규제가 엔비디아 실질 펀더멘털에 미치는 영향
2. ⚡ 빅테크 자체 ASIC 대비 CUDA 소프트웨어 및 범용 초거대 LLM 사전학습에서의 대체 불가성
3. 🎯 경쟁 심화 우려에 대한 퀀트 평가와 장기 해자 지속성"""
            geopolitics_asic_text = call_ollama(model, system_prompt, u_geopolitics)

            # 4. Valuation
            u_valuation = f"""[엔비디아 실시간 밸류에이션 & 70%+ 마진율 지속가능성 감사 보고서 작성]
- 현재가: ${p_a} | 시가총액: ${market_cap_t:.2f}T
- Trailing P/E: {pe}x | Forward P/E: {fpe}x (피어 테크 평균 및 자체 역사적 밴드)
- 매출총이익률(Gross Margin): {gm_pct}% | 영업이익률: {opm}%
- 월가 평균 목표주가: ${target} (+{upside}%)
- 연간 수백억 달러 규모 FCF 창출 및 자사주 매입 집행

다음 항목을 퀀트적 시각으로 감사해 주세요:
1. 📊 주가 멀티플(FPE {fpe}x) 및 실적 성장률(PEG) 관점의 밸류에이션 매력도
2. 🏰 70%+ 매출총이익률 유지 가능성과 가격결정력(Pricing Power)
3. 📈 역(Reverse) DCF 관점의 내재 가치와 장기 투자자를 위한 안전마진"""
            valuation_text = call_ollama(model, system_prompt, u_valuation)

            engine_used = f"ollama_{model}"
        except Exception as e:
            print(f"[WARN] Ollama call failed or timed out: {e}. Falling back to dynamic quant rules.")
            memo_text = None

    # Fallback if Ollama unavailable or failed
    if not memo_text:
        print("[INFO] Utilizing deterministic quantitative dynamic rules engine.")
        memo_text, blackwell_ai_text, geopolitics_asic_text, valuation_text = generate_algorithmic_fallback(nvda_f, earnings)
        engine_used = "offline_quant_rule_engine"

    synthesis_result = {
        "metadata": {
            "symbol": "NVDA",
            "company_name": "NVIDIA Corporation",
            "engine": engine_used,
            "generated_at_kst": now_kst,
            "generated_at_ny": now_ny,
            "stock_price_ref": p_a,
            "earnings_quarter_ref": quarter,
        },
        "reports": {
            "memo": memo_text,
            "blackwell_ai": blackwell_ai_text,
            "geopolitics_asic": geopolitics_asic_text,
            "valuation": valuation_text,
        }
    }

    with open(SYNTHESIS_FILE, "w", encoding="utf-8") as f:
        json.dump(synthesis_result, f, ensure_ascii=False, indent=2)

    print(f"[SUCCESS] Saved synthesis reports to {SYNTHESIS_FILE} (Engine: {engine_used})")

if __name__ == "__main__":
    main()
