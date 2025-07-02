import axios from '/node_modules/.vite/deps/axios.js?v=097fac46';

const API_URL = 'http://localhost:7000/api/subjects';

export const getAllSubjects = () => {
    return axios.get(API_URL);
};

export const createSubject = (subject) => {
    console.log('Creating subject with payload:', subject);
    return axios.post(API_URL, subject);
};

export const updateSubject = (subjectId, subject) => {
    console.log('Updating subject ID:', subjectId, 'with payload:', subject);
    return axios.put(`${API_URL}/${subjectId}`, subject)
        .then(response => {
            console.log('Update response:', response.data);
            return response;
        })
        .catch(error => {
            console.error('Update error:', error.response?.data || error.message);
            throw error;
        });
};

export const deleteSubject = (subjectId) => {
    console.log('Deleting subject ID:', subjectId);
    return axios.delete(`${API_URL}/${subjectId}`)
        .then(response => {
            console.log('Delete response:', response.data);
            return response;
        })
        .catch(error => {
            console.error('Delete error:', error.response?.data || error.message);
            throw error;
        });
};