import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/AuthForm.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CustomLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Stato per mostrare/nascondere la password
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/homepage");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const url = "http://localhost:3001/auth/login";

    if (!email || !password) {
      setError("Inserisci sia l'email che la password.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "Invalid credentials") {
          setError("Email o password errati.");
        } else {
          setError("Errore durante l'accesso.");
        }
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.accessToken);
      navigate("/homepage");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1>Accedi a Inspira</h1>
        <p>Inserisci le tue credenziali per iniziare il viaggio.</p>
        <input
          type="email"
          placeholder="La tua Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
            type={showPassword ? "text" : "password"} // Cambia tipo in base al valore di showPassword
          placeholder="La tua Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)} 
            title={showPassword ? "Nascondi password" : "Mostra password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />} 
          </span>
        
        {error && <p className="error-message">{error}</p>}
        <Link to="/resetPasswordPage">Hai dimenticato la password?</Link>
        <button type="submit" disabled={isLoading}>
          {isLoading ? (
            <i className="fa-solid fa-palette fa-spin" style={{ fontSize: '24px' }}></i>
          ) : (
            "Accedi"
          )}
        </button>
      </form>
    </div>
  );
};

export default CustomLogin;
