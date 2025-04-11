import axios from "axios";

import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import Register from "../components/Register";

const BaseRegister: React.FC = () => {
  const navigate = useNavigate();
  const handleRegistration = async (data: {
    name: string;
    username: string;
    password: string;
    role: string;
  }) => {
    const resp = await axios.post(API_URL + "/auth/register", {
      username: data.username,
      name: data.name,
      role: data.role,
      password: data.password,
    });
    if (resp.data.user.role == "teacher") {
      navigate("/teacher");
    } else {
      navigate("/user");
    }
  };
  return <Register handleRegistration={handleRegistration} />;
};

export default BaseRegister;
