import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "./axiosInstance"; // Importa tu instancia de axios
import jwt from "jsonwebtoken";

export const register = async (
  nombre: string,
  correo: string,
  clave: string
) => {
  try {
    const response = await axiosInstance.post("/api/Usuario", {
      usuarioId: 0,
      nombre,
      correo,
      clave,
      esAdmin: false,
      eliminado: false,
      habilitado: true,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error en la solicitud de registro:",
      error.response?.data || error.message
    );
    throw error;
  }
};

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  try {
    const response = await axiosInstance.get(`/api/Login/${data.email}/${data.password}`);
    const token = response.data.token.token;
  
    // Decodificar el token
    const decodedToken = jwt.decode(token);

    if (
      decodedToken &&
      typeof decodedToken === "object" &&
      "Token" in decodedToken &&
      "NombreUsuario" in decodedToken
    ) {
      // Llamar al store para iniciar sesión
      useAuthStore.getState().login(data.email, decodedToken.Token, decodedToken.NombreUsuario);
      console.log(decodedToken.Token)
      console.log(decodedToken.NombreUsuario)
    } else {
      console.error("El token no pudo ser decodificado o es inválido.");
      throw new Error("Token inválido");
    }

    return response.data;
  } catch (error) {
    console.error("Error durante el login:", error);
    throw error;
  }
};