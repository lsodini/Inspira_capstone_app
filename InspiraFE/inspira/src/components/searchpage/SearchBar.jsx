import React, { useState, useEffect } from "react";
import "../../css/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [username, setUsername] = useState("");
  const [isActive, setIsActive] = useState(false);

  // Quando il componente viene caricato, imposta la search bar come attiva
  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    setUsername(value);

    // Esegui la ricerca solo se la stringa non è vuota
    if (onSearch && value.trim()) {
      onSearch(value);
    }
  };

  const handleToggle = (evt) => {
    evt.preventDefault();
    setIsActive((prevActive) => {
      if (prevActive) {
        setUsername("");
        // Passa una stringa vuota per "cancellare" la ricerca
        if (onSearch) {
          onSearch(""); // Passa una stringa vuota per disabilitare la ricerca
        }
      }
      return !prevActive;
    });
  };

  return (
    <div className={`search-wrapper ${isActive ? "active" : ""}`}>
      <div className="input-holder">
        <input
          type="text"
          className="search-input"
          placeholder="cerca utente per username..."
          value={username}
          onChange={handleChange}
        />
        <button className="search-icon" onClick={handleToggle}>
          <span></span>
        </button>
      </div>
      <span className="close" onClick={handleToggle}></span>
    </div>
  );
};

export default SearchBar;