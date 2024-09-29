"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Usar useRouter en lugar de router.query
import MainLayout from "../../../layouts/MainLayout";
import { GetPedidoById, GetPedidoDetallesByPedidoId } from "@/utils/orderHelpers";
import { PedidoDetalleDTO, PedidoDto } from "@/types/types";
import Link from "next/link";
import Image from "next/image";


  interface PedidoDetallePageProps {
    params: {
      id: string;
    };
  }
  
  const OrdersDetails = ({ params }: PedidoDetallePageProps) => {
  const [pedido, setPedido] = useState<PedidoDto | null>(null);
  const [detalles, setDetalles] = useState<PedidoDetalleDTO[]>([]); // Agregar estado para detalles
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const pedidoId = Number(params.id); // Convertir el ID a número

  // Función para obtener el pedido y sus detalles
  const fetchPedido = async (pedidoId: number) => {
    try {
      const data = await GetPedidoById(pedidoId); // Obtener el pedido
      setPedido(data);

      const detallesData = await GetPedidoDetallesByPedidoId(pedidoId); // Obtener los detalles
      setDetalles(detallesData);
    } catch (error: any) {
      setError(error.message || "Error obteniendo el pedido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pedidoId) {
      fetchPedido(pedidoId);
    }
  }, [pedidoId]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!pedido) return <div>No se encontró el pedido</div>;

  return (
    <MainLayout>
      <div className="relative mt-20">
        <section className="pt-8 p-4">
          <div className="bg-white p-6 shadow-md rounded-lg mb-6">
            <h2 className="font-semibold text-2xl mb-4 border-b-2 border-gray-300 pb-2">Pedido #{pedidoId}</h2>
            
            <div className="flex justify-between">              
              <div className="w-1/2 pl-4 bg-gray-100 p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-3 text-gray-700">Detalles del Pedido</h3>
                <p><strong>Total Compra:</strong> <span className="text-xl font-bold">${pedido?.valorTotal.toFixed(2)}</span></p>
                <p><strong>Cantidad de Productos:</strong> {pedido.cantidad}</p>
                <p><strong>Fecha Compra:</strong> {new Date(pedido.fecha).toLocaleDateString()}</p>
                <p><strong>Estado:</strong> {pedido?.estadoNombre}</p>
              </div>
            </div>
          </div>

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
                          <h3 className="font-semibold text-lg">{detalle.productoNombre}</h3>
                          <p className="text-sm text-gray-600">Cantidad: {detalle.cantidad}</p>
                          <p className="text-sm text-gray-600">
                            Precio unitario: ${detalle.precioUnitario.toFixed(2)}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-semibold">
                            ${detalle.precioTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
            <Link href="/orders" passHref>
              <button type="button" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
                Volver a Pedidos
              </button>
            </Link>
          </div>
          </div>
          

          
        </section>
      </div>
    </MainLayout>
  );
}

export default OrdersDetails;
