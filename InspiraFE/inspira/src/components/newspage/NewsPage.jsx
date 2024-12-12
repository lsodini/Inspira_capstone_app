import React from 'react';

import BottomBar from '../homepage/BottomBar';
import '../../css/NewsPage.css';
import Footer from "../login/Footer";
import NavBar from "../homepage/NavBar";
import NewsSection from './NewsSection';
const NewsPage = () => {
	return (
	  <>
	  
	
	  <div className="layout">
		
	  <NavBar />
	 
	<NewsSection />
		  
		 
		  
		  
	   <BottomBar /> 
		  
		  <Footer />
		 
		
	  </div>
		  </>
	);
  };
  
  export default NewsPage;
  