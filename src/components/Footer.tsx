import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Footer() {
  const { t, lang } = useLanguage();
  const { theme: appTheme } = useTheme();

  const getFooterText = () => {
    if (lang === 'zh-CN') {
      return '黄金-股票跨资产自适应对冲策略平台';
    } else if (lang === 'zh-TW') {
      return '黃金-股票跨資產自適應對沖策略平台';
    }
    return 'Gold-Stock Cross-Asset Adaptive Hedging Platform';
  };

  const getCopyrightText = () => {
    if (lang === 'zh-CN') {
      return '© 2024 仅供研究参考，不构成投资建议';
    } else if (lang === 'zh-TW') {
      return '© 2024 僅供研究參考，不構成投資建議';
    }
    return '© 2024 For research purposes only, not investment advice';
  };

  const bgClass = appTheme === 'dark' ? 'bg-[#1a2332]' : 'bg-white';
  const borderClass = appTheme === 'dark' ? 'border-[#D4AF37]/20' : 'border-gray-200';
  const textMutedClass = appTheme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const textDimmedClass = appTheme === 'dark' ? 'text-gray-500' : 'text-gray-400';

  return (
    <footer className={`w-full ${bgClass} border-t ${borderClass} py-8 mt-12`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-[#1a2332] font-bold text-xs">
              Au
            </div>
            <span className={`${textMutedClass} text-sm`}>
              {getFooterText()}
            </span>
          </div>
          <div className={`${textDimmedClass} text-xs`}>
            {getCopyrightText()}
          </div>
        </div>
      </div>
    </footer>
  );
}
