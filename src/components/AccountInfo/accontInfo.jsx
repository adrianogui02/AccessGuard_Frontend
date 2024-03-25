// AccountInfo.js

import React, { useState, useContext, useEffect } from 'react';
import './accountInfo.css';
import axios from 'axios';
import { AuthContext } from '../../components/AuthContext/AuthContext';
import AccountPopup from '../AccontPopup/AccountPopup'; // Importe o novo componente

export default function AccountInfo({ title }) {
  const { user, authenticated, logout } = useContext(AuthContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [userAddress, setUserAddress] = useState('');
  const [ethBalance, setEthBalance] = useState(null);
  const [usdBalance, setUsdBalance] = useState(null);

  const fetchBalance = async (accountIndex) => {
    try {
      if (authenticated && user.user.wallet[accountIndex]) {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/balance/${user.user.wallet[accountIndex].address}`
        );
        const data = response.data;
        setEthBalance(data.balanceInEther);
        setUsdBalance(data.balanceInUSD);
      }
    } catch (error) {
      console.error('Erro ao buscar o saldo da carteira:', error);
    }
  };

  useEffect(() => {
    fetchBalance(selectedAccount);
  }, [authenticated, user, selectedAccount]);

  useEffect(() => {
    if (authenticated) {
      setUserAddress(user.user.wallet[selectedAccount]?.address || '');
    }
  }, [authenticated, user, selectedAccount]);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleAccountSelect = (accountIndex) => {
    setSelectedAccount(accountIndex);
    closePopup();
  };

  return (
    <div className="bids section__padding">
      <div className="bids-container">
        <div className="bids-container-text">
          <h1>{title}</h1>
        </div>
        {authenticated && (
          <div className="user-wallet-address">
            <div className='button'>
              <button 
              onClick={openPopup}
              className='accontButton'
              >Contas</button>
            </div>
            {isPopupOpen && (
              <AccountPopup
                accounts={user.user.wallet}
                selectedAccount={selectedAccount}
                onClose={closePopup}
                onAccountSelect={handleAccountSelect}
              />
            )}
            <p className="address">{userAddress}</p>
            <div className="cardSaldo">
              {ethBalance !== null && (
                <p className="saldoText">Ethereum {ethBalance} ETH</p>
              )}
              {usdBalance !== null && (
                <p className="saldoText">Dolar $ {usdBalance}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



