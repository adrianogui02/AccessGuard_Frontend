import React, { useState, useEffect } from "react";
import axios from "axios";
import InputMask from "react-input-mask";
import "./Vehicles.css";
import { useAuth } from "../AuthContext/AuthContext";
import vehicleIcon from "../../assets/Icons/car.png";

const VehicleBookings = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const userID = user.idUser;
  const [vehicleData, setVehicleData] = useState({
    brand: "",
    model: "",
    year: "",
    licensePlate: "",
    color: "",
  });
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/vehicle/getByUser/${userID}`
    );
    setVehicles(response.data);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/vehicle/create`,
        {
          ...vehicleData,
          owner: userID,
        }
      );
      fetchVehicles();
      setVehicleData({
        brand: "",
        model: "",
        year: "",
        licensePlate: "",
        color: "",
      });
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/vehicle/delete/${vehicleId}`
      );
      setVehicles((prevVehicles) =>
        prevVehicles.filter((vehicle) => vehicle._id !== vehicleId)
      );
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  const carBrands = [
    "Audi",
    "BMW",
    "BYD",
    "CAOA Chery",
    "Chevrolet",
    "Citroën",
    "Fiat",
    "Ford",
    "Honda",
    "Hyundai",
    "Jac Motors",
    "Jeep",
    "Kia",
    "Land Rover",
    "Lexus",
    "Lifan",
    "Mercedes-Benz",
    "Mini",
    "Mitsubishi",
    "Nissan",
    "Peugeot",
    "Porsche",
    "Renault",
    "Subaru",
    "Suzuki",
    "Toyota",
    "Volkswagen",
    "Volvo",
  ];

  return (
    <div className="bookings-container">
      <div className="bookings">
        <h2>Seus Veículos</h2>
        <div className="bookings-list">
          {vehicles.map((vehicle, index) => (
            <div key={index} className="bookings-item">
              <div className="vehicles-item-left">
                <img src={vehicleIcon} alt={vehicle.brand} />
              </div>
              <div className="vehicles-item-right">
                <div className="vehicles-item-right-content-left">
                  <div className="vehicles-colum">
                    <strong className="strong">Marca</strong> {vehicle.brand}
                    <strong className="strong">Modelo</strong> {vehicle.model}
                  </div>
                  <div className="vehicles-colum">
                    <strong className="strong">Placa</strong>{" "}
                    {vehicle.licensePlate}
                    <strong className="strong">Ano</strong> {vehicle.year}
                  </div>
                </div>
                <div className="vehicles-item-right-content-right">
                  <p
                    className="delete"
                    onClick={() => handleDeleteVehicle(vehicle._id)}
                  >
                    Excluir
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="vehicles-form">
        <h2>Adicionar Veículo</h2>
        <form onSubmit={handleSubmit} className="vehicles-form-grid">
          <div>
            <label>Marca</label>
            <select
              name="brand"
              value={vehicleData.brand}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione a marca</option>
              {carBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Modelo</label>
            <input
              type="text"
              name="model"
              value={vehicleData.model}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Cor</label>
            <input
              type="text"
              name="color"
              value={vehicleData.color}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Ano</label>
            <input
              type="text"
              name="year"
              value={vehicleData.year}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Placa</label>
            <InputMask
              mask=""
              value={vehicleData.licensePlate}
              onChange={handleInputChange}
              type="text"
              name="licensePlate"
              required
            />
          </div>
        </form>
        <div className="div-button-create-vehicles">
          <button type="submit" onClick={handleSubmit}>
            Adicionar Veículo
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleBookings;
