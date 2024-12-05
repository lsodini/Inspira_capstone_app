import React from "react";
import {
  FiHome,
  FiMessageSquare,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoSearch } from "react-icons/io5";
import "../../css/BottomBar.css"; // Cambia il nome del CSS

const BottomBar = () => {
  return (
    <nav className="bottom-navbar">
      <ul className="bottom-navbar__menu">
        <li className="bottom-navbar__item">
          <a href="#" className="bottom-navbar__link">
            <FiHome className="primary" />
            <span>Home</span>
          </a>
        </li>
        <li className="bottom-navbar__item">
          <a href="#" className="bottom-navbar__link">
            <FiMessageSquare className="primary" />
            <span>Messages</span>
          </a>
        </li>
        <li className="bottom-navbar__item">
          <a href="#" className="bottom-navbar__link">
            <MdOutlineShoppingCart className="primary" />
            <span>Shop</span>
          </a>
        </li>
        <li className="bottom-navbar__item">
          <a href="#" className="bottom-navbar__link">
            <CgProfile className="primary" />
            <span>Profile</span>
          </a>
        </li>
        <li className="bottom-navbar__item">
          <a href="#" className="bottom-navbar__link">
            <IoSearch className="primary" />
            <span>Search</span>
          </a>
        </li>
        <li className="bottom-navbar__item">
          <a href="#" className="bottom-navbar__link">
            <FiHelpCircle className="primary" />
            <span>Help</span>
          </a>
        </li>
        <li className="bottom-navbar__item">
          <a href="#" className="bottom-navbar__link">
            <FiSettings className="primary" />
            <span>Settings</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default BottomBar;
