import React, { useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  onTimeUp: () => void;
  setTimeRemaining: (time: number) => void;
}

export const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  totalTime,
  onTimeUp,
  setTimeRemaining,
}) => {
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, onTimeUp, setTimeRemaining]);

  const percentage = (timeRemaining / totalTime) * 100;
  const isLowTime = timeRemaining <= 10;
  const isVeryLowTime = timeRemaining <= 5;

  const getTimerColor = () => {
    if (isVeryLowTime) return 'text-destructive';
    if (isLowTime) return 'text-yellow-500';
    return 'text-primary';
  };

  const getProgressColor = () => {
    if (isVeryLowTime) return 'bg-destructive';
    if (isLowTime) return 'bg-yellow-500';
    return 'bg-primary';
  };

  return (
    <div 
      className="flex items-center gap-3" 
      role="timer" 
      aria-live={isLowTime ? "assertive" : "polite"}
      aria-label={`Time remaining: ${timeRemaining} seconds`}
    >
      {/* Timer Icon */}
      <div className={`flex items-center gap-2 ${getTimerColor()}`}>
        {isVeryLowTime ? (
          <AlertTriangle 
            className="w-5 h-5 animate-pulse" 
            aria-hidden="true"
          />
        ) : (
          <Clock 
            className="w-5 h-5" 
            aria-hidden="true"
          />
        )}
        <span 
          className={`font-mono text-lg font-bold ${isVeryLowTime ? 'animate-pulse' : ''}`}
          aria-label={`${timeRemaining} seconds remaining`}
        >
          {timeRemaining}s
        </span>
      </div>

      {/* Circular Progress */}
      <div className="relative w-12 h-12" aria-hidden="true">
        <svg className="w-12 h-12 rotate-[-90deg]" viewBox="0 0 36 36">
          {/* Background circle */}
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted/30"
          />
          
          {/* Progress circle */}
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${percentage}, 100`}
            className={`${getTimerColor()} transition-all duration-1000 ease-linear`}
          />
        </svg>
        
        {/* Center number */}
        <div className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${getTimerColor()}`}>
          {timeRemaining}
        </div>
      </div>
      
      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite">
        {isVeryLowTime && "Warning: Time is running out!"}
        {timeRemaining === 0 && "Time's up!"}
      </div>
    </div>
  );
};