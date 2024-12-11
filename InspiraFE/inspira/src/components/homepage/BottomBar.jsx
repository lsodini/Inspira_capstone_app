import React from "react";
import {
  FiHome,
  FiMessageSquare,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";

import { CgProfile } from "react-icons/cg";
import { IoSearch } from "react-icons/io5";
import { IoNewspaperOutline } from "react-icons/io5";
import { useLocation } from "react-router-dom"; 
import "../../css/CustomHomePage.css"; 

const BottomBar = () => {
  const location = useLocation(); 

 
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-navbar">
      <ul className="bottom-navbar__menu">
        <li className={`bottom-navbar__item ${isActive('/feed') ? 'active' : ''}`}>
          <a href="/feed" className="bottom-navbar__link">
            <FiHome className="primary" />
            <span>Home</span>
          </a>
        </li>
        <li className={`bottom-navbar__item ${isActive('/messages') ? 'active' : ''}`}>
          <a href="/messages" className="bottom-navbar__link">
            <FiMessageSquare className="primary" />
            <span>Messages</span>
          </a>
        </li>
        <li className={`bottom-navbar__item ${isActive('/shop') ? 'active' : ''}`}>
          <a href="/news" className="bottom-navbar__link">
            <IoNewspaperOutline className="primary" />
            <span>News</span>
          </a>
        </li>
        <li className={`bottom-navbar__item ${isActive('/homepage') ? 'active' : ''}`}>
          <a href="/homepage" className="bottom-navbar__link">
            <CgProfile className="primary" />
            <span>Profile</span>
          </a>
        </li>
        <li className={`bottom-navbar__item ${isActive('/search') ? 'active' : ''}`}>
          <a href="/search" className="bottom-navbar__link">
            <IoSearch className="primary" />
            <span>Search</span>
          </a>
        </li>
        <li className={`bottom-navbar__item ${isActive('/help') ? 'active' : ''}`}>
          <a href="/help" className="bottom-navbar__link">
            <FiHelpCircle className="primary" />
            <span>Help</span>
          </a>
        </li>
       
         
      </ul> 
    </nav>
  );
};

export default BottomBar;
