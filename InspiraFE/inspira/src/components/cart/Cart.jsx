import React, { useState, useEffect } from "react";
import "../../css/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Recupera gli items dal localStorage quando il componente viene montato
    const storedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedItems);

    // Calcola il totale
    const total = storedItems.reduce((acc, item) => acc + item.price, 0);
    setTotalPrice(total);
  }, []);

  const handleRemoveItem = (artworkId) => {
    const updatedCart = cartItems.filter(item => item.id !== artworkId);
    setCartItems(updatedCart);

    // Salva gli items aggiornati nel localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    // Ricalcola il totale
    const newTotal = updatedCart.reduce((acc, item) => acc + item.price, 0);
    setTotalPrice(newTotal);
  };

  const handleClearCart = () => {
    setCartItems([]);
    setTotalPrice(0);
    localStorage.removeItem("cartItems");
  };

  const handleCheckout = () => {
    // Funzione di checkout (es. invio richiesta a server)
    console.log("Procedi al checkout");
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
          <button onClick={handleCheckout} className="cart-checkout-btn">Procedi al Checkout</button>
          <button onClick={handleClearCart} className="cart-clear-btn">Svuota Carrello</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
