import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home/Home';
import Search from './Search/Search';
import Navbar from './Navbar/Navbar';
import Profile from './Profile/Profile';
import Footer from './Footer/Footer';
import Register from './Register/register';

function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Footer/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
        
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
