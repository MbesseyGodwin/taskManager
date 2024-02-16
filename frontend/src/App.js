import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import FeedbackForm from "./components/FeedbackForm";
import "./index.css";
// import AuthAccordion from "./components/AuthAccordion";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [loading, setLoading] = useState("sign-in");

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const buttonStyle = isOnline ? "alert alert-success btn btn-success uppercase rounded-none fixed w-full" : "alert alert-danger btn btn-danger uppercase rounded-none fixed w-full";

  const BASE_URL = "http://localhost:5000";

  const handleRegister = async () => {
    try {
      setLoading("validating. Please wait...");
  
      const response = await axios.post(`${BASE_URL}/register`, {
        username,
        password,
      });
  
      if (response.status === 201 || response.status === 200) {
        setLoading(`User ${username} registered successfully.`);
        console.log("User registered successfully");
      } else {
        setLoading("Error registering user");
        console.error("Error registering user:", response.data.message);
      }
    } catch (error) {
      setLoading("User registration failed");
      console.error("Error registering user:", error.message);
    }
  };
  

  const handleLogin = async () => {
    try {
      // Show loading feedback
      setLoading("Authenticating User. Please wait...");
  
      const response = await axios.post(`${BASE_URL}/login`, {
        username,
        password,
      });
  
      if (response.status === 200) {
        const data = response.data;
        console.log("User logged in:", data);
        // Save token in session storage
        sessionStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        console.error("Error logging in");
        // Alert the user if login fails
        setLoading("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      // Alert the user if an error occurs during login
      setLoading("An error occurred while logging in. Please check your credentials and try again.");
    }
  };
  

//   const handleLogin = async () => {
//   try {
//     const response = await axios.post(`${BASE_URL}/login`, {
//       username,
//       password,
//     });
//     if (response.status === 200) {
//       const data = response.data;
//       console.log("User logged in:", data);

//       // Get current timestamp
//       const loginTime = new Date().toISOString();

//       // Update token data with login time
//       data.loginTime = loginTime;

//       // Save token with login time in session storage
//       sessionStorage.setItem("token", JSON.stringify(data));
//       setToken(data.token);
//     } else {
//       console.error("Error logging in");
//     }
//   } catch (error) {
//     console.error("Error logging in:", error);
//   }
// };


  const handleLogout = () => {
    // Perform any necessary logout logic here (e.g., clear local storage, send API request)
    sessionStorage.removeItem("token"); // remove token from session storage
    window.location.href = "/"; // redirect to login page
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tasks`, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        setTasks(response.data);
      } else {
        console.error("Error fetching tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async (task) => {
    try {
      const response = await axios.post(`${BASE_URL}/tasks`, task, {
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 201) {
        setTasks([...tasks, response.data]);
      } else {
        console.error("Error adding task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // useEffect(() => {
  //   // Check if token exists in session storage
  //   const storedToken = sessionStorage.getItem("token");
  //   if (storedToken) {
  //     setToken(storedToken);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (token) {
  //     fetchTasks();
  //   }
  // }, [token]);



  useEffect(() => {
    // Check if token exists in session storage
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);
  
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [fetchTasks, token]);
  
  useEffect(() => {
    const checkLoginTime = () => {
      const loginTime = sessionStorage.getItem("loginTime");
      if (loginTime) {
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - parseInt(loginTime);
        const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
        if (hoursDifference >= 2) {
          // Login time exceeds 2 hours, clear the session and redirect to login page
          sessionStorage.removeItem("token"); // Clear token from session storage
          sessionStorage.removeItem("loginTime"); // Clear login time from session storage
          window.location.href = "/login"; // Redirect to login page
        }
      }
    };
  
    checkLoginTime();
  }, [token]);

   const openLoginAccordion = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false); // Close the register accordion
  };

  const openRegisterAccordion = () => {
    setUsername("");
    setPassword("");
    setIsRegisterOpen(true);
    setIsLoginOpen(false); // Close the login accordion
  };

  if (!token) {
    return (
      <div className="container flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl text-uppercase font-bold my-1">Task Manager Application</h1>
      <p className="text-uppercase font-bold my-1 alert alert-success" role="alert">{loading}</p>

      {/* Login Accordion */}
      <div className="w-full my-1">
      <button onClick={openLoginAccordion} className="text-2xl text-uppercase btn-dark text-light w-full bg-dark p-2 text-left">Login to an existing account</button>
        {isLoginOpen && (
          <form onSubmit={(e) => {e.preventDefault(); handleLogin()}} className="d-flex flex-col bg-dark p-3">
            <input required className="form-control m-1" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input required className="form-control m-1" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn btn-success w-full m-1" type="submit">Login</button>
          </form>
        )}
      </div>

      {/* Register Accordion */}
      <div className="w-full my-1">
         <button onClick={openRegisterAccordion} className="text-2xl text-uppercase btn-dark text-light w-full bg-dark p-2 text-left">Register and Create an account</button>
        {isRegisterOpen && (
          <form onSubmit={(e) => {e.preventDefault();handleRegister();}} className="d-flex flex-col bg-dark p-3">
            <input required className="form-control m-1" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <input required className="form-control m-1" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn btn-success w-full m-1" type="submit">Register</button>
          </form>
        )}
      </div>
    </div>
    );
  }

  return (
    <div className="">
      <div className="d-grid">
      <button className={buttonStyle} onClick={handleLogout}>
        {isOnline ? "Logout (Online)" : "Logout (Offline)"}
      </button>
        <h1 className="text-3xl text-center font-bold mt-14 mb-2">Task Manager Dashboard</h1>
      </div>
      <TaskForm onSubmit={handleAddTask} />
      {/* <TaskList tasks={tasks} /> */}
      <TaskList tasks={tasks} fetchTasks={fetchTasks} />
  
      <FeedbackForm />
    </div>
  );
  };
  
  export default App;
