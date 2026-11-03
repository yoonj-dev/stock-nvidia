import { StockData, StockFundamentals, LlmSynthesisData } from '../types/stock';

const STOCK_API_BASE = 'https://stock-api.on-tap.xyz';

export async function fetchSynthesisData(): Promise<LlmSynthesisData | null> {
  try {
    const res = await fetch(`/data/synthesis.json?t=${Date.now()}`);
    if (res.ok) {
      const data: LlmSynthesisData = await res.json();
      if (data?.reports?.memo) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[stockApi] Failed to fetch static synthesis data:', err);
  }
  return null;
}

export async function fetchLiveQuote(symbol: string = 'NVDA'): Promise<any | null> {
  try {
    const res = await fetch(`${STOCK_API_BASE}/market_summary.json?t=${Date.now()}`);
    if (res.ok) {
      const data = await res.json();
      return data?.summary?.[symbol.toUpperCase()] || null;
    }
  } catch (e) {
    console.warn(`[stockApi] Failed to fetch live market_summary for ${symbol}:`, e);
  }
  return null;
}

export async function fetchStockData(symbol: string = 'NVDA'): Promise<StockData | null> {
  // 1. Fetch live quote from stock-api first (Single Source of Truth)
  const liveQuote = await fetchLiveQuote(symbol);

  // 2. Try local static data
  let data: StockData | null = null;
  try {
    const localRes = await fetch(`/data/${symbol}.json?t=${Date.now()}`);
    if (localRes.ok) {
      const localData: StockData = await localRes.json();
      if (localData?.fundamentals?.currentPrice) {
        data = localData;
      }
    }
  } catch {}

  // 3. Try remote stock-api
  if (!data?.fundamentals) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${STOCK_API_BASE}/data/${symbol}.json?t=${Date.now()}`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const remoteData: StockData = await res.json();
        if (remoteData?.fundamentals?.currentPrice) {
          data = remoteData;
        }
      }
    } catch (err) {
      console.warn(`[stockApi] Network error for ${symbol}, utilizing fallback.`, err);
    }
  }

  // 4. Fallback baseline if detail is unavailable
  if (!data?.fundamentals) {
    data = {
      fundamentals: {
        symbol: symbol.toUpperCase(),
        currentPrice: liveQuote?.currentPrice || 207.41,
        previousClose: liveQuote?.previousClose || 202.21,
        change: liveQuote?.change || 5.20,
        changePercent: liveQuote?.changePercent || 2.57,
        marketState: liveQuote?.marketState || 'OVERNIGHT',
        trailingPE: 45.0,
        forwardPE: 30.2,
        marketCap: liveQuote?.marketCap || 5.1e12,
        fiftyTwoWeekLow: liveQuote?.fiftyTwoWeekLow || 112.50,
        fiftyTwoWeekHigh: liveQuote?.fiftyTwoWeekHigh || 215.38,
        targetMeanPrice: 265.50,
        targetHighPrice: 320.0,
        targetLowPrice: 180.0,
      },
      candles: {
        '1d_intraday': [],
      },
    };
  }

  // 5. Overlay liveQuote onto fundamentals
  if (liveQuote && data?.fundamentals) {
    data.fundamentals.currentPrice = liveQuote.currentPrice;
    data.fundamentals.regularMarketPrice = liveQuote.currentPrice;
    data.fundamentals.regularLastPrice = liveQuote.currentPrice;
    if (liveQuote.previousClose != null) data.fundamentals.previousClose = liveQuote.previousClose;
    if (liveQuote.change != null) data.fundamentals.change = liveQuote.change;
    if (liveQuote.changePercent != null) data.fundamentals.changePercent = liveQuote.changePercent;
    if (liveQuote.marketState) data.fundamentals.marketState = liveQuote.marketState;
    if (liveQuote.dayHigh != null) data.fundamentals.dayHigh = liveQuote.dayHigh;
    if (liveQuote.dayLow != null) data.fundamentals.dayLow = liveQuote.dayLow;
    if (liveQuote.open != null) data.fundamentals.open = liveQuote.open;
    if (liveQuote.volume != null) data.fundamentals.volume = liveQuote.volume;
    if (liveQuote.marketCap != null) data.fundamentals.marketCap = liveQuote.marketCap;
  }

  return data;
}

export function formatCurrency(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export function formatLargeNumber(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return '--';
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  return formatCurrency(val);
}

export function formatPercent(val?: number): string {
  if (val === undefined || val === null || isNaN(val)) return '0.00%';
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(2)}%`;
}
