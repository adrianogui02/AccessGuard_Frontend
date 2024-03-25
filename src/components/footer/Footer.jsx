import React from 'react'
import './footer.css'
import nftlogo from '../../assets/logo.png'
import { AiOutlineInstagram,AiOutlineTwitter, } from "react-icons/ai";
import { RiDiscordFill } from "react-icons/ri";
import { FaTelegramPlane } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="footer-copyright">
        <p> © {(new Date().getFullYear())} Arkade • Termos e Políticas de Privacidade </p>
    </footer>
  )
}

