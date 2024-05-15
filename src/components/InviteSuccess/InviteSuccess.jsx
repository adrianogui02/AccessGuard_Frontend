import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Import useHistory
import "./InviteSuccess.css";

import logo from "../../assets/accessguard_logo.png";
import OkIcon from "../../assets/Icons/ok-icon.svg";

const InviteSuccess = () => {
  const [invitation, setInvitation] = useState(null);
  const { uuid } = useParams();
  const navigate = useNavigate(); // Para navegação programática

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await axios.get(
          `https://accessguardbackend-production.up.railway.app/api/invite/getByUUID/${uuid}`
        );
        setInvitation(response.data);

        if (response.data.active) {
          // Chame a função para desativar o QR Code se o convite está ativo

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

          deactivateQRCode(uuid);

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
                <img src={logo} className="invite-details-logo" alt="Logo" />
                <div className="invite-details-content">
                  <img
                    src={OkIcon}
                    alt="QR Code do Convite"
                    className="invite-success-icon"
                  />
                  <p className="invite-detail">Escaneamento bem-sucedido!</p>
                  <p className="invite-detail">
                    <strong>
                      Parabéns! Você escaneou com sucesso o QR code e seu acesso
                      foi autorizado.
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          );
        } else {
          // Redirecionar se o convite não estiver ativo
          navigate(`/QRCode/Failed/${uuid}`); // Assumindo que você tem uma rota '/error' para convites inativos
        }
      } catch (error) {
        console.error("Erro ao buscar convite:", error);
      }
    };

    fetchInvitation();
  }, [uuid, navigate]);
};

export default InviteSuccess;
