import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Booking.css";
import { useAuth } from "../AuthContext/AuthContext";
import churrasqueiraIcon from "../../assets/Icons/churrasqueira.png";
import quadraIcon from "../../assets/Icons/quadra-de-basquete.png";
import salaoIcon from "../../assets/Icons/festa.png";

const Bookings = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const userID = user.idUser;
  const [bookingData, setBookingData] = useState({
    location: "",
    date: "",
    time: "",
  });
  const [bookings, setBookings] = useState([]);
  console.log("reservas", bookings);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/reservation/getByUser/${userID}`
    );
    setBookings(response.data);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/reservation/create`,
        {
          location: bookingData.location,
          date: bookingData.date,
          time: bookingData.time,
          user: userID,
        }
      );
      console.log("Booking created:", response.data);
      fetchBookings(); // Atualiza a lista de reservas
      // Redefine o estado para limpar o formulário
      setBookingData({
        location: "",
        date: "",
        time: "",
      });
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/reservation/delete/${bookingId}`
      );
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const getIconForLocation = (location) => {
    switch (location) {
      case "Churrasqueira":
        return churrasqueiraIcon;
      case "Quadra Poliesportiva":
        return quadraIcon;
      case "Salão de Festas":
        return salaoIcon;
      default:
        return null; // Ou algum ícone padrão
    }
  };

  const formatDateAndTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat("pt-BR").format(date);
    const formattedTime = timeString.slice(0, 5); // Extrai apenas a hora e minuto no formato HH:mm
    return `${formattedDate} às ${formattedTime}`;
  };

  return (
    <div className="bookings-container">
      <div className="bookings">
        <h2>Suas Reservas</h2>
        <div className="bookings-list">
          {bookings.map((booking, index) => (
            <div key={index} className="bookings-item">
              <div className="bookings-item-left">
                <img
                  src={getIconForLocation(booking.location)}
                  alt={booking.location}
                />
              </div>
              <div className="bookings-item-right">
                <div className="bookings-item-right-content-left">
                  <strong className="strong-reservation">Local</strong>{" "}
                  {booking.location}
                  <strong className="strong-reservation">
                    Data da Reserva
                  </strong>{" "}
                  {formatDateAndTime(booking.date, booking.time)}
                </div>
                <div className="bookings-item-right-content-right">
                  <p
                    className="delete"
                    onClick={() => handleDeleteBooking(booking._id)}
                  >
                    Excluir
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bookings-form">
        <h2>Adicionar Reserva</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Local</label>
            <select
              name="location"
              value={bookingData.location}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione...</option>
              <option value="Churrasqueira">Churrasqueira</option>
              <option value="Quadra Poliesportiva">Quadra Poliesportiva</option>
              <option value="Salão de Festas">Salão de Festas</option>
              {/* Adicione mais opções conforme necessário */}
            </select>
          </div>
          <div>
            <label>Data</label>
            <input
              type="date"
              name="date"
              value={bookingData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Horário</label>
            <input
              type="time"
              name="time"
              value={bookingData.time}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="div-button-create-bookings">
            <button type="submit">Reservar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bookings;
