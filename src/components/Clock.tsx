import { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// 时钟组件，显示香港时间
export default function Clock() {
  const { t, lang } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    // 香港时区：Asia/Hong_Kong
    const timeOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Hong_Kong',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Hong_Kong',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };

    const timeFormatter = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : lang, timeOptions);
    const dateFormatter = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : lang, dateOptions);

    return {
      time: timeFormatter.format(currentTime),
      date: dateFormatter.format(currentTime),
    };
  };

  const { time, date } = formatTime();

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <ClockIcon className="w-4 h-4" />
      <div className="flex flex-col items-end">
        <span className="font-medium">{time}</span>
        <span className="text-xs">{date}</span>
      </div>
    </div>
  );
}
