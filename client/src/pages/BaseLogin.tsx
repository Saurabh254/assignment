import axios from "axios";
import LoginPage from "../components/Login";

import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const BaseLogin: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = async (username: string, password: string) => {
    const resp = await axios.post(API_URL + "/auth/login", {
      username: username,
      password: password,
    });
    if (resp.data.user.role == "teacher") {
      navigate("/teacher");
    } else {
      navigate("/user");
    }
  };
  return <LoginPage handleLogin={handleLogin} />;
};

export default BaseLogin;
