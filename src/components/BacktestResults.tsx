import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { BacktestResult, Trade } from '@/services/backtestEngine';
import { useLanguage } from '@/contexts/LanguageContext';

interface BacktestResultsProps {
  result: BacktestResult | null;
  isLoading?: boolean;
}

export function BacktestResults({ result, isLoading }: BacktestResultsProps) {
  const { t, lang } = useLanguage();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="animate-pulse">{t('strategy.running')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* KPI 卡片区域 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              {t('result.totalReturn')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(result.totalReturn * 100).toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              {t('result.maxDrawdown')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {(result.maxDrawdown * 100).toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4 text-yellow-500" />
              {t('result.sharpeRatio')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {result.sharpeRatio.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              {t('result.totalTrades')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {result.totalTrades}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('result.winRate')}: {(result.winRate * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 详细结果标签页 */}
      <Tabs defaultValue="equity" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="equity">{t('result.equityCurve')}</TabsTrigger>
          <TabsTrigger value="trades">{t('result.trades')}</TabsTrigger>
          <TabsTrigger value="metrics">{t('result.metrics')}</TabsTrigger>
        </TabsList>

        <TabsContent value="equity" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>{t('result.equityCurve')}</CardTitle>
              <CardDescription>
                {lang === 'en' 
                  ? 'Shows the portfolio value over time'
                  : lang === 'zh-TW'
                    ? '顯示投資組合價值隨時間的變化'
                    : '显示投资组合价值随时间的变化'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EquityChart result={result} lang={lang} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trades" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>{t('result.trades')}</CardTitle>
              <CardDescription>
                {lang === 'en' 
                  ? 'List of all executed trades'
                  : lang === 'zh-TW'
                    ? '所有執行的交易清單'
                    : '所有执行的交易清单'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TradeTable trades={result.trades} t={t} lang={lang} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>{t('result.metrics')}</CardTitle>
              <CardDescription>
                {lang === 'en' 
                  ? 'Detailed performance metrics'
                  : lang === 'zh-TW'
                    ? '詳細的績效指標'
                    : '详细的绩效指标'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetricsTable result={result} t={t} lang={lang} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// 资金曲线图组件
function EquityChart({ result, lang }: { result: BacktestResult, lang: string }) {
  const isDark = true; // 默认深色主题
  
  const chartOption = useMemo(() => {
    const initialValue = result.initialCapital;
    const dates = result.portfolioHistory.map(d => {
      const date = new Date(d.timestamp);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const equityValues = result.portfolioHistory.map(d => 
      ((d.totalValue - initialValue) / initialValue * 100)
    );

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const value = params[0].value;
          const date = dates[params[0].dataIndex];
          return `${date}<br/>${lang === 'en' ? 'Return' : lang === 'zh-TW' ? '報酬率' : '收益率'}: ${value.toFixed(2)}%`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: isDark ? '#334155' : '#e2e8f0' } },
        axisLabel: { color: isDark ? '#94a3b8' : '#64748b' }
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: isDark ? '#334155' : '#e2e8f0' } },
        axisLabel: { 
          color: isDark ? '#94a3b8' : '#64748b',
          formatter: '{value}%'
        },
        splitLine: { lineStyle: { color: isDark ? '#1e293b' : '#f1f5f9' } }
      },
      series: [
        {
          name: lang === 'en' ? 'Return' : lang === 'zh-TW' ? '報酬率' : '收益率',
          type: 'line',
          data: equityValues,
          smooth: true,
          lineStyle: { color: '#D4AF37', width: 2 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(212, 175, 55, 0.3)' },
                { offset: 1, color: 'rgba(212, 175, 55, 0)' }
              ]
            }
          },
          itemStyle: { color: '#D4AF37' }
        }
      ]
    };
  }, [result, isDark, lang]);

  return (
    <ReactECharts
      option={chartOption}
      style={{ height: '400px' }}
      notMerge={true}
    />
  );
}

// 交易表格组件
function TradeTable({ trades, t, lang }: { trades: Trade[], t: any, lang: string }) {
  if (trades.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {lang === 'en' ? 'No trades executed' : lang === 'zh-TW' ? '沒有執行交易' : '没有执行交易'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('result.date')}</TableHead>
            <TableHead>{lang === 'en' ? 'Action' : lang === 'zh-TW' ? '操作' : '操作'}</TableHead>
            <TableHead>{t('result.asset')}</TableHead>
            <TableHead>{t('result.price')}</TableHead>
            <TableHead>{t('result.amount')}</TableHead>
            <TableHead>{t('result.reason')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade, index) => (
            <TableRow key={index}>
              <TableCell>
                {new Date(trade.timestamp).toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN')}
              </TableCell>
              <TableCell>
                <Badge variant={trade.type === 'buy' ? 'default' : 'destructive'}>
                  {trade.type === 'buy' 
                    ? (lang === 'en' ? 'Buy' : lang === 'zh-TW' ? '買入' : t('result.buy'))
                    : (lang === 'en' ? 'Sell' : lang === 'zh-TW' ? '賣出' : t('result.sell'))}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{trade.asset}</TableCell>
              <TableCell>${trade.price.toFixed(2)}</TableCell>
              <TableCell>{trade.amount}</TableCell>
              <TableCell className="text-muted-foreground">{trade.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// 详细指标表格组件
function MetricsTable({ result, t, lang }: { result: BacktestResult, t: any, lang: string }) {
  const metrics = [
    { name: lang === 'en' ? 'Initial Capital' : lang === 'zh-TW' ? '初始資金' : t('strategy.initialCapital'), value: `$${result.initialCapital.toLocaleString()}` },
    { name: lang === 'en' ? 'Final Capital' : lang === 'zh-TW' ? '最終資金' : '最终资金', value: `$${result.finalCapital.toFixed(2)}` },
    { name: t('result.totalReturn'), value: `${(result.totalReturn * 100).toFixed(2)}%` },
    { name: t('result.annualReturn'), value: `${(result.annualizedReturn * 100).toFixed(2)}%` },
    { name: t('result.maxDrawdown'), value: `${(result.maxDrawdown * 100).toFixed(2)}%` },
    { name: t('result.sharpeRatio'), value: result.sharpeRatio.toFixed(2) },
    { name: t('result.volatility'), value: `${(result.volatility * 100).toFixed(2)}%` },
    { name: t('result.totalTrades'), value: result.totalTrades.toString() },
    { name: t('result.winRate'), value: `${(result.winRate * 100).toFixed(1)}%` },
    { name: t('result.profitFactor'), value: result.profitFactor.toFixed(2) },
    { name: t('result.benchmark'), value: `${(result.benchmarkReturn * 100).toFixed(2)}%` },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4">
          <div className="text-sm text-muted-foreground mb-1">{metric.name}</div>
          <div className="text-lg font-semibold">{metric.value}</div>
        </Card>
      ))}
    </div>
  );
}
