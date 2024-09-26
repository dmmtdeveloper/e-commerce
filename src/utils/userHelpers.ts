import axios from "axios";
import axiosInstance from "./axiosInstance"; // Importa tu instancia de axios

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

// Define la interfaz de Usuario
export interface Usuario {
  usuarioId: number;
  nombre: string;
  correo: string;
  clave: string;
  esAdmin: boolean;
  eliminado: boolean;
  habilitado: boolean;
}

export const GetUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await axiosInstance.get<Usuario[]>("/api/usuario");
    return response.data; // Retorna la lista de usuarios
  } catch (error) {
    console.error("Error obteniendo la lista de usuarios:", error);
    throw error;
  }
};

// Función para obtener el usuario basado en el token
export const GetUsuarioByToken = async (token: string): Promise<Usuario> => {
  try {
    const response = await axiosInstance.get<Usuario>(
      `/api/Usuario/bytoken/${token}`
    );
    return response.data; // El tipo será automáticamente Usuario
  } catch (error) {
    console.error("Error obteniendo el usuario:", error);
    throw error;
  }
};

//metodo put para actualizar nombre
export const UpdateNombreUsuario = async (
  usuarioId: number,
  nombre: string
): Promise<void> => {
  try {
    // Enviamos la solicitud PUT
    const response = await axiosInstance.put<void>(
      `/api/Usuario/update/name/${usuarioId}/${nombre}`
    );

    // Verificamos el código de estado HTTP
    if (response.status === 204) {
      // Actualización exitosa
      console.log("Nombre actualizado con éxito.");
    } else {
      // Código de estado inesperado
      throw new Error("Respuesta inesperada del servidor.");
    }
  } catch (error) {
    handleError(error);
  }
};

export const UpdateClaveUsuario = async (
  usuarioId: number,
  clave: string
): Promise<void> => {
  try {
    const response = await axiosInstance.put<void>(
      `/api/Usuario/update/password/${usuarioId}/${clave}`
    );

    if (response.status === 204) {
      console.log("Clave actualizada con éxito.");
    } else {
      throw new Error("Respuesta inesperada del servidor.");
    }
  } catch (error) {
    handleError(error);
  }
};

export const UpdateHabilitadoUsuario = async (
  usuarioId: number,
  habilitado: boolean
): Promise<void> => {
  try {
    const response = await axiosInstance.put<void>(
      `/api/Usuario/update/enabled/${usuarioId}/${habilitado}`
    );

    if (response.status === 204) {
      console.log("Estado de habilitado actualizado con éxito.");
    } else {
      throw new Error("Respuesta inesperada del servidor.");
    }
  } catch (error) {
    handleError(error);
  }
};

export const UpdateEliminadoUsuario = async (
  usuarioId: number,
  eliminado: boolean
): Promise<void> => {
  try {
    const response = await axiosInstance.put<void>(
      `/api/Usuario/update/deleted/${usuarioId}/${eliminado}`
    );

    if (response.status === 204) {
      console.log("Estado de eliminado actualizado con éxito.");
    } else {
      throw new Error("Respuesta inesperada del servidor.");
    }
  } catch (error) {
    handleError(error);
  }
};

export const UpdateEsAdminUsuario = async (
  usuarioId: number,
  esAdmin: boolean
): Promise<void> => {
  try {
    const response = await axiosInstance.put<void>(
      `/api/Usuario/update/isadmin/${usuarioId}/${esAdmin}`
    );

    if (response.status === 204) {
      console.log("Estado de administrador actualizado con éxito.");
    } else {
      throw new Error("Respuesta inesperada del servidor.");
    }
  } catch (error) {
    handleError(error);
  }
};

const handleError = (error: any) => {
  if (axios.isAxiosError(error) && error.response) {
    if (error.response.status === 500) {
      console.error("Error interno del servidor:", error);
      throw new Error("Error interno del servidor.");
    } else {
      console.error("Error en la solicitud:", error);
      throw new Error("Error en la solicitud.");
    }
  } else {
    console.error("Error desconocido:", error);
    throw new Error("Error desconocido.");
  }
};
