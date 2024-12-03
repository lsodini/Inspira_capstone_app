import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/AuthForm.css";

const CustomLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
        throw new Error(errorData.message || "Errore durante l'accesso.");
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
          type="password"
          placeholder="La tua Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <Link to="/resetPasswordPage">Hai dimenticato la password?</Link>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Caricamento..." : "Accedi"}
        </button>
      </form>
    </div>
  );
};

export default CustomLogin;
