import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/accessguard_logo.png";
import { useAuth } from "../AuthContext/AuthContext";
import Modal from "../Modal/Modal";
import "./header.css";

export default function Header() {
  const navigate = useNavigate(); // Hook para redirecionar para outras páginas
  const [isModalOpen, setModalOpen] = useState(false);
  const { authState, setAuthState } = useAuth();
  const { user } = authState;
  const location = useLocation(); // Hook para acessar a localização atual

  const isActive = (path) => {
    return location.pathname === path;
  };
  useEffect(() => {
    console.log("User in Header:", user); // Verificar se o usuário está sendo atualizado
  }, [user]); // Dependência para re-renderização ao atualizar o usuário

  const handleLogout = () => {
    // Implemente a lógica para limpar o estado e redirecionar para o login
    setAuthState({ user: null, logged: false }); // Supondo que setAuthState pode lidar com o logout
    localStorage.removeItem("user"); // Limpar localStorage
    navigate("/"); // Redireciona para a tela de login
  };

  return (
    <div className="header">
      <div className="header-right">
        <Link to="/Home">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>
      <div className="header-center">
        <Link
          to="/Residents"
          className={`header-link ${isActive("/Residents") ? "active" : ""}`}
        >
          Moradores
        </Link>
        <Link
          to="/Vehicles"
          className={`header-link ${isActive("/Vehicles") ? "active" : ""}`}
        >
          Veículos
        </Link>
        <Link
          to="/Bookings"
          className={`header-link ${isActive("/Bookings") ? "active" : ""}`}
        >
          Reservas
        </Link>
        <Link
          to="/Invites"
          className={`header-link ${isActive("/Invites") ? "active" : ""}`}
        >
          Convites
        </Link>
      </div>

      <div className="header-left">
        {user && (
          <div onClick={() => setModalOpen(true)} className="user-name">
            {user.name}
          </div>
        )}
        {user && user.picture && (
          <img src={user.picture} alt="User" className="user-photo" />
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        close={() => setModalOpen(false)}
        user={user}
        logout={handleLogout}
      />
    </div>
  );
}
