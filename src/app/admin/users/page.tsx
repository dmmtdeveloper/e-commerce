"use client";
import { useState, useEffect } from "react";
import MainLayout from "../../../components/layouts/MainLayout";
import NavAdmin from "@/components/shared/navbar-admin-component/NavAdmin";
import { GetUsuarios } from "@/utils/authHelpers";
import { Usuario } from "@/utils/authHelpers";
import useAdmin from "@/hooks/useAdmin";
import { useAuthStore } from "@/store/useAuthStore";
import {
  UpdateHabilitadoUsuario,
  UpdateEliminadoUsuario,
  UpdateEsAdminUsuario,
} from "@/utils/authHelpers";
import { Title } from "@/components/title/Title";
import FilterButtonComponent from "@/components/buttons-components/button-product-component/Filter-button-component";
import LayoutSectionComponent from "@/components/layouts/layout-section-component";
import LayoutDivComponent from "@/components/layouts/layout-div-component";

export default function UsersPage() {
  useAdmin();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuthStore();

  // Estados para los filtros
  const [filters, setFilters] = useState({
    search: "",
    admin: false,
    habilitado: true, // Habilitado por defecto
    noEliminado: true, // Filtro No Eliminados por defecto
  });

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usuariosPerPage] = useState<number>(10);

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
        // setLoading(false);
        setFilteredUsuarios(usuarios);
      })
      .catch((error) => {
        setError("Error obteniendo los usuarios");
        console.error("Error obteniendo los usuarios:", error);
        // setLoading(false);
      });
  }, []);

  useEffect(() => {
    const { search, admin, habilitado, noEliminado } = filters;
    const filtered = usuarios.filter((usuario) => {
      const matchesSearch =
        usuario.nombre.toLowerCase().includes(search.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(search.toLowerCase());
      const matchesAdmin = !admin || usuario.esAdmin;
      const matchesHabilitado = !habilitado || usuario.habilitado;
      const matchesNoEliminado = !noEliminado || !usuario.eliminado;

      return (
        matchesSearch && matchesAdmin && matchesHabilitado && matchesNoEliminado
      );
    });
    setFilteredUsuarios(filtered);
  }, [filters, usuarios]);

  const handleCheckboxChange = (
    usuarioId: number,
    field: "habilitado" | "eliminado" | "esAdmin",
    value: boolean
  ) => {
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
            <button
              onClick={handleConfirm}
              className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
            >
              Confirmar
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 py-2 px-4 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Lógica de paginación
  const indexOfLastUsuario = currentPage * usuariosPerPage;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPerPage;
  const currentUsuarios = filteredUsuarios.slice(
    indexOfFirstUsuario,
    indexOfLastUsuario
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // if (loading) {
  //   return <div>Cargando...</div>;
  // }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {isAdmin && (
        <MainLayout>
          <LayoutSectionComponent>
            <LayoutDivComponent>
              <NavAdmin />
              <div>
                <Title className="text-left" text="Usuarios" />
                <p className="text-gray-500">Panel de usuarios</p>
              </div>
              {/* Panel de Filtros */}
              <div className="bg-gray-100 p-4 border-b-2 border-gray-200 mb-4">
                <FilterButtonComponent
                  text={
                    isPanelCollapsed ? "Mostrar filtros" : "Ocultar filtros"
                  }
                  onclick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                  className="my-custom-class"
                  isPanelCollapsed={isPanelCollapsed} // Pasar el estado como prop
                />
                <div
                  className={`transition-opacity duration-300 ${
                    isPanelCollapsed
                      ? "opacity-0 h-0 overflow-hidden"
                      : "opacity-100"
                  }`}
                >
                  <div className="flex flex-col space-y-4 md:flex-row md:space-x-10">
                    <input
                      type="text"
                      name="search"
                      placeholder="Buscar"
                      value={filters.search}
                      onChange={handleFilterChange}
                      className="border p-2 rounded w-full md:w-1/3"
                    />
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="admin"
                        checked={filters.admin}
                        onChange={handleFilterChange}
                      />
                      <span>Mostrar Administradores</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="habilitado"
                        checked={filters.habilitado}
                        onChange={handleFilterChange}
                      />
                      <span>Mostrar Habilitados</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="noEliminado"
                        checked={filters.noEliminado}
                        onChange={handleFilterChange}
                      />
                      <span>Mostrar no Eliminados</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Tabla de Usuarios */}
              <table className="min-w-full bg-white border border-gray-300 text-sm">
                <thead>
                  <tr>
                    <th className="border-b p-2">Nombre</th>
                    <th className="border-b p-2">Correo</th>
                    <th className="border-b p-2">Es Administrador</th>
                    <th className="border-b p-2">Habilitado</th>
                    <th className="border-b p-2">Eliminado</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsuarios.map((usuario) => (
                    <tr key={usuario.usuarioId}>
                      <td className="border-b p-2">{usuario.nombre}</td>
                      <td className="border-b p-2">{usuario.correo}</td>
                      <td className="border-b p-2">
                        <input
                          type="checkbox"
                          checked={usuario.esAdmin}
                          disabled={usuario.eliminado}
                          onChange={() =>
                            !usuario.eliminado &&
                            handleCheckboxChange(
                              usuario.usuarioId,
                              "esAdmin",
                              !usuario.esAdmin
                            )
                          }
                        />
                      </td>
                      <td className="border-b p-2">
                        <input
                          type="checkbox"
                          checked={usuario.habilitado}
                          disabled={usuario.eliminado}
                          onChange={() =>
                            !usuario.eliminado &&
                            handleCheckboxChange(
                              usuario.usuarioId,
                              "habilitado",
                              !usuario.habilitado
                            )
                          }
                        />
                      </td>
                      <td className="border-b p-2">
                        <input
                          type="checkbox"
                          checked={usuario.eliminado}
                          disabled={usuario.eliminado}
                          onChange={() =>
                            handleCheckboxChange(
                              usuario.usuarioId,
                              "eliminado",
                              !usuario.eliminado
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paginación */}
              <div className="flex justify-center space-x-2 mt-4">
                {Array.from({
                  length: Math.ceil(filteredUsuarios.length / usuariosPerPage),
                }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`py-2 px-4 border ${
                      currentPage === index + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </LayoutDivComponent>

            {/* Modal de confirmación */}
            {isModalOpen && <ConfirmationModal />}
          </LayoutSectionComponent>
        </MainLayout>
      )}
    </>
  );
}
