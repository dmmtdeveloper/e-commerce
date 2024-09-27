import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "./axiosInstance"; // Importa tu instancia de axios
import jwt from "jsonwebtoken";
import axios from "axios";
import { DetallePedido, Pedido } from "@/types/types";
import { Product } from "@/types/product";

export const addPedido = async (
  pedidoId: number,
  token: string,
  estadoId: number,
  valorTotal: number,
  fecha: string,
  eliminado: boolean,
  detalles: DetallePedido[]
) => {
  try {
    const response = await axiosInstance.post("/api/Pedido", {
      pedidoId: 0,
      token,
      estadoId: 1,
      valorTotal,
      fecha,
      eliminado: false,
      detalles,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error en la solicitud de pedido:",
      error.response?.data || error.message
    );
    throw error;
  }
};



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

export const AddProducto = async (
  nombre: string,
  descripcion: string,
  precio: number,
  stock: number,
  stockReservado: number,
  habilitado: boolean,
  eliminado: boolean,
  foto: string,
  nombreFoto: string,
  extension: string
) => {
  try {
    const response = await axiosInstance.post("/Api/Productos", {
      productoId: 0, // Esto se asume que se autogenera en el backend
      nombre,
      descripcion,
      precio,
      stock,
      stockReservado: 0,
      habilitado: true,
      eliminado: false,
      foto,
      nombreFoto,
      extension

    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Error en la solicitud de agregar producto:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetProductosHabilitados = async (): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get<Product[]>("/api/Productos/habilitados");
    return response.data; // Retorna la lista de productos habilitados
  } catch (error) {
    console.error("Error obteniendo la lista de productos:", error);
    throw error;
  }
};

export const GetProductos = async (): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get<Product[]>("/api/Productos");
    return response.data; // Retorna la lista de productos habilitados
  } catch (error) {
    console.error("Error obteniendo la lista de productos:", error);
    throw error;
  }
};

export const GetProductoById = async (id: number): Promise<Product> => {
  try {
    const response = await axiosInstance.get<Product>(
      `/api/Productos/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error obteniendo el producto:", error);
    throw error;
  }
};

export const UpdateProductoAll = async (producto: Product): Promise<void> => {
  try {
    
    const response = await axiosInstance.post<{ isSuccess: boolean; Message: string }>(
      `/api/Productos/update/all`, // Cambia a POST y elimina el ID del URL
      {
        ProductoId: producto.productoId, // Incluye el ID del producto en el cuerpo
        Nombre: producto.nombre,
        Descripcion: producto.descripcion,
        Stock: producto.stock,
        Precio: producto.precio,
        Habilitado: producto.habilitado,
        Eliminado: producto.eliminado,
        Foto: producto.foto ?? "",
        NombreFoto: producto.nombreFoto ?? "",
        Extension: producto.extension ?? ""
      }
    );

    // Verifica si la respuesta es exitosa
    if (response.data.isSuccess) {
      console.log("Producto actualizado con éxito.");
    } else {
      console.error(response.data.Message); // Captura el mensaje personalizado de error
      throw new Error(response.data.Message); // Lanza un error con el mensaje personalizado
    }
  } catch (error) {
    handleError(error);
  }
};

// Función para obtener el Pedidos basados en el token
export const GetPedidosByToken = async (token: string): Promise<Pedido[]> => {
  try {
    const response = await axiosInstance.get<Pedido[]>(
      `/api/Pedido/ByToken/${token}`
    );
    return response.data; // El tipo será automáticamente Usuario
  } catch (error) {
    console.error("Error obteniendo los pedidos:", error);
    throw error;
  }
};

// Función para obtener el Pedidos basados en el token
export const GetPedidos = async (): Promise<Pedido[]> => {
  try {
    const response = await axiosInstance.get<Pedido[]>(
      `/api/Pedido/`
    );
    return response.data; // El tipo será automáticamente Usuario
  } catch (error) {
    console.error("Error obteniendo los pedidos:", error);
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

//producto
export const UpdateHabilitadoProducto = async (
  productoId: number,
  habilitado: boolean
): Promise<void> => {
  try {
    const response = await axiosInstance.put<void>(
      `/api/productos/update/enabled/${productoId}/${habilitado}`
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

//producto
export const UpdateLimpiaFotoProducto = async (
  productoId: number
): Promise<void> => {
  try {
    const response = await axiosInstance.put<void>(
      `/api/productos/update/cleanfoto/${productoId}`
    );

    if (response.status === 204) {
      console.log("Foto de producto actualizada.");
    } else {
      throw new Error("Respuesta inesperada del servidor.");
    }
  } catch (error) {
    handleError(error);
  }
};

export const UpdateEliminadoProducto = async (
  productoId: number,
  eliminado: boolean
): Promise<void> => {
  try {
    const response = await axiosInstance.put<void>(
      `/api/productos/update/deleted/${productoId}/${eliminado}`
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
//producto

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
      console.error("Error interno del servidor:", error.response.data.message);
      throw new Error(error.response.data.message);
    } else {
      console.error("Error en la solicitud:", error);
      throw new Error("Error en la solicitud.");
    }
  } else {
    console.error("Error desconocido:", error);
    throw new Error("Error desconocido.");
  }
};

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  try {
    const response = await axiosInstance.get(
      `/api/Login/${data.email}/${data.password}`
    );
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
      useAuthStore
        .getState()
        .login(data.email, decodedToken.Token, decodedToken.NombreUsuario);
      console.log(decodedToken.Token);
      console.log(decodedToken.NombreUsuario);
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
