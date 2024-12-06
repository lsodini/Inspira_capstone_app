import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../css/CustomHomePage.css'; 
import { BiLogOut } from "react-icons/bi";

const NavBar = () => {
  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    window.location.href = '/login'; 
  };

  return (
    <nav className="navbar-horizontal navbar navbar-expand-lg">
      <div className="container-fluid">
        {/* Logo */}
        <div className="d-flex justify-content-center w-100">
          <a className="navbar-brand mx-auto" href="/">
            <img
              src="https://via.placeholder.com/150"
              alt="Logo"
              style={{ maxHeight: '40px' }}
            />
          </a>
        </div>

        <div className="collapse navbar-collapse">
          
          <Dropdown align="end">
            <Dropdown.Toggle
              as="div"  
              id="dropdownMenu"
              className="p-0" 
            >
              <i className="primary fa-solid fa-paintbrush me-3" style={{ fontSize: '24px' }}></i>
            </Dropdown.Toggle>

            
            <Dropdown.Menu className="custom-dropdown-menu">
              <Dropdown.Item onClick={handleLogout}> <BiLogOut className='mb-1 me-2' style={{ fontSize: '24px' }}/>Esci</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
