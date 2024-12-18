import React, { useState, useEffect } from "react";
import "../../css/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
   
    const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedItems);

   
    const total = storedItems.reduce((acc, item) => acc + item.price, 0);
    setTotalPrice(total);
  }, []);

  const handleRemoveItem = (artworkId) => {
    const updatedCart = cartItems.filter(item => item.id !== artworkId);
    setCartItems(updatedCart);

   
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    
    const newTotal = updatedCart.reduce((acc, item) => acc + item.price, 0);
    setTotalPrice(newTotal);
  };

  const handleClearCart = () => {
    setCartItems([]);
    setTotalPrice(0);
    localStorage.removeItem("cartItems");
  };

  const handleCheckout = () => {
   
    console.log("Procedi al checkout");
  
    
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      console.error("No token found. User may not be logged in.");
      return;
    }
  
    
    cartItems.forEach(item => {
      fetch(`http://localhost:3001/api/transactions/buy/${item.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to mark artwork as sold");
        }
        return response.json();
      })
      .then(data => {
        console.log("Artwork marked as sold", data);
        handleClearCart(); 
      })
      .catch(error => console.error("Error marking artwork as sold:", error));
    });
  };
  

  return (
    <div className="cart vh-100">
      <h2>Carrello</h2>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Il carrello è vuoto</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.mediaUrls[0]} alt={item.title} className="cart-item-image" />
              <div className="cart-item-details">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <p>Prezzo: ${item.price}</p>
                <button onClick={() => handleRemoveItem(item.id)}>Rimuovi</button>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <h3>Totale: ${totalPrice}</h3>
          <button onClick={handleCheckout} className="cart-checkout-btn me-3">Procedi al Checkout</button>
          <button onClick={handleClearCart} className="cart-clear-btn">Svuota Carrello</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
