import { useRef, useState, useEffect } from "react";
import "../UserCss/user.css";
import {
  getAllUsers,
  saveUser,
  loggedInUserFunction,
} from "../services/userservice";
import UserList from '../admin/UserList'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//tomorrow

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loggedInUser, setloggedInUser] = useState({
    email: "",
    password: "",
  });

  const [allUsers, setAllUsers] = useState([]);

  const handleChange = (event) => {
    setloggedInUser({
      ...loggedInUser,
      [event.target.name]: event.target.value,
    });
  };

  const loginHandler = (event) => {
    event.preventDefault();
    alert("got clicked..");
    // setUserLoggedIn(true)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    //saving user API
    try {
      const response = await loggedInUserFunction(loggedInUser);

      toast.success("User LoggedIn Successfully!");
      setMessage("User LoggedIn Successfully!");
      localStorage.setItem("token", response.token);
      localStorage.setItem("email", response.email);
      localStorage.setItem("role", response.role);

      if (response.role === "ROLE_ADMIN") {
        navigate("/admin/dashboard");
      } else if (response.role === "ROLE_USER") {
        navigate("/user/dashboard");
      }
      //  navigate("/api/admin/getAllUsers");
      console.log("loggin user response");
      console.log(response);

      // setUser({ name: "", email: "", password: "" });
    } catch (error) {
      console.log("*************");
      console.log(error.message);
      setMessage(error.message);
      toast.error(error.message);
      setMessage("Something went wrong. Please try again.");
    }
  };

  const forgotPasswordHandler = () => {
    navigate("/forgot-password");
  };

  return (
    <main className="page">
      <section className="form-card">
        <h1>Login User</h1>
        <p className="subtitle">Enter Your Credentials.</p>

        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            id="email"
            name="email"
            type="email"
            value={loggedInUser.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={loggedInUser.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            minLength="6"
            required
          />
          <button type="submit">LogIn</button>
          <div className="auth-links">
            <button
              type="button"
              className="forgot-password-btn"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </button>

            <div className="signup-section">
              <p>Don't have an account?</p>

              <button
                type="button"
                className="signup-btn"
                onClick={() => navigate("/")}
              >
                Create Account
              </button>
            </div>
          </div>
          {/* <button type="submit">Login</button> */}
        </form>

        {message && <p className="message">{message}</p>}
      </section>
    </main>
  );
};

export default Login;
