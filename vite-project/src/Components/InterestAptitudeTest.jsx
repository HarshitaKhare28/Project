
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTimer from '../hooks/useTimer2';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const InterestAptitudeTest = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [totalMinutes, setTotalMinutes] = useState(1);
    const [error, setError] = useState(null);

    const { minutes, seconds, isTimeUp, resetTimer, startTimer } = useTimer(totalMinutes);
    const currentQuestion = questions[currentQuestionIndex] || {};

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/questions', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                if (!response.status === 200) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = response.data;
                console.log('Fetched Questions:', data);

                const formattedQuestions = data.map((q) => ({
                    ...q,
                    questionId: q.questionId || q.id,
                    questionText: q.questionText || q.text,
                    options: [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean),
                    correctAnswer: q.correctOption || q.correctAnswer,
                }));

                if (formattedQuestions.length === 0) {
                    setError('No questions available.');
                    return;
                }

                setQuestions(formattedQuestions);
                const storedTimer = localStorage.getItem('testTimer');
                const minutesFromStorage = storedTimer ? parseInt(storedTimer) : formattedQuestions.length;
                setTotalMinutes(minutesFromStorage);
            } catch (error) {
                console.error('Error fetching questions:', error.response?.data || error.message);
                setError('Failed to load questions. Please try again.');
            }
        };

        // Test endpoint to verify /api/test/response accessibility
        const testEndpoint = async () => {
            try {
                const response = await axios.get('http://localhost:7000/api/test/response/test', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                console.log('Test Endpoint Response:', response.data);
            } catch (error) {
                console.error('Test Endpoint Error:', error.response?.data || error.message);
            }
        };

        fetchQuestions();
        testEndpoint();
    }, []);

    useEffect(() => {
        if (questions.length > 0 && totalMinutes > 0) {
            resetTimer();
            startTimer();
        }
    }, [totalMinutes, questions]);

    useEffect(() => {
        if (isTimeUp) handleSubmit();
    }, [isTimeUp]);

    const handleOptionChange = (option) => {
        if (!currentQuestion.options) return;

        const index = currentQuestion.options.indexOf(option);
        if (index === -1) return;

        const optionLetter = String.fromCharCode(65 + index);
        setSelectedOptions({
            ...selectedOptions,
            [currentQuestion.questionId]: optionLetter,
        });
    };

    const handleNextClick = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitted) return;

        setIsSubmitted(true);
        const userId = localStorage.getItem('userId');
        const testId = uuidv4();
        console.log('Submitting Test - User ID:', userId, 'Test ID:', testId, 'Selected Options:', selectedOptions);

        try {
            for (const [questionId, selectedOption] of Object.entries(selectedOptions)) {
                const payload = {
                    user: { userId: parseInt(userId) },
                    question: { questionId: parseInt(questionId) },
                    selectedOption,
                    testId
                };
                console.log('Sending Response Payload:', JSON.stringify(payload, null, 2));
                const response = await axios.post('http://localhost:7000/api/test/response', payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                console.log('Response from Server:', response.data);
            }
        } catch (error) {
            console.error('Error submitting responses:', error.response?.data || error.message);
            setError(`Failed to submit responses to server: ${error.response?.data?.error || error.message}`);
            setIsSubmitted(false);
            return;
        }

        let score = 0;
        let correctAnswers = 0;

        questions.forEach((q) => {
            if (selectedOptions[q.questionId] === q.correctAnswer) {
                score += 1;
                correctAnswers += 1;
            }
        });

        navigate('/result2', {
            state: {
                questions,
                selectedOptions,
                score,
                correctAnswers,
                totalQuestions: questions.length,
                testId
            },
        });
    };

    if (error) return <div className="text-red-600 text-center p-8">{error}</div>;
    if (!questions.length) return <div className="text-center p-8">Loading questions...</div>;

    return (
        <div className="min-h-screen min-w-screen bg-blue-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl h-full">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-700">Interest | Aptitude Test</h1>
                        <p className="mt-4 text-lg text-gray-700">{currentQuestion.questionText || 'No question text'}</p>
                        <p className="text-sm text-gray-600 mt-2">
                            Total Time: {totalMinutes} minute{totalMinutes > 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="text-lg text-gray-700 font-semibold">
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </div>
                </div>

                <div className="flex space-x-12 h-full">
                    <div className="flex-1 overflow-y-auto">
                        <div className="space-y-4">
                            {Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 ? (
                                currentQuestion.options.map((option, index) => (
                                    <label key={index} className="block p-4 border rounded-lg cursor-pointer hover:bg-blue-50">
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestion.questionId}`}
                                            value={String.fromCharCode(65 + index)}
                                            className="mr-2"
                                            checked={selectedOptions[currentQuestion.questionId] === String.fromCharCode(65 + index)}
                                            onChange={() => handleOptionChange(option)}
                                            disabled={isSubmitted}
                                        />
                                        {option}
                                    </label>
                                ))
                            ) : (
                                <p className="text-red-600">No options available.</p>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            {currentQuestionIndex < questions.length - 1 && (
                                <button
                                    onClick={handleNextClick}
                                    className="mt-6 bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700"
                                    disabled={isSubmitted}
                                >
                                    Next
                                </button>
                            )}
                            {currentQuestionIndex === questions.length - 1 && (
                                <button
                                    onClick={handleSubmit}
                                    className="mt-6 bg-green-600 text-white py-2 px-4 rounded w-full hover:bg-green-700"
                                    disabled={isSubmitted}
                                >
                                    Submit
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-none">
                        <div className="text-lg text-gray-700 mb-4">Question List</div>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((_, i) => (
                                <button
                                    key={i}
                                    className={`p-2 rounded-full border ${currentQuestionIndex === i ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                    onClick={() => setCurrentQuestionIndex(i)}
                                    disabled={isSubmitted}
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
