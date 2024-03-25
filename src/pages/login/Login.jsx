import React, { useContext, useState } from "react";
import "./login.css";
import { useNavigate, useLocation } from "react-router-dom";
import SuccessPopup from "../../components/SuccessPopup/SuccessPopup";
import { BsChevronLeft } from "react-icons/bs";
import logo from "../../assets/Arkade.svg";
import { AuthContext } from "../../components/AuthContext/AuthContext"; // Importe useAuth do seu contexto
import Footer from "../../components/footer/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const server = process.env.REACT_APP_WALLET_SERVER;

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setAuthState, authState } = useContext(AuthContext);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Estado para mostrar/ocultar o popup
  // const {login}  = useAuth(); // Use o hook useAuth para acessar o contexto de autenticação
  const navigate = useNavigate(); // Use o hook useNavigate para navegar
  // Função para lidar com mudanças nos campos de formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Função para enviar os dados de login para a API
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Enviar os dados de login para verificar se o usuário existe
      const loginResponse = await fetch(`${server}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (loginResponse.ok) {
        // O usuário existe, agora recupere os dados do usuário por e-mail
        const userDataResponse = await fetch(
          `${server}/getAccountByEmail/${formData.email}`
        );
        const userData = await userDataResponse.json();

        // Despachar a ação LOGIN para atualizar o estado de autenticação
        setAuthState({ user: userData });

        // Redirecionar para a página home
        navigate("/home");
      } else {
        // Tratar erros de login, exibir mensagens de erro, etc.
        // Aqui você pode exibir uma mensagem de erro para o usuário
        toast.info("Email ou senha inválidos", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false); // Fechar o popup de sucesso
    navigate("/home"); // Redirecionar para a página de login
  };

  return (
    <>
      <div className="login section__padding">
        <div className="arkade-wallet">
          <img src={logo} alt="Arkade Wallet Logo" />
          <h1 className="wallet-name">WALLET</h1>
        </div>
        <div className="login-container">
          <div className="login-top-forms">
            <BsChevronLeft
              className="back-icon"
              onClick={() => navigate("/")}
            />
            <h1 className="login-text">Login</h1>
          </div>
          <form
            className="login-writeForm"
            autoComplete="off"
            onSubmit={handleLogin}
          >
            <div className="login-formGroup">
              <label>E-Mail</label>
              <input
                type="email"
                placeholder="Insira seu e-mail"
                name="email" // Adicione o atributo 'name' para associar ao estado 'formData'
                value={formData.email} // Adicione o valor do estado 'formData'
                onChange={handleChange} // Chame a função 'handleChange' para atualizar o estado
              />
            </div>
            <div className="login-formGroup">
              <label>Senha</label>
              <input
                type="password"
                placeholder="Insira sua senha"
                name="password" // Adicione o atributo 'name' para associar ao estado 'formData'
                value={formData.password} // Adicione o valor do estado 'formData'
                onChange={handleChange} // Chame a função 'handleChange' para atualizar o estado
              />
            </div>

            <div className="login-button">
              <button className="login-writeButton" type="submit">
                Confirmar
              </button>
              {/* <Link to="/register">
            <button className='login-reg-writeButton' type='submit'>Register</button>
          </Link> */}
            </div>
          </form>
          {showSuccessPopup && (
            <SuccessPopup
              message={`Bem-vindo, ${""}`} // Mostrar a mensagem de boas-vindas com o nome do usuário
              onClose={handleCloseSuccessPopup}
            />
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
