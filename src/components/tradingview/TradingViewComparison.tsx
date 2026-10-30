import React, { useEffect, useRef } from 'react';

interface TradingViewComparisonProps {
  theme: 'dark' | 'light';
  height?: number | string;
}

export const TradingViewComparison: React.FC<TradingViewComparisonProps> = ({
  theme,
  height = 480,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;

    const config = {
      symbols: [
        ['Nvidia (NVDA)', 'NASDAQ:NVDA|12M'],
        ['TSMC (TSM)', 'NYSE:TSM|12M'],
        ['Broadcom (AVGO)', 'NASDAQ:AVGO|12M'],
        ['AMD (AMD)', 'NASDAQ:AMD|12M'],
        ['Microsoft (MSFT)', 'NASDAQ:MSFT|12M'],
        ['Alphabet (GOOGL)', 'NASDAQ:GOOGL|12M'],
        ['Semiconductor ETF (SMH)', 'NASDAQ:SMH|12M'],
        ['Nasdaq 100 (QQQ)', 'NASDAQ:QQQ|12M'],
      ],
      chartOnly: false,
      width: '100%',
      height: '100%',
      locale: 'ko',
      colorTheme: theme,
      autosize: true,
      showVolume: true,
      showMA: true,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: 'right',
      scaleMode: 'Percentage',
      fontFamily: '-apple-system, BlinkMacSystemFont, Pretendard, sans-serif',
      fontSize: '10',
      noTimeScale: false,
      valuesTracking: '1',
      changeMode: 'price-and-percent',
      chartType: 'area',
      maLineColor: '#76b900',
      maLineWidth: 1,
      maLength: 50,
      headerFontSize: 'medium',
      lineType: 0,
      dateRanges: ['1d|1', '1m|30', '3m|60', '12m|1D', '60m|1W', 'all|1M'],
    };

    script.text = JSON.stringify(config);
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [theme]);

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
