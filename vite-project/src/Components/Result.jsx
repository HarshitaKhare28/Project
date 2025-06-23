import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {
        questions = [],
        selectedOptions = {},
        score = 0,
        correctAnswers = 0,
        totalQuestions = 0,
    } = location.state || {};

    
    console.log('Location State:', location.state);
    questions.forEach((question, index) => {
        console.log(`Question ${index + 1} Details:`, {
            questionId: question.questionId,
            questionText: question.questionText,
            options: question.options,
            correctAnswer: question.correctAnswer,
            userAnswerLetter: selectedOptions[question.questionId.toString()],
        });
    });

    return (
        <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-blue-700 mb-6">Test Results</h1>
                <p className="text-xl text-gray-700 mb-4">Score: {score}/{totalQuestions}</p>
                <p className="text-xl text-gray-700 mb-8">Correct Answers: {correctAnswers}</p>

                {questions.length > 0 ? (
                    <div className="space-y-4">
                        {questions.map((question, index) => {
                            const questionId = question.questionId.toString();
                            const userAnswerLetter = selectedOptions[questionId];
                            const correctAnswerLetter = question.correctAnswer;

                            const userAnswerOption = userAnswerLetter 
                                ? question.options[parseInt(userAnswerLetter.charCodeAt(0) - 65)] 
                                : null;
                            const correctAnswerOption = correctAnswerLetter 
                                ? question.options[parseInt(correctAnswerLetter.charCodeAt(0) - 65)] 
                                : null;

                            
                            console.log(`Rendering Question ${index + 1}:`, {
                                questionId,
                                userAnswerLetter,
                                userAnswerOption,
                                correctAnswerLetter,
                                correctAnswerOption,
                                options: question.options,
                            });

                            return (
                                <div key={questionId} className="p-4 border rounded-lg bg-gray-100">
                                    <p className="font-bold mb-2">
                                        {index + 1}. {question.questionText || 'No question text'}
                                    </p>
                                    <ul className="list-disc ml-4">
                                        {question.options.map((option, i) => {
                                            let colorClass = "text-black";

                                            if (correctAnswerOption === option) {
                                                colorClass = "text-green-600 font-semibold";
                                            }

                                            else if (userAnswerOption === option && userAnswerOption !== correctAnswerOption) {
                                                colorClass = "text-red-600";
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