import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../css/AuthForm.css";

const CustomRegister = ({ switchToLogin }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = () => {
    setName("");
    setSurname("");
    setUsername("");
    setEmail("");
    setPassword("");
  };

  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!passwordRegex.test(password)) {
      setError("La password non soddisfa i criteri (almeno una maiuscola, un numero e un simbolo).");
      return;
    }

    const url = "http://localhost:3001/auth/register";
    const userData = { name, surname, username, email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Errore durante la registrazione.");
      }

      resetForm();
      switchToLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit}>
        <h1>Unisciti a Inspira</h1>
        <p>Condividi il tuo mondo con una comunità appassionata.</p>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Cognome"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nome Utente"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
            <input
          type={showPassword ? "text" : "password"}
          placeholder="La tua Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
         <span
                  className="eye-icon my-1"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Nascondi password" : "Mostra password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
        {error && <p className="error-message">{error}</p>}
        <button className="pt-2" type="submit">Registrati</button>
      </form>
    </div>
  );
};

export default CustomRegister;
