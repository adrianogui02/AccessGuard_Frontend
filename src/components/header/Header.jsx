import React from "react";
import "./Header.css";
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
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="header-center">
        <Link to="/moradores" className="header-link">
          Moradores
        </Link>
        <Link to="/veiculos" className="header-link">
          Veículos
        </Link>
        <Link to="/reservas" className="header-link">
          Reservas
        </Link>
        <Link to="/invite" className="header-link">
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
