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
      const matchesSearch = usuario.nombre.toLowerCase().includes(search.toLowerCase()) ||
                             usuario.correo.toLowerCase().includes(search.toLowerCase());
      const matchesAdmin = !admin || usuario.esAdmin;
      const matchesHabilitado = !habilitado || usuario.habilitado;

      return matchesSearch && matchesAdmin && matchesHabilitado;
    });
    setFilteredUsuarios(filtered);
  }, [filters, usuarios]);

  const handleCheckboxChange = async (
    usuarioId: number,
    field: "habilitado" | "eliminado" | "esAdmin",
    value: boolean
  ) => {
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
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      <div className="relative">
        {/* Navbar */}
        <NavAdmin className="fixed top-0 left-0 w-full z-50 bg-white shadow-md" />

        <section className="pt-16 p-4 mt-16">
          {/* Botón para Crear Usuario */}
          <div className="mb-4 relative">
            <Link href="/admin/users/create" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 z-10">
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
            <div className={`transition-opacity duration-300 ${isPanelCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
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
                <div className="flex items-center gap-2">
                  <input
                    id="admin"
                    name="admin"
                    type="checkbox"
                    checked={filters.admin}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  <label htmlFor="admin">Mostrar solo administradores</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="habilitado"
                    name="habilitado"
                    type="checkbox"
                    checked={filters.habilitado}
                    onChange={handleFilterChange}
                    className="mr-2"
                  />
                  <label htmlFor="habilitado">Mostrar solo habilitados</label>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <div>
            <h1 className="font-semibold text-4xl mb-4">Usuarios del Sistema</h1>
            <p className="mb-4">A continuación se muestra la lista de usuarios registrados en el sistema:</p>

            <table className="table-auto w-full border">
              <thead>
                <tr>
                  <th className="border p-2">Usuario ID</th>
                  <th className="border p-2">Nombre</th>
                  <th className="border p-2">Correo</th>
                  <th className="border p-2">Habilitado</th>
                  <th className="border p-2">Eliminado</th>
                  <th className="border p-2">Admin</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsuarios.map((usuario) => (
                  <tr key={usuario.usuarioId}>
                    <td className="border p-2">{usuario.usuarioId}</td>
                    <td className="border p-2">{usuario.nombre}</td>
                    <td className="border p-2">{usuario.correo}</td>
                    <td className="border p-2">
                      <input
                        type="checkbox"
                        checked={usuario.habilitado}
                        onChange={(e) =>
                          handleCheckboxChange(usuario.usuarioId, "habilitado", e.target.checked)
                        }
                        disabled={usuario.eliminado} // Desactiva si el registro está eliminado
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="checkbox"
                        checked={usuario.eliminado}
                        onChange={(e) =>
                          handleCheckboxChange(usuario.usuarioId, "eliminado", e.target.checked)
                        }
                        disabled={usuario.eliminado} // Desactiva si el registro está eliminado
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="checkbox"
                        checked={usuario.esAdmin}
                        onChange={(e) =>
                          handleCheckboxChange(usuario.usuarioId, "esAdmin", e.target.checked)
                        }
                        disabled={usuario.eliminado} // Desactiva si el registro está eliminado
                      />
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
