import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTimer from '../hooks/useTimer2';
// import './InterestAptitudeTest.css';

const InterestAptitudeTest = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [quesnum, setQuesNum] = useState(0);
    const [totalMinutes, setTotalMinutes] = useState(1);
    const navigate = useNavigate();

    // const totalMinutes = 10;
    // const { minutes, seconds, isTimeUp } = useTimer(totalMinutes);
    const { minutes, seconds, isTimeUp, resetTimer, startTimer } = useTimer(totalMinutes);

    // Fetch questions from API when the component mounts
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('http://localhost:7000/api/questions'); // Fetch questions from API
                const data = await response.json();
                console.log(data);
                setQuestions(data);
                // setTotalMinutes(questions.length)
                if (data && data.length > 0) {
                    const calculatedMinutes = data.length; // 1 minute per question
                    setTotalMinutes(calculatedMinutes);
                }

            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, []);
    useEffect(() => {
        if (totalMinutes > 0) {
            resetTimer(); // Reset timer whenever total minutes change
            startTimer(); // Start the timer
        }
    }, [totalMinutes]);
    // useEffect(() => {
    //     setTotalMinutes(questions.length)
    // }, [questions])

    useEffect(() => {
        if (isTimeUp) {
            handleSubmit();
        }
    }, [isTimeUp]);

    const currentQuestion = questions[currentQuestionIndex];

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

    useEffect(() => {
        setQuesNum(quesnum + 1);

    }, [currentQuestion])

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
        navigate('/result2', { state: { questions, selectedOptions, score, correctAnswers, totalQuestions: questions.length } });
    };

    if (!questions.length) {
        return <div>Loading questions...</div>;
    }

    return (
        <div className="min-h-screen min-w-screen bg-blue-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl h-full">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-700">Interest | Aptitude Test</h1>
                        <p className="mt-4 text-lg text-gray-700">{currentQuestion.text}</p>
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
                                    className={`p-2 rounded-full border ${currentQuestionIndex === i ? 'bg-blue-500 text-white' : 'bg-white'
                                        }`}
                                    onClick={() => setCurrentQuestionIndex(i)}
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
