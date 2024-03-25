import React from 'react';
import './navbarAuth.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'

export default function NavbarAuthenticated({ username, handleLogout }) {
  return(
    <div className='navbar'>
      <div className="navbar-links">
        <div className="navbar-links_logo">
            <img src={logo} alt="logo" />
            <Link to="/"> 
              <h1>ArkadeWallet</h1>
            </Link>
        </div>
        <div className="navbar-links_container">
          <Link to="/"><p>Tokens</p> </Link>
          <Link to="/mynft"><p>My NFTs</p> </Link>
          <Link to="/"><p>Activity</p> </Link> 
          <p onClick={handleLogout}>Logout</p>
          <p>{username}</p>
        </div>
      </div>
      <div className="navbar-sign">
        {/* ... Seu código de botões Create e Connect */}
      </div>
      <div className="navbar-menu">
        {/* ... Seu código de menu hamburguer */}
      </div>
    </div>
)};
