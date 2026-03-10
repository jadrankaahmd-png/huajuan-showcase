// ==================== 伊朗局势监控 - 数据类型定义 ====================

export interface RealTimePrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdate: string;
}

export interface MacroData {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  source: string;
  real: boolean;
}

export interface NewsItem {
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  time: string;
  source: string;
  url: string;
}

export interface StabilityIndex {
  country: string;
  index: number;
  trend: 'up' | 'down' | 'stable';
  lastUpdate: string;
  available: boolean;
}

export interface FlightData {
  route: string;
  status: string;
  impact: string;
  lastUpdate: string;
  available: boolean;
}

export interface MaritimeData {
  route: string;
  vessels: number;
  status: string;
  lastUpdate: string;
  available: boolean;
}

export interface SatelliteData {
  location: string;
  firePoints: number;
  intensity: string;
  lastUpdate: string;
  available: boolean;
}

export interface AgentAnalysis {
  agent: string;
  analysis: string;
  recommendation: string;
  confidence: number;
  lastUpdate: string;
  available: boolean;
}

export interface SentimentData {
  platform: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  volume: string;
  lastUpdate: string;
  available: boolean;
}
