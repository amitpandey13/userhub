import { useRef, useState, useEffect } from "react";
import "../UserCss/user.css";
import { getAllUsers, saveUser } from "../services/userservice";
import UserList from '../admin/UserList';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addUserByAdmin } from "../services/userservice";

function UserForm() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [allUsers, setAllUsers] = useState([]);
  const [userLoggedIn,setUserLoggedIn] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const [message, setMessage] = useState("");
  const [verifyEmail, setVerifyEmail] = useState(false);

  //local storage for +add user 

  const userRole = localStorage.getItem("role");

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const loginHandler = (event) => {
    event.preventDefault();
    
    navigate('/login')
    // setUserLoggedIn(true)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // if(verifyEmail===false){
    //     setMessage('verify email first')
    //     return false
    // }
    if (nameRef === "") {
      nameRef.current.focus();
    }
    if (emailRef === "") {
      alert("got clicked");
      emailRef.current.focus();
    }
    if (passwordRef === "") {
      passwordRef.current.focus();
    }

    setMessage("");

    //saving user API
    try {
      const response = await saveUser(user);
      toast.success("User Created Successfully!")

      setMessage("Customer created successfully!");
      // navigate("/users/getAllUsers");
      navigate("/login")
      setUser({ name: "", email: "", password: "" });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
      setMessage("Something went wrong. Please try again.");
    }
  };

    const handleSubmitAdmin = async (event) => {
    event.preventDefault();
    // if(verifyEmail===false){
    //     setMessage('verify email first')
    //     return false
    // }
    if (nameRef === "") {
      nameRef.current.focus();
    }
    if (emailRef === "") {
      alert("got clicked");
      emailRef.current.focus();
    }
    if (passwordRef === "") {
      passwordRef.current.focus();
    }

    setMessage("");

    //saving user API
    try {
      const response = await addUserByAdmin(user);
      toast.success("User Created Successfully!")

      setMessage("Customer created successfully!");
      // navigate("/users/getAllUsers");
      // navigate("/login")
      setUser({ name: "", email: "", password: "" });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
       <main className="page">
        
        <section className="form-card">
          <h1>Create Account</h1>
          <p className="subtitle">Enter your details to get started.</p>

          <form onSubmit={userRole==="ROLE_ADMIN"?(handleSubmitAdmin):handleSubmit} autoComplete="off">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              ref={nameRef}
              type="text"
              value={user.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label htmlFor="email">Email address</label>
            <input
              id="email"
              ref={emailRef}
              name="email"
              type="email"
              value={user.email}
              onChange={handleChange}
              placeholder="you@example.com"
              // required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              minLength="6"
              required
            />
            {userRole !=="ROLE_ADMIN" ? (<> <button type="submit" onClick={loginHandler}>
              LogIn
            </button>
           </>):(<></>)}
            <button type="submit">Create Account</button>
           
          </form>

          {message && <p className="message">{message}</p>}
        </section>

      </main>

    </>
  );
}

export default UserForm;
