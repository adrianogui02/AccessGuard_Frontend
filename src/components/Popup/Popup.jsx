import React from "react";
import "./Popup.css"; // Assuma que você criará um arquivo CSS para estilos

const Popup = ({ isOpen, close, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {children}
        <button className="popup-close-button" onClick={close}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Popup;
