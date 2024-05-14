import "./App.css";
import { Home, First, Invite, InviteDetails } from "./pages";
import { AuthProvider } from "../src/components/AuthContext/AuthContext"; // Importe o AuthProvider
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<First />} />
          <Route path="/home" element={<Home />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/QRCode/Details/:uuid" element={<InviteDetails />} />
          <Route path="/QRCode/Success/:uuid" element={<InviteDetails />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
