import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./InviteFailed.css"; // Assegure que o caminho do CSS está correto
import logo from "../../assets/accessguard_logo.png";
import FailIcon from "../../assets/Icons/failed-icon.svg";

const InviteFailed = () => {
  const [invitation, setInvitation] = useState(null);
  const { uuid } = useParams();

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await axios.get(
          `https://accessguardbackend-production.up.railway.app/api/invite/getByUUID/${uuid}`
        );
        setInvitation(response.data);
        // Chame a função para desativar o QR Code
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
        `https://accessguardbackend-production.up.railway.app/api/invite/desactive/${uuid}`
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
            src={FailIcon}
            alt="QR Code do Convite"
            className="invite-success-icon"
          />
          <p className="invite-detail">Convite Expirado</p>
          <p className="invite-detail">
            <strong>
              O convite que você está tentando utilizar expirou e não pode mais
              ser utilizado para acessar este local.
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteFailed;
