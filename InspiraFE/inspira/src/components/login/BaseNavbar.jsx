import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css'; 

const Navbar = () => {
  return (
    <>
    <nav className="basenav navbar ">
      <div className="container-fluid d-flex justify-content-center align-items-center container-logo" >
        
        
          <a className="ms-3 navbar-brand text-center " href="/">
            <img
              src="/images/logo.webp"
              alt="Logo"
              style={{ maxHeight: '50px'}}
            />
            
          </a>
        
         {/* <Dropdown className="pt-3 pe-2" align="end">
            <Dropdown.Toggle
              as="div"  
              id="dropdownMenu"
             
            >
              <i className="primary fa-solid fa-paintbrush" style={{ fontSize: '24px' }}></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="/login">Accedi</Dropdown.Item>
              <Dropdown.Item href="/register">Registrati</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        
        */ }
      
        
      </div>
    </nav>
    < hr className='linea2'/>
    </>
  );
};

export default Navbar;
