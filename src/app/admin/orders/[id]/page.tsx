"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import MainLayout from "../../../layouts/MainLayout";
import NavAdmin from "@/components/shared/NavAdmin";
import { GetPedidoAdminById, GetPedidoDetallesAdminByPedidoId, UpdateEstadoPedido, UpdateEstadoPedidoCancelado } from "@/utils/authHelpers";
import { VmPedido, VmDetallePedido } from "@/types/types";
import Link from 'next/link';
import Image from "next/image";

interface PedidoDetallePageProps { 
  params: {
    id: string;
  };
}

const PedidoDetalle = ({ params }: PedidoDetallePageProps) => {
  const [pedido, setPedido] = useState<VmPedido | null>(null);
  const [detalles, setDetalles] = useState<VmDetallePedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModalCompletar, setShowModalCompletar] = useState<boolean>(false);
  const [showModalCancelar, setShowModalCancelar] = useState<boolean>(false);

  const router = useRouter();
  const pedidoId = parseInt(params.id); 

  useEffect(() => {
    if (pedidoId) {
      GetPedidoAdminById(Number(pedidoId))
        .then((pedidoData) => {
          setPedido(pedidoData);
          return GetPedidoDetallesAdminByPedidoId(Number(pedidoId));
        })
        .then((detallesData) => {
          setDetalles(detallesData);
          setLoading(false);
        })
        .catch((error) => {
          setError("Error obteniendo los detalles del pedido");
          console.error("Error obteniendo los detalles del pedido:", error);
          setLoading(false);
        });
    }
  }, [pedidoId]);

  const handleConfirmChangeEstado = () => {
    if (pedido) {
      UpdateEstadoPedido(pedido.pedidoId) // Cambia a "Completado", suponiendo que 2 es el ID del estado "Completado"
        .then(() => {
          setPedido({ ...pedido, estadoId: 2, estadoNombre: 'Completado' });
          setShowModalCompletar(false);
        })
        .catch((error) => {
          console.error("Error actualizando el estado del pedido:", error);
        });
    }
  };

  const handleConfirmCancelarPedido = () => {
    if (pedido) {
      UpdateEstadoPedidoCancelado(pedido.pedidoId, 3) // Cambia a "Cancelado"
        .then(() => {
          setPedido({ ...pedido, estadoId: 3, estadoNombre: 'Cancelado' }); // Asumiendo que 3 es el ID del estado "Cancelado"
          setShowModalCancelar(false);
        })
        .catch((error) => {
          console.error("Error cancelando el pedido:", error);
        });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!pedido) {
    return <div>No se encontró el pedido</div>;
  }

  return (
    <MainLayout>
      <div className="relative mt-20 min-h-screen flex flex-col">
        <NavAdmin className="pl-8 w-full z-50 bg-white shadow-md" />

        <section className="pt-8 p-4 flex-grow">
          <div className="bg-white p-6 shadow-md rounded-lg mb-6">
            <h2 className="font-semibold text-2xl mb-4 border-b-2 border-gray-300 pb-2">Pedido #{pedido.pedidoId}</h2>
            
            <div className="flex justify-between">
              {/* Columna 1: Datos del cliente */}
              <div className="w-1/2 pr-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-700">Datos del Cliente</h3>
                <p><strong>Usuario:</strong> {pedido.nombreUsuario}</p>
                <p><strong>Correo:</strong> {pedido.correoUsuario}</p>

                {/* Botón para cambiar el estado a "Completado" si EstadoId es 1 */}
                {pedido.estadoId === 1 && (
                  <>
                    <button 
                      className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mr-2"
                      onClick={() => setShowModalCompletar(true)}
                    >
                      Completar Pedido
                    </button>
                    
                    <button 
                      className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                      onClick={() => setShowModalCancelar(true)}
                    >
                      Cancelar Pedido
                    </button>
                  </>
                )}
              </div>
              
              {/* Columna 2: Información del pedido */}
              <div className="w-1/2 pl-4 bg-gray-100 p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-3 text-gray-700">Detalles del Pedido</h3>
                <p><strong>Total Compra:</strong> <span className="text-xl font-bold">${pedido.valorTotal.toFixed(2)}</span></p>
                <p><strong>Cantidad de Productos:</strong> {pedido.cantidadDetalles}</p>
                <p><strong>Fecha Compra:</strong> {new Date(pedido.fecha).toLocaleDateString()}</p>
                <p><strong>Estado:</strong> {pedido.estadoNombre}</p>
              </div>
            </div>
          </div>

          {/* Tabla de Detalles del Pedido */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full border">
              <thead>
                <tr>
                  <th className="border p-2">Productos de la compra</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle) => (
                  <tr key={detalle.pedidoDetalleId}>
                    <td className="border p-4">
                      <div className="flex items-center">
                        {detalle.foto && detalle.foto !== "" ? (
                          <Image 
                            src={`data:image/${detalle.extension};base64,${detalle.foto}`} 
                            alt={detalle.productoNombre} 
                            width={60} 
                            height={60} 
                            className="h-40 w-40 object-cover mr-4" 
                            priority 
                          />
                        ) : (
                          <div className="h-40 w-40 bg-gray-200 mr-4"></div>
                        )}
                        <div className="flex-grow">
                          <h3 className="font-bold text-lg">{detalle.productoNombre}</h3>
                          <h4 className="text-md">{detalle.productoDescripcion}</h4>
                          <p className="text-sm text-gray-600">Cantidad: {detalle.cantidad}</p>
                          <p className="text-sm text-gray-600">Precio unitario: ${detalle.precioUnitario.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold">${detalle.precioTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botón de regreso */}
          <div className="mt-4">
            <Link href="/admin/orders">
              <button type="button" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
                Volver a Pedidos
              </button>
            </Link>
          </div>
        </section>
      </div>

      {/* Modal de confirmación para completar pedido */}
      {showModalCompletar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Confirmar cambio de estado</h2>
            <p>¿Estás seguro de que deseas cambiar el estado del pedido a <strong>Completado</strong>?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button 
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                onClick={() => setShowModalCompletar(false)}
              >
                Cancelar
              </button>
              <button 
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
                onClick={handleConfirmChangeEstado}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para cancelar pedido */}
      {showModalCancelar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Confirmar cancelación del pedido</h2>
            <p>¿Estás seguro de que deseas cancelar este pedido?</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button 
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
                onClick={() => setShowModalCancelar(false)}
              >
                Cancelar
              </button>
              <button 
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                onClick={handleConfirmCancelarPedido}
              >
                Confirmar Cancelación
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default PedidoDetalle;
