// AccountSelectionPopup.js

import React from 'react';
import './AccountPopup.css';

const AccountPopup = ({ accounts, selectedAccount, onClose, onAccountSelect }) => {
  return (
    <div className="account-selection-popup">
      <div className="account-selection-popup-content">
        <h2>Escolher Conta</h2>
        <ul>
          {accounts.map((account, index) => (
            <li
              key={index}
              className={index === selectedAccount ? 'selected' : ''}
              onClick={() => onAccountSelect(index)}
            >
              {account.address}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default AccountPopup;
