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
import { AuthProvider } from "../src/components/AuthContext/AuthContext"; // Importe o AuthProvider
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <AuthProvider>
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
