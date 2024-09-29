import axiosInstance from "./axiosInstance"; // Importa tu instancia de axios
import { DetallePedido, Pedido, PedidoDetalleDTO, PedidoDto } from "@/types/types";

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

export const GetPedidoDetallesByPedidoId = async (pedidoId: number): Promise<PedidoDetalleDTO[]> => {
  try {
    const response = await axiosInstance.get(`/api/PedidoDetalle/ByPedidoId/${pedidoId}`);
    console.log(response.data)
    return response.data; // Retorna los detalles del pedido
  } catch (error) {
    console.error("Error obteniendo los detalles del pedido:", error);
    throw error; // Propaga el error para manejarlo en la UI
  }
};

export const GetPedidoById = async (pedidoId: number): Promise<PedidoDto> => {
  try {
    const response = await axiosInstance.get<PedidoDto>(`/api/Pedido/ById/${pedidoId}`); // Cambiar el tipo de PedidoDto[]
    console.log(response.data)
    return response.data; // Retorna un único PedidoDto
  } catch (error) {
    console.error("Error obteniendo el pedido:", error);
    throw error; // Propaga el error para manejarlo en la UI
  }
};

// Función para obtener el Pedidos basados en el token
export const GetPedidosByToken = async (token: string): Promise<Pedido[]> => {
  try {
    const response = await axiosInstance.get<Pedido[]>(
      `/api/Pedido/ByToken/${token}`
    );
    console.log(response.data)
    console.log(response)
    return response.data; // El tipo será automáticamente Usuario
  } catch (error) {
    console.error("Error obteniendo el pedido:", error);
    throw error;
  }
};
