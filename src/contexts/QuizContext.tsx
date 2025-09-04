import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

export type UserAnswer = {
  question: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
};

type Difficulty = 'easy' | 'medium' | 'hard';

type QuizState = {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  score: number;
  loading: boolean;
  error: string | null;
  timeRemaining: number;
  highScore: number;
  difficulty: Difficulty | null;
};

type QuizAction =
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'SET_ANSWER'; payload: { answer: string | null } }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'SKIP_QUESTION' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'RESET_QUIZ' }
  | { type: 'SET_DIFFICULTY'; payload: Difficulty }
  | { type: 'UPDATE_HIGH_SCORE'; payload: number };

const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  score: 0,
  loading: false,
  error: null,
  timeRemaining: 30,
  highScore: parseInt(localStorage.getItem('highScore') || '0'),
  difficulty: null,
};

const QuizContext = createContext<{
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
}>({ state: initialState, dispatch: () => null });

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.payload,
        userAnswers: new Array(action.payload.length).fill({ 
          question: '',
          userAnswer: null,
          correctAnswer: '',
          isCorrect: false
        })
      };
    case 'SET_ANSWER':
      const updatedAnswers = [...state.userAnswers];
      updatedAnswers[state.currentQuestionIndex] = {
        question: state.questions[state.currentQuestionIndex].question,
        userAnswer: action.payload.answer,
        correctAnswer: state.questions[state.currentQuestionIndex].correct_answer,
        isCorrect: action.payload.answer === state.questions[state.currentQuestionIndex].correct_answer
      };
      // Only update score for completed questions (not skipped)
      const newScore = updatedAnswers.filter(answer => answer.userAnswer !== null && answer.isCorrect).length;
      return {
        ...state,
        userAnswers: updatedAnswers,
        score: newScore
      };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1),
        timeRemaining: 30
      };
    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
        timeRemaining: 30
      };
    case 'SKIP_QUESTION':
      const skippedAnswers = [...state.userAnswers];
      skippedAnswers[state.currentQuestionIndex] = {
        question: state.questions[state.currentQuestionIndex].question,
        userAnswer: null,
        correctAnswer: state.questions[state.currentQuestionIndex].correct_answer,
        isCorrect: false
      };
      return {
        ...state,
        userAnswers: skippedAnswers,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1),
        timeRemaining: 30
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'SET_TIME':
      return {
        ...state,
        timeRemaining: action.payload
      };
    case 'RESET_QUIZ':
      return {
        ...initialState,
        highScore: state.highScore
      };
    case 'SET_DIFFICULTY':
      return {
        ...state,
        difficulty: action.payload
      };
    case 'UPDATE_HIGH_SCORE':
      return {
        ...state,
        highScore: action.payload
      };
    default:
      return state;
  }
};

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.score > state.highScore) {
      localStorage.setItem('highScore', state.score.toString());
      dispatch({ type: 'UPDATE_HIGH_SCORE', payload: state.score });
    }
  }, [state.score, state.highScore]);

  // Handle offline status
  useEffect(() => {
    const handleOffline = () => {
      dispatch({ type: 'SET_ERROR', payload: 'No internet connection. Using fallback questions.' });
    };

    const handleOnline = () => {
      dispatch({ type: 'SET_ERROR', payload: null });
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Handle page refresh/unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.currentQuestionIndex > 0 && state.currentQuestionIndex < state.questions.length) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.currentQuestionIndex, state.questions.length]);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
