import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Invite.css";
import { useNavigate } from "react-router-dom";
import Popup from "../Popup/Popup";
import { useAuth } from "../AuthContext/AuthContext";
import InputMask from "react-input-mask";
import okIcon from "../../assets/Icons/ok.svg";

const Invitations = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { user } = authState;
  const userID = user.idUser;
  const [invitations, setInvitations] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    numeroTelefoneConvidado: "",
    nomeConvidado: "",
    validoAte: new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000
    ).toISOString(),
    criador: userID,
  });

  const handleRedirect = (uuid) => {
    navigate(`/QRCode/Details/${uuid}`);
  };

  const loadInvitations = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/invite/getByUser/${userID}`
      );
      const activeInvites = response.data.filter((invite) => invite.ativo); // Filtrando por convites ativos
      setInvitations(activeInvites);
    } catch (error) {
      console.error("Erro ao carregar convites:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/invite/create`,
        {
          numeroTelefoneConvidado: formData.numeroTelefoneConvidado,
          nomeConvidado: formData.nomeConvidado,
          validoAte: formData.validoAte,
          criador: formData.criador,
        }
      );
      console.log("Convite criado com sucesso:", response.data);
      setPopupVisible(true);
      loadInvitations();
    } catch (error) {
      console.error("Erro ao criar convite:", error);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="invitations-container">
      <Popup isOpen={popupVisible} close={() => setPopupVisible(false)}>
        <img src={okIcon} className="icon-sucess-popup" alt="" />
        <h4 className="text-sucess-popup">Convite Criado com Sucesso!</h4>
      </Popup>
      <div className="invitations">
        <h2>Convites Ativos</h2>
        <div className="invitations-list">
          {invitations.map((invitation, index) => (
            <div
              key={index}
              className="invitation-item"
              onClick={() => handleRedirect(invitation.uuid)}
            >
              <div className="invitations-item-left">
                <p>
                  <strong className="strong">Nome</strong>{" "}
                  {invitation.nomeConvidado}
                </p>
                <p>
                  <strong className="strong">Telefone</strong>{" "}
                  {invitation.numeroTelefoneConvidado}
                </p>
              </div>
              <div className="invitations-item-right">
                <img
                  src={invitation.urlQRCode}
                  className="qrcode-item"
                  alt="QR Code"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="invitations-form">
        <h2>Gerar Convite</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome do Convidado</label>
            <input
              type="text"
              name="nomeConvidado"
              value={formData.nomeConvidado}
              onChange={handleChange}
              required
            />
            <InputMask
              mask="+55 (99) 99999-9999"
              value={formData.numeroTelefoneConvidado}
              onChange={handleChange}
              maskChar=" "
            >
              {(inputProps) => (
                <input
                  type="text"
                  {...inputProps}
                  name="numeroTelefoneConvidado"
                  required
                />
              )}
            </InputMask>
          </div>
          <div className="div-button-create-invite">
            <button type="submit">Gerar Convite</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Invitations;
