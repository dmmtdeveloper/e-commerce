import axiosInstance from "./axiosInstance"; // Importa tu instancia de axios
import { DetallePedido, Pedido } from "@/types/types";

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

// Función para obtener el Pedidos basados en el token
export const GetPedidosByToken = async (token: string): Promise<Pedido[]> => {
  try {
    const response = await axiosInstance.get<Pedido[]>(
      `/api/Pedido/ByToken/${token}`
    );
    return response.data; // El tipo será automáticamente Usuario
  } catch (error) {
    console.error("Error obteniendo el pedido:", error);
    throw error;
  }
};
