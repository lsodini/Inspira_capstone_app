import React from 'react';

import BottomBar from '../homepage/BottomBar';
import '../../css/CustomHomePage.css';
import Footer from "../login/Footer";
import NavBar from "../homepage/NavBar";

import OtherUserPage from './OtherUserPage';


const CustomOtherUserPage = () => {
  return (
    <>
    
  
    <div className="layout">
      <div className="main-content">
    <NavBar />
    
        <OtherUserPage />
        
       
        
        
     <BottomBar /> 
        <Footer />
      </div>
    </div>
        </>
  );
};

export default CustomOtherUserPage;
