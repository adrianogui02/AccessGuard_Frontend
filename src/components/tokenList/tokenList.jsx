// TokenList.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import logo from '../../assets/profileIcon.svg'
import "./tokenList.css"
import { AuthContext } from "../../components/AuthContext/AuthContext";

const server = process.env.REACT_APP_WALLET_SERVER;

  const TokenList = ({tokenValue}) => {
  const { authState } = useContext(AuthContext);
  const [tokenValues, setTokenValue] = useState(null);
  const [loading, setLoading] = useState(null);

  const fetchTokenValue = async () => {
    try {
      setLoading(true); // Inicia o estado de carregamento
      const response = await axios.get(`${server}/balance/${authState.user.wallet.walletData.address}`);
      const tokenValueData = response.data.balanceInTekoin;
      setTokenValue(tokenValueData);
    } catch (error) {
      console.error("Erro ao buscar o valor do token:", error);
    } finally {
      setLoading(false); // Marca que o carregamento foi concluído, independentemente de ter sido bem-sucedido ou não
    }
  };

//   useEffect(() => {
//     if (authState.user && authState.user.wallet && authState.user.wallet.walletData) {
//       fetchTokenValue();
//     }
//   }, [authState]);

  const handleRefresh = () => {
    fetchTokenValue();
  };

  return (
    <div className="token-list">
      <div className="token-content">
        <div className="token-image">
          <img src={logo} alt="Token" />
        </div>
        <div className="token-info">
          <p className="token-name">Tekoin</p>
          {loading ? (
            <p className="loading-text">Atualizando saldo...</p>
          ) : (
            <p className="token-value">{tokenValue} TK</p>
          )}
        </div>
      </div>
      <div className="button-div">
        <span className="refresh-span" onClick={handleRefresh}>Atualizar Lista</span>
      </div>
    </div>
  );
};

export default TokenList;
