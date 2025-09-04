import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';

interface NavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  canGoBack: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onNext,
  onPrevious,
  onSkip,
  canGoBack,
}) => {
  const isLastQuestion = currentQuestion === totalQuestions;

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-border/50">
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button
          variant="ghost"
          onClick={onSkip}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <SkipForward className="w-4 h-4" />
          Skip
        </Button>
      </div>

      <Button
        onClick={onNext}
        disabled={!selectedAnswer}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {isLastQuestion ? 'Finish Quiz' : 'Next'}
        {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
      </Button>
    </div>
  );
};