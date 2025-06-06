// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard"; // Assuming you have a UserDashboard component
import BaseLogin from "./pages/BaseLogin";
import BaseRegister from "./pages/BaseRegister";
import TeacherDashboard from "./pages/TeacherDashboard";
import Students from "./components/Students";
import CreateExam from "./pages/CreateExam";
import MyExams from "./pages/MyExams";
import Results from "./pages/Results";
import Profile from "./pages/Profile";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/exams" element={<MyExams />} />
        <Route path="/user/results" element={<Results />} />
        <Route path="/user/profile" element={<Profile />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/create-exam" element={<CreateExam />} />
        <Route path="/students/all" element={<Students />} />
        <Route path="/login" element={<BaseLogin />} />
        <Route path="/register" element={<BaseRegister />} />
      </Routes>
    </Router>
  );
};

export default App;
