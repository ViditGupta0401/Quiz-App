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
    <div className="slide-up">
      <h2 className="text-xl font-semibold mb-8 text-foreground leading-relaxed">
        {question}
      </h2>
      
      <div className="grid gap-4">
        {answers.map((answer, index) => (
          <Button
            key={index}
            variant="ghost"
            className={getAnswerClassName(answer)}
            onClick={() => !showResults && onAnswerSelect(answer)}
            disabled={showResults}
          >
            <span className="flex-1 text-left">{answer}</span>
            {getAnswerIcon(answer)}
          </Button>
        ))}
      </div>
    </div>
  );
};