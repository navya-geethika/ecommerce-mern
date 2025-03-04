import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    if (count === 0) {
      navigate(`/${path}`, { state: location.pathname });
    }
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div>
          <h1>Redirecting you to login in {count} sec...</h1>
        </div>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Spinner;
