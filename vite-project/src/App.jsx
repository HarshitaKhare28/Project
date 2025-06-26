import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Test2 from './Components/Test2.jsx';
import ResultPage from './Components/ResultPage';
import AdminPage from './Components/AdminPage.jsx';
import InterestAptitude from './Components/InterestAptitudeTest.jsx';
import Result from './Components/Result.jsx';
import Login from './Components/Login.jsx';
import SignUp from './Components/SignUp.jsx';
import Home from './Components/Home.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/test" element={<InterestAptitude />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/feedback" element={<Test2 />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/result2" element={<Result />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default App;
