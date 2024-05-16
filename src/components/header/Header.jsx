import React from "react";
import "./header.css";
import { Link } from "react-router-dom";
import logo from "../../assets/accessguard_logo.png";
import { useAuth } from "../AuthContext/AuthContext";

export default function Header() {
  const { authState } = useAuth();
  // Aqui você pode acessar authState.user para obter as informações do usuário logado
  const { user } = authState;
  console.log(user);

  return (
    <div className="header">
      <div className="header-right">
        <Link to="/Home">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>
      <div className="header-center">
        <Link to="/Residents" className="header-link">
          Moradores
        </Link>
        <Link to="/Vehicles" className="header-link">
          Veículos
        </Link>
        <Link to="/Bookings" className="header-link">
          Reservas
        </Link>
        <Link to="/Invites" className="header-link">
          Convites
        </Link>
      </div>

      <div className="header-left">
        {/* Exibir o nome do usuário */}
        {user && user.name && (
          <Link to="/perfil" className="user-name">
            {user.name}
          </Link>
        )}
        {/* Exibir a foto do usuário */}
        {user && user.picture && (
          <img src={user.picture} alt="User" className="user-photo" />
        )}
      </div>
    </div>
  );
}
