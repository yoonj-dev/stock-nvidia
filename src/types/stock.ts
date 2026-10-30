export interface Candle {
  time: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
  rsi?: number | null;
  mfi?: number | null;
  session?: 'PRE' | 'REGULAR' | 'POST';
}

export interface VolatilityCatalystNews {
  title: string;
  source: string;
  link: string;
  pubDate: string;
}

export interface VolatilityDriver {
  title: string;
  description: string;
  type: 'negative' | 'positive' | 'warning' | 'info';
}

export type MajorIssueCategory =
  | 'PRICE_VOLATILITY'           // 3%+ 주가 급변동
  | 'BLACKWELL_AI_CHIPS'         // Blackwell B200/GB200 양산 수율, 신규 수주, Rubin 로드맵
  | 'DATACENTER_HYPERSCALER'     // 빅테크(MS, 구글, 메타, AWS) AI CapEx 및 GPU 클러스터 증설
  | 'EXPORT_CONTROLS_GEOPOLITICS'// 미 상무부 대중국 반도체 규제, 중동 라이선스
  | 'CUSTOM_SILICON_COMPETITION' // 빅테크 자체 ASIC (TPU, Trainium, MTIA) 경쟁
  | 'EARNINGS_CATALYST'          // 분기 실적 서프라이즈, 마진율(70%+) 가이던스
  | 'GENERAL_MARKET';

export interface MarketVolatilityAlert {
  triggered: boolean;
  triggerReason: 'PRICE_VOLATILITY' | 'MAJOR_CATALYST' | 'BOTH' | 'NONE';
  category: MajorIssueCategory;
  categoryLabel: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL';
  direction: 'SURGE' | 'PLUNGE' | 'NEUTRAL';
  changePercent: number;
  changeAmount: number;
  sessionPrice: number;
  threshold: number;
  headline: string;
  primaryReason: string;
  drivers: VolatilityDriver[];
  institutionalVerdict: string;
  actionGuide: string;
  relatedNews: VolatilityCatalystNews[];
  detectedAt: string;
}

export interface EarningsFlash {
  quarter: string;
  reportDate?: string;
  revenue?: number; // ($B)
  revenueYoY?: number; // (%)
  revenueEstimate?: number; // ($B)
  revenueBeat?: boolean;
  eps?: number;
  epsEstimate?: number;
  epsSurprisePercent?: number; // (%)
  epsBeat?: boolean;
  epsMissReason?: string;
  datacenterRevenue?: number; // ($B)
  datacenterYoY?: number; // (%)
  gamingRevenue?: number; // ($B)
  grossMargin?: number; // (%)
  afterMarketPrice?: number;
  afterMarketChangePercent?: number;
  keyTakeaway?: string;
  isBreaking?: boolean;
  nextEarningsDate?: string;
  nextEpsEstimate?: number;
  daysSinceReport?: number;
  operatingMargins?: number;
  totalRevenueTTM?: number;
  revenueGrowthYoY?: number;
  earningsGrowthYoY?: number;
}

export interface StockFundamentals {
  symbol: string;
  shortName?: string;
  displayName?: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  open?: number;
  dayLow?: number;
  dayHigh?: number;
  volume?: number;
  marketCap?: number;
  trailingPE?: number;
  forwardPE?: number;
  priceToBook?: number;
  dividendYield?: number;
  beta?: number;
  fiftyTwoWeekLow?: number;
  fiftyTwoWeekHigh?: number;
  fiftyDayAverage?: number;
  twoHundredDayAverage?: number;
  marketState?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  extendedLastPrice?: number;
  postMarketPrice?: number;
  postMarketChangePercent?: number;
  preMarketPrice?: number;
  preMarketChangePercent?: number;
  earningsFlash?: EarningsFlash;
  volatilityAlert?: MarketVolatilityAlert;
  targetHighPrice?: number;
  targetLowPrice?: number;
  targetMeanPrice?: number;
  targetMedianPrice?: number;
  recommendationKey?: string;
  numberOfAnalystOpinions?: number;
  totalCash?: number;
  totalDebt?: number;
  totalRevenue?: number;
  revenueGrowth?: number;
  freeCashflow?: number;
  grossMargins?: number;
  operatingMargins?: number;
  profitMargins?: number;
  trailingEps?: number;
  forwardEps?: number;
  sharesOutstanding?: number;
  [key: string]: any;
}

export interface StockData {
  fundamentals: StockFundamentals;
  candles: {
    '1d_intraday'?: Candle[];
    '1h'?: Candle[];
    '1d'?: Candle[];
    '1w'?: Candle[];
  };
  earnings_flash?: EarningsFlash;
  volatility_alert?: MarketVolatilityAlert;
}

export interface BusinessPillar {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  color: string;
  badge: string;
  highlights: { label: string; value: string; change?: string }[];
  summary: string;
  catalysts: string[];
  risks: string[];
}

export interface LlmSynthesisData {
  metadata: {
    last_updated?: string;
    last_updated_ny?: string;
    generated_at_kst?: string;
    generated_at_ny?: string;
    engine: string;
    model?: string;
    symbol?: string;
    company_name?: string;
    stock_price_ref?: number;
    earnings_quarter_ref?: string;
    nvda_price?: number;
    target_mean?: number;
    target_high?: number;
    target_low?: number;
    forward_pe?: number;
    recommendation?: string;
  };
  reports: {
    memo: string;
    blackwell_ai: string;
    geopolitics_asic: string;
    valuation: string;
  };
}
