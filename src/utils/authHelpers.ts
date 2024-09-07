import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from './axiosInstance';  // Importa tu instancia de axios

export const register = async (nombre: string, correo: string, clave: string) => {
  try {
    const response = await axiosInstance.post('/api/Usuario', {
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
    console.error("Error en la solicitud de registro:", error.response?.data || error.message);
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

    const token = response.data.token;
    const login = useAuthStore.getState().login;
    login(data.email);  // Marca el usuario como autenticado

    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
