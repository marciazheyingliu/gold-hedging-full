import { useState, useCallback, type FormEvent } from 'react';
import { Send, Sparkles, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getLangKey } from '@/lib/lang-utils';
import { MarketDataCard } from '@/components/MarketDataCard';
import { AIConfigPanel } from '@/components/AIConfigPanel';
import {
  calculateGoldRatio,
  detectLanguage,
  parseQueryFallback,
  INDUSTRY_LIST,
  type IndustryKey,
} from '@/data/strategy';
import {
  generateHedgingExplanation,
  loadAIConfig,
} from '@/services/aiService';

interface ExampleQuestion {
  'zh-CN': string;
  'zh-TW': string;
  'en': string;
}

const EXAMPLES: ExampleQuestion[] = [
  {
    'zh-CN': '我重仓了科技股，应该配多少黄金对冲？',
    'zh-TW': '我重倉了科技股，應該配多少黃金對沖？',
    'en': 'I hold heavy tech stocks, how much gold should I allocate for hedging?',
  },
  {
    'zh-CN': '现在通胀高，能源股配多少黄金合适？',
    'zh-TW': '現在通脹高，能源股配多少黃金合適？',
    'en': 'Inflation is high now, how much gold for energy stocks?',
  },
  {
    'zh-CN': '保守型投资者，消费行业怎么配黄金ETF？',
    'zh-TW': '保守型投資者，消費行業怎麼配黃金ETF？',
    'en': 'Conservative investor, how to allocate gold ETF for consumer sector?',
  },
];

export default function HomePage() {
  const { t, lang } = useLanguage();
  const { theme: appTheme } = useTheme();
  const langKey = getLangKey(lang);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [stepText, setStepText] = useState('');
  const [result, setResult] = useState<{
    ratio: number;
    industry: string;
    riskLevel: string;
    explanation: string;
  } | null>(null);

  const generateExplanationText = useCallback(
    async (ratio: number, industryLabel: string, riskLabel: string, inputLang: 'zh' | 'en') => {
      setStepText(langKey === 'zh' ? '正在生成解释...' : 'Generating explanation...');
      try {
        const aiConfig = loadAIConfig();
        const explanation = await generateHedgingExplanation(aiConfig, {
          ratio,
          industryLabel,
          riskLabel,
          inputLang,
        });
        setResult((prev) =>
          prev ? { ...prev, explanation } : null
        );
      } catch (err) {
        console.error('AI generation failed:', err);
        toast.error(langKey === 'zh' ? 'AI 生成失败，请检查 API 配置或使用默认说明' : 'AI generation failed, please check API config');
        const fallback =
          inputLang === 'zh'
            ? `## 配置逻辑说明\n\n基于您的${riskLabel}风险偏好和${industryLabel}行业持仓特征，建议配置 ${ratio}% 的黄金ETF作为对冲工具。\n\n黄金作为传统避险资产，在市场波动加剧、通胀上行、地缘风险上升等环境中通常表现优异，能够有效分散股票组合的系统性风险。当前配置比例综合考虑了行业特性、风险承受能力和市场环境因素。\n\n## 风险提示\n\n1. 黄金价格受美元指数、实际利率、地缘政治等多重因素影响，存在短期波动风险\n2. 对冲策略在单边上涨行情中可能拖累组合收益\n3. 建议定期（每季度）评估配置比例，根据市场环境动态调整\n4. 本建议仅供参考，不构成投资决策依据`
            : `## Hedging Rationale\n\nBased on your ${riskLabel} risk preference and ${industryLabel} sector exposure, we recommend allocating ${ratio}% to gold ETFs as a hedge.\n\nAs a traditional safe-haven asset, gold typically performs well during market volatility, rising inflation, and geopolitical risk, effectively diversifying systematic risk in equity portfolios. This allocation considers industry characteristics, risk tolerance, and market conditions.\n\n## Risk Warnings\n\n1. Gold prices are influenced by the US dollar, real interest rates, and geopolitics — short-term volatility risk exists\n2. Hedging strategies may drag returns during sustained rallies\n3. Review allocation quarterly and adjust dynamically with market conditions\n4. This advice is for reference only and does not constitute investment guidance`;
        setResult((prev) => (prev ? { ...prev, explanation: fallback } : null));
      }
    },
    [langKey]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!query.trim() || loading) return;

      setLoading(true);
      setResult(null);
      setStepText(langKey === 'zh' ? '正在分析...' : 'Analyzing...');

      const inputLang = detectLanguage(query);

      try {
        const parsed = parseQueryFallback(query);
        const calcResult = calculateGoldRatio({
          industry: parsed.industry,
          riskLevel: parsed.riskLevel,
          volatility: parsed.volatility,
          inflation: parsed.inflation,
          panic: parsed.panic,
        });

        const industryInfo = INDUSTRY_LIST.find((i) => i.key === parsed.industry as IndustryKey);
        const industryLabel = inputLang === 'zh' ? industryInfo?.zh ?? '大盘' : industryInfo?.en ?? 'Broader Market';
        const riskLabel =
          inputLang === 'zh'
            ? parsed.riskLevel === 'conservative'
              ? '保守型'
              : parsed.riskLevel === 'aggressive'
                ? '激进型'
                : '稳健型'
            : parsed.riskLevel === 'conservative'
              ? 'Conservative'
              : parsed.riskLevel === 'aggressive'
                ? 'Aggressive'
                : 'Moderate';

        setResult({
          ratio: calcResult.goldRatio,
          industry: industryLabel,
          riskLevel: riskLabel,
          explanation: '',
        });

        await generateExplanationText(calcResult.goldRatio, industryLabel, riskLabel, inputLang);
      } catch (err) {
        console.error('Analysis failed:', err);
        toast.error(t('home.result.error'));

        const parsed = parseQueryFallback(query);
        const calcResult = calculateGoldRatio({
          industry: parsed.industry,
          riskLevel: parsed.riskLevel,
          volatility: parsed.volatility,
          inflation: parsed.inflation,
          panic: parsed.panic,
        });

        const industryInfo = INDUSTRY_LIST.find((i) => i.key === parsed.industry as IndustryKey);
        const industryLabel = inputLang === 'zh' ? industryInfo?.zh ?? '大盘' : industryInfo?.en ?? 'Broader Market';
        const riskLabel =
          inputLang === 'zh'
            ? parsed.riskLevel === 'conservative'
              ? '保守型'
              : parsed.riskLevel === 'aggressive'
                ? '激进型'
                : '稳健型'
            : parsed.riskLevel === 'conservative'
              ? 'Conservative'
              : parsed.riskLevel === 'aggressive'
                ? 'Aggressive'
                : 'Moderate';

        const fallback =
          inputLang === 'zh'
            ? `## 配置逻辑说明\n\n基于您的${riskLabel}风险偏好和${industryLabel}行业持仓特征，建议配置 ${calcResult.goldRatio}% 的黄金ETF作为对冲工具。\n\n黄金作为传统避险资产，在市场波动加剧、通胀上行、地缘风险上升等环境中通常表现优异，能够有效分散股票组合的系统性风险。\n\n## 风险提示\n\n1. 黄金价格受多重因素影响，存在短期波动风险\n2. 对冲策略在单边上涨行情中可能拖累组合收益\n3. 建议定期评估配置比例，动态调整\n4. 本建议仅供参考，不构成投资决策依据`
            : `## Hedging Rationale\n\nBased on your ${riskLabel} risk preference and ${industryLabel} sector exposure, we recommend allocating ${calcResult.goldRatio}% to gold ETFs as a hedge.\n\nAs a traditional safe-haven asset, gold typically performs well during market volatility and rising inflation, effectively diversifying systematic risk in equity portfolios.\n\n## Risk Warnings\n\n1. Gold prices are influenced by multiple factors — short-term volatility risk exists\n2. Hedging strategies may drag returns during sustained rallies\n3. Review allocation periodically and adjust dynamically\n4. This advice is for reference only and does not constitute investment guidance`;

        setResult({
          ratio: calcResult.goldRatio,
          industry: industryLabel,
          riskLevel: riskLabel,
          explanation: fallback,
        });
      } finally {
        setLoading(false);
        setStepText('');
      }
    },
    [query, loading, t, generateExplanationText, langKey]
  );

  const handleExampleClick = (text: string) => {
    setQuery(text);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-4 border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/5 px-4 py-1"
            >
              <Sparkles className="size-3.5 mr-1.5" />
              {langKey === 'zh' ? 'AI 驱动 · 实证研究' : 'AI-Powered · Evidence-Based'}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C96A] to-[#D4AF37] bg-clip-text text-transparent">
                {t('home.hero.title')}
              </span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
          </motion.div>

          {/* Search Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('home.placeholder')}
                  rows={3}
                  className="w-full px-5 py-4 pr-28 bg-[#0f1622] border border-[#D4AF37]/20 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]/40 resize-none text-base"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as unknown as FormEvent);
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="absolute right-3 bottom-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a2332] font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="size-4 mr-2" />
                  )}
                  {t('home.submit')}
                </Button>
              </div>
            </form>

            {/* Example questions */}
            {!result && !loading && (
              <div className="mt-6">
                <p className="text-gray-500 text-sm mb-3">{t('home.examples.title')}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {EXAMPLES.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => handleExampleClick(langKey === 'zh' ? ex.zh : ex.en)}
                      className="px-4 py-2 text-sm text-gray-400 bg-white/5 border border-white/10 rounded-full hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-colors"
                    >
                      {langKey === 'zh' ? ex.zh : ex.en}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full pb-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <MarketDataCard />
            </div>

            {/* Right: Result */}
            <div className="lg:col-span-2">
              {(loading || result) && (
                <Card className="bg-[#0f1622]/80 border-[#D4AF37]/20 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <ShieldCheck className="size-5 text-[#D4AF37]" />
                      {t('home.result.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Loading state */}
                    {loading && !result && (
                      <div className="py-8 text-center">
                        <Loader2 className="size-8 text-[#D4AF37] animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">{stepText}</p>
                      </div>
                    )}

                    {result && (
                      <>
                        {/* Ratio display */}
                        <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#B8860B]/5 rounded-xl p-6 border border-[#D4AF37]/20">
                          <p className="text-gray-400 text-sm mb-2">{t('home.result.ratio')}</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#E8C96A] bg-clip-text text-transparent tabular-numbers">
                              {result.ratio}
                            </span>
                            <span className="text-2xl text-[#D4AF37]/80">%</span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Badge variant="outline" className="border-white/10 text-gray-300">
                              {result.industry}
                            </Badge>
                            <Badge variant="outline" className="border-white/10 text-gray-300">
                              {result.riskLevel}
                            </Badge>
                          </div>
                        </div>

                        {/* Explanation */}
                        {result.explanation ? (
                          <div className="prose prose-sm prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {result.explanation}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-gray-400 py-4">
                            <Loader2 className="size-4 animate-spin text-[#D4AF37]" />
                            <span className="text-sm">{stepText}</span>
                          </div>
                        )}

                        {/* Risk warning footer */}
                        <div className="flex items-start gap-3 pt-4 border-t border-white/5">
                          <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-500">
                            {langKey === 'zh'
                              ? '风险提示：以上建议基于历史数据和量化模型，仅供参考，不构成任何投资建议。市场有风险，投资需谨慎。'
                              : 'Risk Warning: The above advice is based on historical data and quantitative models, for reference only and does not constitute investment advice. Market risks exist, invest cautiously.'}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
