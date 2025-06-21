import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Default to empty data in case location.state is undefined
    const {
        questions = [],
        selectedOptions = {},
        score = 0,
        correctAnswers = 0,
        totalQuestions = 0,
    } = location.state || {}; // Use empty object if state is undefined

    return (
        <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-blue-700 mb-6">Test Results</h1>
                <p className="text-xl text-gray-700 mb-4">Score: {score}/{totalQuestions}</p>
                <p className="text-xl text-gray-700 mb-8">Correct Answers: {correctAnswers}</p>

                {questions.length > 0 ? (
                    <div className="space-y-4">
                        {questions.map((question, index) => (
                            <div key={question.id} className="p-4 border rounded-lg bg-gray-100">
                                <p className="font-bold">{question.text}</p>
                                <ul className="list-disc ml-4">
                                    {question.options.map((option, i) => (
                                        <li
                                            key={i}
                                            className={`${option === question.correctAnswer ? 'text-green-500' : ''
                                                } ${selectedOptions[question.id] === option && option !== question.correctAnswer
                                                    ? 'text-red-500'
                                                    : ''
                                                }`}
                                        >
                                            {option} {selectedOptions[question.id] === option ? '(Your Answer)' : ''}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No questions available to display.</p>
                )}

                <button
                    onClick={() => navigate('/')}
                    className="mt-8 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                    Restart Test
                </button>
            </div>
        </div>
    );
};

export default Result;
