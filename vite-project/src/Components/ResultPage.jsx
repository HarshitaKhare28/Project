import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import './ResultPage.css';

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, correctAnswers, totalQuestions } = location.state;
    const selectedOptions = JSON.parse(localStorage.getItem('selectedOptions')) || {};

    const questions = JSON.parse(localStorage.getItem('questions')) || [];

    const handleRestart = () => {
        localStorage.removeItem('selectedOptions');
        navigate('/feedback');
    };

    return (
        <div className="min-h-screen bg-blue-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-4xl">
                <h1 className="text-3xl font-bold text-blue-700 mb-6">Test Results</h1>
                <p className="text-lg mb-4">Score: {score}</p>
                <p className="text-lg mb-6">Correct Answers: {correctAnswers} / {totalQuestions}</p>
                <div className="space-y-4">
                    {questions.map((question, index) => (
                        <div key={question.id} className="bg-gray-100 p-4 rounded-lg shadow">
                            <p className="font-bold">{index + 1}. {question.text}</p>
                            <ul className="ml-4 mt-2">
                                {question.options.map((option, i) => (
                                    <li key={i} className={`list-disc ${selectedOptions[question.id] === option ? 'text-blue-700' : ''}`}>
                                        {option}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-2">Correct Answer: {question.correctAnswer}</p>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleRestart}
                    className="mt-6 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                    Another Feedback
                </button>
            </div>
        </div>
    );
};

export default ResultPage;
