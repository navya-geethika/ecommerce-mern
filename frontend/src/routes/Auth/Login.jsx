import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/auth.css";
import { useAuth } from "../../context/authContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Registration Failed");
    }
  };
  return (
    <Layout title={"Login - Antra"}>
      <div className="form-container">
        <form onSubmit={submitHandler}>
          <h2 className="title">Log In</h2>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Enter your Email Id"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="button"
            onClick={() => {
              navigate("/forgot-password");
            }}
            className="btn btn-outline-warning"
            style={{
              backgroundColor: "white",
              color: "#eeb404",
              border: "0px",
            }}
          >
            Forgot Password
          </button>
          <button type="submit" className="btn btn-primary">
            Log In
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
