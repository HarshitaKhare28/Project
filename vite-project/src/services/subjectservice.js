import axios from 'axios';

const SUBJECT_API = 'http://localhost:7000/api/subjects';

export const getAllSubjects = () => axios.get(SUBJECT_API);
export const createSubject = (subjectData) => axios.post(SUBJECT_API, subjectData);
