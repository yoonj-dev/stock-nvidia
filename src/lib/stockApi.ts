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

export async function fetchStockData(symbol: 'NVDA' = 'NVDA'): Promise<StockData | null> {
  // 1. Try local static data first (instant & resilient)
  try {
    const localRes = await fetch(`/data/${symbol}.json?t=${Date.now()}`);
    if (localRes.ok) {
      const localData: StockData = await localRes.json();
      if (localData?.fundamentals?.currentPrice) {
        return localData;
      }
    }
  } catch {
    // Continue to remote API
  }

  // 2. Try remote stock-api
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${STOCK_API_BASE}/data/${symbol}.json?t=${Date.now()}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data: StockData = await res.json();
      if (data?.fundamentals?.currentPrice) {
        return data;
      }
    }
  } catch (err) {
    console.warn(`[stockApi] Network error for ${symbol}, utilizing cached fallback.`, err);
  }

  return null;
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
  if (val === undefined || val === null || isNaN(val)) return '-';
  if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
  return val.toLocaleString();
}

export function formatPercent(val?: number, includeSign = true): string {
  if (val === undefined || val === null || isNaN(val)) return '0.00%';
  const sign = includeSign && val > 0 ? '+' : '';
  return `${sign}${val.toFixed(2)}%`;
}
