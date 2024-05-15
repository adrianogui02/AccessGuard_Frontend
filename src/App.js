import "./App.css";
import { Home, First, Invite, InviteDetails, InviteSuccess } from "./pages";
import { AuthProvider } from "../src/components/AuthContext/AuthContext"; // Importe o AuthProvider
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <AuthProvider>
          <Route path="/" element={<First />} />
          <Route path="/home" element={<Home />} />
          <Route path="/invite" element={<Invite />} />
        </AuthProvider>
        <Route path="/QRCode/Details/:uuid" element={<InviteDetails />} />
        <Route path="/QRCode/Success/:uuid" element={<InviteSuccess />} />
      </Routes>
    </div>
  );
}

export default App;
