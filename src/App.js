import "./App.css";
import { Home, First, Invite } from "./pages";

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
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
