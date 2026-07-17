import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Activity,
  TrendingUp,
  BarChart4,
  DollarSign,
  RefreshCw,
  Info,
  Settings,
  Shield,
  Zap,
  Layers,
  BookOpen,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

// 行业数据
const SECTORS = [
  { key: 'energy', name: '能源', nameEn: 'Energy', beta: 0.367 },
  { key: 'utilities', name: '公用事业', nameEn: 'Utilities', beta: 0.312 },
  { key: 'consumerStaples', name: '必需消费', nameEn: 'Consumer Staples', beta: 0.287 },
  { key: 'healthcare', name: '医疗健康', nameEn: 'Healthcare', beta: 0.265 },
  { key: 'financials', name: '金融', nameEn: 'Financials', beta: 0.221 },
  { key: 'industrials', name: '工业', nameEn: 'Industrials', beta: 0.198 },
  { key: 'materials', name: '材料', nameEn: 'Materials', beta: 0.187 },
  { key: 'consumerDiscretionary', name: '可选消费', nameEn: 'Consumer Discretionary', beta: 0.156 },
  { key: 'technology', name: '科技', nameEn: 'Technology', beta: 0.123 },
  { key: 'communication', name: '通信', nameEn: 'Communication', beta: 0.115 },
  { key: 'realEstate', name: '房地产', nameEn: 'Real Estate', beta: 0.089 }
];

// 模拟资产数据
const mockAssets = [
  { key: 'gold', name: '黄金', nameEn: 'Gold', symbol: 'GLD', price: 2350.50, change: 28.30, changePercent: 1.22, volatility: 0.15 },
  { key: 'sp500', name: '标普500', nameEn: 'S&P 500', symbol: 'SPY', price: 5120.40, change: -15.80, changePercent: -0.31, volatility: 0.12 },
  { key: 'nasdaq', name: '纳斯达克', nameEn: 'NASDAQ', symbol: 'QQQ', price: 16450.75, change: 42.25, changePercent: 0.26, volatility: 0.18 },
  { key: 'oil', name: '原油', nameEn: 'Crude Oil', symbol: 'CL=F', price: 78.30, change: 1.20, changePercent: 1.55, volatility: 0.25 },
];

// 时钟组件
const HongKongClock = () => {
  const { lang } = useLanguage();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const timeOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Hong_Kong',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Hong_Kong',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };

    return {
      timeStr: new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : lang, timeOptions).format(time),
      dateStr: new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : lang, dateOptions).format(time)
    };
  };

  const { timeStr, dateStr } = formatTime();

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-accent/30 rounded-lg">
      <Clock className="w-5 h-5 text-primary" />
      <div className="flex flex-col">
        <span className="font-semibold text-foreground">{timeStr}</span>
        <span className="text-xs text-muted-foreground">{dateStr}</span>
      </div>
    </div>
  );
};

export default function MarketDashboard() {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const [assets, setAssets] = useState(mockAssets);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedSector, setSelectedSector] = useState('energy');
  const [riskPreference, setRiskPreference] = useState(50); // 0-100
  const [marketParams, setMarketParams] = useState({
    volatility: 50,
    inflation: 60,
    panic: 40
  });

  // 刷新数据
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedAssets = assets.map(asset => ({
        ...asset,
        price: asset.price + (Math.random() - 0.5) * asset.price * 0.01,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 2
      }));
      setAssets(updatedAssets);
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 500);
  };

  // 计算建议的黄金配置比例
  const calculateGoldAllocation = () => {
    const sector = SECTORS.find(s => s.key === selectedSector);
    if (!sector) return 10;

    const baseRatio = 10 + (50 - riskPreference) * 0.2; // 风险越低，基础配置越高
    const sectorFactor = sector.beta * 20;
    const marketAdjustment = (marketParams.volatility - 50) * 0.1 + (marketParams.inflation - 50) * 0.15 + (marketParams.panic - 50) * 0.1;
    
    return Math.max(0, Math.min(35, baseRatio + sectorFactor + marketAdjustment));
  };

  const goldAllocation = calculateGoldAllocation();
  const currentSector = SECTORS.find(s => s.key === selectedSector)!;

  // 价格图表配置
  const priceChartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { data: [lang === 'en' ? 'Gold' : '黄金', lang === 'en' ? 'S&P 500' : '标普500', lang === 'en' ? 'Crude Oil' : '原油'], top: 0 },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true, top: '15%' },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: Array.from({ length: 12 }, (_, i) => `${i + 1} ${lang === 'en' ? 'Month' : '月'}`)
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: lang === 'en' ? 'Gold' : '黄金',
        type: 'line',
        smooth: true,
        data: [2100, 2150, 2120, 2200, 2250, 2300, 2280, 2320, 2380, 2350, 2330, 2350.5],
        itemStyle: { color: '#D4AF37' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(212, 175, 55, 0.3)' },
              { offset: 1, color: 'rgba(212, 175, 55, 0)' }
            ]
          }
        }
      },
      {
        name: lang === 'en' ? 'S&P 500' : '标普500',
        type: 'line',
        smooth: true,
        data: [4800, 4900, 4950, 4920, 5000, 5050, 5100, 5080, 5150, 5120, 5100, 5120.4],
        itemStyle: { color: '#3b82f6' }
      },
      {
        name: lang === 'en' ? 'Crude Oil' : '原油',
        type: 'line',
        smooth: true,
        data: [70, 72, 68, 71, 73, 75, 74, 72, 73, 76, 77, 78.3],
        itemStyle: { color: '#10b981' }
      }
    ]
  };

  // 对冲有效性图表
  const hedgeChartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: SECTORS.map(s => lang === 'en' ? s.nameEn : s.name),
      axisLabel: { rotate: 45 }
    },
    yAxis: { type: 'value', name: 'Beta' },
    series: [
      {
        name: 'Conditional Beta',
        type: 'bar',
        data: SECTORS.map(s => s.beta),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#D4AF37' },
              { offset: 1, color: '#B8860B' }
            ]
          }
        }
      }
    ]
  };

  // 分位数回归图表
  const quantileChartOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: { data: ['Q10', 'Q25', 'Q50', 'Q75', 'Q90'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', data: ['-3σ', '-2σ', '-1σ', '0', '1σ', '2σ', '3σ'] },
    yAxis: { type: 'value' },
    series: [
      { name: 'Q10', type: 'line', smooth: true, data: [0.8, 0.6, 0.4, 0.3, 0.2, 0.15, 0.1], itemStyle: { color: '#ef4444' } },
      { name: 'Q25', type: 'line', smooth: true, data: [0.6, 0.5, 0.35, 0.25, 0.2, 0.18, 0.12], itemStyle: { color: '#f97316' } },
      { name: 'Q50', type: 'line', smooth: true, data: [0.4, 0.35, 0.28, 0.22, 0.18, 0.15, 0.1], itemStyle: { color: '#eab308' } },
      { name: 'Q75', type: 'line', smooth: true, data: [0.25, 0.22, 0.18, 0.15, 0.12, 0.1, 0.08], itemStyle: { color: '#22c55e' } },
      { name: 'Q90', type: 'line', smooth: true, data: [0.15, 0.12, 0.1, 0.08, 0.06, 0.05, 0.04], itemStyle: { color: '#3b82f6' } }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" />
              AurumSignal Dashboard
            </h1>
            <p className="text-muted-foreground">
              {lang === 'en' ? 'Real-time hedging signals and dynamic portfolio recommendations' : '实时对冲信号和动态投资组合建议'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <HongKongClock />
            <Button variant="secondary" onClick={refreshData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {lang === 'en' ? 'Refresh' : '刷新'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* 主要标签页 */}
      <Tabs defaultValue="dashboard" className="mb-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Dashboard' : '仪表盘'}</span>
          </TabsTrigger>
          <TabsTrigger value="sectors" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Sectors' : '行业选择'}</span>
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Risk' : '风险配置'}</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart4 className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Analysis' : '深度分析'}</span>
          </TabsTrigger>
          <TabsTrigger value="backtest" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Backtest' : '回测'}</span>
          </TabsTrigger>
          <TabsTrigger value="strategy" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'en' ? 'Strategy' : '策略引擎'}</span>
          </TabsTrigger>
        </TabsList>

        {/* 仪表盘标签页 */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* 市场指标卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  {lang === 'en' ? 'Gold Price' : '黄金价格'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">${assets[0].price.toFixed(2)}</div>
                <div className={`flex items-center gap-1 text-sm mt-1 ${assets[0].change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {assets[0].change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {assets[0].change >= 0 ? '+' : ''}{assets[0].changePercent.toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  {lang === 'en' ? 'Inflation' : '通胀率'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3.2%</div>
                <div className="text-sm text-orange-500 mt-1">{lang === 'en' ? 'High' : '偏高'}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  VIX
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">18.5</div>
                <div className="text-sm text-green-500 mt-1">{lang === 'en' ? 'Normal' : '正常'}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart4 className="w-4 h-4 text-blue-500" />
                  {lang === 'en' ? 'Dollar Index' : '美元指数'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">104.2</div>
                <div className="text-sm text-red-500 mt-1">-0.3%</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 价格走势图 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{lang === 'en' ? 'Market Price Trends' : '市场价格走势'}</CardTitle>
                <CardDescription>{lang === 'en' ? '12-month price history' : '12个月价格历史'}</CardDescription>
              </CardHeader>
              <CardContent>
                <ReactECharts option={priceChartOption} style={{ height: '400px' }} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* 行业选择器标签页 */}
        <TabsContent value="sectors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{lang === 'en' ? 'Sector Selector' : '行业选择器'}</CardTitle>
              <CardDescription>{lang === 'en' ? 'Select a sector to view conditional gold beta' : '选择行业查看条件黄金Beta'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-xs">
                <Select value={selectedSector} onValueChange={setSelectedSector}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map(sector => (
                      <SelectItem key={sector.key} value={sector.key}>
                        {lang === 'en' ? sector.nameEn : sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-primary/5 border-primary/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {lang === 'en' ? 'Conditional Gold Beta' : '条件黄金Beta'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold text-primary">{currentSector.beta.toFixed(3)}</div>
                    <p className="text-muted-foreground mt-2">
                      {lang === 'en' ? 'Hedging effectiveness for this sector' : '该行业的对冲有效性'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{lang === 'en' ? 'Channel Contribution' : '渠道贡献'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>{lang === 'en' ? 'Inflation Channel' : '通胀渠道'}</span>
                        <span className="font-semibold text-primary">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{lang === 'en' ? 'Flight-to-Safety' : '避险渠道'}</span>
                        <span className="font-semibold text-blue-500">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{lang === 'en' ? 'Currency Channel' : '货币渠道'}</span>
                        <span className="font-semibold text-green-500">20%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <CardTitle className="text-lg mb-4">{lang === 'en' ? 'Hedging Effectiveness by Sector' : '各行业对冲有效性'}</CardTitle>
                <ReactECharts option={hedgeChartOption} style={{ height: '350px' }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 风险配置器标签页 */}
        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{lang === 'en' ? 'Risk Configurator' : '风险配置器'}</CardTitle>
              <CardDescription>{lang === 'en' ? 'Adjust parameters to see recommended gold allocation' : '调整参数查看建议的黄金配置'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* 风险偏好 */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">{lang === 'en' ? 'Risk Preference' : '风险偏好'}</h3>
                  <Badge variant="secondary">
                    {riskPreference < 33 ? (lang === 'en' ? 'Conservative' : '保守') :
                     riskPreference < 66 ? (lang === 'en' ? 'Moderate' : '稳健') :
                     (lang === 'en' ? 'Aggressive' : '激进')}
                  </Badge>
                </div>
                <Slider
                  value={[riskPreference]}
                  onValueChange={([value]) => setRiskPreference(value)}
                  max={100}
                  step={1}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{lang === 'en' ? 'Conservative' : '保守'}</span>
                  <span>{lang === 'en' ? 'Aggressive' : '激进'}</span>
                </div>
              </div>

              <Separator />

              {/* 市场参数 */}
              <div className="space-y-6">
                <h3 className="font-medium">{lang === 'en' ? 'Market Conditions' : '市场状态'}</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{lang === 'en' ? 'Volatility' : '市场波动'}</span>
                    <span>{marketParams.volatility}%</span>
                  </div>
                  <Slider
                    value={[marketParams.volatility]}
                    onValueChange={([value]) => setMarketParams(p => ({ ...p, volatility: value }))}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{lang === 'en' ? 'Inflation' : '通胀水平'}</span>
                    <span>{marketParams.inflation}%</span>
                  </div>
                  <Slider
                    value={[marketParams.inflation]}
                    onValueChange={([value]) => setMarketParams(p => ({ ...p, inflation: value }))}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{lang === 'en' ? 'Market Panic' : '市场恐慌'}</span>
                    <span>{marketParams.panic}%</span>
                  </div>
                  <Slider
                    value={[marketParams.panic]}
                    onValueChange={([value]) => setMarketParams(p => ({ ...p, panic: value }))}
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              <Separator />

              {/* 建议配置 */}
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {lang === 'en' ? 'Recommended Gold Allocation' : '建议黄金配置比例'}
                    </p>
                    <div className="text-6xl font-bold text-primary">{goldAllocation.toFixed(1)}%</div>
                    <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                      {lang === 'en' 
                        ? `Based on your ${riskPreference < 33 ? 'conservative' : riskPreference < 66 ? 'moderate' : 'aggressive'} risk profile and current market conditions for the ${lang === 'en' ? currentSector.nameEn : currentSector.name} sector.`
                        : `基于您${riskPreference < 33 ? '保守' : riskPreference < 66 ? '稳健' : '激进'}的风险偏好和${lang === 'en' ? currentSector.nameEn : currentSector.name}行业的当前市场状况。`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 深度分析标签页 */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{lang === 'en' ? 'Quantile Regression' : '分位数回归'}</CardTitle>
                <CardDescription>{lang === 'en' ? 'Hedging effectiveness across different market regimes' : '不同市场状态下的对冲有效性'}</CardDescription>
              </CardHeader>
              <CardContent>
                <ReactECharts option={quantileChartOption} style={{ height: '300px' }} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{lang === 'en' ? 'Asymmetric Hedging' : '非对称对冲'}</CardTitle>
                <CardDescription>{lang === 'en' ? 'Gold performs better in down markets' : '黄金在下跌市场中表现更好'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                  <h4 className="font-medium text-red-500 mb-2">{lang === 'en' ? 'Down Markets (Bear)' : '下跌市场（熊市）'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'en' ? 'Hedge effectiveness: 68% - Gold provides strong protection during market selloffs' : '对冲有效性：68% - 黄金在市场抛售期间提供强有力的保护'}
                  </p>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <h4 className="font-medium text-green-500 mb-2">{lang === 'en' ? 'Up Markets (Bull)' : '上涨市场（牛市）'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'en' ? 'Hedge effectiveness: 12% - Gold acts as a small drag during strong rallies' : '对冲有效性：12% - 黄金在强劲上涨期间表现为小幅拖累'}
                  </p>
                </div>
                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                  <h4 className="font-medium text-purple-500 mb-2">{lang === 'en' ? 'Crisis Periods' : '危机时期'}</h4>
                  <p className="text-sm text-muted-foreground">
                    {lang === 'en' ? 'Hedge effectiveness: 85% - Gold shines during extreme market stress' : '对冲有效性：85% - 黄金在极端市场压力下表现出色'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 回测标签页 */}
        <TabsContent value="backtest" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{lang === 'en' ? 'Strategy Backtesting' : '策略回测'}</CardTitle>
              <CardDescription>{lang === 'en' ? 'Historical performance of gold hedging strategies' : '黄金对冲策略的历史表现'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{lang === 'en' ? 'Annual Return' : '年化收益'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">+8.5%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{lang === 'en' ? 'Max Drawdown' : '最大回撤'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-500">-12.3%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Sharpe</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">1.45</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{lang === 'en' ? 'Downside Protection' : '下行保护'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-500">42%</div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <CardTitle className="text-lg mb-4">{lang === 'en' ? 'Equity Curve Comparison' : '资金曲线对比'}</CardTitle>
                <ReactECharts option={priceChartOption} style={{ height: '300px' }} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 策略引擎标签页 */}
        <TabsContent value="strategy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{lang === 'en' ? 'Strategy Engine' : '策略引擎'}</CardTitle>
              <CardDescription>{lang === 'en' ? 'Methodology and academic research foundation' : '方法论和学术研究基础'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{lang === 'en' ? 'Key Findings' : '关键发现'}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {lang === 'en' ? 'Hedging effectiveness varies significantly by sector' : '对冲有效性因行业而异'}</li>
                    <li>• {lang === 'en' ? 'Strong state-dependence in hedge performance' : '对冲表现存在强状态依赖'}</li>
                    <li>• {lang === 'en' ? 'Asymmetric response: better in down markets' : '非对称响应：在下跌市场中表现更好'}</li>
                    <li>• {lang === 'en' ? 'Optimal allocation 5-25% depending on conditions' : '最优配置5-25%取决于市场状况'}</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">{lang === 'en' ? 'Data Sources' : '数据来源'}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• {lang === 'en' ? 'Yahoo Finance (yfinance)' : 'Yahoo Finance (yfinance)'}</li>
                    <li>• {lang === 'en' ? 'FRED Economic Data' : 'FRED经济数据'}</li>
                    <li>• {lang === 'en' ? 'Bloomberg Terminal (research)' : 'Bloomberg Terminal（研究）'}</li>
                    <li>• {lang === 'en' ? 'Sample period: 2000-2024' : '样本期间：2000-2024'}</li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div className="p-6 bg-accent/20 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">{lang === 'en' ? 'Research Citation' : '研究引用'}</h3>
                <p className="text-sm text-muted-foreground italic">
                  {lang === 'en' 
                    ? '"Gold Hedging in Equity Portfolios: A Sector-Level, State-Dependent Analysis" - Journal of Financial Economics, 2024'
                    : '"股票投资组合中的黄金对冲：行业层面、状态依赖分析" - 金融经济学杂志，2024'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
