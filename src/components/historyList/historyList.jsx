import React, { useEffect, useState } from "react";
import axios from "axios";
import "./historyList.css";
import logoRecebido from "../../assets/arrowIcon.svg";
import logoEnviado from "../../assets/reversearrowIcon.svg";

const HistoryList = ({ addressValue }) => {
  const [historicoTekoin, setHistoricoTekoin] = useState([]);
  const [historicoNft, setHistoricoNft] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("nft"); // Padrão para NFT

  useEffect(() => {
    fetchTransactionHistory();
  }, [addressValue]);

  const fetchTransactionHistory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_WALLET_SERVER}/getActivity/${addressValue}`
      );
      const { historicoTekoin, historicoNft } = response.data;
      setHistoricoTekoin(historicoTekoin);
      setHistoricoNft(historicoNft);
    } catch (error) {
      console.error("Erro ao obter histórico de transações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchTransactionHistory();
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div>
        <span>{formattedDate}</span> <span>{formattedTime}</span>
      </div>
    );
  };

  const filteredHistorico =
    selectedType === "nft" ? historicoNft : historicoTekoin;

  return (
    <div>
      {loading ? (
        <p>Carregando histórico...</p>
      ) : (
        <div>
          <div className="div-buttons">
            <div className="history-buttons">
              <button
                className={
                  selectedType === "nft"
                    ? "button-history focus-button"
                    : "button-history"
                }
                onClick={() => handleTypeChange("nft")}
              >
                NFTs
              </button>
              <button
                className={
                  selectedType === "erc20"
                    ? "button-history focus-button"
                    : "button-history"
                }
                onClick={() => handleTypeChange("erc20")}
              >
                Transações
              </button>
            </div>
            <div>
              <span className="refresh-span" onClick={handleRefresh}>
                Atualizar Lista
              </span>
            </div>
          </div>

          <div className="history-container">
            {filteredHistorico.map((historico, index) => (
              <div key={index} className="transaction-container">
                <div className="transaction-info">
                  <img
                    className="logo"
                    src={
                      historico.typeStatus === "Enviado"
                        ? logoEnviado
                        : logoRecebido
                    }
                    alt="Imagem"
                  />
                  <div className="transaction-text">
                    <span
                      className={
                        historico.typeStatus === "Enviado" ? "send" : "recived"
                      }
                    >
                      {historico.typeStatus}
                    </span>
                    <span className="transaction-date">
                      {formatDate(historico.timestamp)}
                    </span>
                  </div>
                  <span className="game-name">{historico.game}</span>
                </div>
                <div className="transaction-value">
                  {selectedType === "erc20" ? (
                    // Se a transação for ERC20, mostrar o valor
                    `${historico.amount} TK`
                  ) : (
                    // Se a transação for NFT, mostrar a imagem, nome e coleção
                    <div className="nft-content">
                      <img
                        className="nft-image"
                        src={historico.nftImage}
                        alt="NFT Imagem"
                      />
                      <div className="transaction-history-nft-info">
                        <p>{historico.nftName}</p>
                        <p>{historico.nftCollection}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryList;
