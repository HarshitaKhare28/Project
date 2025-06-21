import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../data/questions2.json';
import useTimer from '../hooks/useTimer';
// import './InterestAptitudeTest.css';

const InterestAptitudeTest = () => {
    const [questions, setQuestions] = useState(
        JSON.parse(localStorage.getItem('questions')) || data.questions
    );
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState(
        JSON.parse(localStorage.getItem('selectedOptions')) || {}
    );
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const currentQuestion = questions[currentQuestionIndex];
    const totalMinutes = questions.length;

    const { minutes, seconds, isTimeUp } = useTimer(totalMinutes);
    useEffect(() => {
        console.log(typeof (questions))
        console.log(questions)
    }, [])

    useEffect(() => {
        localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
    }, [selectedOptions]);

    useEffect(() => {
        if (isTimeUp) {
            handleSubmit();
        }
    }, [isTimeUp]);

    const handleOptionChange = (option) => {
        setSelectedOptions({
            ...selectedOptions,
            [currentQuestion.id]: option,
        });
    };

    const handleNextClick = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleQuestionClick = (index) => {
        setCurrentQuestionIndex(index);
    };

    const handleSubmit = () => {
        let score = 0;
        let correctAnswers = 0;

        questions.forEach((question) => {
            if (selectedOptions[question.id] === question.correctAnswer) {
                score += 1;
                correctAnswers += 1;
            }
        });

        setIsSubmitted(true);
        navigate('/result', { state: { score, correctAnswers, totalQuestions: questions.length } });
    };

    if (isSubmitted) {
        return null;
    }

    return (
        <div className="min-h-screen min-w-screen bg-blue-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl h-full">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-700">Interest | Aptitude Test</h1>
                        <p className="mt-4 text-lg text-gray-700">Q{currentQuestion.id}. {currentQuestion.text}</p>
                    </div>
                    <div className="text-lg text-gray-700">
                        <div className="inline h-6 w-6 text-blue-700 mr-2">
                            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                        </div>
                    </div>
                </div>
                <div className="flex space-x-12 h-full">
                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-4">
                            {currentQuestion.options.map((option, index) => (
                                <label key={index} className="block p-4 border rounded-lg cursor-pointer hover:bg-blue-50">
                                    <input
                                        type="radio"
                                        name={`question-${currentQuestion.id}`}
                                        value={option}
                                        className="mr-2"
                                        checked={selectedOptions[currentQuestion.id] === option}
                                        onChange={() => handleOptionChange(option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleNextClick}
                                className="mt-6 bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700"
                            >
                                Next
                            </button>
                            {currentQuestionIndex === questions.length - 1 && (
                                <button
                                    onClick={handleSubmit}
                                    className="mt-6 bg-green-600 text-white py-2 px-4 rounded w-full hover:bg-green-700"
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex-none">
                        <div className="text-lg text-gray-700 mb-4">Question Lists</div>
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: questions.length }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleQuestionClick(i)}
                                    className={`py-2 px-4 rounded ${selectedOptions[questions[i].id] ? 'bg-blue-200' : 'bg-gray-200'
                                        } hover:bg-blue-300`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterestAptitudeTest;
