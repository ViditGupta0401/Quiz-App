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
type Difficulty = 'easy' | 'medium' | 'hard';

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
    const savedHighScore = localStorage.getItem('quiz-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Fetch questions from API based on difficulty
  const fetchQuestions = async (selectedDifficulty: Difficulty) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&difficulty=${selectedDifficulty}&type=multiple`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      
      const data = await response.json();
      
      if (data.response_code !== 0) {
        throw new Error('No questions available for this difficulty');
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
      setError(err instanceof Error ? err.message : 'Failed to load questions');
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
        setScore(score + 1);
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
    setSelectedAnswer(null);
    handleNext();
  };

  // Auto-submit when timer runs out
  const handleTimeUp = () => {
    setTimeRemaining(0);
    handleNext();
  };

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

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    fetchQuestions(difficulty);
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
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Quiz Master</h1>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>Score: {score}/{questions.length}</span>
            <span>High Score: {highScore}</span>
          </div>
        </div>

        <ProgressBar 
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        <div className="quiz-card fade-in mb-6">
          <div className="flex justify-between items-start mb-6">
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