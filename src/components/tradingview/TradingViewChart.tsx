import React, { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string;
  theme: 'dark' | 'light';
  height?: number | string;
  interval?: string;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  symbol,
  theme,
  height = 520,
  interval = 'D',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;

    const fullSymbol = symbol.startsWith('NASDAQ:') ? symbol : `NASDAQ:${symbol}`;

    const config = {
      autosize: true,
      symbol: fullSymbol,
      interval: interval,
      timezone: 'America/New_York',
      theme: theme,
      style: '1',
      locale: 'ko',
      enable_publishing: false,
      allow_symbol_change: false,
      calendar: false,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      save_image: true,
      studies: [
        'RSI@tv-basicstudies',
        'MASimple@tv-basicstudies',
      ],
      support_host: 'https://www.tradingview.com',
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
      className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
      style={{ height }}
    >
      <div className="tradingview-widget-container h-full w-full" ref={containerRef}>
        <div className="tradingview-widget-container__widget h-full w-full"></div>
      </div>
    </div>
  );
};
