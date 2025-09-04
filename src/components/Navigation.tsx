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
    <div className="quiz-navigation flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-border/50 gap-4">
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoBack}
          className="flex items-center gap-2 min-h-[48px] touch-manipulation"
          aria-label={canGoBack ? "Go to previous question" : "Cannot go back - this is the first question"}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>
        
        <Button
          variant="ghost"
          onClick={onSkip}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground min-h-[48px] touch-manipulation"
          aria-label="Skip current question"
        >
          <SkipForward className="w-4 h-4" />
          Skip
        </Button>
      </div>

      <Button
        onClick={onNext}
        disabled={!selectedAnswer}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground min-h-[48px] touch-manipulation w-full sm:w-auto"
        aria-label={isLastQuestion ? "Finish quiz and view results" : "Go to next question"}
      >
        {isLastQuestion ? 'Finish Quiz' : 'Next'}
        {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
      </Button>
    </div>
  );
};