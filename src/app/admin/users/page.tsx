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
import { InputComponent } from "@/components/input/InputComponent";
import LabelComponent from "@/components/label-component/label-component";
import Pagination from "@/components/pagination-component/pagination-component";
import { MdEmail } from "react-icons/md";
import { FaUserSlash } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { FaUserTag } from "react-icons/fa";
import { GoPasskeyFill } from "react-icons/go";
import ButtonCtaComponent from "@/components/buttons-components/button-cta-component";
import * as XLSX from "xlsx"; // Importar la biblioteca XLSX

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
  const [currentPage, setCurrentPage] = useState(1);
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

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredUsers.map((usuario) => ({
        "ID": usuario.usuarioId,
        "Nombre": usuario.nombre,
        "Correo": usuario.correo,
        "Es Admin": usuario.esAdmin,
        "Habilitado": usuario.habilitado,
        "Eliminado": usuario.eliminado,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

    // Generar y descargar el archivo Excel
    XLSX.writeFile(workbook, "Listado de usuarios de sistema.xlsx");
  };

  // if (loading) {
  //   return <div>Cargando...</div>;
  // }

  if (error) {
    return <div>{error}</div>;
  }

  const filteredUsers = filteredUsuarios.slice(
    indexOfFirstUsuario,
    indexOfLastUsuario
  );

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredUsuarios.length / usuariosPerPage);
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
              <div>
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
                  <div className="2xl:flex md:flex lg:flex flex flex-col gap-4 2xl:gap-8 md:flex-row">
                    <InputComponent
                      type="text"
                      name="search"
                      placeholder="Buscar"
                      value={filters.search}
                      onChange={handleFilterChange}
                    />

                    <div className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        name="admin"
                        checked={filters.admin}
                        onChange={handleFilterChange}
                      />
                      <LabelComponent text="Administradores" />
                    </div>

                    <div className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        name="habilitado"
                        checked={filters.habilitado}
                        onChange={handleFilterChange}
                      />
                      <LabelComponent text="Habilitados" />
                    </div>

                    <div className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        name="noEliminado"
                        checked={filters.noEliminado}
                        onChange={handleFilterChange}
                      />
                      <LabelComponent text="Existentes" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Botón de descarga */}
                <div className="w-[20rem]">
                  <ButtonCtaComponent
                    text="Descarga Excel"
                    onClick={downloadExcel}
                  />
                </div>
              </div>

              {/* Tabla de Usuarios */}
              {/* Sección de Usuarios */}
              <section className="bg-white border-gray-300">
                {/* Encabezados */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-semibold bg-blue-500 text-slate-50 p-2">
                  <div className="flex justify-center items-center">
                    <FaUserTag className="text-2xl" title="Nombre" />
                  </div>
                  <div className="flex justify-center items-center">
                    <MdEmail className="text-2xl" title="Correo"/>
                  </div>
                  <div className="flex justify-center items-center">
                    <GoPasskeyFill className="text-2xl" title="Administrador"/>
                  </div>
                  <div className="flex justify-center items-center">
                    <FaUserCheck className="text-2xl" title="Habilitado"/>
                  </div>
                  <div className="flex justify-center items-center">
                    <FaUserSlash className="text-2xl" title="Eliminado"/>
                  </div>
                </div>

                {/* Cuerpo de la tabla */}
                <div className="divide-y divide-gray-300">
                  {currentUsuarios.map((usuario) => (
                    <div
                      key={usuario.usuarioId}
                      className="grid grid-cols-2 md:grid-cols-5 gap-4 p-2"
                    >
                      <p className="flex text-sm justify-center items-center">
                        {usuario.nombre}
                      </p>
                      <p className="flex text-sm justify-center items-center">
                        {usuario.correo}
                      </p>
                      <div className="flex justify-center items-center">
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
                      </div>
                      <div className="flex justify-center items-center">
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
                      </div>
                      <div className="flex justify-center items-center">
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
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Paginación */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={paginate}
              />
            </LayoutDivComponent>

            {/* Modal de confirmación */}
            {isModalOpen && <ConfirmationModal />}
          </LayoutSectionComponent>
        </MainLayout>
      )}
    </>
  );
}
