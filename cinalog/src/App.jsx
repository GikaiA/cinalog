import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home/Home';
import Navbar from './Navbar/Navbar';
import Profile from './Profile/Profile';
import Footer from './Footer/Footer';
import Register from './Register/register';
import Login from "./Login/Login";
import MediaDetails from './MediaDetails/MediaDetails';

function App() {
  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Footer/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/:mediaType/:id" element={<MediaDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
