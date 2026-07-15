import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, ExternalLink, Sparkles, Clock, BarChart3, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLangKey } from "@/lib/lang-utils";

// 研报数据
interface ResearchReport {
  id: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  category: "gold" | "equity" | "macro" | "strategy";
  date: string;
  source: string;
  sourceUrl: string;
  tags: string[];
  featured?: boolean;
}

const researchReports: ResearchReport[] = [
  {
    id: "1",
    title: {
      zh: "黄金-通胀关系的经济驱动因素研究",
      en: "On the economic determinants of the gold–inflation relation"
    },
    description: {
      zh: "实证分析黄金对冲通胀效应的核心宏观变量，揭示黄金抗通胀能力的底层经济逻辑",
      en: "Empirical analysis of core macro variables driving gold inflation hedging, revealing fundamental economic logic of gold’s inflation resistance"
    },
    category: "gold",
    date: "2014-03",
    source: "Resources Policy",
    sourceUrl: "https://doi.org/10.1016/j.resourpol.2014.03.002",
    tags: ["通胀对冲", "黄金定价", "宏观因子"],
    featured: true
  },
  {
    id: "2",
    title: {
      zh: "黄金的非对称波动率特征研究",
      en: "The asymmetric volatility of gold"
    },
    description: {
      zh: "基于银行金融期刊框架，验证黄金价格涨跌阶段波动率存在显著非对称效应",
      en: "Based on banking finance framework, verify significant asymmetric volatility during gold price rise and fall cycles"
    },
    category: "strategy",
    date: "2018-01",
    source: "Journal of Banking & Finance",
    sourceUrl: "https://doi.org/10.1016/j.jbankfin.2017.08.004",
    tags: ["波动率", "非对称波动", "量化建模"]
  },
  {
    id: "3",
    title: {
      zh: "时变系数框架下黄金的通胀对冲属性",
      en: "Gold as an inflation hedge in a time-varying coefficient framework"
    },
    description: {
      zh: "采用时变参数模型，证明黄金对冲通胀效果随宏观周期动态变化，不存在恒定对冲能力",
      en: "Time-varying coefficient model proves gold inflation hedging power fluctuates across macro cycles with no constant hedging effect"
    },
    category: "macro",
    date: "2013-12",
    source: "The North American Journal of Economics and Finance",
    sourceUrl: "https://doi.org/10.1016/j.najef.2012.10.007",
    tags: ["时变模型", "通胀", "周期分析"]
  },
  {
    id: "4",
    title: {
      zh: "小波分析视角：比特币、黄金与大宗商品的股市避险属性对比",
      en: "Bitcoin, gold, and commodities as safe havens for stocks: New insight through wavelet analysis"
    },
    description: {
      zh: "多尺度小波分解对比黄金、加密货币、商品在股市危机中的避险能力差异",
      en: "Multi-scale wavelet decomposition compares safe-haven performance of gold, crypto and commodities during stock market crises"
    },
    category: "equity",
    date: "2020-03",
    source: "Quarterly Review of Economics and Finance",
    sourceUrl: "https://doi.org/10.1016/j.qref.2020.03.004",
    tags: ["小波分析", "避险资产", "比特币", "股市联动"]
  },
  {
    id: "5",
    title: {
      zh: "长期维度下黄金是否具备避险价值？跨周期、跨投资期限的对冲效果检验",
      en: "Does gold glitter in the long-run? Gold as a hedge and safe haven across time and investment horizon"
    },
    description: {
      zh: "区分短期/中长期投资周期，量化黄金对冲风险与危机避险的长期有效性边界",
      en: "Distinguish short/long investment horizons, quantify effective boundary of gold’s hedging and safe-haven function over long term"
    },
    category: "gold",
    date: "2015-02",
    source: "International Review of Financial Analysis",
    sourceUrl: "https://doi.org/10.1016/j.irfa.2015.01.010",
    tags: ["长期配置", "避险资产", "投资期限"]
  },
  {
    id: "6",
    title: {
      zh: "美元贬值环境下黄金能否对冲风险、保值增值？",
      en: "Can gold hedge and preserve value when the US dollar depreciates?"
    },
    description: {
      zh: "计量建模验证美元走弱周期中黄金的保值对冲功能，分析汇率与金价联动机制",
      en: "Econometric modeling verifies gold’s value-preserving hedging function amid USD depreciation and analyzes exchange rate-gold linkage"
    },
    category: "macro",
    date: "2014-02",
    source: "Economic Modelling",
    sourceUrl: "https://doi.org/10.1016/j.econmod.2014.01.007",
    tags: ["美元汇率", "保值", "汇率联动"]
  }
];

const categories = [
  { value: "all", label: { zh: "全部", en: "All" } },
  { value: "gold", label: { zh: "黄金专题", en: "Gold Focus" } },
  { value: "equity", label: { zh: "股市相关", en: "Equities" } },
  { value: "macro", label: { zh: "宏观经济", en: "Macro" } },
  { value: "strategy", label: { zh: "投资策略", en: "Strategy" } }
];

export default function ResearchReportsPage() {
  const { lang } = useLanguage();
  const langKey = getLangKey(lang);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredReports = researchReports.filter((report) => {
    const matchesCategory = category === "all" || report.category === category;
    const matchesSearch =
      report.title[langKey].toLowerCase().includes(search.toLowerCase()) ||
      report.description[langKey].toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "gold": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "equity": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "macro": return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "strategy": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "gold": return langKey === "zh" ? "黄金" : "Gold";
      case "equity": return langKey === "zh" ? "股市" : "Equity";
      case "macro": return langKey === "zh" ? "宏观" : "Macro";
      case "strategy": return langKey === "zh" ? "策略" : "Strategy";
      default: return cat;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/5">
            <Sparkles className="size-3.5 mr-1.5" />
            {langKey === "zh" ? "学术文献" : "Academic Papers"}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C96A] to-[#D4AF37] bg-clip-text text-transparent">
              {langKey === "zh" ? "黄金金融学术文献库" : "Gold Finance Academic Library"}
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            {langKey === "zh"
              ? "收录国际顶刊黄金定价、避险、通胀对冲相关实证论文，提供DOI直达原文"
              : "Peer-reviewed top journal papers on gold pricing, safe haven & inflation hedge, direct DOI access"
            }
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 size-4" />
            <Input
              type="text"
              placeholder={langKey === "zh" ? "搜索论文标题、关键词..." : "Search paper title / keywords..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#0f1622] border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48 bg-[#0f1622] border-white/10 text-white">
              <SelectValue placeholder={langKey === "zh" ? "分类" : "Category"} />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2332] border-[#D4AF37]/20 text-white">
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="focus:bg-[#D4AF37]/10 focus:text-[#D4AF37]">
                  {cat.label[langKey]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Reports Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            >
              <Card className={`bg-[#0f1622]/80 border-[#D4AF37]/20 backdrop-blur-sm hover:border-[#D4AF37]/50 transition-all h-full flex flex-col ${report.featured ? 'border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/30' : ''}`}>
                {report.featured && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0f1622] border-none">
                      <Sparkles className="size-3 mr-1" />
                      {langKey === "zh" ? "精选顶刊" : "Featured Top Journal"}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline" className={`${getCategoryColor(report.category)}`}>
                        {getCategoryLabel(report.category)}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg text-white mt-2 leading-tight">
                    {report.title[langKey]}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    {report.description[langKey]}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-3">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {report.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FileText className="size-3" />
                    <span>{report.source}</span>
                    <span className="mx-1">•</span>
                    <Clock className="size-3" />
                    <span>{report.date}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a2332] font-semibold hover:opacity-90"
                  >
                    <a href={report.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-4 mr-2" />
                      {langKey === "zh" ? "通过DOI查看原文" : "Open via DOI"}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText className="size-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {langKey === "zh" ? "未匹配到相关学术论文" : "No matching academic papers found"}
            </h3>
            <p className="text-gray-400">
              {langKey === "zh" ? "尝试调整搜索关键词或筛选分类" : "Try adjusting search keywords or category filter"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
