import React, { useEffect, useState } from "react";
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
      // Decodifica o token JWT para extrair as informações do usuário
      const { email, name, picture } = jwtDecode(credentialResponse.credential);

      // Envia os dados do usuário para o backend para verificação e criação se necessário
      const response = await axios.get(
        `http://localhost:3001/api/users/getByEmail/${email}`
      );

      const idUser = response.data[0]._id;

      // Verifica se o login foi bem-sucedido
      if (Array.isArray(response.data) && response.data.length === 1) {
        console.log("Usuário logado com sucesso");
        setAuthState({ user: { email, name, picture, idUser } });
        // Redireciona o usuário para a página home
        navigate("/Home");
      } else {
        // Se o usuário não existir, cria um novo usuário
        const createUserResponse = await axios.post(
          `http://localhost:3001/api/users/create`,
          {
            nome: name,
            email: email,
            telefone: "", // Coloque os valores padrão ou deixe em branco, dependendo da lógica do seu aplicativo
            endereco: "", // Coloque os valores padrão ou deixe em branco, dependendo da lógica do seu aplicativo
            fotoPerfil: picture, // Se você quiser usar a foto do Google como foto do perfil, pode passá-la aqui
          }
        );

        if (createUserResponse.statusText === "Created") {
          console.log("Usuário criado e logado com sucesso");

          // Redirecione o usuário para a página home
          navigate("/Home");
        } else {
          console.log("Erro ao criar usuário");
        }
      }
    } catch (error) {
      console.error("Erro durante o login:", error);
    }
  };

  return (
    <>
      <div className="login_section__padding">
        <div className="arkade-wallet">
          <img src={logo} alt="AccessGuard Logo" />
          <h1 className="wallet-name">
            Com o AccessGuard, você pode gerenciar facilmente as permissões de
            entrada, criar convites com QR codes seguros e garantir a segurança
            do seu espaço.
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
    </>
  );
}
