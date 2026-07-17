import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BookOpen, Play, Save, Download, Code, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SIMPLE_STRATEGY, GOLD_HEDGE_STRATEGY } from '@/services/backtestEngine';

export interface StrategyConfig {
  initialCapital: number;
  commissionRate: number;
  slippageRate: number;
  timePeriod: string;
}

interface StrategyEditorProps {
  initialCode?: string;
  initialConfig?: Partial<StrategyConfig>;
  onRun?: (code: string, config: StrategyConfig) => void;
  onSave?: (code: string, name: string) => void;
  isRunning?: boolean;
}

// 策略元数据
const getStrategyMeta = (lang: string) => ({
  simple: {
    name: lang === 'en' ? 'Simple Moving Average' : 
          lang === 'zh-TW' ? '簡單均線策略' : '简单均线策略',
    code: SIMPLE_STRATEGY,
    description: lang === 'en' 
      ? 'The simplest strategy: buy when price crosses above MA, sell when it crosses below'
      : lang === 'zh-TW' 
        ? '最簡單的策略，價格上穿均線買入，下穿賣出' 
        : '最简单的策略，价格上穿均线买入，下穿卖出',
    difficulty: lang === 'en' ? 'Easy' : lang === 'zh-TW' ? '簡單' : '简单'
  },
  goldHedge: {
    name: lang === 'en' ? 'Gold Hedging Strategy' : 
          lang === 'zh-TW' ? '黃金對沖策略' : '黄金对冲策略',
    code: GOLD_HEDGE_STRATEGY,
    description: lang === 'en' 
      ? 'Dynamically adjust gold allocation based on market conditions'
      : lang === 'zh-TW' 
        ? '根據市場狀態動態調整黃金配置' 
        : '根据市场状态动态调整黄金配置',
    difficulty: lang === 'en' ? 'Medium' : lang === 'zh-TW' ? '中等' : '中等'
  }
});

const TIME_PERIODS = [
  { value: '1m', days: 22 },
  { value: '3m', days: 66 },
  { value: '6m', days: 132 },
  { value: '1y', days: 252 },
  { value: '3y', days: 756 },
  { value: '5y', days: 1260 },
];

export function StrategyEditor({ initialCode, initialConfig, onRun, onSave, isRunning }: StrategyEditorProps) {
  const { t, lang } = useLanguage();
  const strategyMeta = getStrategyMeta(lang);
  
  const [selectedStrategyKey, setSelectedStrategyKey] = useState('simple');
  const [code, setCode] = useState(initialCode || strategyMeta.simple.code);
  const [strategyName, setStrategyName] = useState(strategyMeta.simple.name);
  const [activeTab, setActiveTab] = useState('editor');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // 配置参数
  const [config, setConfig] = useState<StrategyConfig>({
    initialCapital: initialConfig?.initialCapital || 100000,
    commissionRate: initialConfig?.commissionRate || 0.001,
    slippageRate: initialConfig?.slippageRate || 0.001,
    timePeriod: initialConfig?.timePeriod || '1y',
  });

  // 处理策略切换
  const handleStrategyChange = (key: string) => {
    setSelectedStrategyKey(key);
    const strategy = strategyMeta[key as keyof typeof strategyMeta];
    if (strategy) {
      setCode(strategy.code);
      setStrategyName(strategy.name);
    }
  };

  // 代码编辑器自动调整高度
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 600)}px`;
    }
  };

  // 初始化编辑器高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 600)}px`;
    }
  }, []);

  const handleRun = () => {
    onRun?.(code, config);
  };

  const getTimePeriodLabel = (value: string) => {
    switch (value) {
      case '1m': return t('strategy.timePeriod.1m');
      case '3m': return t('strategy.timePeriod.3m');
      case '6m': return t('strategy.timePeriod.6m');
      case '1y': return t('strategy.timePeriod.1y');
      case '3y': return t('strategy.timePeriod.3y');
      case '5y': return t('strategy.timePeriod.5y');
      default: return value;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              {t('strategy.editor')}
            </CardTitle>
            <CardDescription>
              {t('strategy.subtitle')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={strategyName}
              onChange={(e) => setStrategyName(e.target.value)}
              placeholder="Strategy Name"
              className="w-48"
            />
            <Select value={selectedStrategyKey} onValueChange={handleStrategyChange}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder={t('strategy.selectTemplate')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="simple">{strategyMeta.simple.name} ({strategyMeta.simple.difficulty})</SelectItem>
                <SelectItem value="goldHedge">{strategyMeta.goldHedge.name} ({strategyMeta.goldHedge.difficulty})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              {t('strategy.code')}
            </TabsTrigger>
            <TabsTrigger value="tutorial" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {t('strategy.tutorial')}
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              {t('strategy.apiHelp')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-0">
            <div className="bg-muted rounded-lg p-1 overflow-hidden border">
              <div className="flex items-center justify-between px-4 py-2 bg-card border-b">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-sm text-muted-foreground">strategy.js</span>
                </div>
              </div>
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleCodeChange}
                className="w-full bg-transparent font-mono text-sm p-4 resize-none focus:outline-none min-h-[400px] dark:text-gray-100"
                spellCheck={false}
              />
            </div>
          </TabsContent>

          <TabsContent value="tutorial" className="mt-0">
            <div className="bg-muted/50 rounded-lg p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {t('strategy.tutorial')}
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">1. {t('strategy.step1')}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {t('strategy.step1.desc')}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">2. {t('strategy.step2')}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {t('strategy.step2.desc')}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">3. {t('strategy.step3')}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {t('strategy.step3.desc')}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">4. {t('strategy.step4')}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {t('strategy.step4.desc')}
                  </CardContent>
                </Card>
              </div>

              <div className="border-t pt-6 mt-6">
                <h4 className="font-semibold mb-3">{t('strategy.description')}</h4>
                {Object.entries(strategyMeta).map(([key, strategy]) => (
                  <div key={key} className="mb-4 p-3 bg-card rounded-lg border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{strategy.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        strategy.difficulty === 'Easy' || strategy.difficulty === '簡單' || strategy.difficulty === '简单' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {t(`strategy.difficulty.${strategy.difficulty.toLowerCase()}`)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="help" className="mt-0">
            <div className="bg-muted/50 rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-semibold mb-2">{t('strategy.apiHelp')}</h3>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t('strategy.editor')} {t('strategy.code')}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2 font-mono">
                    <div>
                      <p className="text-muted-foreground">
                        {lang === 'en' 
                          ? 'Write your strategy in JavaScript. The engine provides two functions:'
                          : lang === 'zh-TW'
                            ? '用 JavaScript 編寫您的策略。引擎提供兩個函數：'
                            : '用 JavaScript 编写您的策略。引擎提供两个函数：'}
                      </p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><code className="bg-primary/10 px-2 py-0.5 rounded">initialize(context)</code></li>
                        <li><code className="bg-primary/10 px-2 py-0.5 rounded">handleBar(context, actions)</code></li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Context {t('strategy.code')}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="font-mono">
                      <p><span className="text-primary">data</span> - Historical price data</p>
                      <p><span className="text-primary">currentIndex</span> - Current bar index</p>
                      <p><span className="text-primary">cash</span> - Available cash</p>
                      <p><span className="text-primary">positions</span> - Current positions</p>
                      <p><span className="text-primary">portfolioValue</span> - Total portfolio value</p>
                      <p><span className="text-primary">parameters</span> - Strategy parameters</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{t('strategy.config')} Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="font-mono">
                      <p><code className="bg-primary/10 px-1.5 py-0.5 rounded">buy(asset, amount, reason)</code></p>
                      <p><code className="bg-primary/10 px-1.5 py-0.5 rounded">sell(asset, amount, reason)</code></p>
                      <p><code className="bg-primary/10 px-1.5 py-0.5 rounded">orderValue(asset, value, reason)</code></p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* 配置参数区域 */}
        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold mb-4">{t('strategy.config')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialCapital">{t('strategy.initialCapital')}</Label>
              <Input
                id="initialCapital"
                type="number"
                value={config.initialCapital}
                onChange={(e) => setConfig({ ...config, initialCapital: Number(e.target.value) })}
                placeholder={t('strategy.initialCapital.placeholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commissionRate">{t('strategy.commission')} (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                step="0.001"
                value={config.commissionRate * 100}
                onChange={(e) => setConfig({ ...config, commissionRate: Number(e.target.value) / 100 })}
                placeholder={t('strategy.commission.placeholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slippageRate">{t('strategy.slippage')} (%)</Label>
              <Input
                id="slippageRate"
                type="number"
                step="0.001"
                value={config.slippageRate * 100}
                onChange={(e) => setConfig({ ...config, slippageRate: Number(e.target.value) / 100 })}
                placeholder={t('strategy.slippage.placeholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timePeriod">{t('strategy.timePeriod')}</Label>
              <Select 
                value={config.timePeriod} 
                onValueChange={(value) => setConfig({ ...config, timePeriod: value })}
              >
                <SelectTrigger id="timePeriod">
                  <SelectValue placeholder={t('strategy.timePeriod.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {TIME_PERIODS.map(period => (
                    <SelectItem key={period.value} value={period.value}>
                      {getTimePeriodLabel(period.value)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center border-t pt-6">
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => onSave?.(code, strategyName)}>
            <Save className="w-4 h-4 mr-2" />
            {t('strategy.save')}
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {t('strategy.export')}
          </Button>
        </div>
        <Button 
          onClick={handleRun} 
          disabled={isRunning}
          className="bg-primary hover:bg-primary/90"
        >
          <Play className={`w-4 h-4 mr-2 ${isRunning ? 'animate-pulse' : ''}`} />
          {isRunning ? t('strategy.running') : t('strategy.run')}
        </Button>
      </CardFooter>
    </Card>
  );
}
