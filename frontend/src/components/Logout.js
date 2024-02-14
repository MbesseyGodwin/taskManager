import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform any necessary logout logic here (e.g., clear local storage, send API request)
    sessionStorage.removeItem('token'); // remove example token from local storage
    navigate("/"); // redirect to login page
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
