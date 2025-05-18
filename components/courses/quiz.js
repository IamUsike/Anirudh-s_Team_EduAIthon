"use client";
import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function Quiz({ questions, onComplete, passingScore = 70 }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const calculateScore = () => {
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach((question, index) => {
      totalPoints += question.points;

      if (question.type === "multiple-choice") {
        const correctOptionIndex = question.options.findIndex(
          (opt) => opt.isCorrect,
        );
        if (selectedAnswers[index] === correctOptionIndex) {
          earnedPoints += question.points;
        }
      } else if (selectedAnswers[index] === question.correctAnswer) {
        earnedPoints += question.points;
      }
    });

    const calculatedScore = Math.round((earnedPoints / totalPoints) * 100);
    setScore(calculatedScore);

    if (onComplete) {
      onComplete({
        score: calculatedScore,
        passed: calculatedScore >= passingScore,
        answers: selectedAnswers,
      });
    }
  };

  const isAnswerCorrect = (questionIndex) => {
    const question = questions[questionIndex];
    if (question.type === "multiple-choice") {
      const correctOptionIndex = question.options.findIndex(
        (opt) => opt.isCorrect,
      );
      return selectedAnswers[questionIndex] === correctOptionIndex;
    } else {
      return selectedAnswers[questionIndex] === question.correctAnswer;
    }
  };

  if (!currentQuestion) {
    return <div>No questions available.</div>;
  }

  if (showResults) {
    const passed = score >= passingScore;

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
          <div
            className={`text-4xl font-bold mb-4 ${passed ? "text-green-600" : "text-red-600"}`}
          >
            {score}%
          </div>

          <div className="flex justify-center items-center mb-4">
            {passed ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="mr-2" />
                <span className="font-medium">
                  You passed! ({score}% ≥ {passingScore}%)
                </span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <XCircle className="mr-2" />
                <span className="font-medium">
                  You didn't pass. ({score}% &lt; {passingScore}%)
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Question Summary</h3>

          {questions.map((question, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                isAnswerCorrect(index)
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start">
                <div className="mr-2 mt-1">
                  {isAnswerCorrect(index) ? (
                    <CheckCircle className="text-green-600 h-5 w-5" />
                  ) : (
                    <XCircle className="text-red-600 h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{question.text}</p>

                  {question.type === "multiple-choice" && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium">
                        Your answer:{" "}
                        {selectedAnswers[index] !== undefined
                          ? question.options[selectedAnswers[index]]?.text ||
                            "No answer"
                          : "No answer"}
                      </p>
                      <p className="font-medium text-green-600">
                        Correct answer:{" "}
                        {question.options.find((opt) => opt.isCorrect)?.text}
                      </p>
                    </div>
                  )}

                  {question.type !== "multiple-choice" && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium">
                        Your answer: {selectedAnswers[index] || "No answer"}
                      </p>
                      <p className="font-medium text-green-600">
                        Correct answer: {question.correctAnswer}
                      </p>
                    </div>
                  )}

                  {question.explanation && (
                    <div className="mt-2 text-sm bg-white p-2 rounded border border-gray-200">
                      <p className="font-medium">Explanation:</p>
                      <p>{question.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              setShowResults(false);
              setCurrentQuestionIndex(0);
              setSelectedAnswers({});
              setScore(0);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Retry Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
        <div className="text-sm text-gray-500">
          {Math.round((currentQuestionIndex / questions.length) * 100)}%
          Complete
        </div>
      </div>

      <div className="mb-4 w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{
            width: `${(currentQuestionIndex / questions.length) * 100}%`,
          }}
        ></div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>

        {currentQuestion.type === "multiple-choice" && (
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? "bg-blue-50 border-blue-300"
                    : "hover:bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 mr-3 rounded-full border flex items-center justify-center ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span>{option.text}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentQuestion.type === "true-false" && (
          <div className="space-y-2">
            <div
              onClick={() => handleAnswerSelect("true")}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswers[currentQuestionIndex] === "true"
                  ? "bg-blue-50 border-blue-300"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 mr-3 rounded-full border flex items-center justify-center ${
                    selectedAnswers[currentQuestionIndex] === "true"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAnswers[currentQuestionIndex] === "true" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span>True</span>
              </div>
            </div>

            <div
              onClick={() => handleAnswerSelect("false")}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswers[currentQuestionIndex] === "false"
                  ? "bg-blue-50 border-blue-300"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-5 h-5 mr-3 rounded-full border flex items-center justify-center ${
                    selectedAnswers[currentQuestionIndex] === "false"
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedAnswers[currentQuestionIndex] === "false" && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span>False</span>
              </div>
            </div>
          </div>
        )}

        {(currentQuestion.type === "short-answer" ||
          currentQuestion.type === "coding") && (
          <div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={currentQuestion.type === "coding" ? 8 : 4}
              placeholder={
                currentQuestion.type === "coding"
                  ? "Write your code here..."
                  : "Write your answer here..."
              }
              value={selectedAnswers[currentQuestionIndex] || ""}
              onChange={(e) => handleAnswerSelect(e.target.value)}
            />
          </div>
        )}
      </div>

      {showExplanation && currentQuestion.explanation && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="text-blue-600 mr-2 mt-0.5 h-5 w-5" />
            <div>
              <p className="font-medium text-blue-800">Explanation:</p>
              <p className="text-blue-800">{currentQuestion.explanation}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 border rounded-md ${
            currentQuestionIndex === 0
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {!showExplanation && currentQuestion.explanation && (
            <button
              onClick={() => setShowExplanation(true)}
              className="px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50"
            >
              Show Explanation
            </button>
          )}

          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswers[currentQuestionIndex] === undefined}
            className={`px-4 py-2 rounded-md ${
              selectedAnswers[currentQuestionIndex] === undefined
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
