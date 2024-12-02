import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import CustomLogin from './components/login/CustomLogin';
import RegisterPage from './components/login/RegisterPage';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomLogin />} />
        <Route path="/register" element={<RegisterPage />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;