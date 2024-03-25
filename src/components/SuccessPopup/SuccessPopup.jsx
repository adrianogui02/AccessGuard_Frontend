import React from 'react';
import './SuccessPopup.css';

export default function SuccessPopup({ message, onClose }) {
  return (
    <div className="popup-container">
      <div className="success-popup">
        <div className="success-popup-content">
          <p>{message}</p>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};
