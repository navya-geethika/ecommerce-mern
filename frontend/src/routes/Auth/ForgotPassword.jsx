import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/v1/auth/forgotPassword", {
        email,
        newPassword,
        secretQuestion,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Password Reset Failed");
    }
  };

  return (
    <Layout title={"Reset Password - Antra"}>
      <div className="form-container">
        <form onSubmit={submitHandler}>
          <h2 className="title">Reset Password</h2>

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
              placeholder="Enter New Password"
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              placeholder="Your Favourite Food?"
              className="form-control"
              id="phone"
              value={secretQuestion}
              onChange={(e) => setSecretQuestion(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Change Password
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
