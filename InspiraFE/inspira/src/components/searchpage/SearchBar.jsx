import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [username, setUsername] = useState("");

  const handleChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSearch = () => {
    if (username.trim()) {
      onSearch(username); 
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Cerca utente per username..."
        value={username}
        onChange={handleChange}
      />
      <button onClick={handleSearch}>Cerca</button>
    </div>
  );
};

export default SearchBar;
