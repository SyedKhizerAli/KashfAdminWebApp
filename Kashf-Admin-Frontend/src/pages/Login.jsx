import React, { useState } from "react";
import "../css/Login.css";
import kashfLogo from "../assets/images/kashf-logo.png";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import BACKEND_URL from "../constants";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const handleLogin = async () => {
    if (!username) {
      setError("Username is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }


    console.log(BACKEND_URL)
    try {
      const response = await axios.post(`${BACKEND_URL}/login`, {
        username,
        password,
      });
      console.log(response)
      if (response.status === 201) {
 
        console.log(response)

        const token_ = response.data.token;
        console.log('token--------',token_);
    
        localStorage.setItem('token', token_);
        console.log('local---',localStorage.getItem('token'));
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred while logging in");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onChangeUsername = (e) => {
    setUsername(e.target.value);
    setError("");
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  return (
    <div className="login-container">
      <div className="left-half">
        {/* Add your image here */}
        <img src={kashfLogo} alt="Logo Kashf Foundation" />
      </div>
      <div className="right-half">
        <h1>
          Welcome to Asaani<br></br> Admin Portal
        </h1>
        <h3>Please login to continue</h3>

        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={onChangeUsername}
        />
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={onChangePassword}
          />
          {/* <button
            type="button"
            style={{
              position: "absolute",
              right: "100px",
              top: "-10%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "#5db075",
              cursor: "pointer",
              fontSize: "14px",
            }}
            onClick={togglePasswordVisibility}
          >
            {showPassword ? "Hide" : "Show"}
          </button> */}
        </div>
        <button onClick={()=>handleLogin()}>Login</button>
        <h5>Forgot your password?</h5>
      </div>
    </div>
  );
};

export default Login;
 