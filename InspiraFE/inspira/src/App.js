import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import CustomLogin from './components/login/CustomLogin';
import RegisterPage from './components/login/RegisterPage';
import CustomHomePage from './components/homepage/CustomHomePage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomLogin />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homepage" element={<CustomHomePage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;