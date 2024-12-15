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
  const [searchActive, setSearchActive] = useState(false);

 
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");

  const handleSearch = async (username) => {
    if (username.trim() === "") {
      setSearchActive(false);
      setUsers([]);
      return;
    }
  
   
    if (username === localStorage.getItem("username")) {
      setError("Non puoi cercare il tuo stesso profilo.");
      setSearchActive(false);
      setUsers([]);
      return;
    }
  
    setSearchActive(true);
    setError(null);
  
    try {
      setLoading(true);
  
      if (!token) {
        setError("Non autenticato. Effettua il login.");
        setLoading(false);
        return;
      }
  
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
  
    
      const filteredUsers = data.filter(user => user.username !== localStorage.getItem("username"));
  
      setUsers(filteredUsers);
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
      <NavBar />
      <SearchBar onSearch={handleSearch} />

      <div className="search-results vh-100">
        {loading && <div className='msg'>Caricamento...</div>}
        {error && <div className='msg'>{error}</div>}

        {searchActive && users.length === 0 && !loading && !error && (
          <div className='msg'>Nessun utente trovato</div>
        )}

        {users.length > 0 && !loading && (
          <ul>
            {users.map((user) => (
              <li key={user.id} onClick={() => handleUserClick(user.username)} className="user-item">
                <div className="user-info d-flex">
                  <img src={user.avatarUrl || "/images/default-avatar.png"} alt="avatar" className="user-avatar me-2 mt-1 mb-1" />
                  <div className="user-details">
                    <div className="username">{user.username}</div>
                    <div className="full-name">{user.name} {user.surname}</div>
                  </div>
                </div>
                <hr className="linea3" />
              </li>
            ))}
          </ul>
        )}
      </div>

      <BottomBar />
      <Footer />
    </div>
  );
};

export default SearchPage;
