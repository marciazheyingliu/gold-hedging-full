import { useState } from 'react';
import { motion } from 'framer-motion';
import { StrategyEditor, StrategyConfig } from '@/components/StrategyEditor';
import { BacktestResults } from '@/components/BacktestResults';
import { SimpleBacktestEngine, generateMockData, TIME_PERIODS } from '@/services/backtestEngine';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BacktestPage() {
  const { t } = useLanguage();
  const [result, setResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunBacktest = (code: string, config: StrategyConfig) => {
    setIsRunning(true);
    setResult(null);
    
    try {
      // 根据选择的时间周期获取天数
      const days = TIME_PERIODS[config.timePeriod] || 252;
      
      // 生成数据
      const data = {
        'SPY': generateMockData('SPY', days),
        'GLD': generateMockData('GLD', days),
      };
      
      // 创建引擎 - 使用用户配置
      const engine = new SimpleBacktestEngine({
        initialCapital: config.initialCapital,
        data,
        strategyCode: code,
        commission: config.commissionRate,
        slippage: config.slippageRate,
      });
      
      // 同步运行回测
      const backtestResult = engine.run();
      setResult(backtestResult);
      toast.success(t('result.success'));
    } catch (error) {
      console.error('回测错误:', error);
      toast.error(`${t('result.error')}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t('strategy.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('strategy.subtitle')}
          </p>
        </div>
      </motion.div>

      <div className="space-y-8">
        {/* 策略编辑器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StrategyEditor
            onRun={handleRunBacktest}
            isRunning={isRunning}
          />
        </motion.div>

        {/* 回测结果 */}
        {(result || isRunning) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BacktestResults result={result} isLoading={isRunning} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
