import React from "react";
import "./Modal.css"; // Assuma que este arquivo contém os estilos para o modal

const Modal = ({ isOpen, close, user, logout }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Perfil do Usuário</h2>
        <img src={user.picture} alt="Perfil" className="profile-picture" />
        <div className="profile-content">
          <strong className="profile-strong">Nome</strong>
          <p>{user.name}</p>
        </div>
        <div className="profile-content">
          <strong className="profile-strong">Email</strong>
          <p>{user.email}</p>
        </div>
        <div className="modal-actions">
          <button className="profile-button" onClick={close}>
            Fechar
          </button>
          <button className="profile-button-logout" onClick={logout}>
            Deslogar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
