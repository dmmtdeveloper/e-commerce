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
    // Realiza la petición a la API con los datos de login
    const response = await axiosInstance.get(
      `/api/Login/${data.email}/${data.password}`
    );
    console.log("response:", response);

    // Obtener el token de la respuesta
    const token = response.data.token.token;
    console.log("response-data:", response.data);
    console.log("response-token:", token);

    // Decodificar el token
    const decodedToken = jwt.decode(token); // Aquí decodificas el token sin verificar

    // Mostrar el token decodificado en consola
    console.log("Decoded token:", decodedToken.Token);

    // Guardar el token o realizar cualquier otra acción con el token decodificado
    const login = useAuthStore.getState().login;
    login(data.email, decodedToken.Token); // Marca el usuario como autenticado

    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
