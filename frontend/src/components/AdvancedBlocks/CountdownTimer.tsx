import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  targetDate: string | Date;
  title?: string;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  onComplete?: () => void;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  title,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  onComplete,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsComplete(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (onComplete) {
          onComplete();
        }
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      key={`${label}-${value}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center"
    >
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-4 sm:p-6 min-w-[80px] sm:min-w-[100px] text-center shadow-lg">
        <div className="text-3xl sm:text-4xl font-black">{String(value).padStart(2, '0')}</div>
      </div>
      <div className="text-xs sm:text-sm font-bold text-slate-600 mt-2 uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );

  if (isComplete) {
    return (
      <div className={`text-center py-20 ${className}`}>
        <h2 className="text-4xl font-black text-slate-900 mb-4">Время истекло!</h2>
        <p className="text-slate-600">Событие завершилось</p>
      </div>
    );
  }

  return (
    <div className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}>
      {title && (
        <h2 className="text-4xl font-black text-slate-900 mb-8 text-center">
          {title}
        </h2>
      )}
      <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
        {showDays && <TimeUnit value={timeLeft.days} label="Дней" />}
        {showHours && <TimeUnit value={timeLeft.hours} label="Часов" />}
        {showMinutes && <TimeUnit value={timeLeft.minutes} label="Минут" />}
        {showSeconds && <TimeUnit value={timeLeft.seconds} label="Секунд" />}
      </div>
    </div>
  );
};

