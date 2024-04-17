import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Invite.css";
import { useAuth } from "../AuthContext/AuthContext";

const Invitations = () => {
  const { authState } = useAuth();
  // Aqui você pode acessar authState.user para obter as informações do usuário logado
  const { user } = authState;
  console.log("user Context", user);
  const [invitations, setInvitations] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
  });

  // Função para carregar os convites ativos do usuário
  const loadInvitations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/invite/getByUser/${user.idUser}`
      );
      console.log("Invites", response);
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
          numeroTelefoneConvidado: formData.telefone,
        }
      );
      console.log("Convite criado com sucesso:", response.data);
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
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="invitations-container">
      {/* Lista de convites ativos */}
      <div className="invitations-list">
        <h2>Convites Ativos</h2>
        <ul>
          {invitations.map((invitation, index) => (
            <li key={index}>
              {/* Exibir detalhes do convite */}
              Nome: {invitation.nome}, Telefone: {invitation.telefone}
            </li>
          ))}
        </ul>
      </div>

      {/* Formulário para criar um novo convite */}
      <div className="invitations-form">
        <h2>Gerar Convite</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome:</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Telefone:</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Gerar Convite</button>
        </form>
      </div>
    </div>
  );
};

export default Invitations;
