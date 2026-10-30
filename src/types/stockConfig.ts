import React from 'react';

export interface PillarHighlight {
  label: string;
  value: string;
  change?: string;
}

export interface PillarConfig {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  color: string;
  badge: string;
  iconName: string;
  highlights: PillarHighlight[];
  summary: string;
  catalysts: string[];
  risks: string[];
}

export interface CatalystConfig {
  id: string;
  title: string;
  tag: string;
  impact: 'HIGH' | 'MEDIUM' | 'OPPORTUNITY';
  summary: string;
}

export interface EarningsConfig {
  dDay: string;
  date: string;
  quarter: string;
  estRevenue: string;
  estEps: string;
  prevRevenue: string;
  prevEps: string;
  grossMargin: string;
  operatingMargin: string;
}

export interface PeerItem {
  symbol: string;
  name: string;
  changePercent: number;
  marketCap: string;
  peRatio: string;
}

export interface SingleStockProfile {
  symbol: string;
  name: string;
  koreanName: string;
  sector: string;
  industry: string;
  accentColor: string; // e.g. 'emerald' | 'blue' | 'purple' | 'red'
  themeClasses: {
    primaryText: string;
    primaryBg: string;
    badgeBg: string;
    border: string;
    glow: string;
    activeTab: string;
  };
  pillars: PillarConfig[];
  catalysts: CatalystConfig[];
  quickAiQuestions: string[];
  earnings: EarningsConfig;
  peers: PeerItem[];
}
