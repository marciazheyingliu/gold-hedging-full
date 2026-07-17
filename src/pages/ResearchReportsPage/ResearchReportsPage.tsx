import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, ExternalLink, Sparkles, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLangKey } from "@/lib/lang-utils";

interface ResearchReport {
  id: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  category: "gold" | "equity" | "macro" | "strategy";
  date: string;
  source: string;
  sourceUrl: string;
  tags: { zhCn: string; zhTw: string; en: string }[];
  featured?: boolean;
  isLatest?: boolean;
}

const researchReports: ResearchReport[] = [
  // 1. 最新 NBER Working Paper 2026-07
  {
    id: "1",
    title: {
      zh: "地緣分裂時期：美國貨幣溢出、外匯市場與黃金儲備研究",
      en: "US Monetary Spillovers, Foreign Exchange, and Gold Reserves at Times of Geopolitical Fragmentation"
    },
    description: {
      zh: "剖析地緣格局分裂環境下美國貨幣政策外溢效應，匯率波動與各國央行黃金儲備調配的關聯機制，NBER權威工作論文",
      en: "Analyze US monetary spillover effects amid geopolitical fragmentation, linkage between FX volatility and central bank gold reserve allocation, authoritative NBER working paper"
    },
    category: "macro",
    date: "2026-07-20",
    source: "NBER Working Paper No.35337",
    sourceUrl: "https://doi.org/10.3386/w35337",
    tags: [
      { zhCn: "地缘分裂", zhTw: "地緣分裂", en: "Geopolitical Fragmentation" },
      { zhCn: "貨幣溢出", zhTw: "貨幣溢出", en: "Monetary Spillovers" },
      { zhCn: "央行黃金儲備", zhTw: "央行黃金儲備", en: "Central Bank Gold Reserves" },
      { zhCn: "匯率波動", zhTw: "匯率波動", en: "FX Volatility" }
    ],
    featured: true,
    isLatest: true
  },
  // 2. In Gold We Trust 2026
  {
    id: "2",
    title: {
      zh: "In Gold We Trust 2026：重返貨幣未來（20週年紀念版）",
      en: "In Gold We Trust 2026: Back to the Monetary Future (20th Anniversary Edition)"
    },
    description: {
      zh: "奧地利學派視角全球宏觀與黃金年度重磅報告，450+頁深度分析，覆蓋貨幣貶值、制裁、儲備多元化、礦業產業鏈，全球60+國家引用",
      en: "Austrian School perspective annual flagship gold report with 450+ pages, covers currency debasement, sanctions, reserve diversification & mining industry, cited across 60+ countries"
    },
    category: "gold",
    date: "2026-05-20",
    source: "Incrementum AG",
    sourceUrl: "https://ingoldwetrust.report/in-gold-we-trust-report/?lang=en",
    tags: [
      { zhCn: "奧地利學派", zhTw: "奧地利學派", en: "Austrian Economics" },
      { zhCn: "貨幣體系", zhTw: "貨幣體系", en: "Monetary System" },
      { zhCn: "黃金儲備多元化", zhTw: "黃金儲備多元化", en: "Gold Reserve Diversification" },
      { zhCn: "年度權威報告", zhTw: "年度權威報告", en: "Annual Flagship Report" }
    ]
  },
  // 3. 2020 小波分析 股市/黃金/比特幣
  {
    id: "3",
    title: {
      zh: "小波分析視角：比特幣、黃金與大宗商品的股市避險屬性對比",
      en: "Bitcoin, gold, and commodities as safe havens for stocks: New insight through wavelet analysis"
    },
    description: {
      zh: "多尺度小波分解對比黃金、加密貨幣、商品在股市危機中的避險能力差異",
      en: "Multi-scale wavelet decomposition compares safe-haven performance of gold, crypto and commodities during stock market crises"
    },
    category: "equity",
    date: "2020-03",
    source: "Quarterly Review of Economics and Finance",
    sourceUrl: "https://doi.org/10.1016/j.qref.2020.03.004",
    tags: [
      { zhCn: "小波分析", zhTw: "小波分析", en: "Wavelet Analysis" },
      { zhCn: "避險資產", zhTw: "避險資產", en: "Safe Haven Asset" },
      { zhCn: "比特幣", zhTw: "比特幣", en: "Bitcoin" },
      { zhCn: "股市聯動", zhTw: "股市聯動", en: "Stock Market Linkage" }
    ]
  },
  // 4. 2018 黃金非對稱波動
  {
    id: "4",
    title: {
      zh: "黃金的非對稱波動率特徵研究",
      en: "The asymmetric volatility of gold"
    },
    description: {
      zh: "基於銀行金融期刊框架，驗證黃金價格漲跌階段波動率存在顯著非對稱效應",
      en: "Based on banking finance framework, verify significant asymmetric volatility during gold price rise and fall cycles"
    },
    category: "strategy",
    date: "2018-01",
    source: "Journal of Banking & Finance",
    sourceUrl: "https://doi.org/10.1016/j.jbankfin.2017.08.004",
    tags: [
      { zhCn: "波動率", zhTw: "波動率", en: "Volatility" },
      { zhCn: "非對稱波動", zhTw: "非對稱波動", en: "Asymmetric Volatility" },
      { zhCn: "量化建模", zhTw: "量化建模", en: "Quantitative Modeling" }
    ]
  },
  // 5. 2015 長期黃金避險
  {
    id: "5",
    title: {
      zh: "長期維度下黃金是否具備避險價值？跨週期、跨投資期限的對衝效果檢驗",
      en: "Does gold glitter in the long-run? Gold as a hedge and safe haven across time and investment horizon"
    },
    description: {
      zh: "區分短期/中長期投資週期，量化黃金對衝風險與危機避險的長期有效性邊界",
      en: "Distinguish short/long investment horizons, quantify effective boundary of gold’s hedging and safe-haven function over long term"
    },
    category: "gold",
    date: "2015-02",
    source: "International Review of Financial Analysis",
    sourceUrl: "https://doi.org/10.1016/j.irfa.2015.01.010",
    tags: [
      { zhCn: "長期配置", zhTw: "長期配置", en: "Long-Term Allocation" },
      { zhCn: "避險資產", zhTw: "避險資產", en: "Safe Haven Asset" },
      { zhCn: "投資期限", zhTw: "投資期限", en: "Investment Horizon" }
    ]
  },
  // 6. 2014 黃金通脹驅動因子
  {
    id: "6",
    title: {
      zh: "黃金-通脹關係的經濟驅動因素研究",
      en: "On the economic determinants of the gold–inflation relation"
    },
    description: {
      zh: "實證分析黃金對衝通脹效應的核心宏觀變數，揭示黃金抗通脹能力的底層經濟邏輯",
      en: "Empirical analysis of core macro variables driving gold inflation hedging, revealing fundamental economic logic of gold’s inflation resistance"
    },
    category: "gold",
    date: "2014-03",
    source: "Resources Policy",
    sourceUrl: "https://doi.org/10.1016/j.resourpol.2014.03.002",
    tags: [
      { zhCn: "通脹對衝", zhTw: "通脹對衝", en: "Inflation Hedge" },
      { zhCn: "黃金定價", zhTw: "黃金定價", en: "Gold Pricing" },
      { zhCn: "宏觀因子", zhTw: "宏觀因子", en: "Macro Factors" }
    ]
  },
  // 7. 2014 美元匯率與黃金保值
  {
    id: "7",
    title: {
      zh: "美元貶值環境下黃金能否對衝風險、保值增值？",
      en: "Can gold hedge and preserve value when the US dollar depreciates?"
    },
    description: {
      zh: "計量建模驗證美元走弱週期中黃金的保值對衝功能，分析匯率與金價聯動機制",
      en: "Econometric modeling verifies gold’s value-preserving hedging function amid USD depreciation and analyzes exchange rate-gold linkage"
    },
    category: "macro",
    date: "2014-02",
    source: "Economic Modelling",
    sourceUrl: "https://doi.org/10.1016/j.econmod.2014.01.007",
    tags: [
      { zhCn: "美元匯率", zhTw: "美元匯率", en: "USD Exchange Rate" },
      { zhCn: "保值", zhTw: "保值", en: "Value Preservation" },
      { zhCn: "匯率聯動", zhTw: "匯率聯動", en: "Exchange Rate Linkage" }
    ]
  },
  // 8. 2013 時變模型黃金通脹對衝
  {
    id: "8",
    title: {
      zh: "時變係數框架下黃金的通脹對衝屬性",
      en: "Gold as an inflation hedge in a time-varying coefficient framework"
    },
    description: {
      zh: "採用時變參數模型，證明黃金對衝通脹效果隨宏觀週期動態變化，不存在恆定對衝能力",
      en: "Time-varying coefficient model proves gold inflation hedging power fluctuates across macro cycles with no constant hedging effect"
    },
    category: "macro",
    date: "2013-12",
    source: "The North American Journal of Economics and Finance",
    sourceUrl: "https://doi.org/10.1016/j.najef.2012.10.007",
    tags: [
      { zhCn: "時變模型", zhTw: "時變模型", en: "Time-Varying Model" },
      { zhCn: "通脹", zhTw: "通脹", en: "Inflation" },
      { zhCn: "週期分析", zhTw: "週期分析", en: "Cycle Analysis" }
    ]
  }
];

const categories = [
  { value: "all", label: { zh: "全部", en: "All" } },
  { value: "gold", label: { zh: "黃金專題", en: "Gold Focus" } },
  { value: "equity", label: { zh: "股市相關", en: "Equities" } },
  { value: "macro", label: { zh: "宏觀經濟", en: "Macro" } },
  { value: "strategy", label: { zh: "投資策略", en: "Strategy" } }
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
      case "gold": return langKey === "zh" ? "黃金" : "Gold";
      case "equity": return langKey === "zh" ? "股市" : "Equity";
      case "macro": return langKey === "zh" ? "宏觀" : "Macro";
      case "strategy": return langKey === "zh" ? "策略" : "Strategy";
      default: return cat;
    }
  };

  const getTagText = (tagItem: { zhCn: string; zhTw: string; en: string }) => {
    return langKey === "zh" ? tagItem.zhTw : tagItem.en;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/5">
            <Sparkles className="size-3.5 mr-1.5" />
            {langKey === "zh" ? "學術文獻 & 權威年度報告" : "Academic Papers & Flagship Reports"}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C96A] to-[#D4AF37] bg-clip-text text-transparent">
              {langKey === "zh" ? "黃金金融研究文獻庫" : "Gold Finance Research Library"}
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            {langKey === "zh"
              ? "收錄國際頂刊論文、權威機構年度黃金報告，涵蓋宏觀、量化、避險、央行儲備主題，提供DOI/官網直達原文"
              : "Peer-reviewed journal papers & institutional flagship gold reports, covering macro, quant, safe haven & central bank reserves, direct DOI/website access"
            }
          </p>
        </motion.div>

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
              placeholder={langKey === "zh" ? "搜尋報告標題、關鍵字..." : "Search report title / keywords..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#0f1622] border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48 bg-[#0f1622] border-white/10 text-white">
              <SelectValue placeholder={langKey === "zh" ? "分類" : "Category"} />
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
                {report.isLatest && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-rose-500 text-white border-none">
                      {langKey === "zh" ? "最新 Latest" : "Latest"}
                    </Badge>
                  </div>
                )}
                {report.featured && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0f1622] border-none">
                      <Sparkles className="size-3 mr-1" />
                      {langKey === "zh" ? "精選文獻" : "Featured Research"}
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
                    {report.tags.map((tagItem, tagIdx) => (
                      <span key={tagIdx} className="text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-gray-300">
                        {getTagText(tagItem)}
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
                      {langKey === "zh" ? "透過連結查看原文" : "Open Source Link"}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredReports.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText className="size-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {langKey === "zh" ? "未找到相關研究文獻" : "No matching research papers found"}
            </h3>
            <p className="text-gray-400">
              {langKey === "zh" ? "嘗試調整搜尋關鍵字或分類篩選" : "Try adjusting search keywords or category filter"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
