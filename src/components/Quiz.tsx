import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionCard } from './QuestionCard';
import { Navigation } from './Navigation';
import { ProgressBar } from './ProgressBar';
import { Results } from './Results';
import { DifficultySelection } from './DifficultySelection';
import { Timer } from './Timer';
import { useQuiz } from '@/contexts/QuizContext';

// Question type from API/local data
export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  category?: string;
  difficulty?: string;
}

// Tracks user's answers and performance
export interface UserAnswer {
  question: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  timeRemaining: number;
}

// Different states of quiz flow
type QuizState = 'difficulty' | 'playing' | 'results';
export type Difficulty = 'easy' | 'medium' | 'hard';

// Time limit per question
const TIMER_DURATION = 30; // seconds

export const Quiz: React.FC = () => {
  // Global quiz state & navigation
  const { state, dispatch } = useQuiz();
  const navigate = useNavigate();
  const { difficulty: urlDifficulty } = useParams();

  // Core quiz state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizState, setQuizState] = useState<QuizState>('difficulty');
  
  // Progress tracking
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Game settings
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(urlDifficulty as Difficulty || 'medium');
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [highScore, setHighScore] = useState<number>(0);

  // Load high score from localStorage on mount
  useEffect(() => {
    // Load high score
    const savedHighScore = localStorage.getItem('quiz-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }

    // Start quiz if difficulty is provided
    if (urlDifficulty && (urlDifficulty === 'easy' || urlDifficulty === 'medium' || urlDifficulty === 'hard')) {
      console.log('Starting quiz with difficulty from URL:', urlDifficulty);
      setSelectedDifficulty(urlDifficulty as Difficulty);
      fetchQuestions(urlDifficulty as Difficulty);
    }
  }, [urlDifficulty]);

  // Enhanced fetch with retry mechanism and timeout
  const fetchWithTimeout = async (url: string, timeout = 10000): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, { 
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      throw error;
    }
  };

  // Retry mechanism for API calls
  const fetchWithRetry = async (url: string, maxRetries = 3): Promise<Response> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetchWithTimeout(url);
        if (response.ok) {
          return response;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < maxRetries) {
          // Exponential backoff: wait 1s, 2s, 4s between retries
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  };

  // Fetch questions from API based on difficulty
  const fetchQuestions = async (selectedDifficulty: Difficulty) => {
    console.log('Fetching questions for difficulty:', selectedDifficulty);
    setError(null);
    
    try {
      const response = await fetchWithRetry(
        `https://opentdb.com/api.php?amount=10&difficulty=${selectedDifficulty}&type=multiple`
      );
      
      const data = await response.json();
      
      if (data.response_code !== 0) {
        throw new Error('No questions available for this difficulty. Please try a different difficulty level.');
      }
      
      if (!data.results || data.results.length === 0) {
        throw new Error('No questions found. Please try again later.');
      }
      
      const decodedQuestions = data.results.map((q: any) => ({
        ...q,
        question: decodeHTML(q.question),
        correct_answer: decodeHTML(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(decodeHTML)
      }));
      
      setQuestions(decodedQuestions);
      setUserAnswers(new Array(decodedQuestions.length).fill(null).map(() => ({
        question: '',
        userAnswer: null,
        correctAnswer: '',
        isCorrect: false,
        timeRemaining: 0
      })));
      setQuizState('playing');
      setTimeRemaining(TIMER_DURATION);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load questions';
      setError(errorMessage);
      
      // Enhanced error logging for debugging
      console.error('Quiz fetch error:', {
        error: err,
        difficulty: selectedDifficulty,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        online: navigator.onLine
      });
      
      // Fallback to local questions if API fails
      loadFallbackQuestions();
    } finally {
      setLoading(false);
    }
  };

  // Helper to decode HTML entities from API
  const decodeHTML = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // Backup questions if API fails
  const loadFallbackQuestions = () => {
    const fallbackQuestions: Question[] = [
      {
        question: "What is the capital of France?",
        correct_answer: "Paris",
        incorrect_answers: ["London", "Berlin", "Madrid"]
      },
      {
        question: "Which planet is known as the Red Planet?",
        correct_answer: "Mars",
        incorrect_answers: ["Venus", "Jupiter", "Saturn"]
      },
      {
        question: "What is 2 + 2?",
        correct_answer: "4",
        incorrect_answers: ["3", "5", "6"]
      },
      {
        question: "Who painted the Mona Lisa?",
        correct_answer: "Leonardo da Vinci",
        incorrect_answers: ["Pablo Picasso", "Vincent van Gogh", "Michelangelo"]
      },
      {
        question: "What is the largest ocean on Earth?",
        correct_answer: "Pacific Ocean",
        incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"]
      }
    ];
    
    setQuestions(fallbackQuestions);
    setUserAnswers(new Array(fallbackQuestions.length).fill(null).map(() => ({
      question: '',
      userAnswer: null,
      correctAnswer: '',
      isCorrect: false,
      timeRemaining: 0
    })));
    setQuizState('playing');
    setTimeRemaining(TIMER_DURATION);
  };

  // Handle user selecting an answer
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Move to next question and update score
  const handleNext = () => {
    if (selectedAnswer || timeRemaining === 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = selectedAnswer === currentQuestion.correct_answer;
      
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentQuestionIndex] = {
        question: currentQuestion.question,
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correct_answer,
        isCorrect,
        timeRemaining
      };
      
      setUserAnswers(newUserAnswers);
      
      if (isCorrect) {
        const newScore = score + 1;
        setScore(newScore);
        // Update high score immediately if the current score exceeds it
        if (newScore > highScore) {
          setHighScore(newScore);
          localStorage.setItem('quiz-high-score', newScore.toString());
          // Also update in global context
          dispatch({ type: 'UPDATE_HIGH_SCORE', payload: newScore });
        }
      }
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setTimeRemaining(TIMER_DURATION);
      } else {
        const finalScore = isCorrect ? score + 1 : score;
        if (finalScore > highScore) {
          setHighScore(finalScore);
          localStorage.setItem('quiz-high-score', finalScore.toString());
          // Also update in global context
          dispatch({ type: 'UPDATE_HIGH_SCORE', payload: finalScore });
        }
        setQuizState('results');
      }
    }
  };

  // Go back to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousAnswer = userAnswers[currentQuestionIndex - 1]?.userAnswer;
      setSelectedAnswer(previousAnswer || null);
      setTimeRemaining(TIMER_DURATION);
    }
  };

  // Skip current question without answering
  const handleSkip = () => {
    console.log('Skipping question:', currentQuestionIndex + 1);
    dispatch({ type: 'SKIP_QUESTION' });
    setSelectedAnswer(null);
  };

  // Auto-submit when timer runs out
  const handleTimeUp = () => {
    setTimeRemaining(0);
    handleNext();
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (quizState !== 'playing' || questions.length === 0) return;
      
      const currentQuestion = questions[currentQuestionIndex];
      if (!currentQuestion) return;
      
      const allAnswers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers].sort();
      
      // Handle number keys for answer selection (1-4)
      if (e.key >= '1' && e.key <= '4') {
        const answerIndex = parseInt(e.key) - 1;
        if (answerIndex < allAnswers.length) {
          const answer = allAnswers[answerIndex];
          handleAnswerSelect(answer);
        }
      }
      
      // Handle Enter key to proceed
      if (e.key === 'Enter' && selectedAnswer) {
        handleNext();
      }
      
      // Handle Escape key to skip
      if (e.key === 'Escape') {
        handleSkip();
      }
      
      // Handle arrow keys for navigation
      if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
        handlePrevious();
      }
      if (e.key === 'ArrowRight' && currentQuestionIndex < questions.length - 1) {
        if (selectedAnswer) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quizState, currentQuestionIndex, selectedAnswer, questions]);

  // Reset everything for a new game
  const handleRestart = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setScore(0);
    setError(null);
    setTimeRemaining(TIMER_DURATION);
    setQuizState('difficulty');
  };

  const handleDifficultySelect = async (difficulty: Difficulty) => {
    console.log('Starting quiz with difficulty:', difficulty);
    if (loading) return; // Prevent multiple selections while loading
    
    setLoading(true);
    setSelectedDifficulty(difficulty);
    
    try {
      await fetchQuestions(difficulty);
    } catch (error) {
      console.error('Error starting quiz:', error);
      setError('Failed to start quiz. Please try again.');
      setLoading(false);
    }
  };

  if (quizState === 'difficulty') {
    return (
      <DifficultySelection 
        onSelect={handleDifficultySelect}
        loading={loading}
        error={error}
        highScore={highScore}
      />
    );
  }

  if (quizState === 'results') {
    return (
      <Results 
        userAnswers={userAnswers}
        score={score}
        totalQuestions={questions.length}
        onRestart={handleRestart}
        highScore={highScore}
      />
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers].sort();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-8 px-4">
      {/* Animated background patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6 animate-title">Quiz Forge</h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <span className="px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary animate-score font-medium">
              Score: {score}/{questions.length}
            </span>
            <span className="px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary animate-score font-medium">
              High Score: {highScore}
            </span>
          </div>
        </div>

        <ProgressBar 
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        <div className="quiz-card fade-in mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <Timer 
              timeRemaining={timeRemaining}
              totalTime={TIMER_DURATION}
              onTimeUp={handleTimeUp}
              setTimeRemaining={setTimeRemaining}
            />
          </div>
          
          {/* Keyboard shortcuts info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-muted/10 to-muted/5 rounded-xl border border-border/30 backdrop-blur-sm">
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                <span className="font-medium">Keyboard shortcuts</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted/30 rounded text-xs">1-4</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted/30 rounded text-xs">Enter</kbd>
                  <span>Next</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted/30 rounded text-xs">Esc</kbd>
                  <span>Skip</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-muted/30 rounded text-xs">←→</kbd>
                  <span>Navigate</span>
                </div>
              </div>
            </div>
          </div>

          <QuestionCard
            question={currentQuestion.question}
            answers={allAnswers}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            correctAnswer={currentQuestion.correct_answer}
            showResults={false}
          />

          <Navigation
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedAnswer={selectedAnswer}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSkip={handleSkip}
            canGoBack={currentQuestionIndex > 0}
          />
        </div>
      </div>
    </div>
  );
};