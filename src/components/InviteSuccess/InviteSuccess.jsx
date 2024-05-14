import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./InviteSuccess.css"; // Assegure que o caminho do CSS está correto
import logo from "../../assets/accessguard_logo.png";

const InviteSuccess = () => {
  const [invitation, setInvitation] = useState(null);
  const { uuid } = useParams();

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/invite/getByUUID/${uuid}`
        );
        setInvitation(response.data);
      } catch (error) {
        console.error("Erro ao buscar convite:", error);
      }
    };

    fetchInvitation();
  }, [uuid]);

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
            src={invitation.urlQRCode}
            alt="QR Code do Convite"
            className="invite-qrcode"
          />
          <p className="invite-detail">Escaneie o QR Code para Acesso</p>
          <p className="invite-detail">
            <strong>
              Use seu dispositivo para escanear o QR code abaixo e autorizar seu
              acesso
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteSuccess;
