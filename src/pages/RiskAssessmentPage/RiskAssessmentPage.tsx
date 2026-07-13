import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, ArrowLeft, RefreshCw, Calculator } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLangKey } from '@/lib/lang-utils';

interface Question {
  title: string;
  desc: string;
  options: string[];
}

interface Result {
  type: 'conservative' | 'moderate' | 'balanced' | 'aggressive' | 'veryAggressive';
  goldRatio: number;
  description: string;
}

export default function RiskAssessmentPage() {
  const { t, lang } = useLanguage();
  const langKey = getLangKey(lang);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  const questions: Question[] = [
    {
      title: t('risk.question.1.title'),
      desc: t('risk.question.1.desc'),
      options: [
        t('risk.question.1.option.1'),
        t('risk.question.1.option.2'),
        t('risk.question.1.option.3'),
        t('risk.question.1.option.4'),
      ],
    },
    {
      title: t('risk.question.2.title'),
      desc: t('risk.question.2.desc'),
      options: [
        t('risk.question.2.option.1'),
        t('risk.question.2.option.2'),
        t('risk.question.2.option.3'),
        t('risk.question.2.option.4'),
      ],
    },
    {
      title: t('risk.question.3.title'),
      desc: t('risk.question.3.desc'),
      options: [
        t('risk.question.3.option.1'),
        t('risk.question.3.option.2'),
        t('risk.question.3.option.3'),
        t('risk.question.3.option.4'),
      ],
    },
    {
      title: t('risk.question.4.title'),
      desc: t('risk.question.4.desc'),
      options: [
        t('risk.question.4.option.1'),
        t('risk.question.4.option.2'),
        t('risk.question.4.option.3'),
        t('risk.question.4.option.4'),
      ],
    },
  ];

  const calculateResult = (scores: number[]): Result => {
    const total = scores.reduce((a, b) => a + b, 0);

    if (total <= 5) {
      return {
        type: 'conservative',
        goldRatio: 20,
        description: langKey === 'zh'
          ? '您是一位保守型投资者，更加注重资本的安全性。建议配置较高比例的黄金作为避险资产，在市场波动时提供可靠的下行保护。'
          : 'You are a conservative investor prioritizing capital safety. A higher gold allocation is recommended to provide reliable downside protection during market volatility.',
      };
    } else if (total <= 8) {
      return {
        type: 'moderate',
        goldRatio: 15,
        description: langKey === 'zh'
          ? '您是一位稳健型投资者，在风险和收益之间寻求平衡。适度配置黄金可以在保持增长潜力的同时，降低整体组合的波动性。'
          : 'You are a moderate investor seeking balance between risk and return. A moderate gold allocation reduces portfolio volatility while maintaining growth potential.',
      };
    } else if (total <= 11) {
      return {
        type: 'balanced',
        goldRatio: 10,
        description: langKey === 'zh'
          ? '您是一位平衡型投资者，愿意承担适度风险以获取更好的收益。合理配置黄金可以在市场承压时提供缓冲，同时不牺牲太多上行空间。'
          : 'You are a balanced investor willing to take moderate risk for better returns. A reasonable gold allocation buffers during market stress without sacrificing too much upside.',
      };
    } else if (total <= 13) {
      return {
        type: 'aggressive',
        goldRatio: 5,
        description: langKey === 'zh'
          ? '您是一位进取型投资者，追求较高的收益并愿意承担相应风险。少量配置黄金主要用于极端市场环境下的尾部风险对冲。'
          : 'You are an aggressive investor seeking higher returns and willing to accept corresponding risk. A small gold allocation is mainly for tail risk hedging in extreme market environments.',
      };
    } else {
      return {
        type: 'veryAggressive',
        goldRatio: 3,
        description: langKey === 'zh'
          ? '您是一位激进型投资者，以最大化收益为首要目标，能够承受较大波动。极低比例的黄金配置仅作为极端风险的最后防线。'
          : 'You are a very aggressive investor prioritizing maximum returns and comfortable with large swings. A minimal gold allocation serves only as a last line of defense for extreme risks.',
      };
    }
  };

  const handleSelect = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = index;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setResult(calculateResult(answers));
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRetake = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        {!result ? (
          <div className="space-y-8">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <Badge variant="outline" className="mb-4 border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/5">
                <Shield className="size-3.5 mr-1.5" />
                {t('nav.risk')}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C96A] to-[#D4AF37] bg-clip-text text-transparent">
                  {t('risk.title')}
                </span>
              </h1>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                {t('risk.subtitle')}
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B]"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{langKey === 'zh' ? '开始' : 'Start'}</span>
              <span>{langKey === 'zh' ? '完成' : 'Complete'}</span>
            </div>

            {/* Question Card */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-[#0f1622]/80 border-[#D4AF37]/20 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="text-sm text-[#D4AF37] mb-2">
                    {t('nav.risk')} {currentStep + 1}/{questions.length}
                  </div>
                  <CardTitle className="text-2xl text-white mb-2">
                    {questions[currentStep].title}
                  </CardTitle>
                  <p className="text-gray-400">
                    {questions[currentStep].desc}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {questions[currentStep].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelect(index)}
                      className={`w-full p-4 rounded-xl text-left border-2 transition-all ${
                        answers[currentStep] === index
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                          : 'border-white/10 bg-transparent text-gray-300 hover:border-[#D4AF37]/40 hover:bg-white/5'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                onClick={handlePrev}
                disabled={currentStep === 0}
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 disabled:opacity-30"
              >
                <ArrowLeft className="size-4 mr-2" />
                {t('risk.prev')}
              </Button>
              <Button
                onClick={handleNext}
                disabled={answers[currentStep] === undefined}
                className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a2332] font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {currentStep < questions.length - 1 ? t('risk.next') : t('risk.submit')}
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          /* Result Section */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4 border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/5">
                <Shield className="size-3.5 mr-1.5" />
                {t('risk.result.title')}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C96A] to-[#D4AF37] bg-clip-text text-transparent">
                  {t('risk.result.title')}
                </span>
              </h1>
            </div>

            <Card className="bg-[#0f1622]/80 border-[#D4AF37]/20 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <Shield className="size-5 text-[#D4AF37]" />
                  {t('risk.result.profile')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Risk Type */}
                <div className="text-center">
                  <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a2332]">
                    {t(`risk.type.${result.type}`)}
                  </Badge>
                </div>

                {/* Gold Ratio */}
                <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#B8860B]/5 rounded-xl p-6 border border-[#D4AF37]/20">
                  <p className="text-gray-400 text-sm mb-2 text-center">
                    {t('risk.result.gold.ratio')}
                  </p>
                  <div className="flex justify-center items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#E8C96A] bg-clip-text text-transparent tabular-nums">
                      {result.goldRatio}
                    </span>
                    <span className="text-2xl text-[#D4AF37]/80">%</span>
                  </div>
                </div>

                {/* Description */}
                <div className="text-gray-300">
                  <p className="text-base leading-relaxed">
                    {result.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={handleRetake}
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5"
              >
                <RefreshCw className="size-4 mr-2" />
                {t('risk.retake')}
              </Button>
              <Button
                onClick={() => navigate('/calculator')}
                className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a2332] font-semibold hover:opacity-90"
              >
                <Calculator className="size-4 mr-2" />
                {t('risk.goToCalculator')}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
