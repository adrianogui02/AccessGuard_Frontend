import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./InviteDetails.css";
import logo from "../../assets/accessguard_logo.png";

const InviteDetails = () => {
  const [invitation, setInvitation] = useState(null);
  const { uuid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/invite/getByUUID/${uuid}`
        );
        setInvitation(response.data);

        // Verifica se o convite não é ativo e redireciona
        if (response.data && !response.data.ativo) {
          navigate(`/QRCode/Failed/${uuid}`); // Substitua "/path-to-invalid-invite-page" pelo caminho correto
        }
      } catch (error) {
        console.error("Erro ao buscar convite:", error);
        // Opcional: adicione um tratamento ou redirecionamento também para falhas de fetch
        navigate("/error-page"); // Supondo que você tenha uma página de erro
      }
    };

    fetchInvitation();
  }, [uuid, navigate]);

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

export default InviteDetails;
