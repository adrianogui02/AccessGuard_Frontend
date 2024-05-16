import "./App.css";
import {
  Home,
  First,
  Invite,
  InviteDetails,
  InviteSuccess,
  InviteFailed,
  Residents,
  Bookings,
  Vehicles,
} from "./pages";
import { Header } from "./components";
import { AuthProvider } from "../src/components/AuthContext/AuthContext";
import { Routes, Route, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  // Função para determinar se o Header deve ser exibido
  const shouldShowHeader = () => {
    const path = location.pathname;
    // Verifica se o caminho atual é algum dos caminhos especiais onde o Header não deve ser mostrado
    return !(
      path === "/" ||
      /^\/QRCode\/Details\/[^/]+$/.test(path) ||
      /^\/QRCode\/Success\/[^/]+$/.test(path) ||
      /^\/QRCode\/Failed\/[^/]+$/.test(path)
    );
  };

  return (
    <div>
      <AuthProvider>
        {shouldShowHeader() && <Header />}
        <Routes>
          <Route path="/" element={<First />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Invites" element={<Invite />} />
          <Route path="/QRCode/Details/:uuid" element={<InviteDetails />} />
          <Route path="/QRCode/Success/:uuid" element={<InviteSuccess />} />
          <Route path="/QRCode/Failed/:uuid" element={<InviteFailed />} />
          <Route path="/Residents" element={<Residents />} />
          <Route path="/Bookings" element={<Bookings />} />
          <Route path="/Vehicles" element={<Vehicles />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
