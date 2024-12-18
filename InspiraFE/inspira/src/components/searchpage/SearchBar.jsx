import React, { useState, useEffect } from "react";
import "../../css/SearchBar.css";

const SearchBar = ({ onSearch }) => {
  const [username, setUsername] = useState("");
  const [isActive, setIsActive] = useState(false);

 
  useEffect(() => {
    setIsActive(true);
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    setUsername(value);

    if (onSearch && value.trim()) {
      onSearch(value);
    }
  };

  const handleToggle = (e) => {
    e.preventDefault();
    setIsActive((prevActive) => {
      if (prevActive) {
        setUsername("");
       
        if (onSearch) {
          onSearch(""); 
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
