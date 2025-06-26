import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [serverResults, setServerResults] = useState([]);
  const [error, setError] = useState(null);

  const {
    questions = [],
    selectedOptions = {},
    score = 0,
    correctAnswers = 0,
    totalQuestions = 0,
    testId,
  } = location.state || {};

  useEffect(() => {
    const fetchResults = async () => {
      if (!testId) {
        console.log('No testId provided, using client-side results');
        return;
      }
      try {
        const userId = localStorage.getItem('userId');
        console.log('Fetching results for User ID:', userId, 'Test ID:', testId);
        const response = await axios.get(`http://localhost:7000/api/test/response?testId=${testId}&userId=${userId}`);
        console.log('Server Results:', response.data);
        setServerResults(response.data);
      } catch (err) {
        console.error('Error fetching results:', err.response?.data || err.message);
        setError('Failed to load server results, showing client-side data');
      }
    };
    fetchResults();
  }, [testId]);
  const results = serverResults.length > 0
    ? serverResults.map(r => ({
        questionId: r.question.questionId,
        questionText: r.question.questionText,
        selectedOption: r.selectedOption,
        correctOption: r.question.correctOption,
        options: [r.question.optionA, r.question.optionB, r.question.optionC, r.question.optionD].filter(Boolean)
      }))
    : questions.map(q => ({
        questionId: q.questionId,
        questionText: q.questionText,
        selectedOption: selectedOptions[q.questionId],
        correctOption: q.correctAnswer,
        options: q.options
      }));

  if (error && !results.length) {
    return <div className="text-red-600 text-center p-8">{error}</div>;
  }

  if (!results.length) {
    return <div className="text-center p-8">No results available</div>;
  }

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Test Results</h1>
        <p className="text-xl text-gray-700 mb-4">Score: {score}/{totalQuestions}</p>
        <p className="text-xl text-gray-700 mb-8">Correct Answers: {correctAnswers}</p>

        {error && <p className="text-yellow-600 mb-4">{error}</p>}
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result, index) => {
              const questionId = result.questionId.toString();
              const userAnswerLetter = result.selectedOption;
              const correctAnswerLetter = result.correctOption;

              const userAnswerOption = userAnswerLetter
                ? result.options[parseInt(userAnswerLetter.charCodeAt(0) - 65)]
                : null;
              const correctAnswerOption = correctAnswerLetter
                ? result.options[parseInt(correctAnswerLetter.charCodeAt(0) - 65)]
                : null;

              return (
                <div key={questionId} className="p-4 border rounded-lg bg-gray-100">
                  <p className="font-bold mb-2">
                    {index + 1}. {result.questionText || 'No question text'}
                  </p>
                  <ul className="list-disc ml-4">
                    {result.options.map((option, i) => {
                      let colorClass = 'text-black';

                      if (correctAnswerOption === option) {
                        colorClass = 'text-green-600 font-semibold';
                      } else if (userAnswerOption === option && userAnswerOption !== correctAnswerOption) {
                        colorClass = 'text-red-600';
                      }

                      return (
                        <li
                          key={`${questionId}-opt-${i}`}
                          className={colorClass}
                        >
                          {option}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600">No questions available to display.</p>
        )}

        <button
          onClick={() => navigate('/test')}
          className="mt-8 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Take Another Test
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('userId');
            navigate('/');
          }}
          className="mt-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 ml-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Result;