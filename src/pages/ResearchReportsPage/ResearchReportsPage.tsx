import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Download, ExternalLink, Sparkles, Clock, BarChart3, Shield } from "lucide-react";
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
    title: { zh: "2026年黄金投资策略展望", en: "2026 Gold Investment Strategy Outlook" },
    description: { zh: "2026年全球宏观经济预测与黄金资产配置的前沿分析", en: "2026 global macroeconomic forecast and cutting-edge analysis of gold asset allocation" },
    category: "gold",
    date: "2026-07-10",
    source: "World Gold Council",
    sourceUrl: "https://www.gold.org/",
    tags: ["2026", "黄金", "策略", "前沿"],
    featured: true
  },
  {
    id: "2",
    title: { zh: "AI与量化交易对黄金市场的影响", en: "Impact of AI and Quantitative Trading on Gold Markets" },
    description: { zh: "人工智能算法交易在黄金市场中的作用与未来趋势分析", en: "Analysis of AI algorithmic trading's role and future trends in gold markets" },
    category: "strategy",
    date: "2026-06-28",
    source: "JPMorgan Quantitative Research",
    sourceUrl: "https://www.jpmorgan.com/insights/research",
    tags: ["AI", "量化", "技术"]
  },
  {
    id: "3",
    title: { zh: "央行数字货币与黄金储备战略", en: "Central Bank Digital Currencies and Gold Reserve Strategy" },
    description: { zh: "2026年各国央行数字货币进展及对黄金储备政策的影响", en: "2026 global CBDC developments and impact on central bank gold reserve policies" },
    category: "macro",
    date: "2026-06-15",
    source: "IMF Research",
    sourceUrl: "https://www.imf.org/en/research",
    tags: ["CBDC", "央行", "2026"]
  },
  {
    id: "4",
    title: { zh: "全球通胀与实际利率展望Q3 2026", en: "Global Inflation and Real Rate Outlook Q3 2026" },
    description: { zh: "2026年第三季度全球通胀分析及对黄金和股市的影响预测", en: "Q3 2026 global inflation analysis and impact forecast for gold and equities" },
    category: "macro",
    date: "2026-07-01",
    source: "BlackRock Investment Institute",
    sourceUrl: "https://www.blackrock.com/institutions/en-us/insights/investment-institute",
    tags: ["通胀", "利率", "2026", "前沿"]
  },
  {
    id: "5",
    title: { zh: "ESG投资中的黄金角色", en: "The Role of Gold in ESG Investing" },
    description: { zh: "环境、社会与治理投资框架下的黄金资产价值重估", en: "Re-evaluating gold's value in environmental, social and governance investment frameworks" },
    category: "gold",
    date: "2026-05-20",
    source: "Gold Council ESG Report",
    sourceUrl: "https://www.gold.org/goldhub/research",
    tags: ["ESG", "可持续", "创新"]
  },
  {
    id: "6",
    title: { zh: "2026年大类资产配置模型更新", en: "2026 Updated Asset Allocation Model" },
    description: { zh: "基于最新市场数据重新校准的多资产配置优化模型", en: "Re-calibrated multi-asset allocation optimization model with latest market data" },
    category: "strategy",
    date: "2026-06-05",
    source: "AQR Capital Management",
    sourceUrl: "https://www.aqr.com/insights",
    tags: ["模型", "资产配置", "2026"]
  },
  {
    id: "7",
    title: { zh: "能源转型中的大宗商品格局", en: "Commodity Landscape in Energy Transition" },
    description: { zh: "新能源革命背景下的黄金、铜、锂等大宗商品市场分析", en: "Analysis of gold, copper, lithium and other commodity markets in the new energy revolution" },
    category: "gold",
    date: "2026-04-18",
    source: "World Bank Commodities",
    sourceUrl: "https://www.worldbank.org/en/research/commodity-markets",
    tags: ["能源", "绿色", "创新"]
  },
  {
    id: "8",
    title: { zh: "新兴市场股市与黄金的动态相关性", en: "Dynamic Correlation Between EM Equities and Gold" },
    description: { zh: "新兴市场股票指数与黄金价格的滚动相关性研究", en: "Rolling correlation study of emerging market equity indices and gold prices" },
    category: "equity",
    date: "2026-05-08",
    source: "MSCI Research",
    sourceUrl: "https://www.msci.com/research",
    tags: ["新兴市场", "相关性", "量化"]
  },
  {
    id: "9",
    title: { zh: "2024年黄金投资策略报告", en: "2024 Gold Investment Strategy Report" },
    description: { zh: "全面分析当前宏观经济环境下的黄金投资价值与配置建议", en: "Comprehensive analysis of gold investment value and allocation recommendations in the current macroeconomic environment" },
    category: "gold",
    date: "2024-06-15",
    source: "World Gold Council",
    sourceUrl: "https://www.gold.org/",
    tags: ["黄金", "策略", "宏观"]
  },
  {
    id: "10",
    title: { zh: "大类资产配置研究：黄金的角色", en: "Asset Allocation Research: The Role of Gold" },
    description: { zh: "深入探讨黄金在多资产投资组合中的对冲和分散风险作用", en: "Deep dive into gold's hedging and diversification role in multi-asset portfolios" },
    category: "strategy",
    date: "2024-05-20",
    source: "BlackRock Investment Institute",
    sourceUrl: "https://www.blackrock.com/institutions/en-us/insights/investment-institute",
    tags: ["资产配置", "对冲"]
  },
  {
    id: "11",
    title: { zh: "全球宏观经济回顾Q2", en: "Global Macro Economic Review Q2" },
    description: { zh: "2024年第二季度全球经济分析，包含通胀、利率与地缘政治风险分析", en: "Q2 2024 global economic analysis including inflation, interest rates and geopolitical risk" },
    category: "macro",
    date: "2024-04-10",
    source: "IMF Research",
    sourceUrl: "https://www.imf.org/en/research",
    tags: ["宏观", "经济", "利率"]
  },
  {
    id: "12",
    title: { zh: "黄金与股市：相关性分析", en: "Gold and Equities: Correlation Analysis" },
    description: { zh: "历史数据分析黄金与股市在不同市场环境下的相关性变化", en: "Historical data analysis of gold-equity correlation changes across different market regimes" },
    category: "equity",
    date: "2024-03-28",
    source: "Bloomberg Intelligence",
    sourceUrl: "https://www.bloomberg.com/professional/solutions/bloomberg-intelligence/",
    tags: ["股市", "量化"]
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
            {langKey === "zh" ? "免费研报" : "Free Research"}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C96A] to-[#D4AF37] bg-clip-text text-transparent">
              {langKey === "zh" ? "研究报告库" : "Research Reports"}
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            {langKey === "zh" 
              ? "精选全球权威机构的免费研究报告，助力您的投资决策" 
              : "Curated free research reports from leading global institutions to support your investment decisions"}
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
              placeholder={langKey === "zh" ? "搜索报告标题或内容..." : "Search reports..."}
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
                      {langKey === "zh" ? "精选" : "Featured"}
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
                      {langKey === "zh" ? "查看报告" : "View Report"}
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
              {langKey === "zh" ? "没有找到相关报告" : "No reports found"}
            </h3>
            <p className="text-gray-400">
              {langKey === "zh" ? "尝试更换搜索关键词或分类" : "Try changing search keywords or category"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
