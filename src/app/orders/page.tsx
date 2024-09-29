"use client";
import { useState, useEffect } from "react";
import MainLayout from "@/app/layouts/MainLayout";
import NavAdmin from "@/components/shared/NavAdmin";
import { GetPedidosByToken, GetUsuarios } from "@/utils/authHelpers";
import { Usuario } from "@/utils/authHelpers";
import Link from "next/link";
import {
  UpdateHabilitadoUsuario,
  UpdateEliminadoUsuario,
  UpdateEsAdminUsuario,
} from "@/utils/authHelpers";
import { Pedido } from "@/types/types";
import { NavSetting } from "@/components/shared/NavSetting";

export default function OrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los filtros
  const [filters, setFilters] = useState({
    search: "",
    admin: false,
    habilitado: false,
  });

  // Estado para manejar el colapso del panel
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      GetPedidosByToken(token)
        .then((pedidos) => {
          setPedidos(pedidos);
          setLoading(false);
          setFilteredPedidos(pedidos);
        })
        .catch((error) => {
          setError("Error obteniendo los usuarios");
          console.error("Error obteniendo los usuarios:", error);
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    const { search, admin, habilitado } = filters;
    // const filtered = pedidos.filter((pedido) => {
    //   const matchesSearch =
    //     pedido.nombre.toLowerCase().includes(search.toLowerCase()) ||
    //     pedido.correo.toLowerCase().includes(search.toLowerCase());
    //   const matchesAdmin = !admin || pedido.esAdmin;
    //   const matchesHabilitado = !habilitado || pedido.habilitado;

    //   return matchesSearch && matchesAdmin && matchesHabilitado;
    // });
    const filtered = pedidos;
    setFilteredPedidos(filtered);
  }, [filters, pedidos]);

  // const handleCheckboxChange = async (
  //   usuarioId: number,
  //   field: "habilitado" | "eliminado" | "esAdmin",
  //   value: boolean
  // ) => {
  //   try {
  //     if (field === "habilitado") {
  //       await UpdateHabilitadoUsuario(usuarioId, value);
  //     } else if (field === "eliminado") {
  //       await UpdateEliminadoUsuario(usuarioId, value);
  //     } else if (field === "esAdmin") {
  //       await UpdateEsAdminUsuario(usuarioId, value);
  //     }

  //     setPedidos((prevPedidos) =>
  //       prevPedidos.map((pedido) =>
  //         pedido.pedidoId === pedidoId ? { ...pedido, [field]: value } : pedido
  //       )
  //     );
  //   } catch (error) {
  //     console.error(`Error actualizando ${field}:`, error);
  //   }
  // };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <MainLayout>
      <div className="relative mt-20">
        {/* Navbar */}
        {/* <NavAdmin className="pl-8 w-full z-50 bg-white shadow-md" /> */}
        <NavSetting />

        <section className="pt-8 p-4">
          {/* Panel de Filtros */}
          <div className="bg-gray-100 p-4 border-b-2 border-gray-200 mb-4">
            <button
              className="text-blue-500 mb-4 block"
              onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
            >
              {isPanelCollapsed ? "Mostrar Filtros" : "Ocultar Filtros"}
            </button>
            <div
              className={`transition-opacity duration-300 ${
                isPanelCollapsed
                  ? "opacity-0 h-0 overflow-hidden"
                  : "opacity-100"
              }`}
            >
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col flex-grow">
                  <label htmlFor="search">Buscar:</label>
                  <input
                    id="search"
                    name="search"
                    type="text"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                    placeholder="Nombre o Correo"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Pedidos */}
          <div>
            <h1 className="font-semibold text-4xl mb-4">Mis pedidos</h1>
            <p className="mb-4">
              A continuación se muestra la lista de pedidos históricos:
            </p>

            <table className="table-auto w-full border">
              <thead>
                <tr>
                <th className="border p-2">Fecha</th>
                <th className="border p-2">Estado</th>
                <th className="border p-2">Cantidad Producto</th>
                <th className="border p-2">Valor Total</th>
                <th className="border p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPedidos.map((pedido) => (
                  <tr key={pedido.pedidoId}>
                    <td className="border p-2">
                      {new Date(pedido.fecha).toLocaleDateString()}
                    </td>                    
                    <td className="border p-2">{pedido.estadoNombre}</td>
                    <td className="border p-2">{pedido.cantidad}</td>
                    <td className="border p-2">{pedido.valorTotal}</td>
                    <td className="border p-2">
                      <Link href={`/orders/ordersDetails/${pedido.pedidoId}`} className="text-blue-500 hover:underline">
                        Ver Detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
