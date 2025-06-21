import React, { useState, useEffect } from 'react';
import {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} from '../services/questionservice.js';

const AdminPage = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: '',
    });
    const [editMode, setEditMode] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [timerDuration, setTimerDuration] = useState(() => {
        return localStorage.getItem('testTimer') || 7; 
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await getAllQuestions();
            setQuestions(response.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewQuestion({ ...newQuestion, [name]: value });
    };

    const handleOptionChange = (index, value) => {
        const options = [...newQuestion.options];
        options[index] = value;
        setNewQuestion({ ...newQuestion, options });
    };

    const handleAddQuestion = async () => {
        try {
            const response = await createQuestion(newQuestion);
            setQuestions([...questions, response.data]);
            setNewQuestion({
                text: '',
                options: ['', '', '', ''],
                correctAnswer: '',
            });
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    const handleEditQuestion = (index) => {
        const question = questions[index];
        setNewQuestion(question);
        setEditingQuestionId(question.id);
        setEditMode(true);
    };

    const handleUpdateQuestion = async () => {
        try {
            await updateQuestion(editingQuestionId, newQuestion);
            const updatedQuestions = questions.map((q) =>
                q.id === editingQuestionId ? newQuestion : q
            );
            setQuestions(updatedQuestions);
            setNewQuestion({
                text: '',
                options: ['', '', '', ''],
                correctAnswer: '',
            });
            setEditMode(false);
            setEditingQuestionId(null);
        } catch (error) {
            console.error('Error updating question:', error);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await deleteQuestion(id);
            setQuestions(questions.filter((q) => q.id !== id));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    const saveTimerDuration = () => {
        localStorage.setItem('testTimer', timerDuration);
        alert("Timer duration saved successfully!");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl">
                <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Page</h1>

                {/* Add/Edit Question Section */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-blue-700 mb-4">Add/Edit Question</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="text"
                            value={newQuestion.text}
                            onChange={handleInputChange}
                            placeholder="Question text"
                            className="w-full p-2 border rounded"
                        />
                        {newQuestion.options.map((option, index) => (
                            <input
                                key={index}
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="w-full p-2 border rounded"
                            />
                        ))}
                        <input
                            type="text"
                            name="correctAnswer"
                            value={newQuestion.correctAnswer}
                            onChange={handleInputChange}
                            placeholder="Correct answer"
                            className="w-full p-2 border rounded"
                        />
                        <div className="flex space-x-4">
                            <button
                                onClick={editMode ? handleUpdateQuestion : handleAddQuestion}
                                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                            >
                                {editMode ? 'Update' : 'Add'}
                            </button>
                            {editMode && (
                                <button
                                    onClick={() => {
                                        setNewQuestion({
                                            text: '',
                                            options: ['', '', '', ''],
                                            correctAnswer: '',
                                        });
                                        setEditMode(false);
                                        setEditingQuestionId(null);
                                    }}
                                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Timer Setup Section */}
                <div className="mt-8 mb-6">
                    <h2 className="text-xl font-semibold text-blue-700 mb-2">Set Test Timer Duration (in minutes)</h2>
                    <div className="flex items-center space-x-4">
                        <input
                            type="number"
                            value={timerDuration}
                            onChange={(e) => setTimerDuration(e.target.value)}
                            className="border rounded p-2 w-24"
                            min="1"
                        />
                        <button
                            onClick={saveTimerDuration}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Save Timer
                        </button>
                    </div>
                </div>

                {/* Questions List */}
                <div>
                    <h2 className="text-2xl font-bold text-blue-700 mb-4">Questions List</h2>
                    <div className="space-y-4">
                        {questions.map((question, index) => (
                            <div key={question.id} className="bg-gray-100 p-4 rounded-lg shadow">
                                <p className="font-bold">{index + 1}. {question.text}</p>
                                <ul className="ml-4 mt-2 list-disc">
                                    {question.options.map((option, i) => (
                                        <li key={i}>{option}</li>
                                    ))}
                                </ul>
                                <p className="mt-2">Correct Answer: {question.correctAnswer}</p>
                                <div className="mt-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEditQuestion(index)}
                                        className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuestion(question.id)}
                                        className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
