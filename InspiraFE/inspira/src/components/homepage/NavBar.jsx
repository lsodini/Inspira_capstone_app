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

  return (
    <>
    <nav className="navbar-horizontal navbar navbar-expand-lg">
      <div className="container-fluid">
        
        <div className="d-flex  w-100 container-logo">
          <a className="  navbar-brand my-auto" href="/">
            <img
              src="/images/logo.webp"
              alt="Logo"
              style={{ maxHeight: '50px'}}
            />
            
          </a>
        </div>

        <div className="collapse navbar-collapse">
          
          <Dropdown align="end">
            <Dropdown.Toggle
              as="div"  
              id="dropdownMenu"
              className="p-0" 
            > <FiSettings className="primary fa-solid fa-paintbrush me-3" style={{ fontSize: '24px' }}/>
            </Dropdown.Toggle>

            
            <Dropdown.Menu className="custom-dropdown-menu">
              <Dropdown.Item onClick={handleLogout}> <BiLogOut className='mb-1 me-2' style={{ fontSize: '24px' }}/>Esci</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
    < hr className='linea1'/>
    </>
  );
};

export default NavBar;
