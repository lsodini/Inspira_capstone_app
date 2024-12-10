import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "./components/login/AuthPage";
import CustomHomePage from "./components/homepage/CustomHomePage";


function App() {
  return (
    <Router>
      <Routes>
        {/* Route per la pagina di login/registrazione */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* Route per altre pagine del sito */}
        <Route path="/homepage" element={<CustomHomePage />} />
       {/* <Route path="/resetPasswordPage" element={<ResetPasswordPage />} />*/}
        
        
      </Routes>
    </Router>
  );
}

export default App;
