import React, { useState } from "react";

const AuthAccordion = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Implement your login logic here
  };

  const handleRegister = () => {
    // Implement your register logic here
  };

  const openLoginAccordion = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false); // Close the register accordion
  };

  const openRegisterAccordion = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false); // Close the login accordion
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Task Manager Sign-in</h1>

      {/* Login Accordion */}
      <div className="w-full">
        <button
          onClick={openLoginAccordion}
          className="w-full bg-gray-200 p-2 text-left"
        >
          Login
        </button>
        {isLoginOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="d-flex flex-col"
          >
            {/* Login form inputs */}
          </form>
        )}
      </div>

      {/* Register Accordion */}
      <div className="w-full">
        <button
          onClick={openRegisterAccordion}
          className="w-full bg-gray-200 p-2 text-left"
        >
          Register
        </button>
        {isRegisterOpen && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
            className="d-flex flex-col"
          >
            {/* Register form inputs */}
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthAccordion;
