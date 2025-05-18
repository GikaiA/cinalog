import React, {useState} from 'react';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] =  useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
        <a href="/" className="logo-link">
        <p className='title'>Cinalog</p>
        </a>
      </div>
      <ul className={isOpen ? "nav-menu open" : "nav-menu"}>
        <li>
          <a href="/login" className="nav-item">Login</a>
        </li>
        <li>
          <a href="/register" className="nav-item">Create Account</a>
        </li>
        <div className='search-bar-section'>
          <input type='text' className='search-bar' alt='search-bar'></input>
        </div>
        <div className="close-menu" onClick={() => setIsOpen(false)}>
          ✖
        </div>
      </ul>
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </div>
    </nav>
  );
}

export default Navbar
