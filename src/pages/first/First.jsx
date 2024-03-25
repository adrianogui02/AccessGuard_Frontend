import React, { useContext, useState, useEffect } from "react";
import "./first.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/accessguard.png";
import { AuthContext } from "../../components/AuthContext/AuthContext";
import Footer from "../../components/footer/Footer";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const server = process.env.REACT_APP_WALLET_SERVER;

export default function Login() {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const { setAuthState, authState } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const responseMessage = (response) => {
    console.log(response);
  };
  const errorMessage = (error) => {
    console.log(error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    try {
      // Decode o JWT para obter as informações do usuário
      const decodedToken = jwtDecode(e.credential);

      // Acesse as informações do usuário
      const userData = {
        email: decodedToken.email,
        name: decodedToken.name,
        firstName: decodedToken.given_name,
        picture: decodedToken.picture,
      };

      // Verificar se o usuário já está cadastrado no banco
      const existingUserResponse = await fetch(
        `${server}/getAccountByEmail/${userData.email}`
      );
      const existingUser = await existingUserResponse.json();

      if (existingUser._id) {
        // O usuário já existe, proceda com a autenticação
        // Atualize o contexto de autenticação com as informações do usuário
        setAuthState({ user: existingUser });
        // Redirecione diretamente para a página home
        navigate("/home");
      } else {
        // O usuário não existe, chame a API para criar a carteira e o usuário
        const response = await fetch(`${server}/createWalletUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: userData.name, // Use o nome do usuário do Google como fullName
            email: userData.email,
            password: "GoogleUser", // Defina uma senha padrão ou deixe em branco, dependendo das suas necessidades
          }),
        });

        const userCreated = await response.json();

        if (response.ok) {
          // Verificar se o usuário já está cadastrado no banco
          const existingUserResponse = await fetch(
            `${server}/getAccountByEmail/${userData.email}`
          );
          const existingUser = await existingUserResponse.json();
          setAuthState({ user: existingUser });
          // Atualize o contexto de autenticação com as informações do usuário
          //setAuthState({ user: existingUser });
          // Redirecione diretamente para a página home
          navigate("/home");
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
      }
    } catch (error) {
      console.error("Erro ao lidar com o login:", error);
      // Lidar com erros ou mostrar uma mensagem de erro
      errorMessage(error);
    }
  };

  return (
    <>
      <div className="login_section__padding">
        <div className="arkade-wallet">
          <img src={logo} alt="AccessGuard Logo" />
          <h1 className="wallet-name">
            {" "}
            Com o AccessGuard, você pode gerenciar facilmente as permissões de
            entrada, criar convites com QR codes seguros e garantir a segurança
            do seu espaço.
          </h1>
        </div>
        <div className="form-div">
          <div className="first-login-container">
            <h1 className="title-login-name">Bem-vindo ao AccessGuard</h1>
            <form
              className="first-login-writeForm"
              autoComplete="off"
              onSubmit={handleLogin}
            >
              <div className="first-login-formGroup">
                <label className="label-login">
                  Faça login para acessar o portal seguro de controle de acesso.{" "}
                </label>
                {/* Botão do Google Sign-In */}
                <GoogleLogin onSuccess={handleLogin} onError={errorMessage} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
