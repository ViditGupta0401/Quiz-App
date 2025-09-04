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
        <div className="text-center mb-8 fade-in" role="region" aria-labelledby="results-title">
          <div className="flex justify-center mb-4">
            {percentage >= 90 ? (
              <Trophy 
                className="w-16 h-16 text-yellow-500 results-icon" 
                aria-hidden="true"
              />
            ) : percentage >= 70 ? (
              <Medal 
                className="w-16 h-16 text-primary results-icon" 
                aria-hidden="true"
              />
            ) : (
              <Target 
                className="w-16 h-16 text-muted-foreground results-icon" 
                aria-hidden="true"
              />
            )}
          </div>
          
          <h1 
            id="results-title"
            className="text-3xl md:text-4xl font-bold text-gradient bg-clip-text mb-4 animate-in zoom-in"
          >
            Quiz Complete!
          </h1>
          
          <div className="quiz-card inline-block">
            <div className="text-center">
              <div 
                className="results-score text-6xl font-bold mb-2"
                aria-label={`Final score: ${score} out of ${totalQuestions} questions correct`}
              >
                {score}/{totalQuestions}
              </div>
              <div className="text-2xl text-muted-foreground mb-2 animate-in fade-in-50">
                {percentage}% Correct
              </div>
              <div 
                className={`text-lg font-semibold ${scoreMessage.color} animate-in fade-in-75`}
                aria-live="polite"
              >
                {scoreMessage.message}
              </div>
              {isNewHighScore && (
                <div 
                  className="mt-4 p-3 bg-success/10 text-success rounded-lg border border-success/20 new-highscore"
                  role="alert"
                  aria-live="assertive"
                >
                  🎊 New High Score! 🎊
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4 mb-8" role="region" aria-label="Quiz Statistics">
          <div className="stats-card text-center">
            <div 
              className="text-2xl font-bold text-success mb-1"
              aria-label={`${score} correct answers`}
            >
              {score}
            </div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          <div className="stats-card text-center" style={{ animationDelay: '0.1s' }}>
            <div 
              className="text-2xl font-bold text-destructive mb-1"
              aria-label={`${totalQuestions - score} incorrect answers`}
            >
              {totalQuestions - score}
            </div>
            <div className="text-sm text-muted-foreground">Incorrect</div>
          </div>
          <div className="stats-card text-center" style={{ animationDelay: '0.2s' }}>
            <div 
              className="text-2xl font-bold text-primary mb-1"
              aria-label={`High score: ${highScore}`}
            >
              {highScore}
            </div>
            <div className="text-sm text-muted-foreground">High Score</div>
          </div>
        </div>

          {/* Question Review */}
        <div className="quiz-card slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-semibold mb-6 text-gradient bg-clip-text">Review Your Answers</h2>
          
          <div className="space-y-8">
            {userAnswers.map((answer, index) => {
              if (!answer.question) return null;
              
              const allAnswers = [answer.correctAnswer];
              // We don't have access to the original incorrect answers here
              // This is a simplified version for the results display
              
              return (
                <div key={index} className="border-b border-border/50 pb-6 last:border-b-0 animate-in" 
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-gradient bg-clip-text">
                      Question {index + 1}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                      answer.isCorrect 
                        ? 'bg-success/10 text-success border border-success/20' 
                        : 'bg-destructive/10 text-destructive border border-destructive/20'
                    } ${answer.isCorrect ? 'success-glow' : ''}`}>
                      {answer.isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-foreground mb-4">{answer.question}</p>
                    
                    <div className="space-y-2">
                      {answer.userAnswer && (
                        <div className={`p-3 rounded-lg backdrop-blur-sm ${
                          answer.isCorrect 
                            ? 'bg-success/10 text-success border border-success/20' 
                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                        } transform transition-all hover:scale-[1.02]`}>
                          <span className="font-medium">Your answer: </span>
                          {answer.userAnswer}
                          {answer.isCorrect && <span className="ml-2 animate-in fade-in-75">✓</span>}
                          {!answer.isCorrect && <span className="ml-2 animate-in fade-in-75">✗</span>}
                        </div>
                      )}
                      
                      {!answer.isCorrect && (
                        <div className="p-3 rounded-lg bg-success/10 text-success border border-success/20 backdrop-blur-sm transform transition-all hover:scale-[1.02] animate-in fade-in-75"
                          style={{ animationDelay: '0.2s' }}>
                          <span className="font-medium">Correct answer: </span>
                          {answer.correctAnswer}
                          <span className="ml-2">✓</span>
                        </div>
                      )}
                      
                      {!answer.userAnswer && (
                        <div className="p-3 rounded-lg bg-muted/10 text-muted-foreground border border-border/50 backdrop-blur-sm">
                          <span className="font-medium">No answer selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>        {/* Action Button */}
        <div className="text-center mt-8 animate-in" style={{ animationDelay: '0.4s' }}>
          <Button
            onClick={onRestart}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-glow hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg relative overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg min-h-[48px] touch-manipulation"
            aria-label="Start a new quiz with the same difficulty level"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRestart();
              }
            }}
          >
            <RotateCcw className="w-5 h-5 mr-2 animate-spin-slow" aria-hidden="true" />
            Take Quiz Again
          </Button>
        </div>
      </div>
    </div>
  );
};