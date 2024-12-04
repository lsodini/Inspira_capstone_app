import React from 'react';
import UserProfile from './UserProfile';
import SideBar from './SideBar';
import '../../css/CustomHomePage.css';
import Footer from "../login/Footer";
import NavBar from "./NavBar";
const CustomHomePage = () => {
  return (
    <>
    <div>
    <NavBar />
    </div>
    <div className="layout">
      <SideBar />
      <div className="main-content">
        <UserProfile />
      </div>
    </div>
        <Footer />
        </>
  );
};

export default CustomHomePage;
