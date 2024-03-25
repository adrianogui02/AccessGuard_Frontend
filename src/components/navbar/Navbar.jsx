import React, { useState, useContext } from 'react';
import './navbar.css';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../../assets/logo.png';
import { Link } from "react-router-dom";
import { AuthContext } from '../../components/AuthContext/AuthContext'; // Importe o contexto de autenticação

export function Menu() {
  return(
  <>
     <Link to="/mytoken"><p>Wallet</p> </Link>
     <Link to="/mynft"><p>My NFTs</p> </Link>
     <Link to="/"><p>Activity</p> </Link> 
  </>
  )
  };

export default function Navbar() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { user, authenticated, logout } = useContext(AuthContext); // Use o contexto de autenticação
  console.log(user)
  console.log(authenticated)

  return (
    <div className='navbar'>
      <div className="navbar-links">
        <div className="navbar-links_logo">
          <img src={logo} alt="logo" />
          <Link to="/"> 
            <h1>ArkadeWallet</h1>
          </Link>
        </div>
        <div className="navbar-links_container">
         <Menu />
         {user && <Link to="/"><p onClick={logout}>Logout</p></Link> }
        </div>
      </div>
      <div className="navbar-sign">
        {user ? (
          <>
           <p className='user'>{user.user.fullName}</p> {/* Exibir o nome do usuário logado */}
          </>
        ): (
          <>
           <Link to="/login"> 
            <button type='button' className='primary-btn'>Login</button>
           </Link>
           <Link to="/register"> 
            <button type='button' className='secondary-btn'>Registre-se</button>
           </Link>
          </>
        )}
      </div>
      <div className="navbar-menu">
        {toggleMenu ? 
        <RiCloseLine  color="#fff" size={27} onClick={() => setToggleMenu(false)} /> 
        : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
          <div className="navbar-menu_container scale-up-center" >
            <div className="navbar-menu_container-links">
             <Menu />
            </div>
            <div className="navbar-menu_container-links-sign">
            {user ? (
              <>
              <Link to="/create"> 
                <button type='button' className='primary-btn' >Create</button>
              </Link>
              <p>{user.user.fullName}</p> {/* Exibir o nome do usuário logado */}
              </>
            ): (
              <>
              <Link to="/login"> 
              <button type='button' className='primary-btn'>Sign In</button>
              </Link>
              <Link to="/register"> 
                <button type='button' className='secondary-btn'>Sign Up</button>
              </Link>
              </>
            )}
           
            </div>
          </div>
        )}
      </div>
    </div>
  );
}