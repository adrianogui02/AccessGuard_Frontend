import React from "react";
import "./first.css";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../../assets/accessguard.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import { useAuth } from "../../components/AuthContext/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { setAuthState } = useAuth();

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email, name, picture } = decoded;

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/getByEmail/${email}`
      );
      if (response.data && response.data.length === 1) {
        const user = { email, name, picture, idUser: response.data[0]._id };
        setAuthState({ user });
        navigate("/Home");
      } else {
        const createUserResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/users/create`,
          {
            nome: name,
            email: email,
            telefone: "",
            endereco: "",
            fotoPerfil: picture,
          }
        );
        if (createUserResponse.status === 201) {
          setAuthState({
            user: { ...createUserResponse.data, email, name, picture },
          });
          navigate("/Home");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login falhou. Por favor, tente novamente.");
    }
  };

  return (
    <div className="login_section__padding">
      <div className="arkade-wallet">
        <img src={logo} alt="AccessGuard Logo" />
        <h1 className="wallet-name">
          Com o AccessGuard, você pode gerenciar facilmente as permissões de
          entrada, criar convites com QR codes seguros e garantir a segurança do
          seu espaço.
        </h1>
      </div>
      <div className="form-div">
        <div className="first-login-container">
          <h1 className="title-login-name">Bem-vindo ao AccessGuard</h1>
          <form className="first-login-writeForm" autoComplete="off">
            <div className="first-login-formGroup">
              <label className="label-login">
                Faça login para acessar o portal seguro de controle de acesso.
              </label>
              <GoogleLogin
                type="standard"
                theme="outline"
                shape="pill"
                size="large"
                width="250px"
                logo_alignment="center"
                onSuccess={handleGoogleLogin}
                onError={() => {
                  console.log("Login Failed");
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
