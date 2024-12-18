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
import { MdOutlineShoppingCart } from "react-icons/md";

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
       
        <li className={`bottom-navbar__item ${isActive('/news') ? 'active' : ''}`}>
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
        <li className={`bottom-navbar__item ${isActive('/cart') ? 'active' : ''}`}>
          <a href="/cart" className="bottom-navbar__link">
            <MdOutlineShoppingCart className="primary" />
            <span>Cart</span>
          </a>
        </li>
       
         
      </ul> 
    </nav>
  );
};

export default BottomBar;
