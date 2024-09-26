"use client";
import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import NavAdmin from "@/components/shared/NavAdmin";
import { GetUsuarios } from "@/utils/authHelpers";
import { Usuario } from "@/utils/authHelpers";
import Link from "next/link";
import {
  UpdateHabilitadoUsuario,
  UpdateEliminadoUsuario,
  UpdateEsAdminUsuario,
} from "@/utils/authHelpers";

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
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
  
  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<{
    usuarioId: number;
    field: "habilitado" | "eliminado" | "esAdmin";
    value: boolean;
  } | null>(null);

  useEffect(() => {
    GetUsuarios()
      .then((usuarios) => {
        setUsuarios(usuarios);
        setLoading(false);
        setFilteredUsuarios(usuarios);
      })
      .catch((error) => {
        setError("Error obteniendo los usuarios");
        console.error("Error obteniendo los usuarios:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const { search, admin, habilitado } = filters;
    const filtered = usuarios.filter((usuario) => {
      const matchesSearch =
        usuario.nombre.toLowerCase().includes(search.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(search.toLowerCase());
      const matchesAdmin = !admin || usuario.esAdmin;
      const matchesHabilitado = !habilitado || usuario.habilitado;

      return matchesSearch && matchesAdmin && matchesHabilitado;
    });
    setFilteredUsuarios(filtered);
  }, [filters, usuarios]);

  const handleCheckboxChange = (usuarioId: number, field: "habilitado" | "eliminado" | "esAdmin", value: boolean) => {
    setCurrentAction({ usuarioId, field, value });
    setIsModalOpen(true);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleConfirm = async () => {
    if (!currentAction) return;
    const { usuarioId, field, value } = currentAction;

    try {
      if (field === "habilitado") {
        await UpdateHabilitadoUsuario(usuarioId, value);
      } else if (field === "eliminado") {
        await UpdateEliminadoUsuario(usuarioId, value);
      } else if (field === "esAdmin") {
        await UpdateEsAdminUsuario(usuarioId, value);
      }

      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario.usuarioId === usuarioId
            ? { ...usuario, [field]: value }
            : usuario
        )
      );
    } catch (error) {
      console.error(`Error actualizando ${field}:`, error);
    }

    setIsModalOpen(false);
    setCurrentAction(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrentAction(null);
  };

  const ConfirmationModal = () => {
    if (!currentAction) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold">Confirmación</h2>
          <p>¿Estás seguro de que deseas cambiar este valor?</p>
          <div className="mt-4">
            <button onClick={handleConfirm} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
              Confirmar
            </button>
            <button onClick={handleCancel} className="bg-gray-300 py-2 px-4 rounded">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
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
        <NavAdmin className="pl-8 w-full z-50 bg-white shadow-md" />

        <section className="pt-8 p-4">
          {/* Botón para Crear Usuario */}
          <div className="mb-4 relative">
            <Link
              href="/admin/users/create"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 z-10"
            >
              Crear Usuario
            </Link>
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
              <div className="mb-4">
                <input
                  type="text"
                  name="search"
                  placeholder="Buscar"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="checkbox"
                    name="admin"
                    checked={filters.admin}
                    onChange={handleFilterChange}
                  />
                  Admin
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="habilitado"
                    checked={filters.habilitado}
                    onChange={handleFilterChange}
                  />
                  Habilitado
                </label>
              </div>
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border-b p-2">Nombre</th>
                <th className="border-b p-2">Correo</th>
                <th className="border-b p-2">Admin</th>
                <th className="border-b p-2">Habilitado</th>
                <th className="border-b p-2">Eliminado</th>
              </tr>
            </thead>
            <tbody>
  {filteredUsuarios.map((usuario) => (
    <tr key={usuario.usuarioId}>
      <td className="border-b p-2">{usuario.nombre}</td>
      <td className="border-b p-2">{usuario.correo}</td>
      <td className="border-b p-2">
        <input
          type="checkbox"
          checked={usuario.esAdmin}
          onChange={() =>
            !usuario.eliminado && 
            handleCheckboxChange(usuario.usuarioId, "esAdmin", !usuario.esAdmin)
          }
          disabled={usuario.eliminado} // Deshabilitar si está eliminado
        />
      </td>
      <td className="border-b p-2">
        <input
          type="checkbox"
          checked={usuario.habilitado}
          onChange={() =>
            !usuario.eliminado && 
            handleCheckboxChange(usuario.usuarioId, "habilitado", !usuario.habilitado)
          }
          disabled={usuario.eliminado} // Deshabilitar si está eliminado
        />
      </td>
      <td className="border-b p-2">
        <input
          type="checkbox"
          checked={usuario.eliminado}
          onChange={() =>
            handleCheckboxChange(usuario.usuarioId, "eliminado", !usuario.eliminado)
          }
          disabled={usuario.eliminado} // Se deshabilita si el usuario está eliminado
        />
      </td>
    </tr>
  ))}
</tbody>
          </table>
        </section>

        {/* Renderizar el modal */}
        {isModalOpen && <ConfirmationModal />}
      </div>
    </MainLayout>
  );
}
