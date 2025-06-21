import axios from "axios";

const API_URL = "http://localhost:7000/api/questions";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add withCredentials if you're using cookies/sessions
  withCredentials: true
});

const getAllQuestions = () => axios.get(API_URL);
const getQuestionById = (id) => axios.get(`${API_URL}/${id}`);
const createQuestion = (question) => axios.post(API_URL, question);
const updateQuestion = (id, question) =>
  axios.put(`${API_URL}/${id}`, question);
const deleteQuestion = (id) => axios.delete(`${API_URL}/${id}`);

export {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
