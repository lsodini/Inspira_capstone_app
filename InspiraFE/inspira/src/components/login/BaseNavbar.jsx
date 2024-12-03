import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

const BaseNavbar = () => {
    return (
        <nav className="navbar navbar-light bg-light">
            <a className="navbar-brand" href="#">
                <img 
                    src="/docs/4.0/assets/brand/bootstrap-solid.svg" 
                    width="30" 
                    height="30" 
                    alt="logo" 
                />
            </a>
        </nav>
    );
};

export default BaseNavbar;
