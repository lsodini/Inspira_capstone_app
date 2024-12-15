import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "./components/login/AuthPage";
import CustomHomePage from "./components/homepage/CustomHomePage";
import CustomOtherUserPage from "./components/otherUserPage/CustomOtherUserPage";
import SearchPage from "./components/searchpage/SearchPage";
import NewsPage from "./components/newspage/NewsPage";

import FeedPage from "./components/feed/FeedPage";

function App() {  
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

       
        <Route exact path="/user/:username" element={<CustomOtherUserPage />} />
        <Route path="/homepage" element={<CustomHomePage />} />
<Route path="/search" element={<SearchPage />} />
<Route path="/news" element={<NewsPage />} />
<Route path="feed" element={<FeedPage />} />

      
        
        
      </Routes>
    </Router>
  );
}

export default App;
