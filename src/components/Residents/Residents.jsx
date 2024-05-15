import React, { useState, useEffect } from "react";
import axios from "axios";
import InputMask from "react-input-mask";
import { useAuth } from "../AuthContext/AuthContext";
import "./Residents.css";

const Residents = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const userID = user.idUser;
  const [residentData, setResidentData] = useState({
    nome: "",
    email: "",
    celular: "",
    foto: null,
    fotoPreview: null,
  });
  const [residents, setResidents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  console.log("Residents: ", residents);
  console.log("residentData: ", residentData);

  const loadResidents = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/resident/getByUser/${userID}`
      );
      setResidents(response.data);
    } catch (error) {
      console.error("Erro ao carregar moradores:", error);
    }
  };

  useEffect(() => {
    loadResidents();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowPopup(false);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/resident/create`,
        {
          nome: residentData.nome,
          email: residentData.email,
          celular: residentData.celular,
          foto: residentData.fotoPreview,
          usuario: userID,
        }
      );
      console.log("Residente cadastrado com sucesso:", response.data);
      loadResidents(); // Recarrega a lista após adicionar
    } catch (error) {
      console.error("Erro ao cadastrar residente:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setResidentData({ ...residentData, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResidentData({
        ...residentData,
        foto: file,
        fotoPreview: URL.createObjectURL(file),
      });
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="residents-container">
      <div className="residents-list">
        {/* Aqui você pode listar os moradores cadastrados */}
      </div>
      <div className="residents-form">
        <h2>Adicionar Morador</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome do Morador</label>
            <input
              type="text"
              name="nome"
              value={residentData.nome}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Email do Morador</label>
            <input
              type="email"
              name="email"
              value={residentData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Celular do Morador</label>
            <InputMask
              mask="(99) 99999-9999"
              value={residentData.celular}
              onChange={handleInputChange}
              name="celular"
              type="text"
              required
            />
          </div>
          <div>
            <label htmlFor="photoUpload" className="upload-button">
              <span>
                {residentData.foto ? "Foto Selecionada" : "Selecione uma Foto"}
              </span>
            </label>
            <input
              type="file"
              id="photoUpload"
              name="photoUpload"
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: "none" }} // Esconde o input de arquivo
            />
          </div>
          <div className="div-button-create-resident">
            <button type="submit">Cadastrar Morador</button>
          </div>
        </form>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h3>Visualização de Imagem</h3>
            <img
              src={residentData.fotoPreview}
              alt="Preview"
              className="preview-image"
            />
            <button onClick={handleClosePopup}>Voltar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Residents;
