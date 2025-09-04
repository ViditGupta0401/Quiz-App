import React from 'react';
import { Button } from '@/components/ui/button';

interface QuestionCardProps {
  question: string;
  answers: string[];
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  correctAnswer?: string;
  showResults?: boolean;
  userAnswer?: string | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answers,
  selectedAnswer,
  onAnswerSelect,
  correctAnswer,
  showResults = false,
  userAnswer
}) => {
  const getAnswerClassName = (answer: string) => {
    let baseClass = 'quiz-answer w-full';
    
    if (showResults) {
      if (answer === correctAnswer) {
        baseClass += ' correct';
      } else if (answer === userAnswer && answer !== correctAnswer) {
        baseClass += ' incorrect';
      }
    } else if (selectedAnswer === answer) {
      baseClass += ' selected';
    }
    
    return baseClass;
  };

  const getAnswerIcon = (answer: string) => {
    if (!showResults) return null;
    
    if (answer === correctAnswer) {
      return (
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-success">
          ✓
        </span>
      );
    } else if (answer === userAnswer && answer !== correctAnswer) {
      return (
        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-destructive">
          ✗
        </span>
      );
    }
    
    return null;
  };

  return (
    <div className="slide-up" role="region" aria-labelledby="question-text">
      <div className="relative mb-8 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
        <div className="absolute inset-0 bg-primary/5 blur-xl"></div>
        <h2 
          id="question-text"
          className="relative text-xl font-semibold text-foreground leading-relaxed"
          aria-live="polite"
        >
          {question}
        </h2>
      </div>
      
      <div 
        className="grid gap-4" 
        role="radiogroup" 
        aria-labelledby="question-text"
        aria-describedby="answer-instructions"
      >
        <div id="answer-instructions" className="sr-only">
          Select one of the four answer options below. Use arrow keys to navigate between options and press Enter or Space to select.
        </div>
        {answers.map((answer, index) => {
          const letter = String.fromCharCode(65 + index);
          const isSelected = selectedAnswer === answer;
          const isCorrect = showResults && answer === correctAnswer;
          const isIncorrect = showResults && answer === userAnswer && answer !== correctAnswer;
          
          return (
            <Button
              key={index}
              variant="ghost"
              className={`${getAnswerClassName(answer)} relative overflow-hidden group`}
              onClick={() => !showResults && onAnswerSelect(answer)}
              disabled={showResults}
              style={{ animationDelay: `${index * 0.1}s` }}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Option ${letter}: ${answer}`}
              aria-describedby={`answer-${index}-status`}
              tabIndex={showResults ? -1 : 0}
              onKeyDown={(e) => {
                if (showResults) return;
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onAnswerSelect(answer);
                }
              }}
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Answer letter */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                {letter}
              </div>
              
              {/* Answer text */}
              <span className="flex-1 text-left pl-12">{answer}</span>
              
              {/* Result icon */}
              {getAnswerIcon(answer)}
              
              {/* Status indicator for screen readers */}
              <div id={`answer-${index}-status`} className="sr-only">
                {showResults ? (
                  isCorrect ? 'Correct answer' : 
                  isIncorrect ? 'Your incorrect answer' : 
                  'Not selected'
                ) : (
                  isSelected ? 'Selected' : 'Not selected'
                )}
              </div>
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                <div className="absolute inset-0 translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};