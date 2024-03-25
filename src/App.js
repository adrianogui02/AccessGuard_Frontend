import "./App.css";
import {
  Home,
  Profile,
  Create,
  Login,
  Register,
  MyNFT,
  MyToken,
  First,
} from "./pages";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "../src/components/AuthContext/AuthContext"; // Importe o AuthProvider
import { Routes, Route } from "react-router-dom";
const googleID = process.env.REACT_APP_GOOGLE;

function App() {
  return (
    <div>
      <AuthProvider>
        {" "}
        {/* Use o AuthProvider para envolver a aplicação */}
        <GoogleOAuthProvider clientId={googleID}>
          <Routes>
            <Route path="/" element={<First />} />
          </Routes>
        </GoogleOAuthProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
