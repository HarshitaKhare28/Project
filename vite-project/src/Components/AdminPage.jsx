import React, { useState, useEffect } from 'react';
import {
    getAllQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} from '../services/questionservice.js';
import {
    getAllSubjects,
    createSubject,
    updateSubject,
} from '../services/subjectservice.js';

const AdminPage = () => {
    const [questions, setQuestions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(() =>
        localStorage.getItem('lastSelectedSubjectId') || ''
    );
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectWeightage, setNewSubjectWeightage] = useState('');
    const [editingSubjectId, setEditingSubjectId] = useState(null);
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [timerDuration, setTimerDuration] = useState(() =>
        localStorage.getItem('testTimer') || 7
    );
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
            const questionsWithSubjects = response.data.map((q) => {
                const subjectObj =
                    typeof q.subject === 'object'
                        ? q.subject
                        : loadedSubjects.find((s) => s.subjectId === q.subject);
                return {
                    ...q,
                    subject: subjectObj || { subjectId: q.subject, name: 'N/A' },
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
            await createQuestion(questionPayload);
            await fetchQuestions(subjects);
            setNewQuestion({
                text: '',
                options: ['', '', '', ''],
                correctAnswer: ''
            });
            setError(null);
        } catch (error) {
            console.error('Error adding question:', error.response?.data || error.message);
            setError('Failed to add question. Please check logs or refresh.');
        }
    };

    const handleEditQuestion = (question) => {
        setNewQuestion({
            text: question.questionText,
            options: [question.optionA, question.optionB, question.optionC, question.optionD],
            correctAnswer: question.correctOption
        });
        const subjectId = question.subject.subjectId || question.subject_id;
        setSelectedSubjectId(subjectId);
        localStorage.setItem('lastSelectedSubjectId', subjectId);
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
            };
            await updateQuestion(editingQuestionId, updatedPayload);
            await fetchQuestions(subjects);
            setNewQuestion({
                text: '',
                options: ['', '', '', ''],
                correctAnswer: ''
            });
            setEditMode(false);
            setEditingQuestionId(null);
            setError(null);
        } catch (error) {
            console.error('Error updating question:', error);
            setError(error.response?.data?.error || 'Failed to update question');
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
        alert('Timer duration saved successfully!');
    };

    const handleEditSubject = (subject) => {
        setEditingSubjectId(subject.subjectId);
        setNewSubjectName(subject.name);
        setNewSubjectWeightage(subject.weightage * 100); 
        setError(null);
    };
    
    const handleUpdateSubject = async () => {
        if (!newSubjectName.trim()) {
            setError('Subject name cannot be empty');
            return;
        }
        const weightageNum = parseFloat(newSubjectWeightage);
        if (isNaN(weightageNum) || weightageNum < 1 || weightageNum > 100 || !Number.isInteger(weightageNum)) {
            setError('Weightage must be a whole number between 1 and 100');
            return;
        }
        const totalWeightage = subjects.reduce(
            (sum, subject) => sum + Math.round(subject.weightage * 100), 
            0
        ) - (subjects.find((s) => s.subjectId === editingSubjectId)?.weightage * 100 || 0) + weightageNum;
        if (totalWeightage > 100) {
            setError('Total weightage exceeds 100%');
            return;
        }
        try {
            console.log('Sending payload:', { name: newSubjectName, weightage: weightageNum });
            const response = await updateSubject(editingSubjectId, {
                name: newSubjectName,
                weightage: weightageNum
            });
            console.log('Update response:', response.data);
            const updatedSubjects = subjects.map((s) =>
                s.subjectId === editingSubjectId ? { ...s, name: newSubjectName, weightage: response.data.weightage } : s
            );
            setSubjects(updatedSubjects);
            setEditingSubjectId(null);
            setNewSubjectName('');
            setNewSubjectWeightage('');
            setError(null);
        } catch (error) {
            console.error('Error updating subject:', error);
            console.log('Error response:', error.response?.data);
            setError(error.response?.data || 'Failed to update subject');
        }
    };

    const getSubjectName = (question) => {
        if (question.subject && typeof question.subject === 'object' && question.subject.name) {
            return `${question.subject.name} (${(question.subject.weightage * 100).toFixed(0)}%)`;
        }
        const subject = subjects.find((s) => s.subjectId === question.subject.subjectId);
        return subject ? `${subject.name} (${(subject.weightage * 100).toFixed(0)}%)` : 'N/A';
    };

    const handleAddSubject = async () => {
        if (!newSubjectName.trim()) {
            setError('Subject name cannot be empty');
            return;
        }
        const weightageNum = parseFloat(newSubjectWeightage) / 100; 
        if (isNaN(weightageNum) || weightageNum <= 0 || weightageNum > 1) {
            setError('Weightage must be a number between 0 and 100');
            return;
        }
        const totalWeightage = subjects.reduce(
            (sum, subject) => sum + (subject.weightage || 0),
            0
        ) + weightageNum;
        if (totalWeightage > 1) {
            setError('Total weightage exceeds 100%');
            return;
        }
        try {
            const response = await createSubject({
                name: newSubjectName,
                weightage: weightageNum,
            });
            const updatedSubjects = [...subjects, response.data];
            setSubjects(updatedSubjects);
            setSelectedSubjectId(response.data.subjectId);
            localStorage.setItem('lastSelectedSubjectId', response.data.subjectId);
            setNewSubjectName('');
            setNewSubjectWeightage('');
            setError(null);
        } catch (error) {
            console.error('Error creating subject:', error);
            setError(error.response?.data || 'Failed to create subject');
        }
    };

    const cancelEdit = () => {
        setNewQuestion({
            text: '',
            options: ['', '', '', ''],
            correctAnswer: ''
        });
        setEditMode(false);
        setEditingQuestionId(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center font-sans">
            <div className="max-w-6xl w-full p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Page</h1>
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 mb-6 rounded-lg">{error}</div>
                )}
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        <p className="mt-2 text-gray-600">Loading...</p>
                    </div>
                ) : (
                    <>
                        {/* Subject management */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                {editingSubjectId ? 'Edit Subject' : 'Add Subject'}
                            </h2>
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    placeholder="Subject name"
                                    value={newSubjectName}
                                    onChange={(e) => setNewSubjectName(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Weightage (%)"
                                    value={newSubjectWeightage}
                                    onChange={(e) => setNewSubjectWeightage(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={editingSubjectId ? handleUpdateSubject : handleAddSubject}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                >
                                    {editingSubjectId ? 'Update' : 'Add'}
                                </button>
                                {editingSubjectId && (
                                    <button
                                        onClick={() => {
                                            setEditingSubjectId(null);
                                            setNewSubjectName('');
                                            setNewSubjectWeightage('');
                                        }}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* Subjects list */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Subjects</h2>
                        {subjects.map((s) => (
                            <div
                                key={s.subjectId}
                                className="border border-gray-200 p-3 rounded-lg mb-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
                            >
                                <span className="text-gray-700">{s.name} ({(s.weightage * 100).toFixed(0)}%)</span>
                                <button
                                    onClick={() => handleEditSubject(s)}
                                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition text-sm"
                                >
                                    Edit
                                </button>
                            </div>
                        ))}
                        {/* Timer */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Set Timer (minutes)</h2>
                            <div className="flex space-x-3">
                                <input
                                    type="number"
                                    value={timerDuration}
                                    onChange={(e) => setTimerDuration(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={saveTimerDuration}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Save Timer
                                </button>
                            </div>
                        </div>
                        {/* Add/Edit Question */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                {editMode ? 'Edit Question' : 'Add Question'}
                            </h2>
                            <select
                                value={selectedSubjectId}
                                onChange={(e) => setSelectedSubjectId(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Subject</option>
                                {subjects.map((s) => (
                                    <option key={s.subjectId} value={s.subjectId}>
                                        {s.name} ({(s.weightage * 100).toFixed(0)}%)
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                name="text"
                                placeholder="Question text"
                                value={newQuestion.text}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {newQuestion.options.map((opt, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                    value={opt}
                                    onChange={(e) => handleOptionChange(i, e.target.value)}
                                    className="p-2 border border-gray-300 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ))}
                            <select
                                name="correctAnswer"
                                value={newQuestion.correctAnswer}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded-lg mb-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select correct answer</option>
                                {newQuestion.options.map((_, i) => (
                                    <option key={i} value={String.fromCharCode(65 + i)}>
                                        {String.fromCharCode(65 + i)}
                                    </option>
                                ))}
                            </select>
                            <div className="flex space-x-3">
                                <button
                                    onClick={editMode ? handleUpdateQuestion : handleAddQuestion}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    {editMode ? 'Update' : 'Add'}
                                </button>
                                {editMode && (
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setEditingQuestionId(null);
                                            setNewQuestion({ text: '', options: ['', '', '', ''], correctAnswer: '' });
                                        }}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* Questions list */}
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Questions</h2>
                        {questions.map((q, idx) => (
                            <div
                                key={q.questionId}
                                className="border border-gray-300 p-4 rounded-lg mb-4 bg-gray-50 shadow-sm hover:shadow-md transition"
                            >
                                <p className="font-semibold text-lg text-gray-900 mb-2">
                                    {idx + 1}. {q.questionText}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">Marks: {q.marks}</p>
                                <ul className="ml-4 space-y-1 text-gray-700">
                                    {q.optionA && (
                                        <li className="text-sm">
                                            A: {q.optionA} {q.correctOption === 'A' && <span className="text-green-600 font-medium">corr</span>}
                                        </li>
                                    )}
                                    {q.optionB && (
                                        <li className="text-sm">
                                            B: {q.optionB} {q.correctOption === 'B' && <span className="text-green-600 font-medium">corr</span>}
                                        </li>
                                    )}
                                    {q.optionC && (
                                        <li className="text-sm">
                                            C: {q.optionC} {q.correctOption === 'C' && <span className="text-green-600 font-medium">corr</span>}
                                        </li>
                                    )}
                                    {q.optionD && (
                                        <li className="text-sm">
                                            D: {q.optionD} {q.correctOption === 'D' && <span className="text-green-600 font-medium">corr</span>}
                                        </li>
                                    )}
                                </ul>
                                <p className="text-sm text-gray-500 mt-2">
                                    Correct: {q.correctOption} | Subject: {getSubjectName(q)}
                                </p>
                                <div className="flex space-x-3 mt-3">
                                    <button
                                        onClick={() => handleEditQuestion(q)}
                                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteQuestion(q.questionId)}
                                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPage;