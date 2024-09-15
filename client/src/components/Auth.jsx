import { useState } from "react";

function Auth({ onLogin }) {
  const [isLogIn, setIsLogin] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function viewLogin(status) {
    setIsLogin(status);
    setError("");
  }

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userName, password: password }),
      });

      const data = await response.json();

      if (data.detail) {
        setError(data.detail);
      } else {
        localStorage.setItem("AuthToken", data.data.token);
        onLogin();
      }
    } catch (err) {
      console.error("Fetch error: ", err);
      setError("An error occurred during login.");
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Make sure passwords match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.detail) {
        setError(data.detail);
      } else {
        localStorage.setItem("AuthToken", data.data.token);
        onLogin();
      }
    } catch (err) {
      console.error("Fetch error: ", err);
      setError("An error occurred during signup.");
    }
  }

  function handleSubmit(e) {
    if (isLogIn) {
      handleLogin(e);
    } else {
      handleSignup(e);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-container-box">
        <form onSubmit={handleSubmit}>
          <h2>{isLogIn ? "Please log in" : "Please sign up!"}</h2>
          <input
            type="text"
            placeholder="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          {!isLogIn && (
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!isLogIn && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <input
            type="submit"
            className="create"
            value={isLogIn ? "Login" : "Sign Up"}
          />
          {error && <p>{error}</p>}
        </form>
        <div className="auth-options">
          <button
            onClick={() => viewLogin(false)}
            style={{
              backgroundColor: !isLogIn
                ? "rgb(255,255,255)"
                : "rgb(188,188,188)",
            }}
          >
            Sign Up
          </button>
          <button
            onClick={() => viewLogin(true)}
            style={{
              backgroundColor: isLogIn
                ? "rgb(255,255,255)"
                : "rgb(188,188,188)",
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
