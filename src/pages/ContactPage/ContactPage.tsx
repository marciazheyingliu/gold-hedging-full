import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Sparkles, Linkedin, Github, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLangKey } from "@/lib/lang-utils";

export default function ContactPage() {
  const { lang } = useLanguage();
  const langKey = getLangKey(lang);

  const contactInfo = {
    name: "Zheying (Marcia) Liu",
    title: {
      zh: "金融策略开发者",
      en: "Financial Strategy Developer"
    },
    email: "marcialiu0227@gmail.com",
    phoneHK: "+852 6474 6795",
    phoneCN: "+86 188 1772 0227",
    location: {
      zh: "香港 / 上海",
      en: "Hong Kong / Shanghai"
    }
  };

  const socialLinks = [
    {
      name: "Email",
      icon: Mail,
      value: contactInfo.email,
      url: `mailto:${contactInfo.email}`,
      color: "text-emerald-400"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      value: "LinkedIn Profile",
      url: "https://www.linkedin.com/in/zheying-l-063562199/",
      color: "text-blue-400"
    },
    {
      name: "GitHub",
      icon: Github,
      value: "GitHub Profile",
      url: "https://marciazheyingliu.github.io/",
      color: "text-gray-300"
    }
  ];

  const phoneLinks = [
    {
      region: "Hong Kong",
      number: contactInfo.phoneHK,
      icon: Phone,
      color: "text-purple-400"
    },
    {
      region: "Mainland China",
      number: contactInfo.phoneCN,
      icon: Phone,
      color: "text-blue-400"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/5">
            <MessageSquare className="size-3.5 mr-1.5" />
            {langKey === "zh" ? "联系我" : "Contact Me"}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C96A] to-[#D4AF37] bg-clip-text text-transparent">
              {langKey === "zh" ? "关于开发者" : "About the Developer"}
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            {langKey === "zh" ? "有任何问题或合作意向，欢迎随时联系我！" : "Feel free to reach out for any questions or collaboration opportunities!"}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-[#0f1622]/80 border-[#D4AF37]/20 backdrop-blur-sm overflow-hidden h-full">
              <div className="h-32 bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/30 to-[#B8860B]/20" />
              <CardHeader className="-mt-16 pb-4">
                <div className="flex items-center gap-4">
                  <div className="size-24 rounded-full border-4 border-[#1a2332] shadow-xl shadow-[#D4AF37]/20 overflow-hidden">
                    <img
                      src="/avatar/marcia-avatar.jpg"
                      alt="Zheying (Marcia) Liu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">{contactInfo.name}</CardTitle>
                    <CardDescription className="text-[#D4AF37] text-base">{contactInfo.title[langKey]}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-[#D4AF37] mt-1 shrink-0" />
                  <div>
                    <p className="text-gray-400 text-sm">{langKey === "zh" ? "办公地点" : "Base"}</p>
                    <p className="text-white">{contactInfo.location[langKey]}</p>
                  </div>
                </div>

                {/* Phone Numbers */}
                <div className="space-y-3">
                  <p className="text-gray-400 text-sm">{langKey === "zh" ? "联系方式" : "Phone Numbers"}</p>
                  {phoneLinks.map((phone, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <phone.icon className="size-4 text-gray-500 shrink-0" />
                      <a
                        href={`tel:${phone.number.replace(/\s+/g, '')}`}
                        className="text-white hover:text-[#D4AF37] transition-colors"
                      >
                        {phone.number} <span className="text-gray-500 text-xs">({phone.region})</span>
                      </a>
                    </div>
                  ))}
                </div>

                {/* Social Links */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-3">{langKey === "zh" ? "社交媒体" : "Social Links"}</p>
                  <div className="flex gap-3">
                    {socialLinks.map((social, idx) => (
                      <Button
                        key={idx}
                        asChild
                        variant="outline"
                        size="icon"
                        className="border-white/10 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/10"
                      >
                        <a href={social.url} target={social.name !== "Email" ? "_blank" : "_self"} rel="noopener noreferrer">
                          <social.icon className="size-5" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Email Card */}
            <Card className="bg-[#0f1622]/80 border-[#D4AF37]/20 backdrop-blur-sm hover:border-[#D4AF37]/50 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <Mail className="size-6 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{langKey === "zh" ? "发送邮件" : "Send an Email"}</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      {langKey === "zh" ? "最常用的联系方式" : "The preferred way to reach me"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90"
                >
                  <a href={`mailto:${contactInfo.email}`}>
                    <Mail className="size-4 mr-2" />
                    {contactInfo.email}
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="bg-[#0f1622]/80 border-[#D4AF37]/20 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Sparkles className="size-5 text-[#D4AF37]" />
                  {langKey === "zh" ? "关于这个项目" : "About This Project"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-400 space-y-2 text-sm">
                <p>
                  {langKey === "zh" 
                    ? "这个黄金-股票对冲策略平台是一个开源项目，旨在帮助投资者更好地理解和应用量化对冲策略。"
                    : "This gold-equity hedging strategy platform is an open-source project designed to help investors better understand and apply quantitative hedging strategies."}
                </p>
                <p>
                  {langKey === "zh"
                    ? "如果你对量化投资、金融科技、或者项目合作感兴趣，欢迎随时联系我！"
                    : "If you're interested in quantitative investing, fintech, or project collaboration, feel free to reach out anytime!"}
                </p>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="bg-[#0f1622]/80 border-[#D4AF37]/20 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">{langKey === "zh" ? "工作状态" : "Availability"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="size-3 rounded-full bg-emerald-500" />
                    <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                  </div>
                  <span className="text-emerald-400 font-medium">{langKey === "zh" ? "开放合作机会" : "Open for opportunities"}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
