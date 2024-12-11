import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomBar from '../homepage/BottomBar';
import '../../css/SearchPage.css';
import Footer from "../login/Footer";
import NavBar from "../../components/homepage/NavBar";
import SearchBar from './SearchBar';

const SearchPage = () => {
  const navigate = useNavigate(); 
  const [users, setUsers] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function that handles search when the user submits the search
  const handleSearch = async (username) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Non autenticato. Effettua il login.");
        setLoading(false);
        return;
      }

      // Fetch users matching the username
      const response = await fetch(`http://localhost:3001/api/utenti/search?username=${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Errore durante la ricerca');
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 
  const handleUserClick = (username) => {
    navigate(`/user/${username}`);
  };

  return (
    <div className="layout">
      <div className="main-content">
        <NavBar />
        <SearchBar onSearch={handleSearch} />

        {loading && <div>Caricamento...</div>}
        {error && <div>{error}</div>}

        <div className="search-results vh-100">
          {users.length === 0 && !loading && !error && (
            <div>cerca un utente</div>
          )}
          {users.length > 0 && !loading && (
            <ul>
              {users.map((user) => (
                <li key={user.id} onClick={() => handleUserClick(user.username)}>
                  {user.username}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <BottomBar />
      <Footer />
    </div>
  );
};

export default SearchPage;
