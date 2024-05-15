import React, { useState, useEffect } from "react";
import axios from "axios";
import InputMask from "react-input-mask";
import { useAuth } from "../AuthContext/AuthContext";
import "./Residents.css";
import Popup from "../Popup/Popup";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../FirebaseStorage";

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
  const [selectedResident, setSelectedResident] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    loadResidents();
  }, []);

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

  const handleResidentClick = (resident) => {
    setSelectedResident(resident);
    setPopupContent(
      <>
        <div className="popup-resident-title">
          <h3>Detalhes do Morador</h3>
        </div>
        <img
          className="popup-resident-img"
          src={resident.foto}
          alt="Foto do Morador"
        />
        <div className="popup-resident-content">
          <p>{resident.nome}</p>
          <p>{resident.email}</p>
          <p>{resident.celular}</p>
        </div>
      </>
    );
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedResident(null);
  };

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
          foto: residentData.foto,
          usuario: userID,
        }
      );
      console.log("Residente cadastrado com sucesso:", response.data);
      loadResidents();
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
      const storageRef = ref(storage, `photos/${residentData.nome}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading file:", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setResidentData((prevState) => ({
              ...prevState,
              foto: downloadURL,
              fotoPreview: URL.createObjectURL(file),
            }));
            setPopupContent(
              <>
                <h3>Visualização de Imagem</h3>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="preview-image"
                />
              </>
            );
            setShowPopup(true);
          });
        }
      );
    } else {
      console.log("Nenhum arquivo selecionado");
    }
  };

  return (
    <div className="residents-container">
      <div className="residents">
        <h2>Moradores Cadastrados</h2>
        <div className="residents-list">
          {residents.map((resident, index) => (
            <div
              key={index}
              className="resident-item"
              onClick={() => handleResidentClick(resident)}
            >
              <div className="residents-item-left">
                <p>
                  <strong className="strong">Nome</strong> {resident.nome}
                </p>
                <p>
                  <strong className="strong">Email</strong>
                  {resident.email}
                </p>
              </div>
              <div className="residents-item-right">
                <img src={resident.foto} className="resident-image" alt="" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPopup && (
        <Popup isOpen={showPopup} close={handleClosePopup}>
          {popupContent}
        </Popup>
      )}
      <div className="residents-form">
        <h2>Adicionar Morador</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={residentData.nome}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={residentData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Celular</label>
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
    </div>
  );
};

export default Residents;
