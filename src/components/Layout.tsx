import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/sonner';

function LayoutContent() {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-[#1a2332] via-[#1f2b3d] to-[#1a2332] text-white' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
    }`}>
      <Header />
      <main className="w-full">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        theme={theme}
        position="top-right"
      />
    </div>
  );
}

export function Layout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LayoutContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
