import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css'; 

const Navbar = () => {
  return (
    <nav className="basenav navbar navbar-expand-lg">
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
              <i className="primary fa-solid fa-paintbrush" style={{ fontSize: '24px' }}></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/login">Accedi</Dropdown.Item>
              <Dropdown.Item href="/register">Registrati</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
