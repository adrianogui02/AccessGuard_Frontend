import React, { useState } from 'react';
import './register.css'
import { useNavigate} from 'react-router-dom'
import SuccessPopup from '../../components/SuccessPopup/SuccessPopup'
import logo from '../../assets/Arkade.svg'
import {BsChevronLeft} from "react-icons/bs";
import Footer from '../../components/footer/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const server  = process.env.REACT_APP_WALLET_SERVER

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Estado para mostrar/ocultar o popup
  const navigate = useNavigate(); // Use o hook useNavigate para navegar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [confirmPassword, setConfirmPassword] = useState(''); // Adicione um estado para a confirmação de senha

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifique se as senhas são iguais
    if (formData.password !== confirmPassword) {
      // Se as senhas não forem iguais, avise o usuário e não envie o formulário
      // console.error('As senhas não coincidem');
      // Aqui você pode exibir uma mensagem de erro para o usuário, por exemplo:
      toast.info('As senhas não coincidem', {
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
    if(formData.password === confirmPassword){
      // Enviar os dados para a API para registro e criação de conta Ethereum
      try {

        const response = await fetch(`${server}/createWalletUser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          // Registro bem-sucedido
          navigate('/login');
        
        } else {
          // Aqui você pode exibir uma mensagem de erro para o usuário, por exemplo:
          toast.info('Preencha todos os campos', {
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
        console.error('Erro ao registrar usuário:', error);
      }
    }

  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false); // Fechar o popup de sucesso
    navigate('/login'); // Redirecionar para a página de login
  };



  return (
    <>
    <div className='register section__padding'>
      <div className="arkade-wallet">
        <img src={logo} alt="Arkade Wallet Logo" />
        <h1 className='wallet-name'>WALLET</h1>
      </div>
      <div className="register-container">
        <div className='top-forms'>
          <BsChevronLeft className='back-icon' onClick={() => navigate('/')} />
          <h1 className='cadastro-text'>Cadastro</h1>
        </div>
        <form className='register-writeForm' autoComplete='off' onSubmit={handleSubmit}>
          <div className="register-formGroup">
            <label>Nome</label>
            <input
              type="text"
              placeholder='Insira seu nome'
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div className="register-formGroup">
            <label>E-Mail</label>
            <input
              type="email"
              placeholder='Insira seu email'
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="register-formGroup">
            <label>Senha</label>
            <input
              type="password"
              placeholder='Insira sua senha'
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="register-formGroup">
            <label>Confirmar senha</label>
            <input
              type="password"
              placeholder='Insira sua senha novamente'
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <div className="register-button">
            <button className='login-writeButton' type='submit'>Confirmar</button>
            {/* <Link to="/register">
              <button className='login-reg-writeButton' type='submit'>Register</button>
            </Link> */}
          </div>
        </form>
      </div>
    </div>
    {showSuccessPopup && (
        // Aqui você pode exibir uma mensagem de erro para o usuário, por exemplo:
        toast.success('Usuário cadastrado com sucesso', {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        })
      )}
    <Footer/>
    <ToastContainer/>
    </>
  )
  
};

