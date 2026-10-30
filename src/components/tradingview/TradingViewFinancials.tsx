import React, { useEffect, useRef } from 'react';

interface TradingViewFinancialsProps {
  symbol: string;
  theme: 'dark' | 'light';
  height?: number | string;
}

export const TradingViewFinancials: React.FC<TradingViewFinancialsProps> = ({
  symbol,
  theme,
  height = 480,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-financials.js';
    script.type = 'text/javascript';
    script.async = true;

    const fullSymbol = symbol.startsWith('NASDAQ:') ? symbol : `NASDAQ:${symbol}`;

    const config = {
      isTransparent: true,
      largeChartUrl: '',
      displayMode: 'regular',
      width: '100%',
      height: '100%',
      colorTheme: theme,
      symbol: fullSymbol,
      locale: 'ko',
    };

    script.text = JSON.stringify(config);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, theme]);

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
