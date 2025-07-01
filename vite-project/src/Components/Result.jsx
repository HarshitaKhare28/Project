import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [serverResults, setServerResults] = useState([]);
  const [weightedScore, setWeightedScore] = useState(null);
  const [error, setError] = useState(null);

  const [questionsWithMarks, setQuestionsWithMarks] = useState([]);
  const [clientScore, setClientScore] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);

  const {
    selectedOptions = {},
    testId,
  } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        console.log('Fetching data for User ID:', userId, 'Test ID:', testId);

        // Fetch server results (user answers)
        const response = await axios.get(
          `http://localhost:7000/api/test/response?testId=${testId}&userId=${userId}`
        );
        console.log('Server Results:', response.data);
        setServerResults(response.data);

        // Fetch weighted score from backend
        const scoreResponse = await axios.get(
          `http://localhost:7000/api/scores/${userId}/${testId}`
        );
        console.log('Weighted Score:', scoreResponse.data);
        setWeightedScore(scoreResponse.data);

        // Fetch questions with marks
        const questionsResponse = await axios.get('http://localhost:7000/api/questions');
        console.log('Questions with marks:', questionsResponse.data);
        setQuestionsWithMarks(questionsResponse.data);

        // Compute client-side score
        let correctMarks = 0;
        let total = 0;
        questionsResponse.data.forEach((q) => {
          const selected = selectedOptions[q.questionId];
          if (selected && selected === q.correctOption) {
            correctMarks += q.marks || 0;
          }
          total += q.marks || 0;
        });
        setClientScore(correctMarks);
        setTotalMarks(total);
        console.log('Client-side correct marks:', correctMarks, 'Total marks:', total);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load some data, showing partial data');
      }
    };

    fetchData();
  }, [testId, selectedOptions]);

  const results = serverResults.length > 0
    ? serverResults.map(r => ({
        questionId: r.question.questionId,
        questionText: r.question.questionText,
        selectedOption: r.selectedOption,
        correctOption: r.question.correctOption,
        options: [
          r.question.optionA,
          r.question.optionB,
          r.question.optionC,
          r.question.optionD,
        ].filter(Boolean),
      }))
    : questionsWithMarks.map(q => ({
        questionId: q.questionId,
        questionText: q.questionText,
        selectedOption: selectedOptions[q.questionId],
        correctOption: q.correctOption,
        options: [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean),
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

        <p className="text-xl text-gray-700 mb-2">
          Client Score: {clientScore.toFixed(2)*100} / {totalMarks.toFixed(2)*100}
        </p>

        {weightedScore !== null && (
          <p className="text-xl text-green-700 mb-2">
            Weighted Score from backend: {weightedScore.toFixed(2)}
          </p>
        )}

        {error && <p className="text-yellow-600 mb-4">{error}</p>}

        <div className="space-y-4">
          {results.map((result, index) => {
            const questionId = result.questionId.toString();
            const userAnswerLetter = result.selectedOption;
            const correctAnswerLetter = result.correctOption;

            const userAnswerOption = userAnswerLetter
              ? result.options[userAnswerLetter.charCodeAt(0) - 65]
              : null;
            const correctAnswerOption = correctAnswerLetter
              ? result.options[correctAnswerLetter.charCodeAt(0) - 65]
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
                    } else if (
                      userAnswerOption === option &&
                      userAnswerOption !== correctAnswerOption
                    ) {
                      colorClass = 'text-red-600';
                    }
                    return (
                      <li key={`${questionId}-opt-${i}`} className={colorClass}>
                        {option}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

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
