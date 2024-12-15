import React from 'react';

import BottomBar from '../homepage/BottomBar';
import '../../css/NewsPage.css';
import Footer from "../login/Footer";
import NavBar from "../homepage/NavBar";
import Feed from './Feed';

const FeedPage = () => {
	return (
	  <>
	  
	
	  <div className="layout">
		
	  <NavBar />
	 
	<Feed />
		  
		 
		  
		  
	   <BottomBar /> 
		  
		  <Footer />
		 
		
	  </div>
		  </>
	);
  };
  
  export default FeedPage;
  