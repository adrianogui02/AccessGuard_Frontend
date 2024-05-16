import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./InviteSuccess.css";
import logo from "../../assets/accessguard_logo.png";
import OkIcon from "../../assets/Icons/ok-icon.svg";

const InviteSuccess = () => {
  const [invitation, setInvitation] = useState(null);
  const { uuid } = useParams();

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/invite/getByUUID/${uuid}`
        );
        setInvitation(response.data);
        // Chama a função para desativar o QR Code
        deactivateQRCode(uuid);
      } catch (error) {
        console.error("Erro ao buscar convite:", error);
      }
    };

    fetchInvitation();
  }, [uuid]);

  const deactivateQRCode = async (uuid) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/invite/desactive/${uuid}`
      );
      console.log("QR Code desativado com sucesso!");
    } catch (error) {
      console.error("Erro ao desativar QR Code:", error);
    }
  };

  if (!invitation) {
    return (
      <div className="invite-details-background">
        <div className="blur-effect"></div>
        <div>Carregando detalhes do convite...</div>
      </div>
    );
  }

  return (
    <div className="invite-details-background">
      <div className="invite-details-container">
        <img src={logo} className="invite-details-logo" alt="" />
        <div className="invite-details-content">
          <img
            src={OkIcon}
            alt="QR Code do Convite"
            className="invite-success-icon"
          />
          <p className="invite-detail">Escaneamento bem-sucedido!</p>
          <p className="invite-detail">
            <strong>
              Parabéns! Você escaneou com sucesso o QR code e seu acesso foi
              autorizado
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteSuccess;
