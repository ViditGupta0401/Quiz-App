import React from 'react';

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuestion,
  totalQuestions,
}) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span className="text-sm text-muted-foreground">
          {Math.round(progressPercentage)}%
        </span>
      </div>
      
      <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
        <div
          className="h-full progress-glow transition-all duration-500 ease-out"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>
    </div>
  );
};