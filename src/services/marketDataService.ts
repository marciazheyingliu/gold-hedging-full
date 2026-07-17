export interface Asset {
  key: string;
  name: string;
  symbol: string;
  type: 'gold' | 'equity' | 'bond' | 'currency' | 'commodity';
}

export interface MarketDataPoint {
  timestamp: number;
  price: number;
  volume?: number;
}

export interface CorrelationMatrix {
  [key: string]: { [key: string]: number };
}

export interface HedgeEffectiveness {
  asset: string;
  hedgeRatio: number;
  effectiveness: number;
  rollingCorrelation: number[];
}

export interface MarketState {
  volatility: 'low' | 'normal' | 'high';
  inflation: 'low' | 'high';
  panic: 'low' | 'high';
  regime: 'bull' | 'bear' | 'crisis' | 'recovery';
}

export const ASSETS: Asset[] = [
  { key: 'gold', name: 'Gold', symbol: 'XAUUSD', type: 'gold' },
  { key: 'sp500', name: 'S&P 500', symbol: '^GSPC', type: 'equity' },
  { key: 'nasdaq', name: 'NASDAQ', symbol: '^IXIC', type: 'equity' },
  { key: 'us10y', name: 'US 10Y Treasury', symbol: '^TNX', type: 'bond' },
  { key: 'usd', name: 'US Dollar Index', symbol: 'DX-Y.NYB', type: 'currency' },
  { key: 'oil', name: 'Crude Oil', symbol: 'CL=F', type: 'commodity' },
  { key: 'silver', name: 'Silver', symbol: 'XAGUSD', type: 'commodity' },
  { key: 'djia', name: 'Dow Jones', symbol: '^DJI', type: 'equity' },
];

class MarketDataService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Generate realistic mock data for demonstration
  // In production, replace with actual API calls
  private generateMockPrice(basePrice: number, volatility: number = 0.02): number {
    const change = (Math.random() - 0.5) * 2 * volatility * basePrice;
    return basePrice + change;
  }

  private generateHistoricalData(
    basePrice: number,
    points: number = 100,
    volatility: number = 0.02
  ): MarketDataPoint[] {
    const now = Date.now();
    const data: MarketDataPoint[] = [];
    let price = basePrice;

    for (let i = points - 1; i >= 0; i--) {
      price = this.generateMockPrice(price, volatility);
      data.push({
        timestamp: now - i * 3600000, // 1-hour intervals
        price: Number(price.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000),
      });
    }

    return data;
  }

  async getCurrentPrice(assetKey: string): Promise<{ price: number; change: number; changePercent: number }> {
    const basePrices: Record<string, number> = {
      gold: 2350,
      sp500: 5100,
      nasdaq: 16500,
      us10y: 4.2,
      usd: 104,
      oil: 78,
      silver: 28,
      djia: 38500,
    };

    const basePrice = basePrices[assetKey] || 100;
    const currentPrice = this.generateMockPrice(basePrice, 0.01);
    const change = currentPrice - basePrice;
    const changePercent = (change / basePrice) * 100;

    return {
      price: Number(currentPrice.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
    };
  }

  async getHistoricalData(assetKey: string, points: number = 100): Promise<MarketDataPoint[]> {
    const cacheKey = `historical_${assetKey}_${points}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    const basePrices: Record<string, number> = {
      gold: 2350,
      sp500: 5100,
      nasdaq: 16500,
      us10y: 4.2,
      usd: 104,
      oil: 78,
      silver: 28,
      djia: 38500,
    };

    const data = this.generateHistoricalData(basePrices[assetKey] || 100, points);
    this.cache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  }

  calculateCorrelation(data1: number[], data2: number[]): number {
    if (data1.length !== data2.length || data1.length === 0) return 0;

    const n = data1.length;
    const mean1 = data1.reduce((a, b) => a + b, 0) / n;
    const mean2 = data2.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denom1 = 0;
    let denom2 = 0;

    for (let i = 0; i < n; i++) {
      const diff1 = data1[i] - mean1;
      const diff2 = data2[i] - mean2;
      numerator += diff1 * diff2;
      denom1 += diff1 * diff1;
      denom2 += diff2 * diff2;
    }

    const denom = Math.sqrt(denom1 * denom2);
    return denom === 0 ? 0 : Number((numerator / denom).toFixed(3));
  }

  calculateRollingCorrelation(
    data1: number[],
    data2: number[],
    window: number = 20
  ): number[] {
    const result: number[] = [];

    for (let i = window; i <= data1.length; i++) {
      const window1 = data1.slice(i - window, i);
      const window2 = data2.slice(i - window, i);
      result.push(this.calculateCorrelation(window1, window2));
    }

    return result;
  }

  async getCorrelationMatrix(): Promise<CorrelationMatrix> {
    const cacheKey = 'correlation_matrix';
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    const assetKeys = ASSETS.map(a => a.key);
    const historicalData: Record<string, number[]> = {};

    for (const key of assetKeys) {
      const data = await this.getHistoricalData(key, 100);
      historicalData[key] = data.map(d => d.price);
    }

    const matrix: CorrelationMatrix = {};

    for (const key1 of assetKeys) {
      matrix[key1] = {};
      for (const key2 of assetKeys) {
        matrix[key1][key2] = this.calculateCorrelation(
          historicalData[key1],
          historicalData[key2]
        );
      }
    }

    this.cache.set(cacheKey, { data: matrix, timestamp: Date.now() });
    return matrix;
  }

  calculateHedgeRatio(assetReturns: number[], hedgeReturns: number[]): number {
    const correlation = this.calculateCorrelation(assetReturns, hedgeReturns);
    const assetVolatility = this.calculateVolatility(assetReturns);
    const hedgeVolatility = this.calculateVolatility(hedgeReturns);

    if (hedgeVolatility === 0) return 0;

    return Number((correlation * (assetVolatility / hedgeVolatility)).toFixed(3));
  }

  calculateVolatility(returns: number[]): number {
    if (returns.length === 0) return 0;

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / returns.length;

    return Number(Math.sqrt(variance).toFixed(4));
  }

  async getHedgeEffectiveness(targetAsset: string = 'sp500'): Promise<HedgeEffectiveness[]> {
    const results: HedgeEffectiveness[] = [];

    const targetData = await this.getHistoricalData(targetAsset, 100);
    const targetReturns = this.calculateReturns(targetData.map(d => d.price));

    const hedgeAssets = ['gold', 'us10y', 'usd', 'silver'];

    for (const hedgeAsset of hedgeAssets) {
      const hedgeData = await this.getHistoricalData(hedgeAsset, 100);
      const hedgeReturns = this.calculateReturns(hedgeData.map(d => d.price));

      const hedgeRatio = this.calculateHedgeRatio(targetReturns, hedgeReturns);
      const rollingCorrelation = this.calculateRollingCorrelation(
        targetReturns,
        hedgeReturns,
        20
      );

      const effectiveness = Math.abs(rollingCorrelation[rollingCorrelation.length - 1]);

      results.push({
        asset: hedgeAsset,
        hedgeRatio: Math.max(0, Math.min(1, Math.abs(hedgeRatio))),
        effectiveness,
        rollingCorrelation,
      });
    }

    return results.sort((a, b) => b.effectiveness - a.effectiveness);
  }

  calculateReturns(prices: number[]): number[] {
    const returns: number[] = [];

    for (let i = 1; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }

    return returns;
  }

  calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.02): number {
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const volatility = this.calculateVolatility(returns);

    if (volatility === 0) return 0;

    const annualFactor = Math.sqrt(252);
    return Number(((meanReturn * annualFactor - riskFreeRate) / (volatility * annualFactor)).toFixed(2));
  }

  async getMarketState(vix: number = 18, inflation: number = 3.2): Promise<MarketState> {
    let volatility: 'low' | 'normal' | 'high' = 'normal';
    let panic: 'low' | 'high' = 'low';
    let inflationState: 'low' | 'high' = 'low';
    let regime: 'bull' | 'bear' | 'crisis' | 'recovery' = 'bull';

    if (vix > 25) {
      volatility = 'high';
      if (vix > 30) panic = 'high';
    } else if (vix < 15) {
      volatility = 'low';
    }

    if (inflation > 3) {
      inflationState = 'high';
    }

    if (vix > 30) {
      regime = 'crisis';
    } else if (vix > 20) {
      regime = 'bear';
    } else if (vix < 15) {
      regime = 'bull';
    } else {
      regime = 'recovery';
    }

    return {
      volatility,
      inflation: inflationState,
      panic,
      regime,
    };
  }
}

export const marketDataService = new MarketDataService();
