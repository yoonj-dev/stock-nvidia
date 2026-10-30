import React, { useEffect, useRef } from 'react';

interface TradingViewTechGaugeProps {
  symbol: string;
  theme: 'dark' | 'light';
  interval?: '1m' | '5m' | '15m' | '1h' | '4h' | '1D' | '1W' | '1M';
  height?: number | string;
}

export const TradingViewTechGauge: React.FC<TradingViewTechGaugeProps> = ({
  symbol,
  theme,
  interval = '1D',
  height = 420,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.type = 'text/javascript';
    script.async = true;

    const fullSymbol = symbol.startsWith('NASDAQ:') ? symbol : `NASDAQ:${symbol}`;

    const config = {
      interval: interval,
      width: '100%',
      isTransparent: true,
      height: '100%',
      symbol: fullSymbol,
      showIntervalTabs: true,
      displayMode: 'multiple',
      locale: 'ko',
      colorTheme: theme,
    };

    script.text = JSON.stringify(config);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, theme, interval]);

  return (
    <div
      className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2"
      style={{ height }}
    >
      <div className="tradingview-widget-container h-full w-full" ref={containerRef}>
        <div className="tradingview-widget-container__widget h-full w-full"></div>
      </div>
    </div>
  );
};
