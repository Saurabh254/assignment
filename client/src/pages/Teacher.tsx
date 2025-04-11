import React, { useState } from "react";
import LoginPage from "../components/Login";

const TeacherLogin: React.FC = () => {
  const handleLogin = (username: string, password: string) => {
    console.log(username, password);
  };

  return <LoginPage handleLogin={handleLogin} />;
};

export default TeacherLogin;
