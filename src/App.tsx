import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { SingleStockTerminal } from './components/dashboard/SingleStockTerminal';
import { Footer } from './components/layout/Footer';
import { ThemeMode, getStoredThemeMode, applyThemeToDom, resolveTheme } from './lib/theme';
import { fetchStockData } from './lib/stockApi';
import { StockData } from './types/stock';
import { NVIDIA_PROFILE } from './lib/profiles/nvidiaProfile';

export const App: React.FC = () => {
  const [currentThemeMode, setCurrentThemeMode] = useState<ThemeMode>(getStoredThemeMode);
  const [nvdaData, setNvdaData] = useState<StockData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Sync theme to DOM on mount and when changed
  useEffect(() => {
    applyThemeToDom(currentThemeMode, true);
  }, [currentThemeMode]);

  // Load fresh stock data
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchStockData('NVDA');
      if (data?.fundamentals) {
        setNvdaData(data);
      }
    } catch (err) {
      console.warn('[App] Failed to refresh live data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const nvda = nvdaData?.fundamentals || {
    symbol: 'NVDA',
    currentPrice: 207.41,
    previousClose: 215.38,
    change: -7.97,
    changePercent: -3.70,
    trailingPE: 45.0,
    forwardPE: 30.2,
    marketCap: 5.1e12,
    targetMeanPrice: 265.50,
    fiftyTwoWeekLow: 85.0,
    fiftyTwoWeekHigh: 215.38,
    grossMargins: 0.749,
    operatingMargins: 0.621,
  };

  const resolvedTheme = resolveTheme(currentThemeMode);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f5f7] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 transition-colors">
      {/* 1. Standard Header with Context Menu */}
      <Header
        currentThemeMode={currentThemeMode}
        onThemeModeChanged={setCurrentThemeMode}
        nvda={nvda}
        isRefreshing={isRefreshing}
        onRefresh={loadData}
      />

      {/* 2. Bento Interactive Terminal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
        <SingleStockTerminal
          profile={NVIDIA_PROFILE}
          fundamentals={nvda}
          candles={nvdaData?.candles?.['1d_intraday']}
          resolvedTheme={resolvedTheme}
          isRefreshing={isRefreshing}
          onRefresh={loadData}
        />
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
};
