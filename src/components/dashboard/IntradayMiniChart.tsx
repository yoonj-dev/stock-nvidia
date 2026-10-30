import React, { useState, useMemo, useRef } from 'react';
import { Candle } from '../../types/stock';

interface IntradayMiniChartProps {
  candles?: Candle[];
  previousClose: number;
  currentPrice: number;
  symbol: string;
  className?: string;
}

export const IntradayMiniChart: React.FC<IntradayMiniChartProps> = ({
  candles = [],
  previousClose,
  currentPrice,
  symbol,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Filter valid candles
  const validCandles = useMemo(() => {
    return candles.filter((c) => c && typeof c.Close === 'number' && !isNaN(c.Close));
  }, [candles]);

  const hasData = validCandles.length > 1;

  // Min / Max calculation with baseline
  const { minVal, maxVal, prices, isPositive } = useMemo(() => {
    if (!hasData) {
      return { minVal: 0, maxVal: 1, prices: [], isPositive: true };
    }
    const p = validCandles.map((c) => c.Close);
    const latest = p[p.length - 1] ?? currentPrice;
    const base = previousClose || latest;
    const all = [...p, base];
    const min = Math.min(...all);
    const max = Math.max(...all);
    const padding = (max - min) * 0.08 || 1;
    return {
      minVal: min - padding,
      maxVal: max + padding,
      prices: p,
      isPositive: latest >= base,
    };
  }, [validCandles, previousClose, currentPrice, hasData]);

  // Dimensions
  const width = 280;
  const height = 80;
  const padTop = 14;
  const padBottom = 16;
  const padLeft = 8;
  const padRight = 8;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const getY = (val: number) => {
    const range = maxVal - minVal || 1;
    const norm = (val - minVal) / range;
    return padTop + (1 - norm) * innerH;
  };

  const getX = (idx: number) => {
    if (validCandles.length <= 1) return padLeft;
    return padLeft + (idx / (validCandles.length - 1)) * innerW;
  };

  // Generate SVG Path
  const { linePath, areaPath, baseY, sessionDividers } = useMemo(() => {
    if (!hasData) return { linePath: '', areaPath: '', baseY: height / 2, sessionDividers: [] };

    const pts = validCandles.map((_, i) => ({
      x: getX(i),
      y: getY(prices[i]),
    }));

    let dLine = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      dLine += ` L ${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
    }

    const lastX = pts[pts.length - 1].x;
    const firstX = pts[0].x;
    const bY = getY(previousClose);
    const dArea = `${dLine} L ${lastX.toFixed(1)},${(height - padBottom).toFixed(1)} L ${firstX.toFixed(1)},${(height - padBottom).toFixed(1)} Z`;

    // Detect session transitions (PRE -> REGULAR, REGULAR -> POST)
    const dividers: { x: number; label: string }[] = [];
    let prevSession = validCandles[0]?.session;
    validCandles.forEach((c, idx) => {
      if (c.session && c.session !== prevSession) {
        if (c.session === 'REGULAR') {
          dividers.push({ x: getX(idx), label: '정규' });
        } else if (c.session === 'POST') {
          dividers.push({ x: getX(idx), label: '장외' });
        }
        prevSession = c.session;
      }
    });

    return { linePath: dLine, areaPath: dArea, baseY: bY, sessionDividers: dividers };
  }, [validCandles, prices, hasData, previousClose, minVal, maxVal]);

  // Hover candle
  const activeCandle = hoverIndex !== null && validCandles[hoverIndex] ? validCandles[hoverIndex] : null;
  const activePrice = activeCandle ? activeCandle.Close : (validCandles[validCandles.length - 1]?.Close ?? currentPrice);
  const activeChange = previousClose > 0 ? activePrice - previousClose : 0;
  const activeChangePct = previousClose > 0 ? (activeChange / previousClose) * 100 : 0;
  const activePositive = activeChange >= 0;

  // Format Time for Tooltip
  const formatTimeLabel = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return isoString.slice(11, 16);
    }
  };

  const getSessionBadge = (sess?: string) => {
    switch (sess) {
      case 'PRE':
        return { name: '프리', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 'POST':
        return { name: '애프터', color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
      default:
        return { name: '정규', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    if (!containerRef.current || !hasData) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const relX = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (relX - padLeft) / innerW));
    const idx = Math.round(ratio * (validCandles.length - 1));
    setHoverIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  if (!hasData) {
    return (
      <div className={`flex flex-col items-center justify-center h-full p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-200/60 dark:border-zinc-800 text-[11px] text-slate-400 dark:text-zinc-500 ${className}`}>
        <span>1D 차트 동기화 중...</span>
      </div>
    );
  }

  const strokeColor = isPositive ? '#10b981' : '#f43f5e';
  const fillGradientId = `grad-${symbol}-${isPositive ? 'up' : 'down'}`;

  // Current hover coordinates
  const hoverX = hoverIndex !== null ? getX(hoverIndex) : null;
  const hoverY = hoverIndex !== null ? getY(validCandles[hoverIndex].Close) : null;

  // Day Low & High from valid candles
  const dayMinPrice = Math.min(...prices);
  const dayMaxPrice = Math.max(...prices);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col justify-between rounded-xl bg-slate-50/90 dark:bg-zinc-900/60 border border-slate-200/70 dark:border-zinc-800 p-2 select-none overflow-hidden transition-all duration-200 ${className}`}
    >
      {/* Header Info Row */}
      <div className="flex items-center justify-between text-[10px] font-mono leading-none pb-1">
        <div className="flex items-center gap-1 font-bold text-slate-500 dark:text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>1D (프리·정규·애프터)</span>
        </div>

        {/* Live Hover Info or High/Low Range */}
        {activeCandle ? (
          <div className="flex items-center gap-1 font-bold">
            <span className={`px-1 py-0.2 rounded border text-[9px] ${getSessionBadge(activeCandle.session).color}`}>
              {getSessionBadge(activeCandle.session).name}
            </span>
            <span className="text-slate-600 dark:text-zinc-300">
              {formatTimeLabel(activeCandle.time)}
            </span>
            <span className={activePositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
              ${activePrice.toFixed(2)} ({activePositive ? '+' : ''}{activeChangePct.toFixed(2)}%)
            </span>
          </div>
        ) : (
          <div className="text-[9.5px] text-slate-400 dark:text-zinc-400 flex items-center gap-1.5">
            <span>저 ${dayMinPrice.toFixed(1)}</span>
            <span>·</span>
            <span>고 ${dayMaxPrice.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full h-[58px] sm:h-[64px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible cursor-crosshair"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchEnd={handleMouseLeave}
        >
          <defs>
            <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={isPositive ? 0.35 : 0.4} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Session Divider Vertical Lines & Region Tags */}
          {sessionDividers.map((div, i) => (
            <g key={i}>
              <line
                x1={div.x}
                y1={padTop - 2}
                x2={div.x}
                y2={height - padBottom}
                stroke="currentColor"
                strokeDasharray="2 3"
                className="text-slate-300 dark:text-zinc-700"
                strokeWidth="1"
              />
              <text
                x={div.x + 3}
                y={padTop + 6}
                className="fill-slate-400 dark:fill-zinc-400 text-[8px] font-sans font-medium"
              >
                {div.label}
              </text>
            </g>
          ))}

          {/* Baseline (Previous Close) */}
          {baseY >= padTop && baseY <= height - padBottom && (
            <g>
              <line
                x1={padLeft}
                y1={baseY}
                x2={width - padRight}
                y2={baseY}
                stroke="currentColor"
                strokeDasharray="3 3"
                className="text-slate-400/80 dark:text-zinc-400"
                strokeWidth="1"
              />
              <text
                x={width - padRight}
                y={baseY - 3}
                textAnchor="end"
                className="fill-slate-400 dark:fill-zinc-400 text-[8px] font-mono font-medium"
              >
                전일 ${previousClose.toFixed(2)}
              </text>
            </g>
          )}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#${fillGradientId})`} />

          {/* Line Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Latest Candle Pulsing Dot (when not hovering) */}
          {hoverIndex === null && (
            <g>
              <circle
                cx={getX(validCandles.length - 1)}
                cy={getY(prices[prices.length - 1])}
                r="3"
                fill={strokeColor}
              />
              <circle
                cx={getX(validCandles.length - 1)}
                cy={getY(prices[prices.length - 1])}
                r="6"
                fill={strokeColor}
                opacity="0.3"
                className="animate-ping"
              />
            </g>
          )}

          {/* Hover Crosshair & Marker */}
          {hoverX !== null && hoverY !== null && (
            <g>
              <line
                x1={hoverX}
                y1={padTop}
                x2={hoverX}
                y2={height - padBottom}
                stroke="currentColor"
                strokeDasharray="2 2"
                className="text-slate-500 dark:text-zinc-400"
                strokeWidth="1"
              />
              <circle cx={hoverX} cy={hoverY} r="4" fill={strokeColor} stroke="#ffffff" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Timeline Legend */}
      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 dark:text-zinc-400 pt-0.5 border-t border-slate-200/50 dark:border-zinc-800/80 leading-none">
        <span>04:00 (프리)</span>
        <span>09:30 (정규장)</span>
        <span>16:00 (애프터)</span>
        <span>20:00</span>
      </div>
    </div>
  );
};