// EXPORTS: BACKTEST_KPIS, generateBacktestCurveData, INFLATION_DISTRIBUTION, VIX_DISTRIBUTION

export type AssetType = 'stock' | 'tech' | 'energy' | 'finance' | 'consumption';

export interface KpiData {
  adaptive: number;
  static: number;
  stock: number;
}

export interface BacktestKpis {
  annualReturn: KpiData;
  maxDrawdown: KpiData;
  sharpe: KpiData;
  downsideProtection: number; // 自适应策略下行保护率（相对纯股票）
}

export interface TimeWindow {
  key: string;
  label: { zh: string; en: string };
  startIdx: number;
  endIdx: number;
}

export const TIME_WINDOWS: TimeWindow[] = [
  { key: '1y', label: { zh: '1年', en: '1 Year' }, startIdx: 108, endIdx: 120 },
  { key: '3y', label: { zh: '3年', en: '3 Years' }, startIdx: 84, endIdx: 120 },
  { key: '5y', label: { zh: '5年', en: '5 Years' }, startIdx: 60, endIdx: 120 },
  { key: '10y', label: { zh: '10年', en: '10 Years' }, startIdx: 0, endIdx: 120 },
];

// 回测 KPI（mock 数据，基于合理金融假设）
export function getBacktestKpis(assetType: AssetType, startIdx: number, endIdx: number): BacktestKpis {
  const periodRatio = (endIdx - startIdx) / 120;
  
  // 根据资产类型调整 KPI
  const assetFactors = {
    stock: { return: 1, drawdown: 1, sharpe: 1 },
    tech: { return: 1.2, drawdown: 1.4, sharpe: 0.9 },
    energy: { return: 0.9, drawdown: 0.8, sharpe: 1.2 },
    finance: { return: 0.95, drawdown: 0.9, sharpe: 1.1 },
    consumption: { return: 0.85, drawdown: 0.7, sharpe: 1.3 },
  };
  
  const factors = assetFactors[assetType];
  
  return {
    annualReturn: {
      adaptive: 11.8 * factors.return * periodRatio * (1 + (Math.random() * 0.2 - 0.1)),
      static: 9.2 * factors.return * periodRatio * (1 + (Math.random() * 0.2 - 0.1)),
      stock: 10.5 * factors.return * periodRatio * (1 + (Math.random() * 0.2 - 0.1)),
    },
    maxDrawdown: {
      adaptive: -12.4 * factors.drawdown,
      static: -18.6 * factors.drawdown,
      stock: -28.3 * factors.drawdown,
    },
    sharpe: {
      adaptive: 1.42 * factors.sharpe,
      static: 0.98 * factors.sharpe,
      stock: 0.76 * factors.sharpe,
    },
    downsideProtection: 56.2 * factors.drawdown,
  };
}

// 默认 KPI
export const BACKTEST_KPIS = getBacktestKpis('stock', 0, 120);

/**
 * 生成模拟的累计收益曲线数据（2015-2024，月度数据）
 * 三条曲线：自适应策略 / 静态对冲 / 纯股票
 */
export function generateBacktestCurveData(assetType: AssetType = 'stock'): {
  dates: string[];
  adaptive: number[];
  static: number[];
  stock: number[];
} {
  const dates: string[] = [];
  const adaptive: number[] = [];
  const staticH: number[] = [];
  const stock: number[] = [];

  // 起点
  let a = 1;
  let s = 1;
  let st = 1;

  // 模拟 2015-2024 共 120 个月
  const startYear = 2015;
  const months = 120;

  // 根据资产类型调整参数
  const assetParams = {
    stock: { baseReturn: 0.008, volatilityMultiplier: 1, hedgeEffectiveness: 1 },
    tech: { baseReturn: 0.01, volatilityMultiplier: 1.3, hedgeEffectiveness: 0.8 },
    energy: { baseReturn: 0.007, volatilityMultiplier: 1.2, hedgeEffectiveness: 1.3 },
    finance: { baseReturn: 0.0075, volatilityMultiplier: 1.1, hedgeEffectiveness: 1.1 },
    consumption: { baseReturn: 0.006, volatilityMultiplier: 0.8, hedgeEffectiveness: 1.4 },
  };
  
  const params = assetParams[assetType];

  // 关键事件（用于构造非对称特征）
  // 2015 股灾、2018 贸易战、2020 新冠、2022 加息通胀、2024 AI 行情
  const crisisMonths = [6, 7, 8, 42, 43, 60, 61, 62, 85, 86, 87]; // 危机月份索引（0-based）
  const rallyMonths = [12, 24, 36, 72, 100, 108, 115]; // 上涨月份

  for (let i = 0; i < months; i++) {
    const year = startYear + Math.floor(i / 12);
    const month = (i % 12) + 1;
    dates.push(`${year}-${String(month).padStart(2, '0')}`);

    // 基础月收益率
    const stockBase = params.baseReturn;
    const noise = (Math.sin(i * 1.3) + Math.cos(i * 0.7)) * 0.01 * params.volatilityMultiplier;

    // 纯股票
    let stockRet = stockBase + noise * 0.5;
    // 危机月份：大跌
    if (crisisMonths.includes(i)) {
      stockRet -= (0.04 + Math.random() * 0.04) * params.volatilityMultiplier;
    }
    // 上涨月份：大涨
    if (rallyMonths.includes(i)) {
      stockRet += (0.03 + Math.random() * 0.02) * params.volatilityMultiplier;
    }

    // 静态对冲（10% 黄金固定配置）
    const goldRet = crisisMonths.includes(i)
      ? (0.025 + Math.random() * 0.02) * params.hedgeEffectiveness // 危机时黄金上涨
      : rallyMonths.includes(i)
        ? -0.005 - Math.random() * 0.01 // 大涨时黄金微跌
        : 0.004 + noise * 0.2; // 平时黄金温和

    const staticRet = stockRet * 0.9 + goldRet * 0.1;

    // 自适应策略（根据市场状态动态调整黄金比例 5%-20%）
    const isHighStress = crisisMonths.includes(i) || crisisMonths.some((m) => Math.abs(m - i) <= 2);
    const goldWeight = isHighStress ? 0.2 : 0.05;
    const adaptiveRet = stockRet * (1 - goldWeight) + goldRet * goldWeight * params.hedgeEffectiveness;

    st *= 1 + stockRet;
    s *= 1 + staticRet;
    a *= 1 + adaptiveRet;

    stock.push(Number((st * 100 - 100).toFixed(2)));
    staticH.push(Number((s * 100 - 100).toFixed(2)));
    adaptive.push(Number((a * 100 - 100).toFixed(2)));
  }

  return { dates, adaptive, static: staticH, stock };
}

// 市场状态分布（饼图数据）
export const INFLATION_DISTRIBUTION = [
  { name: 'high', value: 38 }, // 高通胀 38%
  { name: 'low', value: 62 }, // 低通胀 62%
];

export const VIX_DISTRIBUTION = [
  { name: 'high', value: 27 }, // 高VIX 27%
  { name: 'low', value: 73 }, // 低VIX 73%
];
