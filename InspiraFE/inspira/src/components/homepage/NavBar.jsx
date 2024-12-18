import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../css/CustomHomePage.css'; 
import { BiLogOut } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";

const NavBar = () => {
  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    window.location.href = '/login'; 
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile.");
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3001/api/utenti/me', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          alert("Account eliminato con successo.");
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        } else {
          const errorData = await response.json();
          alert(`Errore durante l'eliminazione: ${errorData.message || 'Errore sconosciuto.'}`);
        }
      } catch (error) {
        alert("Si è verificato un errore durante l'eliminazione del tuo account. Riprova più tardi.");
      }
    }
  };

  return (
    <>
      <nav className="navbar-horizontal navbar navbar-expand-lg">
        <div className="container-fluid">
          <div className="d-flex  w-100 container-logo">
            <a className="navbar-brand my-auto" href="/">
              <img
                src="/images/logo.webp"
                alt="Logo"
                style={{ maxHeight: '50px' }}
              />
              <h1>I<span className='primary'>n</span>spira</h1>
            </a>
          </div>

          <div className="collapse navbar-collapse">
            <Dropdown align="end">
              <Dropdown.Toggle
                as="div"  
                id="dropdownMenu"
                className="p-0" 
              > 
                <FiSettings className="primary fa-solid fa-paintbrush me-3" style={{ fontSize: '24px' }}/>
              </Dropdown.Toggle>

              <Dropdown.Menu className="custom-dropdown-menu">
                <Dropdown.Item onClick={handleLogout}> 
                 Esci
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDeleteAccount}>
                
                  Elimina Account
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </nav>
      <hr className='linea1'/>
    </>
  );
};

export default NavBar;
