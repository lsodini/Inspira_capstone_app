import React from 'react';

import BottomBar from '../homepage/BottomBar';
import '../../css/NewsPage.css';
import Footer from "../login/Footer";
import NavBar from "../homepage/NavBar";
import Cart from './Cart';

const CartPage = () => {
	return (
	  <>
	  
	
	  <div className="layout">
		
	  <NavBar />
	 
	<Cart />
		  
		 
		  
		  
	   <BottomBar /> 
		  
		  <Footer />
		 
		
	  </div>
		  </>
	);
  };
  
  export default CartPage;
  