import React from 'react';
import UserCard from './UserCard';
import BottomBar from './BottomBar';
import '../../css/CustomHomePage.css';
import Footer from "../login/Footer";
import NavBar from "./NavBar";
const CustomHomePage = () => {
  return (
    <>
    
  
    <div className="layout">
      <div className="main-content">
    <NavBar />
        <UserCard />
        
        <UserCard />
     <BottomBar /> 
        <Footer />
      </div>
    </div>
        </>
  );
};

export default CustomHomePage;
