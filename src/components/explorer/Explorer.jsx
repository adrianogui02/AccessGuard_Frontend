// Explorer.js
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import "./explorer.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Arkade.svg";
import copy from "../../assets/copyIcon.svg";
import { IoWalletOutline } from "react-icons/io5";
import HistoryList from "../historyList/historyList";
import Bids from "../bids/Bids";
import TokenList from "../tokenList/tokenList";
import { AuthContext } from "../../components/AuthContext/AuthContext";
import { CopyToClipboard } from "react-copy-to-clipboard";

const server = process.env.REACT_APP_WALLET_SERVER;

const Explorer = () => {
  const { authState } = useContext(AuthContext);
  const [selectedOption, setSelectedOption] = useState("Tokens");
  const [ownerName, setOwnerName] = useState("");
  const [tokenValue, setTokenValue] = useState(null);
  const [addressValue, setAddressValue] = useState("teste");

  const [nftData, setNftData] = useState([]);
  const [loadingTokenValue, setLoadingTokenValue] = useState(false);
  const navigate = useNavigate();

  const fetchTokenValue = async () => {
    try {
      setLoadingTokenValue(true);
      const response = await axios.get(
        `${server}/balance/${authState.user.wallet.walletData.address}`
      );
      const tokenValueData = response.data.balanceInTekoin / 100;
      setTokenValue(tokenValueData);
    } catch (error) {
      console.error("Error fetching token value:", error);
    } finally {
      setLoadingTokenValue(false);
    }
  };

  const fetchNftData = async () => {
    try {
      const response = await axios.get(
        `${server}/nft/nftsAccount/${authState.user.wallet.walletData.address}`
      );
      const nftData = response.data.nfts || [];
      setNftData(nftData);
    } catch (error) {
      console.error("Error fetching NFTs Data:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (authState && authState.user && authState.user.wallet.walletData) {
      setAddressValue(authState.user.wallet.walletData.address);
      setOwnerName(authState.user.fullName);
      fetchTokenValue();
      fetchNftData();
    }
  }, [authState]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };
  const handleButtonClick = () => {
    window.location.href = "https://arkademarketplace.com/";
  };

  const renderSelectedContent = () => {
    if (!authState || !authState.user) {
      return <p>Authentication required. Redirecting to the login page...</p>;
    }

    switch (selectedOption) {
      case "NFTs":
        return (
          <div>
            {" "}
            <Bids nftData={nftData} />{" "}
          </div>
        );
      case "Tokens":
        return (
          <div>
            <TokenList tokenValue={tokenValue} />
          </div>
        );
      case "Histórico":
        return (
          <div>
            <HistoryList addressValue={addressValue} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="explorer-container">
        <div className="explorer">
          <img src={logo} className="arkade-logo" alt="Arkade Wallet Logo" />
          <button className="marketplace-button" onClick={handleButtonClick}>
            Acessar Marketplace
          </button>
        </div>
        <div className="sub-container">
          <div className="header">
            <div className="header-content">
              <h1 className="tekoin">Tekoin</h1>
              <p className="nome-dono">{ownerName}</p>
            </div>
          </div>
          <div className="navigation">
            <div className="navigation-saldo">
              <IoWalletOutline className="wallet-logo" />
              {loadingTokenValue ? (
                <p className="saldo-tekoin">Loading...</p>
              ) : (
                <p className="saldo-tekoin">{tokenValue} Tekoin</p>
              )}
            </div>
            <div className="navigation-address">
              <CopyToClipboard
                text={
                  authState &&
                  authState.user &&
                  authState.user.wallet.walletData.address
                }
              >
                <button className="address-button">
                  <span>My Address</span>
                  <img src={copy} alt="Wallet Icon" className="address-icon" />
                </button>
              </CopyToClipboard>
            </div>
            <div className="navigation-options">
              <button
                className={
                  selectedOption === "NFTs"
                    ? "navigation-buttons focus"
                    : "navigation-buttons"
                }
                onClick={() => handleOptionClick("NFTs")}
              >
                NFTs
              </button>
              <button
                className={
                  selectedOption === "Tokens"
                    ? "navigation-buttons focus"
                    : "navigation-buttons"
                }
                onClick={() => handleOptionClick("Tokens")}
              >
                Tokens
              </button>
              <button
                className={
                  selectedOption === "Histórico"
                    ? "navigation-buttons focus"
                    : "navigation-buttons"
                }
                onClick={() => handleOptionClick("Histórico")}
              >
                Histórico
              </button>
            </div>
          </div>
          <div className="navigation-content">{renderSelectedContent()}</div>
        </div>
      </div>
    </>
  );
};

export default Explorer;
