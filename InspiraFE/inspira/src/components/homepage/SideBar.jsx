import React from "react";
import {
  FiHome,
  FiMessageSquare,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";
import { MdOutlineShoppingCart } from "react-icons/md"
import { CgProfile } from "react-icons/cg";
import { IoSearch } from "react-icons/io5";
import "../../css/SideBar.css"; 

const SideBar = () => {
  return (
    <nav className="sidebar">
      <ul className="sidebar__menu">
        <li className="sidebar__item">
          <a href="#" className="sidebar__link">
            <FiHome className="primary"/>
            <span>Home</span>
          </a>
        </li>
        <li className="sidebar__item">
          <a href="#" className="sidebar__link">
            <FiMessageSquare className="primary"/>
            <span>Messages</span>
          </a>
        </li>
        <li className="sidebar__item">
          <a href="#" className="sidebar__link">
          <MdOutlineShoppingCart className="primary"/>
            <span>Shop</span>
          </a>
        </li>
        <li className="sidebar__item">
          <a href="#" className="sidebar__link">
          <CgProfile className="primary"/>
            <span>Profile</span>
          </a>
        </li>
        <li className="sidebar__item">
          <a href="#" className="sidebar__link">
          <IoSearch className="primary"/>
            <span>Search</span>
          </a>
        </li>
        <li className="sidebar__item">
          <a href="#" className="sidebar__link">
            <FiHelpCircle className="primary"/>
            <span>Help</span>
          </a>
        </li>
        <li className="sidebar__item">
          <a href="#" className="sidebar__link">
            <FiSettings className="primary"/>
            <span>Settings</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default SideBar;
