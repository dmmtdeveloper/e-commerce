import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const footerLinks = [
    {
      title: "Contacto",
      links: [
        {
          name: "contacto@pcStore.cl",
          link: "",
        },
        {
          name: "+56 956918388",
          link: "",
        },
       
      ],
    },
    {
      title: "Acerca de pcStore",
      links: [
        {
          name: "¿Quiénes somos?",
          link: "",
        },
      ],
    },
  
    {
      title: "Información",
      links: [
   
        {
          name: "Inicio",
          link: "/#inicio",
        },
        {
          name: "Registrarse",
          link: "/register",
        },
        {
          name: "Iniciar sesión",
          link: "/login",
        },
    
      ],
    },
  ];
  
  export const socialMedia = [
    {
      id: "social-media-1",
      icon: FaWhatsapp,
      link: "https://www.whatsapp.com/",
    },
    {
      id: "social-media-2",
      icon: FaInstagram,
      link: "https://www.instagram.com/",
    },
    {
      id: "social-media-3",
      icon: FaXTwitter,
      link: "https://www.twitter.com/",
    },
  ];