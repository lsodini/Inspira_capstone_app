import React from 'react';
import UserCard from './UserCard';
import BottomBar from './BottomBar';
import '../../css/CustomHomePage.css';
import Footer from "../login/Footer";
import NavBar from "./NavBar";
import UserPage from "./UserPage";


const CustomHomePage = () => {
  return (
    <>
    
  
    <div className="layout">
      <div className="main-content">
    <NavBar />
    
        <UserPage />
        
       
        
        
     <BottomBar /> 
        <Footer />
      </div>
    </div>
        </>
  );
};

export default CustomHomePage;
