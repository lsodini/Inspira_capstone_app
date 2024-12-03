import React, { useState, useEffect } from "react";
import "../../css/AuthForm.css";
import RegisterPage from "./RegisterPage";
import CustomLogin from "./CustomLogin";
import Footer from "./Footer";
import BaseNavbar from "./BaseNavbar";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState(""); 

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

 
  const backgroundImages = [
	"url('/images/formbg.jpg')",
    "url('/images/formbg1.jpg')", 
    "url('/images/formbg2.jpg')", 
    "url('/images/formbg3.jpg')",
	"url('/images/formbg4.jpg')",
    "url('/images/formbg5.jpg')", 
    "url('/images/formbg6.jpg')"
  ];

  // Cambia l'immagine di sfondo ogni volta che il componente è caricato
  useEffect(() => {
	const randomIndex = Math.floor(Math.random() * backgroundImages.length);
	const randomImage = backgroundImages[randomIndex];
	console.log(randomImage); 
	setBackgroundImage(randomImage);
  }, []);
  

  return (
    <>
      <BaseNavbar />
      <div className="mainContainer">
        <div className={`container ${isLogin ? "" : "right-panel-active"}`} id="container">
          <RegisterPage />
          <CustomLogin />
          <div className="overlay-container">
            <div className="overlay" style={{ backgroundImage: backgroundImage }}>
              <div className="overlay-panel overlay-left">
                <h1>Benvenuto su Inspira</h1>
                <p>
                  Accedi per continuare a esplorare, connetterti e lasciarti ispirare.
                </p>
                <button className="ghost" onClick={toggleForm}>
                  Accedi
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Scopri il Mondo di Inspira</h1>
                <p>
                  Crea un account per condividere idee, ispirarti e trasformare le tue passioni.
                </p>
                <button className="ghost" onClick={toggleForm}>
                  Registrati
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthForm;
