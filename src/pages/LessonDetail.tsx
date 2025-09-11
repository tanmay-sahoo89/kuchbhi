import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Award, Book } from 'lucide-react';
import { useStudent } from '../contexts/StudentContext';

const LessonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allLessons, currentStudent, completeLesson } = useStudent();
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const lesson = allLessons.find(l => l.id === id);
  const isCompleted = lesson ? currentStudent.completedLessons.includes(lesson.id) : false;

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800">Lesson not found</h1>
        <button
          onClick={() => navigate('/lessons')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Lessons
        </button>
      </div>
    );
  }

  const handleNextSection = () => {
    if (currentSection < lesson.content.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleQuizAnswer = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newAnswers);

    if (selectedAnswer === lesson.quiz.questions[currentQuestion].correctAnswer) {
      setQuizScore(quizScore + 1);
    }

    setTimeout(() => {
      if (currentQuestion < lesson.quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        if (quizScore >= Math.ceil(lesson.quiz.questions.length * 0.7)) {
          completeLesson(lesson.id);
        }
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizScore(0);
    setUserAnswers([]);
  };

  if (showQuiz) {
    if (showResult) {
      const passed = quizScore >= Math.ceil(lesson.quiz.questions.length * 0.7);
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <div className="text-red-600 text-2xl">✗</div>
              )}
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              {passed ? '🎉 Congratulations!' : '😔 Not quite there'}
            </h2>
            
            <p className="text-xl text-gray-600 mb-6">
              You scored {quizScore} out of {lesson.quiz.questions.length}
            </p>
            
            {passed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <Award className="h-5 w-5" />
                  <span className="font-semibold">+{lesson.points} Eco Points Earned!</span>
                </div>
                <p className="text-green-600 text-sm mt-2">Lesson completed successfully!</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">
                  You need at least {Math.ceil(lesson.quiz.questions.length * 0.7)} correct answers to pass.
                </p>
              </div>
            )}
            
            <div className="flex space-x-4 justify-center">
              <button
                onClick={restartQuiz}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => navigate('/lessons')}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back to Lessons
              </button>
            </div>
          </div>
        </motion.div>
      );
    }

    const question = lesson.quiz.questions[currentQuestion];
    const hasAnswered = selectedAnswer !== null;
    const isCorrect = selectedAnswer === question.correctAnswer;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Quiz Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {lesson.quiz.questions.length}
              </span>
              <span className="text-sm font-medium text-green-600">
                Score: {quizScore}/{lesson.quiz.questions.length}
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-blue-600 rounded-full h-2"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / lesson.quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: hasAnswered ? 1 : 1.02 }}
                onClick={() => !hasAnswered && setSelectedAnswer(index)}
                disabled={hasAnswered}
                className={`w-full p-4 text-left rounded-lg border transition-all ${
                  hasAnswered
                    ? index === question.correctAnswer
                      ? 'bg-green-100 border-green-500 text-green-800'
                      : index === selectedAnswer
                      ? 'bg-red-100 border-red-500 text-red-800'
                      : 'bg-gray-50 border-gray-300 text-gray-600'
                    : selectedAnswer === index
                    ? 'bg-blue-100 border-blue-500 text-blue-800'
                    : 'bg-white border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <span className="flex items-center">
                  <span className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center text-sm font-semibold ${
                    hasAnswered && index === question.correctAnswer
                      ? 'border-green-500 bg-green-500 text-white'
                      : hasAnswered && index === selectedAnswer && index !== question.correctAnswer
                      ? 'border-red-500 bg-red-500 text-white'
                      : selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-400'
                  }`}>
                    {hasAnswered && index === question.correctAnswer ? '✓' :
                     hasAnswered && index === selectedAnswer && index !== question.correctAnswer ? '✗' :
                     String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          {hasAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg mb-6 ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <h4 className={`font-semibold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </h4>
              <p className="text-gray-700">{question.explanation}</p>
            </motion.div>
          )}

          {/* Next Button */}
          <button
            onClick={handleQuizAnswer}
            disabled={selectedAnswer === null}
            className={`w-full py-3 rounded-lg font-semibold ${
              selectedAnswer === null
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {currentQuestion < lesson.quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      </motion.div>
    );
  }

  const currentSectionData = lesson.content.sections[currentSection];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/lessons')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Lessons</span>
        </button>
        {isCompleted && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">Completed</span>
          </div>
        )}
      </div>

      {/* Lesson Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">{lesson.title}</h1>
          <div className="flex items-center space-x-2 text-green-600">
            <Award className="h-5 w-5" />
            <span className="font-semibold">{lesson.points} points</span>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{lesson.description}</p>
        
        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Section {currentSection + 1} of {lesson.content.sections.length}
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${((currentSection + 1) / lesson.content.sections.length) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{currentSectionData.title}</h2>
          
          {currentSectionData.imageUrl && (
            <img
              src={currentSectionData.imageUrl}
              alt={currentSectionData.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">{currentSectionData.content}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevSection}
          disabled={currentSection === 0}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold ${
            currentSection === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2 text-gray-600">
          <Book className="h-4 w-4" />
          <span className="text-sm">
            {currentSection + 1} / {lesson.content.sections.length} sections
          </span>
        </div>

        <button
          onClick={handleNextSection}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
        >
          <span>{currentSection === lesson.content.sections.length - 1 ? 'Take Quiz' : 'Next'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default LessonDetail;