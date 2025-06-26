import React, { useState, useEffect } from 'react';
import {
    getAllQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion
} from '../services/questionservice.js';
import {
    getAllSubjects,
    createSubject
} from '../services/subjectservice.js';

const AdminPage = () => {
    const [questions, setQuestions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(() => {
        return localStorage.getItem('lastSelectedSubjectId') || '';
    });
    const [newSubjectName, setNewSubjectName] = useState('');
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const subjectResponse = await getAllSubjects();
                const allSubjects = subjectResponse.data;
                setSubjects(allSubjects);

                if (allSubjects.length > 0 && !selectedSubjectId) {
                    const defaultSubjectId = allSubjects[0].subjectId;
                    setSelectedSubjectId(defaultSubjectId);
                    localStorage.setItem('lastSelectedSubjectId', defaultSubjectId);
                }

                await fetchQuestions(allSubjects);
                setError(null);
            } catch (err) {
                setError('Failed to load data. Please try again.');
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchQuestions = async (loadedSubjects = subjects) => {
        try {
            const response = await getAllQuestions();
            const questionsWithSubjects = response.data.map(q => {
                const subjectObj = typeof q.subject === 'object' ? q.subject : loadedSubjects.find(s => s.subjectId === q.subject);
                return {
                    ...q,
                    subject: subjectObj || { subjectId: q.subject, name: 'N/A' }
                };
            });
            setQuestions(questionsWithSubjects);
        } catch (error) {
            console.error('Error fetching questions:', error);
            throw error;
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

    const handleAddSubject = async () => {
        if (!newSubjectName.trim()) {
            setError('Subject name cannot be empty');
            return;
        }

        try {
            const response = await createSubject({ name: newSubjectName });
            const updatedSubjects = [...subjects, response.data];
            setSubjects(updatedSubjects);
            setSelectedSubjectId(response.data.subjectId);
            localStorage.setItem('lastSelectedSubjectId', response.data.subjectId);
            setNewSubjectName('');
            setError(null);
        } catch (error) {
            console.error('Error creating subject:', error);
            setError('Failed to create subject. Please try again.');
        }
    };

    const handleAddQuestion = async () => {
        if (!newQuestion.text.trim() || !selectedSubjectId) {
            setError('Question text and subject are required');
            return;
        }
        try {
            const questionPayload = {
                questionText: newQuestion.text,
                optionA: newQuestion.options[0],
                optionB: newQuestion.options[1],
                optionC: newQuestion.options[2],
                optionD: newQuestion.options[3],
                correctOption: newQuestion.correctAnswer,
                subject: { subjectId: selectedSubjectId }
            };
            const response = await createQuestion(questionPayload);
            if (response.status === 200||response.status ===201) {
                console.log('Question added successfully');
                await fetchQuestions(subjects);
                setNewQuestion({
                    text: '',
                    options: ['', '', '', ''],
                    correctAnswer: '',
                });
                setError(null);
            } else {
                throw new Error('Unexpected response from server');
            }
        } catch (error) {
            console.error('Error adding question:', error.response?.data || error.message);
            setError('Failed to add question. Please check logs or refresh.');
            await fetchQuestions(subjects); // fallback
        }
    };

    const handleEditQuestion = (question) => {
        setNewQuestion({
            text: question.questionText,
            options: [question.optionA, question.optionB, question.optionC, question.optionD],
            correctAnswer: question.correctOption
        });
        console.log("Selected Subject ID for update:", selectedSubjectId);
        const subjectId = question.subject ? question.subject.subjectId : question.subject_id;
        if (subjectId) {
            setSelectedSubjectId(subjectId);
            localStorage.setItem('lastSelectedSubjectId', subjectId);
        }
        setEditingQuestionId(question.questionId);
        setEditMode(true);
        setError(null);
    };

    const handleUpdateQuestion = async () => {
        if (!newQuestion.text.trim() || !selectedSubjectId) {
            setError('Question text and subject are required');
            return;
        }
        try {
            const updatedPayload = {
                questionText: newQuestion.text,
                optionA: newQuestion.options[0],
                optionB: newQuestion.options[1],
                optionC: newQuestion.options[2],
                optionD: newQuestion.options[3],
                correctOption: newQuestion.correctAnswer,
                subject: { subjectId: selectedSubjectId }
                // Do not include responses to avoid overwriting
            };
            console.log('Updating question with payload:', updatedPayload); // Debug log
            await updateQuestion(editingQuestionId, updatedPayload);
            await fetchQuestions(subjects);
            setNewQuestion({
                text: '',
                options: ['', '', '', ''],
                correctAnswer: '',
            });
            setEditMode(false);
            setEditingQuestionId(null);
            setError(null);
        } catch (error) {
            const backendError = error.response?.data?.error || 'Failed to update question. Please try again.';
            console.error('Update error:', error); // Debug log
            setError(backendError);
        }
    };

    const handleDeleteQuestion = async (id) => {
        try {
            await deleteQuestion(id);
            setQuestions(questions.filter((q) => q.questionId !== id));
            setError(null);
        } catch (error) {
            console.error('Error deleting question:', error);
            setError('Failed to delete question. Please try again.');
        }
    };

    const saveTimerDuration = () => {
            localStorage.setItem('testTimer', timerDuration);
            alert("Timer duration saved successfully!");
            };

    const getSubjectName = (question) => {
        if (question.subject && typeof question.subject === 'object' && question.subject.name) {
            return question.subject.name;
        }
        const subjectId = typeof question.subject === 'object' ? question.subject?.subjectId : question.subject;
        const subject = subjects.find(s => s.subjectId === subjectId);
        return subject ? subject.name : 'N/A';
    };

    const cancelEdit = () => {
        setNewQuestion({
            text: '',
            options: ['', '', '', ''],
            correctAnswer: '',
        });
        setEditMode(false);
        setEditingQuestionId(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-6xl">
                <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Page</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="mt-2">Loading data...</p>
                    </div>
                ) : (
                    <>
                        {/* Subject creation */}
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-blue-700 mb-2">Create New Subject</h2>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    value={newSubjectName}
                                    onChange={(e) => setNewSubjectName(e.target.value)}
                                    placeholder="Enter subject name"
                                    className="w-full p-2 border rounded"
                                />
                                <button
                                    onClick={handleAddSubject}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Add Subject
                                </button>
                            </div>
                        </div>

                        {/* Question form */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-blue-700 mb-4">Add/Edit Question</h2>
                            <div className="space-y-4">
                                <select
                                    value={selectedSubjectId}
                                    onChange={(e) => {
                                        const newSubjectId = e.target.value;
                                        setSelectedSubjectId(newSubjectId);
                                        localStorage.setItem('lastSelectedSubjectId', newSubjectId);
                                    }}
                                    className="w-full p-2 border rounded"
                                    disabled={subjects.length === 0}
                                >
                                    {subjects.length === 0 ? (
                                        <option value="">No subjects available</option>
                                    ) : (
                                        subjects.map((subj) => (
                                            <option key={subj.subjectId} value={subj.subjectId}>
                                                {subj.name}
                                            </option>
                                        ))
                                    )}
                                </select>
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
                                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                                        className="w-full p-2 border rounded"
                                    />
                                ))}
                                <select
                                    name="correctAnswer"
                                    value={newQuestion.correctAnswer}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select correct answer</option>
                                    {newQuestion.options.map((_, index) => (
                                        <option key={index} value={String.fromCharCode(65 + index)}>
                                            {String.fromCharCode(65 + index)}
                                        </option>
                                    ))}
                                </select>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={editMode ? handleUpdateQuestion : handleAddQuestion}
                                        disabled={subjects.length === 0}
                                        className={`py-2 px-4 rounded ${subjects.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                                    >
                                        {editMode ? 'Update Question' : 'Add Question'}
                                    </button>
                                    {editMode && (
                                        <button
                                            onClick={cancelEdit}
                                            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Timer input */}
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
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Save Timer
                        </button>
                        </div>
                        </div>

                        {/* Questions list */}
                        <div>
                            <h2 className="text-2xl font-bold text-blue-700 mb-4">Questions List</h2>
                            {questions.length === 0 ? (
                                <p className="text-gray-500">No questions available</p>
                            ) : (
                                <div className="space-y-4">
                                    {questions.map((question, index) => (
                                        <div key={question.questionId} className="bg-gray-50 p-4 rounded-lg shadow">
                                            <p className="font-bold">{index + 1}. {question.questionText}</p>
                                            <ul className="ml-4 mt-2 list-disc">
                                                <li className={question.correctOption === 'A' ? 'text-green-600 font-medium' : ''}>
                                                    A: {question.optionA}
                                                </li>
                                                <li className={question.correctOption === 'B' ? 'text-green-600 font-medium' : ''}>
                                                    B: {question.optionB}
                                                </li>
                                                <li className={question.correctOption === 'C' ? 'text-green-600 font-medium' : ''}>
                                                    C: {question.optionC}
                                                </li>
                                                <li className={question.correctOption === 'D' ? 'text-green-600 font-medium' : ''}>
                                                    D: {question.optionD}
                                                </li>
                                            </ul>
                                            <div className="mt-2 flex justify-between items-center">
                                                <div>
                                                    <span className="text-sm text-gray-500">
                                                        Subject: {getSubjectName(question)}
                                                    </span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditQuestion(question)}
                                                        className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteQuestion(question.questionId)}
                                                        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
