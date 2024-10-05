"use client";
import { useState, useEffect } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import NavAdmin from "@/components/shared/navbar-admin-component/NavAdmin";
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
import { useAuthStore } from "@/store/useAuthStore";
import { Title } from "@/components/title/Title";
import LayoutSectionComponent from "@/components/layouts/layout-section-component";
import LayoutDivComponent from "@/components/layouts/layout-div-component";

export default function OrdersPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { isAdmin } = useAuthStore();
  
  // Estados para los filtros
  const [filters, setFilters] = useState({
    estadoId: "1", // Estado "Pendiente" por defecto
  });

  // Estado para manejar el colapso del panel
  const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(true);
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

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
    const { estadoId } = filters;
    const filtered = pedidos.filter((pedido) => {
      const matchesEstadoId = !estadoId || pedido.estadoId === Number(estadoId);
      const matchesFechaDesde =
        !fechaDesde || new Date(pedido.fecha) >= new Date(fechaDesde);
      const matchesFechaHasta =
        !fechaHasta || new Date(pedido.fecha) <= new Date(fechaHasta);

      return matchesEstadoId && matchesFechaDesde && matchesFechaHasta;
    });
    setFilteredPedidos(filtered);
  }, [filters, pedidos, fechaDesde, fechaHasta]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "fechaDesde") {
      setFechaDesde(value);
    } else {
      setFechaHasta(value);
    }
  };

  const formatCurrency = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <MainLayout>
      <LayoutSectionComponent>
        <LayoutDivComponent>
          {!isAdmin ? <NavSetting /> : <NavAdmin />}
          <div>
            <Title className="text-left" text="Mis Compras" />
            <p className="text-gray-500">Panel de pedidos históricos</p>
          </div>
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
                  <label htmlFor="estadoId">Estado:</label>
                    <select
                      id="estadoId"
                      name="estadoId"
                      value={filters.estadoId}
                      onChange={handleFilterChange}
                      className="border p-2 rounded"
                    >
                      <option value="">Todos</option>
                      <option value="1">Pendiente</option>
                      <option value="2">Completado</option>
                      <option value="3">Cancelado</option>
                      <option value="4">Anulado</option>
                    </select>                  
                </div>
                <div className="flex flex-col flex-grow">
                      <label htmlFor="fechaDesde">Fecha Desde:</label>
                      <input
                        id="fechaDesde"
                        name="fechaDesde"
                        type="date"
                        value={fechaDesde}
                        onChange={handleDateChange}
                        className="border p-2 rounded cursor-pointer" // Añadir cursor pointer para indicar que se puede hacer clic
                        onClick={(e) => e.currentTarget.showPicker()} // Mostrar el selector de fecha al hacer clic en el input
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <label htmlFor="fechaHasta">Fecha Hasta:</label>
                      <input
                        id="fechaHasta"
                        name="fechaHasta"
                        type="date"
                        value={fechaHasta}
                        onChange={handleDateChange}
                        className="border p-2 rounded cursor-pointer" // Añadir cursor pointer para indicar que se puede hacer clic
                        onClick={(e) => e.currentTarget.showPicker()} // Mostrar el selector de fecha al hacer clic en el input
                      />
                    </div>

              </div>

            </div>
          </div>

          {/* Tabla de Pedidos */}
          <div>
            {/* <h1 className="font-semibold text-4xl mb-4">Mis compras</h1>
            <p className="mb-4">
              A continuación se muestra la lista de pedidos históricos:
            </p> */}

            <table className="table-auto w-full border">
              <thead>
                <tr>
                <th className="border p-2"></th>
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
                    <td className="border p-2">#{pedido.pedidoId}</td>
                    <td className="border p-2">
                      {new Date(pedido.fecha).toLocaleDateString()}
                    </td>
                    <td className="border p-2">{pedido.estadoNombre}</td>
                    <td className="border p-2">{pedido.cantidad}</td>
                    <td className="border p-2">
                      $
                      {pedido.valorTotal !== undefined &&
                      pedido.valorTotal !== null
                        ? `${formatCurrency.format(pedido.valorTotal)}`
                        : "N/A"}
                    </td>
                    <td className="border p-2">
                      <Link
                        href={`/orders/ordersDetails/${pedido.pedidoId}`}
                        className="text-blue-500 hover:underline"
                      >
                        Ver Detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LayoutDivComponent>
      </LayoutSectionComponent>
    </MainLayout>
  );
}
