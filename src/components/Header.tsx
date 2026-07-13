import { NavLink, useLocation } from 'react-router-dom';
import { MessageSquare, Calculator, LineChart, BookOpen, FileText, Mail, Menu, ChevronDown, Globe, Shield } from 'lucide-react';
import { useState } from 'react';
import { useLanguage, type Lang } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const NAV_ITEMS = [
  { path: '/', labelKey: 'nav.assistant', icon: MessageSquare },
  { path: '/risk-assessment', labelKey: 'nav.risk', icon: Shield },
  { path: '/calculator', labelKey: 'nav.calculator', icon: Calculator },
  { path: '/backtest', labelKey: 'nav.backtest', icon: LineChart },
  { path: '/research', labelKey: 'nav.research', icon: BookOpen },
  { path: '/reports', labelKey: 'nav.reports', icon: FileText },
  { path: '/contact', labelKey: 'nav.contact', icon: Mail },
];

const LANGUAGE_OPTIONS: Array<{ value: Lang; label: string }> = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en', label: 'English' },
];

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getLogoText = () => {
    if (lang === 'zh-CN') return '黄金对冲策略';
    if (lang === 'zh-TW') return '黃金對沖策略';
    return 'Gold Hedge Strategy';
  };

  const getCurrentLangLabel = () => {
    const option = LANGUAGE_OPTIONS.find(opt => opt.value === lang);
    return option?.label || 'Language';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1a2332]/90 backdrop-blur-lg border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <div className="size-9 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-[#1a2332] font-bold text-sm shadow-lg shadow-[#D4AF37]/20">
            Au
          </div>
          <span className="text-white font-semibold text-lg hidden sm:block">
            {getLogoText()}
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="size-4" />
                {t(item.labelKey)}
              </NavLink>
            );
          })}
        </nav>

        {/* Right: Lang dropdown + Mobile menu */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 flex items-center gap-2"
              >
                <Globe className="size-4" />
                <span>{getCurrentLangLabel()}</span>
                <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0f1622] border border-[#D4AF37]/20 text-white">
              {LANGUAGE_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setLang(option.value)}
                  className={`cursor-pointer ${
                    lang === option.value ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-300 hover:text-white"
                aria-label="Menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-[#1a2332] border-l border-[#D4AF37]/20 text-white">
              <div className="flex flex-col gap-2 pt-8">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === '/' ? pathname === '/' : pathname.startsWith(item.path);
                return (
                  <SheetClose asChild key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      className={`px-4 py-3 rounded-md text-sm font-medium transition-colors flex items-center gap-3 ${
                        isActive
                          ? 'text-[#D4AF37] bg-[#D4AF37]/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Icon className="size-5" />
                      {t(item.labelKey)}
                    </NavLink>
                  </SheetClose>
                );
              })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
