import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';

export type Lang = 'zh-CN' | 'zh-TW' | 'en';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'gold_hedge_lang';

// 全量三语文案
const translations: Record<Lang, Record<string, string>> = {
  'zh-CN': {
    // 导航
    'nav.assistant': '智能问答',
    'nav.risk': '风险评估',
    'nav.calculator': '行业配置',
    'nav.backtest': '回测看板',
    'nav.research': '研究结论',
    'nav.reports': '研究报告',
    'nav.contact': '联系作者',
    'nav.lang': '语言',

    // 风险评估
    'risk.title': '投资者风险评估',
    'risk.subtitle': '填写问卷，获得个性化的风险偏好分析和对冲建议',
    'risk.question.1.title': '投资经验',
    'risk.question.1.desc': '您的投资经验有多久？',
    'risk.question.1.option.1': '1年以内',
    'risk.question.1.option.2': '1-3年',
    'risk.question.1.option.3': '3-5年',
    'risk.question.1.option.4': '5年以上',
    'risk.question.2.title': '风险承受能力',
    'risk.question.2.desc': '当您的投资亏损20%时，您会怎么做？',
    'risk.question.2.option.1': '立即全部止损',
    'risk.question.2.option.2': '部分止损，等待机会',
    'risk.question.2.option.3': '保持持有，等待反弹',
    'risk.question.2.option.4': '逆势加仓',
    'risk.question.3.title': '投资目标',
    'risk.question.3.desc': '您的主要投资目标是什么？',
    'risk.question.3.option.1': '保本为主，少量增值',
    'risk.question.3.option.2': '稳健增值，适度波动',
    'risk.question.3.option.3': '追求较高收益，接受波动',
    'risk.question.3.option.4': '最大化收益，愿承担高风险',
    'risk.question.4.title': '投资期限',
    'risk.question.4.desc': '您的投资期限是多久？',
    'risk.question.4.option.1': '1年以内',
    'risk.question.4.option.2': '1-3年',
    'risk.question.4.option.3': '3-5年',
    'risk.question.4.option.4': '5年以上',
    'risk.next': '下一题',
    'risk.prev': '上一题',
    'risk.submit': '查看结果',
    'risk.result.title': '您的风险评估结果',
    'risk.result.profile': '风险偏好类型',
    'risk.result.recommendation': '对冲配置建议',
    'risk.result.gold.ratio': '建议黄金配置比例',
    'risk.result.description': '详细说明',
    'risk.type.conservative': '保守型投资者',
    'risk.type.moderate': '稳健型投资者',
    'risk.type.balanced': '平衡型投资者',
    'risk.type.aggressive': '进取型投资者',
    'risk.type.veryAggressive': '激进型投资者',
    'risk.retake': '重新评估',
    'risk.goToCalculator': '使用计算器细化',

    // 首页 - 智能问答
    'home.hero.title': '黄金 · 股票跨资产自适应对冲策略',
    'home.hero.subtitle': '用智能问答，秒级获取您专属的黄金ETF配置方案',
    'home.placeholder': '例如：我重仓了科技股，应该配多少黄金对冲？',
    'home.submit': '生成建议',
    'home.examples.title': '试试这些问题',
    'home.examples.1': '我重仓了科技股，应该配多少黄金对冲？',
    'home.examples.2': '现在通胀高，能源股配多少黄金合适？',
    'home.examples.3': '保守型投资者，消费行业怎么配黄金ETF？',
    'home.result.title': '配置建议',
    'home.result.ratio': '建议黄金配置比例',
    'home.result.logic': '对冲逻辑说明',
    'home.result.risk': '风险提示',
    'home.result.loading': '正在为您分析...',
    'home.result.analyzing': '正在解析您的问题...',
    'home.result.generating': '正在生成配置建议...',
    'home.result.error': '解析失败，请尝试更明确的描述，或使用行业配置计算器手动调整。',
    'home.model.select': '选择AI模型',
    'home.ai.settings': 'AI设置',

    // 计算器
    'calc.title': '行业配置计算器',
    'calc.subtitle': '选择行业与市场参数，实时计算最优黄金对冲比例',
    'calc.industry': '选择行业',
    'calc.risk': '风险偏好',
    'calc.risk.conservative': '保守型',
    'calc.risk.moderate': '稳健型',
    'calc.risk.aggressive': '激进型',
    'calc.market': '市场状态调节',
    'calc.volatility': '市场波动',
    'calc.volatility.low': '低波动',
    'calc.volatility.normal': '正常',
    'calc.volatility.high': '高波动',
    'calc.inflation': '通胀水平',
    'calc.inflation.low': '低通胀',
    'calc.inflation.high': '高通胀',
    'calc.panic': '恐慌程度',
    'calc.panic.low': '低恐慌',
    'calc.panic.high': '高恐慌',
    'calc.result.title': '计算结果',
    'calc.result.ratio': '建议黄金ETF配置比例',
    'calc.result.effect': '预期对冲效果',
    'calc.result.protection': '下行保护强度',
    'calc.formula.title': '计算过程',
    'calc.formula.base': '基准比例',
    'calc.formula.industry': '行业系数',
    'calc.formula.market': '市场调整',
    'calc.formula.result': '最终比例',
    'calc.effect.strong': '强',
    'calc.effect.medium': '中',
    'calc.effect.weak': '弱',

    // 回测
    'backtest.title': '策略回测看板',
    'backtest.subtitle': '自适应策略 vs 静态对冲 vs 纯股票，历史表现一目了然',
    'backtest.kpi.annual': '年化收益',
    'backtest.kpi.drawdown': '最大回撤',
    'backtest.kpi.sharpe': '夏普比率',
    'backtest.kpi.protection': '下行保护率',
    'backtest.chart.curve': '累计收益对比',
    'backtest.chart.inflation': '通胀状态分布',
    'backtest.chart.vix': 'VIX状态分布',
    'backtest.strategy.adaptive': '自适应策略',
    'backtest.strategy.static': '静态对冲',
    'backtest.strategy.stock': '纯股票',
    'backtest.inflation.high': '高通胀',
    'backtest.inflation.low': '低通胀',
    'backtest.vix.high': '高VIX',
    'backtest.vix.low': '低VIX',

    // 研究结论
    'research.title': '核心研究发现',
    'research.subtitle': '基于十年跨资产数据的实证结论',
    'research.f1.title': '行业异质性',
    'research.f1.desc': '不同行业对黄金对冲的敏感度差异显著，能源、公用事业等周期防御型行业对冲效果最强，科技、地产等成长/利率敏感型行业相对较弱。',
    'research.f2.title': '状态依赖',
    'research.f2.desc': '黄金对冲效果高度依赖市场状态：高通胀、高恐慌、高波动环境下对冲效率显著提升，平稳市场中则表现为收益拖累。',
    'research.f3.title': '非对称对冲',
    'research.f3.desc': '黄金在股市下跌时的保护作用远强于上涨时的拖累效应，呈现典型的"危机Alpha"非对称特征，下行保护率显著高于上行损耗率。',
    'research.f4.title': '避险边界',
    'research.f4.desc': '黄金对冲并非万能：在美元流动性危机、实际利率快速上行等特殊场景下，黄金与股票可能同步下跌，需警惕避险资产的阶段性失效风险。',

    // 联系作者
    'contact.title': '联系作者',
    'contact.subtitle': '如有任何问题或合作意向，请联系我们',
    'contact.email': '邮箱',
    'contact.email.placeholder': '请输入您的邮箱',
    'contact.message': '消息',
    'contact.message.placeholder': '请输入您的消息',
    'contact.submit': '发送',
    'contact.success': '消息发送成功！',
    'contact.or.write': '或直接发送邮件至',
    'contact.info': '关于本项目',
    'contact.info.desc': '本项目旨在帮助投资者科学地进行黄金与股票的跨资产对冲配置，基于学术研究成果开发。',

    // 通用
    'common.percent': '%',
    'common.vs': '对比',
    'common.basisPoint': 'bp',
  },
  'zh-TW': {
    // 导航
    'nav.assistant': '智能問答',
    'nav.risk': '風險評估',
    'nav.calculator': '行業配置',
    'nav.backtest': '回測看板',
    'nav.research': '研究結論',
    'nav.reports': '研究報告',
    'nav.contact': '聯繫作者',
    'nav.lang': '語言',

    // 风险评估
    'risk.title': '投資者風險評估',
    'risk.subtitle': '填寫問卷，獲得個性化的風險偏好分析和對沖建議',
    'risk.question.1.title': '投資經驗',
    'risk.question.1.desc': '您的投資經驗有多久？',
    'risk.question.1.option.1': '1年以內',
    'risk.question.1.option.2': '1-3年',
    'risk.question.1.option.3': '3-5年',
    'risk.question.1.option.4': '5年以上',
    'risk.question.2.title': '風險承受能力',
    'risk.question.2.desc': '當您的投資虧損20%時，您會怎麼做？',
    'risk.question.2.option.1': '立即全部止損',
    'risk.question.2.option.2': '部分止損，等待機會',
    'risk.question.2.option.3': '保持持有，等待反彈',
    'risk.question.2.option.4': '逆勢加倉',
    'risk.question.3.title': '投資目標',
    'risk.question.3.desc': '您的主要投資目標是什麼？',
    'risk.question.3.option.1': '保本為主，少量增值',
    'risk.question.3.option.2': '穩健增值，適度波動',
    'risk.question.3.option.3': '追求較高收益，接受波動',
    'risk.question.3.option.4': '最大化收益，願承擔高風險',
    'risk.question.4.title': '投資期限',
    'risk.question.4.desc': '您的投資期限是多久？',
    'risk.question.4.option.1': '1年以內',
    'risk.question.4.option.2': '1-3年',
    'risk.question.4.option.3': '3-5年',
    'risk.question.4.option.4': '5年以上',
    'risk.next': '下一題',
    'risk.prev': '上一題',
    'risk.submit': '查看結果',
    'risk.result.title': '您的風險評估結果',
    'risk.result.profile': '風險偏好類型',
    'risk.result.recommendation': '對沖配置建議',
    'risk.result.gold.ratio': '建議黃金配置比例',
    'risk.result.description': '詳細說明',
    'risk.type.conservative': '保守型投資者',
    'risk.type.moderate': '穩健型投資者',
    'risk.type.balanced': '平衡型投資者',
    'risk.type.aggressive': '進取型投資者',
    'risk.type.veryAggressive': '激進型投資者',
    'risk.retake': '重新評估',
    'risk.goToCalculator': '使用計算器細化',

    // 首頁 - 智能問答
    'home.hero.title': '黃金 · 股票跨資產自適應對沖策略',
    'home.hero.subtitle': '用智能問答，秒級獲取您專屬的黃金ETF配置方案',
    'home.placeholder': '例如：我重倉了科技股，應該配多少黃金對沖？',
    'home.submit': '生成建議',
    'home.examples.title': '試試這些問題',
    'home.examples.1': '我重倉了科技股，應該配多少黃金對沖？',
    'home.examples.2': '現在通脹高，能源股配多少黃金合適？',
    'home.examples.3': '保守型投資者，消費行業怎麼配黃金ETF？',
    'home.result.title': '配置建議',
    'home.result.ratio': '建議黃金配置比例',
    'home.result.logic': '對沖邏輯說明',
    'home.result.risk': '風險提示',
    'home.result.loading': '正在為您分析...',
    'home.result.analyzing': '正在解析您的問題...',
    'home.result.generating': '正在生成配置建議...',
    'home.result.error': '解析失敗，請嘗試更明確的描述，或使用行業配置計算器手動調整。',
    'home.model.select': '選擇AI模型',
    'home.ai.settings': 'AI設置',

    // 計算器
    'calc.title': '行業配置計算器',
    'calc.subtitle': '選擇行業與市場參數，實時計算最優黃金對沖比例',
    'calc.industry': '選擇行業',
    'calc.risk': '風險偏好',
    'calc.risk.conservative': '保守型',
    'calc.risk.moderate': '穩健型',
    'calc.risk.aggressive': '激進型',
    'calc.market': '市場狀態調節',
    'calc.volatility': '市場波動',
    'calc.volatility.low': '低波動',
    'calc.volatility.normal': '正常',
    'calc.volatility.high': '高波動',
    'calc.inflation': '通脹水平',
    'calc.inflation.low': '低通脹',
    'calc.inflation.high': '高通脹',
    'calc.panic': '恐慌程度',
    'calc.panic.low': '低恐慌',
    'calc.panic.high': '高恐慌',
    'calc.result.title': '計算結果',
    'calc.result.ratio': '建議黃金ETF配置比例',
    'calc.result.effect': '預期對沖效果',
    'calc.result.protection': '下行保護強度',
    'calc.formula.title': '計算過程',
    'calc.formula.base': '基準比例',
    'calc.formula.industry': '行業係數',
    'calc.formula.market': '市場調整',
    'calc.formula.result': '最終比例',
    'calc.effect.strong': '強',
    'calc.effect.medium': '中',
    'calc.effect.weak': '弱',

    // 回測
    'backtest.title': '策略回測看板',
    'backtest.subtitle': '自適應策略 vs 靜態對沖 vs 純股票，歷史表現一目了然',
    'backtest.kpi.annual': '年化收益',
    'backtest.kpi.drawdown': '最大回撤',
    'backtest.kpi.sharpe': '夏普比率',
    'backtest.kpi.protection': '下行保護率',
    'backtest.chart.curve': '累計收益對比',
    'backtest.chart.inflation': '通脹狀態分佈',
    'backtest.chart.vix': 'VIX狀態分佈',
    'backtest.strategy.adaptive': '自適應策略',
    'backtest.strategy.static': '靜態對沖',
    'backtest.strategy.stock': '純股票',
    'backtest.inflation.high': '高通脹',
    'backtest.inflation.low': '低通脹',
    'backtest.vix.high': '高VIX',
    'backtest.vix.low': '低VIX',

    // 研究結論
    'research.title': '核心研究發現',
    'research.subtitle': '基於十年跨資產數據的實證結論',
    'research.f1.title': '行業異質性',
    'research.f1.desc': '不同行業對黃金對沖的敏感度差異顯著，能源、公用事業等週期防禦型行業對沖效果最強，科技、地產等成長/利率敏感型行業相對較弱。',
    'research.f2.title': '狀態依賴',
    'research.f2.desc': '黃金對沖效果高度依賴市場狀態：高通脹、高恐慌、高波動環境下對沖效率顯著提升，平穩市場中則表現為收益拖累。',
    'research.f3.title': '非對稱對沖',
    'research.f3.desc': '黃金在股市下跌時的保護作用遠強於上漲時的拖累效應，呈現典型的"危機Alpha"非對稱特徵，下行保護率顯著高於上行損耗率。',
    'research.f4.title': '避險邊界',
    'research.f4.desc': '黃金對沖並非萬能：在美元流動性危機、實際利率快速上行等特殊場景下，黃金與股票可能同步下跌，需警惕避險資產的階段性失效風險。',

    // 聯繫作者
    'contact.title': '聯繫作者',
    'contact.subtitle': '如有任何問題或合作意向，請聯繫我們',
    'contact.email': '郵箱',
    'contact.email.placeholder': '請輸入您的郵箱',
    'contact.message': '消息',
    'contact.message.placeholder': '請輸入您的消息',
    'contact.submit': '發送',
    'contact.success': '消息發送成功！',
    'contact.or.write': '或直接發送郵件至',
    'contact.info': '關於本項目',
    'contact.info.desc': '本項目旨在幫助投資者科學地進行黃金與股票的跨資產對沖配置，基於學術研究成果開發。',

    // 通用
    'common.percent': '%',
    'common.vs': '對比',
    'common.basisPoint': 'bp',
  },
  en: {
    // Nav
    'nav.assistant': 'AI Assistant',
    'nav.risk': 'Risk Assessment',
    'nav.calculator': 'Calculator',
    'nav.backtest': 'Backtest',
    'nav.research': 'Research',
    'nav.reports': 'Research Reports',
    'nav.contact': 'Contact',
    'nav.lang': 'Language',

    // Risk Assessment
    'risk.title': 'Investor Risk Assessment',
    'risk.subtitle': 'Fill out the questionnaire for personalized risk profile analysis and hedging recommendations',
    'risk.question.1.title': 'Investment Experience',
    'risk.question.1.desc': 'How long have you been investing?',
    'risk.question.1.option.1': 'Less than 1 year',
    'risk.question.1.option.2': '1-3 years',
    'risk.question.1.option.3': '3-5 years',
    'risk.question.1.option.4': 'More than 5 years',
    'risk.question.2.title': 'Risk Tolerance',
    'risk.question.2.desc': 'What would you do if your investment lost 20%?',
    'risk.question.2.option.1': 'Sell all immediately',
    'risk.question.2.option.2': 'Sell partially and wait',
    'risk.question.2.option.3': 'Hold and wait for recovery',
    'risk.question.2.option.4': 'Buy more on the dip',
    'risk.question.3.title': 'Investment Goal',
    'risk.question.3.desc': 'What is your main investment goal?',
    'risk.question.3.option.1': 'Capital preservation, minimal growth',
    'risk.question.3.option.2': 'Stable growth, moderate volatility',
    'risk.question.3.option.3': 'Higher returns, accept volatility',
    'risk.question.3.option.4': 'Maximize returns, accept high risk',
    'risk.question.4.title': 'Investment Horizon',
    'risk.question.4.desc': 'How long is your investment horizon?',
    'risk.question.4.option.1': 'Less than 1 year',
    'risk.question.4.option.2': '1-3 years',
    'risk.question.4.option.3': '3-5 years',
    'risk.question.4.option.4': 'More than 5 years',
    'risk.next': 'Next',
    'risk.prev': 'Previous',
    'risk.submit': 'View Results',
    'risk.result.title': 'Your Risk Assessment Results',
    'risk.result.profile': 'Risk Profile',
    'risk.result.recommendation': 'Hedging Recommendation',
    'risk.result.gold.ratio': 'Suggested Gold Allocation',
    'risk.result.description': 'Detailed Description',
    'risk.type.conservative': 'Conservative Investor',
    'risk.type.moderate': 'Moderate Investor',
    'risk.type.balanced': 'Balanced Investor',
    'risk.type.aggressive': 'Growth Investor',
    'risk.type.veryAggressive': 'Aggressive Investor',
    'risk.retake': 'Retake Assessment',
    'risk.goToCalculator': 'Use Calculator to Refine',

    // Home
    'home.hero.title': 'Gold · Stock Cross-Asset Adaptive Hedging',
    'home.hero.subtitle': 'Get your personalized gold ETF allocation in seconds with AI',
    'home.placeholder': 'e.g. I hold heavy tech stocks, how much gold should I allocate?',
    'home.submit': 'Generate Advice',
    'home.examples.title': 'Try these questions',
    'home.examples.1': 'I hold heavy tech stocks, how much gold should I allocate for hedging?',
    'home.examples.2': 'Inflation is high now, how much gold for energy stocks?',
    'home.examples.3': 'Conservative investor, how to allocate gold ETF for consumer sector?',
    'home.result.title': 'Allocation Advice',
    'home.result.ratio': 'Suggested Gold Allocation',
    'home.result.logic': 'Hedging Rationale',
    'home.result.risk': 'Risk Warnings',
    'home.result.loading': 'Analyzing your question...',
    'home.result.analyzing': 'Parsing your query...',
    'home.result.generating': 'Generating allocation advice...',
    'home.result.error': 'Failed to parse. Please try a more specific description, or use the calculator to adjust manually.',
    'home.model.select': 'Select AI Model',
    'home.ai.settings': 'AI Settings',

    // Calculator
    'calc.title': 'Industry Allocation Calculator',
    'calc.subtitle': 'Select industry and market parameters to calculate optimal gold hedge ratio in real time',
    'calc.industry': 'Select Industry',
    'calc.risk': 'Risk Preference',
    'calc.risk.conservative': 'Conservative',
    'calc.risk.moderate': 'Moderate',
    'calc.risk.aggressive': 'Aggressive',
    'calc.market': 'Market Condition Adjustment',
    'calc.volatility': 'Market Volatility',
    'calc.volatility.low': 'Low',
    'calc.volatility.normal': 'Normal',
    'calc.volatility.high': 'High',
    'calc.inflation': 'Inflation Level',
    'calc.inflation.low': 'Low Inflation',
    'calc.inflation.high': 'High Inflation',
    'calc.panic': 'Panic Level',
    'calc.panic.low': 'Low Panic',
    'calc.panic.high': 'High Panic',
    'calc.result.title': 'Calculation Result',
    'calc.result.ratio': 'Suggested Gold ETF Allocation',
    'calc.result.effect': 'Expected Hedge Effect',
    'calc.result.protection': 'Downside Protection',
    'calc.formula.title': 'Calculation Breakdown',
    'calc.formula.base': 'Base Ratio',
    'calc.formula.industry': 'Industry Factor',
    'calc.formula.market': 'Market Adjustment',
    'calc.formula.result': 'Final Ratio',
    'calc.effect.strong': 'Strong',
    'calc.effect.medium': 'Medium',
    'calc.effect.weak': 'Weak',

    // Backtest
    'backtest.title': 'Strategy Backtest Dashboard',
    'backtest.subtitle': 'Adaptive vs Static Hedge vs Pure Stocks — historical performance at a glance',
    'backtest.kpi.annual': 'Annual Return',
    'backtest.kpi.drawdown': 'Max Drawdown',
    'backtest.kpi.sharpe': 'Sharpe Ratio',
    'backtest.kpi.protection': 'Downside Protection',
    'backtest.chart.curve': 'Cumulative Return Comparison',
    'backtest.chart.inflation': 'Inflation Regime Distribution',
    'backtest.chart.vix': 'VIX Regime Distribution',
    'backtest.strategy.adaptive': 'Adaptive Strategy',
    'backtest.strategy.static': 'Static Hedge',
    'backtest.strategy.stock': 'Pure Stocks',
    'backtest.inflation.high': 'High Inflation',
    'backtest.inflation.low': 'Low Inflation',
    'backtest.vix.high': 'High VIX',
    'backtest.vix.low': 'Low VIX',

    // Research
    'research.title': 'Key Research Findings',
    'research.subtitle': 'Empirical conclusions based on ten years of cross-asset data',
    'research.f1.title': 'Industry Heterogeneity',
    'research.f1.desc': 'Sensitivity to gold hedging varies significantly across industries. Cyclical/defensive sectors like energy and utilities show the strongest hedge effect, while growth/rate-sensitive sectors like tech and real estate are relatively weaker.',
    'research.f2.title': 'State Dependence',
    'research.f2.desc': 'Gold hedging effectiveness is highly state-dependent: hedge efficiency improves significantly in high-inflation, high-panic, and high-volatility environments, but acts as a return drag in calm markets.',
    'research.f3.title': 'Asymmetric Hedging',
    'research.f3.desc': "Gold's protection during stock market declines far outweighs its drag during rallies — a classic 'crisis alpha' asymmetric pattern, with downside protection significantly exceeding upside loss.",
    'research.f4.title': 'Safe-Haven Boundary',
    'research.f4.desc': "Gold hedging is not omnipotent: in special scenarios like dollar liquidity crises or rapid real-rate spikes, gold and stocks may fall together. Watch for periodic failure of safe-haven assets.",

    // Contact
    'contact.title': 'Contact Author',
    'contact.subtitle': 'Have any questions or collaboration ideas? Get in touch with us',
    'contact.email': 'Email',
    'contact.email.placeholder': 'Enter your email',
    'contact.message': 'Message',
    'contact.message.placeholder': 'Enter your message',
    'contact.submit': 'Send',
    'contact.success': 'Message sent successfully!',
    'contact.or.write': 'Or email us directly at',
    'contact.info': 'About This Project',
    'contact.info.desc': 'This project helps investors scientifically allocate gold and stock cross-asset hedging, developed based on academic research.',

    // Common
    'common.percent': '%',
    'common.vs': 'vs',
    'common.basisPoint': 'bp',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('zh-CN');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && (saved === 'zh-CN' || saved === 'zh-TW' || saved === 'en')) {
      setLangState(saved);
    }
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  }, []);

  const toggleLang = useCallback(() => {
    // 循环切换：zh-CN -> zh-TW -> en -> zh-CN
    if (lang === 'zh-CN') setLangState('zh-TW');
    else if (lang === 'zh-TW') setLangState('en');
    else setLangState('zh-CN');
  }, [lang, setLangState]);

  const t = useCallback(
    (key: string) => translations[lang][key] ?? key,
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t }),
    [lang, setLang, toggleLang, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
