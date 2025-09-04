import React from 'react';
import { Button } from '@/components/ui/button';
import { QuestionCard } from './QuestionCard';
import { Trophy, RotateCcw, Medal, Target } from 'lucide-react';
import type { UserAnswer } from './Quiz';

interface ResultsProps {
  userAnswers: UserAnswer[];
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  highScore: number;
}

export const Results: React.FC<ResultsProps> = ({
  userAnswers,
  score,
  totalQuestions,
  onRestart,
  highScore,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isNewHighScore = score > highScore;
  
  const getScoreMessage = () => {
    if (percentage >= 90) return { message: "Excellent! 🎉", color: "text-success" };
    if (percentage >= 70) return { message: "Great job! 👏", color: "text-primary" };
    if (percentage >= 50) return { message: "Good effort! 👍", color: "text-accent" };
    return { message: "Keep practicing! 💪", color: "text-muted-foreground" };
  };

  const scoreMessage = getScoreMessage();

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 fade-in">
          <div className="flex justify-center mb-4">
            {percentage >= 90 ? (
              <Trophy className="w-16 h-16 text-yellow-500" />
            ) : percentage >= 70 ? (
              <Medal className="w-16 h-16 text-primary" />
            ) : (
              <Target className="w-16 h-16 text-muted-foreground" />
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gradient mb-2">Quiz Complete!</h1>
          
          <div className="quiz-card inline-block">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                {score}/{totalQuestions}
              </div>
              <div className="text-2xl text-muted-foreground mb-2">
                {percentage}% Correct
              </div>
              <div className={`text-lg font-semibold ${scoreMessage.color}`}>
                {scoreMessage.message}
              </div>
              {isNewHighScore && (
                <div className="mt-4 p-3 bg-success/10 text-success rounded-lg border border-success/20">
                  🎊 New High Score! 🎊
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="quiz-card text-center slide-up">
            <div className="text-2xl font-bold text-success mb-1">{score}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          <div className="quiz-card text-center slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-2xl font-bold text-destructive mb-1">{totalQuestions - score}</div>
            <div className="text-sm text-muted-foreground">Incorrect</div>
          </div>
          <div className="quiz-card text-center slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-2xl font-bold text-primary mb-1">{highScore}</div>
            <div className="text-sm text-muted-foreground">High Score</div>
          </div>
        </div>

        {/* Question Review */}
        <div className="quiz-card slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Review Your Answers</h2>
          
          <div className="space-y-8">
            {userAnswers.map((answer, index) => {
              if (!answer.question) return null;
              
              const allAnswers = [answer.correctAnswer];
              // We don't have access to the original incorrect answers here
              // This is a simplified version for the results display
              
              return (
                <div key={index} className="border-b border-border/50 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-foreground">
                      Question {index + 1}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      answer.isCorrect 
                        ? 'bg-success/10 text-success border border-success/20' 
                        : 'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}>
                      {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-foreground mb-4">{answer.question}</p>
                    
                    <div className="space-y-2">
                      {answer.userAnswer && (
                        <div className={`p-3 rounded-lg ${
                          answer.isCorrect 
                            ? 'bg-success/10 text-success border border-success/20' 
                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}>
                          <span className="font-medium">Your answer: </span>
                          {answer.userAnswer}
                          {answer.isCorrect && <span className="ml-2">✓</span>}
                          {!answer.isCorrect && <span className="ml-2">✗</span>}
                        </div>
                      )}
                      
                      {!answer.isCorrect && (
                        <div className="p-3 rounded-lg bg-success/10 text-success border border-success/20">
                          <span className="font-medium">Correct answer: </span>
                          {answer.correctAnswer}
                          <span className="ml-2">✓</span>
                        </div>
                      )}
                      
                      {!answer.userAnswer && (
                        <div className="p-3 rounded-lg bg-muted/10 text-muted-foreground border border-border/50">
                          <span className="font-medium">No answer selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mt-8 slide-up" style={{ animationDelay: '0.4s' }}>
          <Button
            onClick={onRestart}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Take Quiz Again
          </Button>
        </div>
      </div>
    </div>
  );
};