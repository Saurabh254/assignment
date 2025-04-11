// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TeacherLogin from "./pages/Teacher";
import UserLogin from "./pages/User"; // Assuming you have a User component
import UserDashboard from "./pages/UserDashboard"; // Assuming you have a UserDashboard component
const App: React.FC = () => {
  return (
    <Router>
      <Routes>

        {/* <Route path="/teacher" element={<TeacherDashboard />} /> */}
        <Route path="/teacher/login" element={<TeacherLogin />} />
        
        <Route path="/user" element={<UserDashboard />} /> 
        <Route path="/user/login" element={<UserLogin />} />
      </Routes>
    </Router>
  );
};

export default App;
