#!/usr/bin/env python3
"""
NVIDIA (NVDA) Dedicated Real-time Data Fetcher
- Directly queries Yahoo Finance (yfinance)
- Computes RSI(14) and MFI(14)
- Formats OHLCV candles (1h, 1d, 1w)
- Extracts rich valuation fundamentals and Wall Street targets
- Detects NVIDIA AI catalysts (Blackwell, Hyperscaler CapEx, Export Controls, Custom ASICs)
- Generates public/data/NVDA.json
"""

import json
import os
import sys
import time
import warnings
from datetime import datetime
from zoneinfo import ZoneInfo
import pandas as pd

warnings.filterwarnings("ignore")

try:
    import yfinance as yf
except ImportError:
    print("[WARN] yfinance not installed. Run: pip install yfinance pandas")
    sys.exit(0)

PUBLIC_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "data")
os.makedirs(PUBLIC_DATA_DIR, exist_ok=True)

TARGET_TICKERS = ["NVDA"]

def extract_dynamic_earnings(stock, info):
    """
    Dynamically extracts official earnings reports, consensus, and calendar dates
    from official exchange/SEC feeds via yfinance (earnings_dates, calendar, financials).
    Eliminates rigid static quarter hardcoding.
    """
    now = datetime.now(ZoneInfo("America/New_York"))
    res = {
        "hasData": False,
        "quarter": "최신 공식 분기",
        "reportDate": None,
        "revenue": None,
        "revenueYoY": None,
        "revenueEstimate": None,
        "revenueBeat": None,
        "eps": None,
        "epsEstimate": None,
        "epsSurprisePercent": None,
        "epsBeat": None,
        "daysSinceReport": None,
        "isBreaking": False,
        "nextEarningsDate": None,
        "nextEpsEstimate": None,
        "revenueGrowthYoY": round(info.get("revenueGrowth", 0) * 100, 1) if info.get("revenueGrowth") else None,
        "earningsGrowthYoY": round(info.get("earningsGrowth", 0) * 100, 1) if info.get("earningsGrowth") else None,
        "operatingMargins": round(info.get("operatingMargins", 0) * 100, 1) if info.get("operatingMargins") else None,
        "totalRevenueTTM": round(info.get("totalRevenue", 0) / 1e9, 1) if info.get("totalRevenue") else None,
        "keyTakeaway": "",
    }

    # 1. Official Earnings Dates & Reported EPS vs Estimate
    try:
        ed = stock.earnings_dates
        if ed is not None and not ed.empty:
            reported = ed[ed["Reported EPS"].notna()]
            if not reported.empty:
                latest_ts = reported.index[0]
                latest_row = reported.iloc[0]
                rep_dt = latest_ts.to_pydatetime()
                
                # Dynamic Quarter naming (e.g., Oct report = Q3, Feb report = Q4, etc.)
                m = rep_dt.month
                y = rep_dt.year
                if m in [1, 2, 3]:
                    q_name = f"{y - 1} Q4"
                elif m in [4, 5, 6]:
                    q_name = f"{y} Q1"
                elif m in [7, 8, 9]:
                    q_name = f"{y} Q2"
                else:
                    q_name = f"{y} Q3"

                days_diff = (now.date() - rep_dt.date()).days
                rep_eps = round(float(latest_row["Reported EPS"]), 2)
                est_eps = round(float(latest_row["EPS Estimate"]), 2) if pd.notna(latest_row.get("EPS Estimate")) else None
                surprise = round(float(latest_row["Surprise(%)"]), 2) if pd.notna(latest_row.get("Surprise(%)")) else None

                res["hasData"] = True
                res["quarter"] = q_name
                res["reportDate"] = rep_dt.strftime("%Y-%m-%d")
                res["eps"] = rep_eps
                res["epsEstimate"] = est_eps
                res["epsSurprisePercent"] = surprise
                res["epsBeat"] = (surprise >= 0) if surprise is not None else (rep_eps >= est_eps if est_eps else True)
                res["daysSinceReport"] = max(0, days_diff)
                res["isBreaking"] = days_diff <= 14  # Breaking alert if within 14 days of release
            
            # Next upcoming earnings date
            upcoming = ed[ed["Reported EPS"].isna()]
            if not upcoming.empty:
                next_ts = upcoming.index[-1]
                next_dt = next_ts.to_pydatetime()
                res["nextEarningsDate"] = next_dt.strftime("%Y-%m-%d")
                res["nextEpsEstimate"] = round(float(upcoming.iloc[-1]["EPS Estimate"]), 2) if pd.notna(upcoming.iloc[-1].get("EPS Estimate")) else None
    except Exception as e:
        print(f"[{info.get('symbol', 'TICKER')}] earnings_dates extraction note: {e}")

    # 2. Calendar fallback for next earnings date
    if not res.get("nextEarningsDate"):
        try:
            cal = stock.calendar
            if cal and "Earnings Date" in cal and cal["Earnings Date"]:
                res["nextEarningsDate"] = str(cal["Earnings Date"][0])
            if cal and "Earnings Average" in cal and cal["Earnings Average"]:
                res["nextEpsEstimate"] = round(float(cal["Earnings Average"]), 2)
        except Exception:
            pass

    # 3. Dynamic Revenue from quarterly income stmt or info
    try:
        qi = stock.quarterly_income_stmt
        if qi is not None and not qi.empty and "Total Revenue" in qi.index:
            valid_cols = [c for c in qi.columns if pd.notna(qi.loc["Total Revenue", c])]
            if valid_cols:
                latest_col = valid_cols[0]
                q_rev = qi.loc["Total Revenue", latest_col]
                if q_rev and q_rev > 0:
                    res["revenue"] = round(float(q_rev) / 1e9, 1)
                
                # If 4 quarters ago exists, compute exact YoY
                if len(valid_cols) >= 5 and pd.notna(qi.loc["Total Revenue", valid_cols[4]]):
                    prev_rev = qi.loc["Total Revenue", valid_cols[4]]
                    if prev_rev and prev_rev > 0:
                        res["revenueYoY"] = round(((q_rev - prev_rev) / prev_rev) * 100, 1)
    except Exception:
        pass

    if res["revenue"] is None and res.get("totalRevenueTTM"):
        # Approximate recent quarter from TTM / 4
        res["revenue"] = round(res["totalRevenueTTM"] / 4, 1)
    if res["revenueYoY"] is None:
        res["revenueYoY"] = res.get("revenueGrowthYoY")

    # 4. Generate dynamic takeaway summary
    beat_str = "예상 상회(Beat)" if res.get("epsBeat") else "예상 하회(Miss)"
    rev_str = f"분기 매출 ${res.get('revenue', 0)}B(+{res.get('revenueYoY', 0)}%)" if res.get("revenue") else f"연간 매출 ${res.get('totalRevenueTTM', 0)}B"
    next_str = f"차기 실적 발표는 {res.get('nextEarningsDate')}로 예정되어 있습니다." if res.get("nextEarningsDate") else ""
    res["keyTakeaway"] = f"{res.get('quarter')} 공식 실적 기준 {rev_str}, 주당순이익(EPS) ${res.get('eps', 0)} ({beat_str})를 기록했습니다. 영업이익률 {res.get('operatingMargins', 0)}% 수준의 본업 수익성을 유지하고 있으며, {next_str}"

    return res

def fetch_ticker_news(ticker: str):
    """
    Fetches latest breaking news for ticker and major Alphabet strategic topics
    (Antitrust/DOJ, Gemini/TPU AI Silicon, Waymo) from Google News RSS feeds.
    """
    import urllib.request
    import xml.etree.ElementTree as ET

    queries = [
        f"{ticker}+NVIDIA+stock",
        f"NVIDIA+Blackwell+OR+AI+GPU+OR+datacenter+OR+export+controls"
    ]

    all_items = []
    seen_titles = set()

    for q in queries:
        url = f"https://news.google.com/rss/search?q={q}&hl=en-US&gl=US&ceid=US:en"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"})
        try:
            with urllib.request.urlopen(req, timeout=5) as resp:
                root = ET.fromstring(resp.read())
                for item in root.findall(".//item")[:6]:
                    title = item.find("title").text if item.find("title") is not None else ""
                    link = item.find("link").text if item.find("link") is not None else ""
                    pubDate = item.find("pubDate").text if item.find("pubDate") is not None else ""
                    source = item.find("source").text if item.find("source") is not None else "Financial News"

                    if " - " in title:
                        parts = title.rsplit(" - ", 1)
                        title_clean = parts[0]
                        source = parts[1]
                    else:
                        title_clean = title

                    clean_key = title_clean.lower().strip()[:40]
                    if clean_key and clean_key not in seen_titles:
                        seen_titles.add(clean_key)
                        all_items.append({
                            "title": title_clean,
                            "source": source,
                            "link": link,
                            "pubDate": pubDate
                        })
        except Exception as e:
            print(f"[{ticker}] RSS query '{q}' note: {e}")

    return all_items[:10]

def detect_major_catalyst_category(news_items: list, earnings: dict):
    """
    Scans real-time news headlines & earnings releases to detect major corporate catalysts
    outside of price fluctuations (Blackwell chips, Datacenter, Export controls, Custom ASIC, Earnings).
    """
    text_corpus = " ".join([n.get("title", "").lower() for n in news_items])

    # 1. Blackwell & GPU Hardware Architecture
    blackwell_keywords = ["blackwell", "b200", "gb200", "rubin", "nvlink", "tsmc", "cowos", "yield", "cooling", "ultra"]
    blackwell_matches = [k for k in blackwell_keywords if k in text_corpus]

    # 2. Datacenter & Hyperscaler Demand
    datacenter_keywords = ["datacenter", "data center", "hyperscaler", "microsoft", "meta", "google", "aws", "amazon", "capex", "cluster", "h100", "h200"]
    datacenter_matches = [k for k in datacenter_keywords if k in text_corpus]

    # 3. Export Controls & Geopolitics
    export_keywords = ["export", "china", "bis", "sanction", "middle east", "h20", "license", "tariff", "taiwan"]
    export_matches = [k for k in export_keywords if k in text_corpus]

    # 4. Custom Silicon Competition (ASIC)
    asic_keywords = ["asic", "tpu", "trainium", "inferentia", "mtia", "in-house", "custom chip", "amd", "mi300"]
    asic_matches = [k for k in asic_keywords if k in text_corpus]

    # 5. Earnings / Financial Guidance
    earnings_keywords = ["earnings", "revenue", "eps", "miss", "beat", "gross margin", "margin", "guidance", "quarterly"]
    earnings_matches = [k for k in earnings_keywords if k in text_corpus]

    days_since_earnings = earnings.get("daysSinceReport", 999)

    # Score and select dominant catalyst
    scores = {
        "BLACKWELL_AI_CHIPS": len(blackwell_matches) * 2.5,
        "DATACENTER_HYPERSCALER": len(datacenter_matches) * 2.0,
        "EXPORT_CONTROLS_GEOPOLITICS": len(export_matches) * 2.5,
        "CUSTOM_SILICON_COMPETITION": len(asic_matches) * 2.0,
        "EARNINGS_CATALYST": len(earnings_matches) * (3.0 if days_since_earnings <= 5 else 1.0),
    }

    best_cat, best_score = max(scores.items(), key=lambda x: x[1])
    if best_score >= 2.0:
        return best_cat, best_score
    return None, 0.0

def evaluate_volatility_alert(ticker: str, info: dict, news_items: list, earnings: dict):
    reg_change_pct = info.get("regularMarketChangePercent") or 0.0
    cur_change_pct = info.get("changePercent") or 0.0
    pre_change_pct = info.get("preMarketChangePercent")
    post_change_pct = info.get("postMarketChangePercent")

    candidates = [reg_change_pct, cur_change_pct]
    if pre_change_pct is not None:
        candidates.append(pre_change_pct)
    if post_change_pct is not None:
        candidates.append(post_change_pct)

    dominant_pct = max(candidates, key=abs)
    threshold = 3.0
    is_volatile = abs(dominant_pct) >= threshold

    catalyst_cat, catalyst_score = detect_major_catalyst_category(news_items, earnings)
    has_major_issue = catalyst_cat is not None
    triggered = is_volatile or has_major_issue

    if is_volatile and has_major_issue:
        trigger_reason = "BOTH"
    elif is_volatile:
        trigger_reason = "PRICE_VOLATILITY"
    elif has_major_issue:
        trigger_reason = "MAJOR_CATALYST"
    else:
        trigger_reason = "NONE"

    if is_volatile and not has_major_issue:
        final_category = "PRICE_VOLATILITY"
    elif catalyst_cat:
        final_category = catalyst_cat
    else:
        final_category = "GENERAL_MARKET"

    direction = "PLUNGE" if dominant_pct < -1.0 else ("SURGE" if dominant_pct > 1.0 else "NEUTRAL")
    dominant_amount = round(float(info.get("regularMarketChange") or info.get("change", 0.0)), 2)
    session_price = round(float(info.get("currentPrice") or info.get("regularMarketPrice", 0.0)), 2)
    now_str = datetime.now(ZoneInfo("America/New_York")).strftime("%Y-%m-%d %H:%M EDT")

    pe = info.get("trailingPE", 45.0)
    fpe = round(info.get("forwardPE", 30.0), 1)

    category_labels = {
        "PRICE_VOLATILITY": "대규모 주가 변동성 (3%+)",
        "BLACKWELL_AI_CHIPS": "Blackwell AI 반도체 양산 및 수율 혁신",
        "DATACENTER_HYPERSCALER": "빅테크 AI CapEx 및 데이터센터 GPU 수주",
        "EXPORT_CONTROLS_GEOPOLITICS": "대중국 반도체 수출 통제 및 지정학적 이슈",
        "CUSTOM_SILICON_COMPETITION": "빅테크 자체 ASIC 반도체 경쟁 및 점유율",
        "EARNINGS_CATALYST": "공식 실적 및 70%+ 마진율 가이던스 공시",
        "GENERAL_MARKET": "일반 시장 안정 상태",
    }
    category_label = category_labels.get(final_category, "중대 기업 이슈")

    # Assemble contextual drivers, headline, verdict, and guide
    drivers = []
    headline = ""
    primary_reason = ""
    verdict = ""
    action_guide = ""
    severity = "NORMAL"

    if not triggered:
        headline = f"엔비디아({ticker}) 특이 변동성 및 중대 이슈 없음 (변동률 {dominant_pct:+.2f}%)"
        primary_reason = f"현재 주가는 일중 변동 폭(±{threshold}% 이내) 내에서 안정적인 흐름을 유지하며, Blackwell 양산과 데이터센터 실적 사이클이 순항 중입니다."
        drivers = [
            {"title": "안정적 변동성 밴드", "description": f"현재 변동률 {dominant_pct:+.2f}%로 3% 이상 급변 기준치 미만입니다.", "type": "info"},
            {"title": "데이터센터 펀더멘털 견고", "description": f"AI 가속기 시장 점유율 85%+ 독점 및 70%+ 총마진율(Gross Margin) 체력 유지.", "type": "positive"},
            {"title": "차기 실적 공시 모니터링", "description": f"차기 분기 공식 실적 발표는 {earnings.get('nextEarningsDate', '일정 집계 중')}로 예정되어 있습니다.", "type": "info"}
        ]
        verdict = f"Blackwell 출하 사이클 진입과 강력한 실적 가시성(Forward P/E {fpe}x)이 주가 하방을 견고하게 지지하고 있습니다."
        action_guide = "차세대 AI 인프라 사이클의 구조적 성장에 기반하여 중장기 보유 전략을 유지하세요."
    elif final_category == "BLACKWELL_AI_CHIPS":
        severity = "HIGH"
        headline = f"🚀 엔비디아({ticker}) 차세대 Blackwell(B200/GB200) 양산 및 서버 랙 공급 가속"
        primary_reason = "엔비디아의 차세대 블랙웰(Blackwell) 아키텍처 GB200 NVL72 랙 양산 본격화 및 TSMC CoWoS 패키징 공급망 수율 안정화 모멘텀이 포착되었습니다."
        drivers = [
            {
                "title": "Blackwell 12개월 이상 전량 완판 수주",
                "description": "빅테크 및 주요 클라우드 사업자들의 선주문으로 2025~2026년 가용 물량이 전량 예약된 초과 수요 국면.",
                "type": "positive"
            },
            {
                "title": "GB200 NVL72 랙 단위 단가(ASP) 폭등",
                "description": "단순 GPU 판매를 넘어 수냉식 시스템/스위치/네트워킹을 번들링한 랙 단위 판매(ASP $2~3M)로 매출 극대화.",
                "type": "positive"
            },
            {
                "title": "TSMC 첨단 CoWoS 패키징 캐파 증설 수혜",
                "description": "공급망 병목의 핵심이었던 CoWoS 및 HBM3e 공급망 안정화로 분기별 출하량 우상향 가시성 확보.",
                "type": "positive"
            }
        ]
        verdict = "블랙웰은 단순한 칩 업그레이드가 아닌 데이터센터 수준의 컴퓨팅 패러다임 전환으로, 엔비디아의 AI 컴퓨팅 해자를 더욱 강화하고 있습니다."
        action_guide = "차세대 칩 양산 사이클 진입에 따른 실적 퀀텀점프 기대감에 맞추어 주도주 포지션을 유지하세요."
    elif final_category == "DATACENTER_HYPERSCALER":
        severity = "HIGH"
        headline = f"🏢 엔비디아({ticker}) 빅테크 AI CapEx 상향 및 데이터센터 가속 컴퓨팅 수주 폭발"
        primary_reason = "마이크로소프트, 구글, 메타, 아마존 등 빅테크 하이퍼스케일러들의 연간 CapEx 가이던스 상향 및 엔비디아 가속기 대규모 발주가 확인되었습니다."
        drivers = [
            {
                "title": "빅테크 4사 합산 CapEx $200B+ 돌파",
                "description": "생성형 AI 모델 고도화를 위한 데이터센터 설비투자 확대로 엔비디아 가속기 수혜 집중.",
                "type": "positive"
            },
            {
                "title": "Spectrum-X 이더넷 및 InfiniBand 네트워킹 고성장",
                "description": "GPU 외에 AI 네트워킹 부문만 연간 수십억 달러 규모로 급성장하며 종합 인프라 기업으로 도약.",
                "type": "positive"
            },
            {
                "title": "주권 AI(Sovereign AI) 및 엔터프라이즈 신규 수요 다변화",
                "description": "빅테크를 넘어 각국 정부 및 통신사의 국가 단위 자체 AI 클러스터 구축 수요 급증.",
                "type": "positive"
            }
        ]
        verdict = "빅테크들의 AI 인프라 군비 경쟁이 지속되는 한 데이터센터 부문의 구조적 초과수요는 확고합니다."
        action_guide = "하이퍼스케일러들의 분기 실적 발표 내 CapEx 발언을 추적하며 중기 실적 상향 기조를 활용하세요."
    elif final_category == "EXPORT_CONTROLS_GEOPOLITICS":
        severity = "HIGH"
        headline = f"⚠️ 엔비디아({ticker}) 미 상무부 대중국 반도체 수출 통제 및 지정학적 리스크 감지"
        primary_reason = "미 상무부 BIS의 고성능 AI 칩 대중국 수출 규제 강화, 중동/동남아 등 우회 수출 차단 조치 및 현지 맞춤형(H20 등) 칩 규제 노이즈가 발생했습니다."
        drivers = [
            {
                "title": "중국 매출 비중 축소와 글로벌 대체 수요",
                "description": "중국 시장 비중이 과거 20~25%에서 한 자릿수대로 축소되었으며, 글로벌 하이퍼스케일러 대기 수요가 규제 충격을 흡수 중.",
                "type": "warning"
            },
            {
                "title": "미 정부 추가 규제 불확실성",
                "description": "H20 칩 사양 제한 및 중동 지역 라이선스 통제 등 정책 리스크에 따른 단기 심리 위축.",
                "type": "warning"
            },
            {
                "title": "북미 파운드리 공급망 다변화",
                "description": "TSMC 애리조나 팹 등 미국 내 첨단 패키징 라인 구축으로 대만 지정학적 리스크 완화 도모.",
                "type": "info"
            }
        ]
        verdict = "미국의 대중국 규제는 단기적 심리 악재이나, 글로벌 전역의 공급 부족으로 비중국향 대체 수요가 규제 충격을 상당 부분 상쇄하고 있습니다."
        action_guide = "지정학적 뉴스 플로우로 인한 일시적 급락은 밸류에이션 매력도가 부각되는 분할 매수 타이밍으로 접근하세요."
    elif final_category == "CUSTOM_SILICON_COMPETITION":
        severity = "MEDIUM"
        headline = f"⚡ 엔비디아({ticker}) 빅테크 자체 ASIC 및 경쟁사(AMD) AI 칩 진입 경쟁 분석"
        primary_reason = "구글 TPU, AWS Trainium, 메타 MTIA 등 자체 실리콘 확대 및 AMD MI325X/MI350 시리즈와의 시장 점유율 경쟁 이슈가 포착되었습니다."
        drivers = [
            {
                "title": "500만 개발자 기반 CUDA 소프트웨어 독점 해자",
                "description": "모든 프론티어 AI 라이브러리와 프레임워크가 CUDA에 최적화되어 하드웨어 전환 비용이 극도로 높음.",
                "type": "positive"
            },
            {
                "title": "자체 칩은 특화 추론용, 거대 LLM 학습은 엔비디아 독점",
                "description": "범용 컴퓨팅 및 차세대 프론티어 파운데이션 모델 학습에서는 엔비디아 가속기 대체 불가.",
                "type": "positive"
            },
            {
                "title": "NVLink 스위치 기반 초저지연 스케일아웃 기술 격차",
                "description": "단일 칩 성능을 넘어 수만 개 GPU를 유기적으로 연결하는 시스템 클러스터링 기술력에서 2~3년 격차 유지.",
                "type": "positive"
            }
        ]
        verdict = "빅테크의 자체 칩은 특정 내부 워크로드 보조용이며, 최첨단 프론티어 AI 학습 및 범용 클라우드 서빙에서 엔비디아의 점유율 해자는 확고합니다."
        action_guide = "경쟁 칩 등장에 따른 과도한 점유율 잠식 우려가 주가에 반영될 때 차별화된 소프트웨어 해자에 주목하세요."
    elif is_volatile and direction == "PLUNGE":
        severity = "CRITICAL"
        headline = f"🚨 엔비디아({ticker}) {dominant_pct:.2f}%({dominant_amount:+.2f}달러) 대규모 급락 긴급 진단"
        if days_since_report <= 7:
            primary_reason = f"{quarter} 공식 실적 발표 직후, 지나치게 높은 시장 눈높이(Whisper Number) 대비 가이던스 상회 폭 제한 또는 Blackwell 단기 공급 일정 루머로 차익실현 매물이 출회되었습니다."
            drivers = [
                {
                    "title": f"{quarter} 실적 후 단기 눈높이 조정",
                    "description": f"매출 성장률과 매출총이익률(Gross Margin 70%+)은 견조하나, 과열된 단기 기대감에 따른 숨고르기 매물 출회.",
                    "type": "negative"
                },
                {
                    "title": "반도체 공급망 및 발열/수율 루머 노이즈",
                    "description": "대규모 랙 공급 초기 발생 가능한 수랭 쿨링 및 부품 수급 이슈 루머에 따른 알고리즘 매도.",
                    "type": "warning"
                },
                {
                    "title": "단기 기술적 지지선 테스트",
                    "description": "주요 이동평균선(50일선) 부근 지지력 및 기관 수급 유입 여부 테스트 중.",
                    "type": "info"
                }
            ]
        else:
            primary_reason = "거시경제 금리 변동성, 미-중 반도체 규제 강화 뉴스 또는 테크 섹터 전반의 동반 차익실현 매물 출회."
            drivers = [
                {
                    "title": "반도체 및 빅테크 섹터 동반 조정",
                    "description": "나스닥 및 필라델피아 반도체 지수(SOX) 전반의 차익실현 및 매도세 동조화.",
                    "type": "negative"
                },
                {
                    "title": "지정학적 리스크 및 수출 통제 우려",
                    "description": "대중국 수출 규제 강화 관련 정책 뉴스 및 글로벌 무역 긴장감 반영.",
                    "type": "warning"
                },
                {
                    "title": "기술적 과매도 영역 진입",
                    "description": f"단기 급락으로 일봉 RSI가 과매도권에 근접하여 밸류에이션 매력 부각.",
                    "type": "info"
                }
            ]

        verdict = f"AI 가속기 초과수요와 70%+ 마진 구조의 구조적 훼손이 아닌 단기 수급 및 센티먼트 충격입니다. 현 주가는 Forward P/E {fpe}x 수준으로 역사적 밸류에이션 완충 영역에 진입했습니다."
        action_guide = "단기 공포에 따른 패닉 셀링을 지양하고, 주요 기술적 지지선 확인 후 분할 매수(DCA) 기회로 활용하는 것이 유리합니다."
    elif is_volatile and direction == "SURGE":
        severity = "HIGH"
        headline = f"🚀 엔비디아({ticker}) +{dominant_pct:.2f}%({dominant_amount:+.2f}달러) 폭발적 랠리 발생"
        primary_reason = "어닝 서프라이즈, Blackwell 양산 가속 호재 또는 대형 하이퍼스케일러의 신규 슈퍼클러스터 수주 발표에 힘입은 강력한 기관 매수세 유입."
        drivers = [
            {
                "title": "Blackwell 출하 가속 및 공급망 병목 해소",
                "description": "TSMC 패키징 수율 개선과 시스템 랙 납품 가속화로 차기 분기 실적 상향 기대감 폭발.",
                "type": "positive"
            },
            {
                "title": "빅테크 대규모 AI 수주 및 파트너십 발표",
                "description": "주요 클라우드 사업자 및 국가 단위 Sovereign AI의 수만 장 규모 가속기 클러스터 도입 공시.",
                "type": "positive"
            },
            {
                "title": "월가 목표주가 줄상향 및 쇼트 커버링",
                "description": "주요 투자은행(IB)의 Forward EPS 추정치 상향 및 기관 자금 순유입 가속.",
                "type": "positive"
            }
        ]
        verdict = f"차세대 컴퓨팅 아키텍처의 독점적 리더십이 실적으로 재확인되며 밸류에이션 리레이팅이 가속화되고 있습니다."
        action_guide = "과열 구간 단기 추격 매수보다는 눌림목을 대기하거나 기존 보유 포지션의 수익을 극대화하세요."
    else:
        # Default fallback for other catalysts
        severity = "HIGH"
        headline = f"📢 엔비디아({ticker}) {category_label} 긴급 퀀트 브리핑"
        primary_reason = f"엔비디아 기업가치에 유의미한 영향을 미치는 {category_label} 뉴스가 포착되었습니다."
        drivers = [
            {"title": "주요 이슈 발생", "description": "실시간 글로벌 미디어 및 금융 시장에서 집중 조명 중인 핵심 촉매.", "type": "info"},
            {"title": "본업 수익성 점검", "description": f"분기 매출 및 영업이익률({earnings.get('operatingMargins', 34)}%) 체력 지속 여부.", "type": "positive"},
            {"title": "밸류에이션 방어선", "description": f"Forward P/E {fpe}x 수준의 밸류에이션 지지선 작동.", "type": "info"}
        ]
        verdict = "단기 시장 센티먼트에 따른 노이즈 여부를 식별하고 기업의 본질적 현금 창출력에 집중해야 합니다."
        action_guide = "관련 뉴스 후속 보도와 거래량 변화를 모니터링하며 분할 진입 기준을 준수하세요."

    return {
        "triggered": triggered,
        "triggerReason": trigger_reason,
        "category": final_category,
        "categoryLabel": category_label,
        "severity": severity,
        "direction": direction,
        "changePercent": round(float(dominant_pct), 2),
        "changeAmount": dominant_amount,
        "sessionPrice": session_price,
        "threshold": threshold,
        "headline": headline,
        "primaryReason": primary_reason,
        "drivers": drivers,
        "institutionalVerdict": verdict,
        "actionGuide": action_guide,
        "relatedNews": news_items[:5],
        "detectedAt": now_str
    }

def calculate_indicators(df):
    """Computes Wilder's RSI and MFI matching TradingView standard."""
    if len(df) < 15:
        return df

    delta = df["Close"].diff()
    gain = delta.where(delta > 0, 0).ewm(alpha=1 / 14, adjust=False).mean()
    loss = -delta.where(delta < 0, 0).ewm(alpha=1 / 14, adjust=False).mean()
    rs = gain / loss.replace(0, float("nan"))
    df["rsi"] = 100 - (100 / (1 + rs))

    if "Volume" in df.columns and (df["Volume"] > 0).any():
        typical_price = (df["High"] + df["Low"] + df["Close"]) / 3
        money_flow = typical_price * df["Volume"]
        pos_flow = money_flow.where(typical_price > typical_price.shift(1), 0).rolling(14).sum()
        neg_flow = money_flow.where(typical_price < typical_price.shift(1), 0).rolling(14).sum()
        mfr = pos_flow / neg_flow.replace(0, float("nan"))
        df["mfi"] = 100 - (100 / (1 + mfr))
    else:
        df["mfi"] = None

    return df

def tag_session(dt):
    """Tags candle as PRE, REGULAR, or POST based on Eastern Time."""
    h = dt.hour
    m = dt.minute
    if h < 9 or (h == 9 and m < 30):
        return "PRE"
    elif (h == 9 and m >= 30) or (10 <= h < 16):
        return "REGULAR"
    else:
        return "POST"

def format_candles(df, add_session=False):
    if df.empty:
        return []
    df = df.dropna(subset=["Open", "High", "Low", "Close"])
    df = df[df["Open"] > 0].reset_index()
    time_col = df.columns[0]
    df["time"] = df[time_col].apply(lambda x: x.isoformat() if hasattr(x, "isoformat") else str(x))

    if add_session:
        df["session"] = df[time_col].apply(lambda x: tag_session(x) if hasattr(x, "hour") else "REGULAR")

    for col in ["Open", "High", "Low", "Close", "rsi", "mfi"]:
        if col in df.columns:
            df[col] = df[col].apply(lambda v: round(float(v), 2) if pd.notna(v) and v is not None else None)

    if "Volume" in df.columns:
        df["Volume"] = df["Volume"].fillna(0).astype("int64")

    cols = ["time", "Open", "High", "Low", "Close", "Volume", "rsi", "mfi"]
    if add_session:
        cols.append("session")
    records = df[[c for c in cols if c in df.columns]].to_dict(orient="records")
    return records

def collect_ticker(ticker: str):
    print(f"[{ticker}] Collecting fresh financial data...")
    stock = yf.Ticker(ticker)

    # 1. Fundamentals
    info = {}
    try:
        raw_info = stock.info
        allowed_types = (int, float, str, bool)
        for k, v in raw_info.items():
            if isinstance(v, allowed_types):
                if isinstance(v, float):
                    if pd.isna(v) or v in [float("inf"), float("-inf")]:
                        continue
                    v = round(v, 2)
                info[k] = v
    except Exception as e:
        print(f"[{ticker}] Info fetch warning: {e}")

    # Fallback to fast_info
    fast = None
    try:
        fast = stock.fast_info
        if "regularMarketPrice" not in info or not info["regularMarketPrice"]:
            info["regularMarketPrice"] = round(float(getattr(fast, "last_price", 0)), 2)
        if "previousClose" not in info or not info["previousClose"]:
            info["previousClose"] = round(float(getattr(fast, "previous_close", 0)), 2)
        if "marketCap" not in info or not info["marketCap"]:
            info["marketCap"] = int(getattr(fast, "market_cap", 0))
    except Exception:
        pass

    # Standard Market State & Exact Price Extraction
    raw_state = str(info.get("marketState", "")).upper()
    if "REGULAR" in raw_state:
        market_state = "REGULAR"
    elif "POST" in raw_state:
        market_state = "POST"
    elif "PRE" in raw_state:
        market_state = "PRE"
    elif "OVERNIGHT" in raw_state:
        market_state = "OVERNIGHT"
    elif "CLOSED" in raw_state:
        market_state = "CLOSED"
    else:
        ny_now = datetime.now(ZoneInfo("America/New_York"))
        hour = ny_now.hour
        minute = ny_now.minute
        weekday = ny_now.weekday()
        if weekday >= 5:
            market_state = "CLOSED"
        elif hour < 4:
            market_state = "OVERNIGHT"
        elif hour < 9 or (hour == 9 and minute < 30):
            market_state = "PRE"
        elif (hour == 9 and minute >= 30) or (10 <= hour < 16):
            market_state = "REGULAR"
        elif 16 <= hour < 20:
            market_state = "POST"
        else:
            market_state = "OVERNIGHT"

    info["marketState"] = market_state

    # Regular session prices (Benchmark for day's trading: close vs previous close)
    reg_price = round(float(info.get("regularMarketPrice") or (getattr(fast, "last_price", 0) if fast else 0) or info.get("currentPrice", 0)), 2)
    prev_close = round(float(info.get("regularMarketPreviousClose") or (getattr(fast, "previous_close", 0) if fast else 0) or info.get("previousClose", reg_price)), 2)
    reg_change = round(float(info.get("regularMarketChange") or (reg_price - prev_close)), 2)
    reg_change_pct = round(float(info.get("regularMarketChangePercent") or (((reg_price - prev_close) / prev_close) * 100 if prev_close else 0)), 2)

    info["regularMarketPrice"] = reg_price
    info["regularMarketChange"] = reg_change
    info["regularMarketChangePercent"] = reg_change_pct
    info["regularMarketPreviousClose"] = prev_close
    info["regularLastPrice"] = reg_price
    info["previousClose"] = prev_close

    # Pre-market pricing (Base is ALWAYS reg_price from the regular session)
    pre_price = round(float(info["preMarketPrice"]), 2) if info.get("preMarketPrice") else None
    if pre_price:
        pre_change = round(float(info.get("preMarketChange") if info.get("preMarketChange") is not None else (pre_price - reg_price)), 2)
        pre_change_pct = round(float(info.get("preMarketChangePercent") if info.get("preMarketChangePercent") is not None else (((pre_price - reg_price) / reg_price) * 100 if reg_price else 0)), 2)
        info["preMarketPrice"] = pre_price
        info["preMarketChange"] = pre_change
        info["preMarketChangePercent"] = pre_change_pct

    # Post-market pricing (Base is ALWAYS reg_price from the regular session)
    post_price = round(float(info["postMarketPrice"]), 2) if info.get("postMarketPrice") else None
    if post_price:
        post_change = round(float(info.get("postMarketChange") if info.get("postMarketChange") is not None else (post_price - reg_price)), 2)
        post_change_pct = round(float(info.get("postMarketChangePercent") if info.get("postMarketChangePercent") is not None else (((post_price - reg_price) / reg_price) * 100 if reg_price else 0)), 2)
        info["postMarketPrice"] = post_price
        info["postMarketChange"] = post_change
        info["postMarketChangePercent"] = post_change_pct

    # Active Session Assignment: headline price reflects active session
    if market_state == "PRE" and pre_price:
        info["currentPrice"] = pre_price
        info["change"] = pre_change
        info["changePercent"] = pre_change_pct
        info["extendedLastPrice"] = pre_price
        info["extendedLastType"] = "PRE"
    elif market_state in ["POST", "OVERNIGHT"] and post_price:
        info["currentPrice"] = post_price
        info["change"] = post_change
        info["changePercent"] = post_change_pct
        info["extendedLastPrice"] = post_price
        info["extendedLastType"] = "POST"
    else:
        # REGULAR or CLOSED
        info["currentPrice"] = reg_price
        info["change"] = reg_change
        info["changePercent"] = reg_change_pct
        if post_price:
            info["extendedLastPrice"] = post_price
            info["extendedLastType"] = "POST"
        elif pre_price:
            info["extendedLastPrice"] = pre_price
            info["extendedLastType"] = "PRE"

    # 2. Candles
    candles = {}

    # 2-A. 1D Intraday 5m Candles with Pre/Post extended hours
    try:
        df_5m = stock.history(period="1d", interval="5m", prepost=True)
        if df_5m is None or len(df_5m) < 10:
            df_2d = stock.history(period="2d", interval="5m", prepost=True)
            if df_2d is not None and not df_2d.empty:
                # Filter to latest trading date
                latest_date = df_2d.index[-1].date()
                df_5m = df_2d[df_2d.index.date == latest_date]

        if df_5m is not None and not df_5m.empty:
            candles["1d_intraday"] = format_candles(df_5m, add_session=True)
            print(f"[{ticker}] Collected {len(candles['1d_intraday'])} 1D intraday candles")
    except Exception as e:
        print(f"[{ticker}] 1d intraday history warning: {e}")

    # 2-B. 1H Candles (1 Month with Pre/Post)
    try:
        df_1h = stock.history(period="1mo", interval="1h", prepost=True)
        if df_1h is not None and not df_1h.empty:
            df_1h = calculate_indicators(df_1h)
            candles["1h"] = format_candles(df_1h, add_session=True)
    except Exception as e:
        print(f"[{ticker}] 1h history warning: {e}")

    # 2-C. 1D Daily Candles (1 Year)
    try:
        df_1d = stock.history(period="1y", interval="1d")
        if df_1d is not None and not df_1d.empty:
            df_1d = calculate_indicators(df_1d)
            candles["1d"] = format_candles(df_1d)
    except Exception as e:
        print(f"[{ticker}] 1d history warning: {e}")

    # Attach Dynamic Official Earnings Brief
    earnings_brief = extract_dynamic_earnings(stock, info)
    info["earningsFlash"] = earnings_brief
    info["earningsBrief"] = earnings_brief

    # Fetch Real-Time Breaking News Catalysts & Evaluate Volatility Alert (>= 3.0%)
    news_items = fetch_ticker_news(ticker)
    volatility_alert = evaluate_volatility_alert(ticker, info, news_items, earnings_brief)
    info["volatilityAlert"] = volatility_alert

    output_path = os.path.join(PUBLIC_DATA_DIR, f"{ticker}.json")
    result = {
        "metadata": {
            "symbol": ticker,
            "last_updated": datetime.now(ZoneInfo("America/New_York")).isoformat(),
        },
        "fundamentals": info,
        "earnings_flash": earnings_brief,
        "earnings_brief": earnings_brief,
        "volatility_alert": volatility_alert,
        "news": news_items,
        "candles": candles,
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"[{ticker}] Saved successfully to {output_path} (Price: ${info['currentPrice']}, Change: {info['changePercent']}%, State: {info['marketState']})")

def main():
    print("=== NVIDIA (NVDA) Live Fetcher ===")
    for ticker in TARGET_TICKERS:
        try:
            collect_ticker(ticker)
        except Exception as e:
            print(f"Error fetching {ticker}: {e}")

if __name__ == "__main__":
    main()
