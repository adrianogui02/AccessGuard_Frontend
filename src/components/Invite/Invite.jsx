import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Invite.css";
import { useNavigate } from "react-router";
import Popup from "../Popup/Popup";
import { useAuth } from "../AuthContext/AuthContext";
import InputMask from "react-input-mask";
import okIcon from "../../assets/Icons/ok.svg";

const Invitations = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  // Aqui você pode acessar authState.user para obter as informações do usuário logado
  const { user } = authState;
  console.log("user Context", user);
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
    navigate(`/QRCode/Details/${uuid}`); // Para React Router v6
  };

  // Função para carregar os convites ativos do usuário
  const loadInvitations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/invite/getByUser/${userID}`
      );
      console.log("Invites", response);
      console.log(invitations);
      setInvitations(response.data);
    } catch (error) {
      console.error("Erro ao carregar convites:", error);
    }
  };

  // Função para lidar com a submissão do formulário para gerar um novo convite
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/invite/create",
        {
          numeroTelefoneConvidado: formData.numeroTelefoneConvidado,
          nomeConvidado: formData.nomeConvidado,
          validoAte: formData.validoAte,
          criador: formData.criador,
        }
      );
      console.log("Convite criado com sucesso:", response.data);
      setPopupVisible(true); // Abre o popup
      // Atualizar a lista de convites após a criação bem-sucedida
      loadInvitations();
    } catch (error) {
      console.error("Erro ao criar convite:", error);
    }
  };

  // Atualizar a lista de convites quando o componente for montado
  useEffect(() => {
    loadInvitations();
  }, []);

  // Função para atualizar os dados do formulário conforme o usuário digita
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="invitations-container">
      {/* Popup para mostrar uma mensagem */}
      <Popup isOpen={popupVisible} close={() => setPopupVisible(false)}>
        <img src={okIcon} className="icon-sucess-popup" alt="" />
        <h4 className="text-sucess-popup">Convite Criado com Sucesso!</h4>
      </Popup>
      {/* Lista de convites ativos */}
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
                {/* Exibir detalhes do convite */}
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
                <img src={invitation.urlQRCode} className="qrcode-item" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulário para criar um novo convite */}
      <div className="invitations-form">
        <h2>Gerar Convite</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome do Convidado</label>
            <input
              type="text"
              name="nomeConvidado" // Deve ser 'nomeConvidado', não 'nome'
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
                  name="numeroTelefoneConvidado" // Deve ser 'numeroTelefoneConvidado', não 'telefone'
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
