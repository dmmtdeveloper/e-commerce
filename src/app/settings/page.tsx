"use client";
import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { NavSetting } from "@/components/shared/NavSetting";
import { GetUsuarioByToken, UpdateNombreUsuario, UpdateClaveUsuario } from "@/utils/authHelpers"; // Ajusta el path correctamente
import { Usuario } from "@/utils/authHelpers"; // Asegúrate de importar la interfaz correctamente
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nuevaPassword, setNuevaPassword] = useState<string>("");

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [clave, setClave] = useState<string>("");
  const [habilitado, setHabilitado] = useState<boolean>(false);
  const [eliminado, setEliminado] = useState<boolean>(false);
  const [esAdmin, setEsAdmin] = useState<boolean>(false);

  const { logout } = useAuthStore();
  const router = useRouter();

  // Estado para manejar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      GetUsuarioByToken(token)
        .then((usuario) => {
          setUsuario(usuario);
          setNombre(usuario.nombre);
          setCorreo(usuario.correo);
          setClave(usuario.clave);
          setHabilitado(usuario.habilitado);
          setEliminado(usuario.eliminado);
          setEsAdmin(usuario.esAdmin);
        })
        .catch((error) => {
          console.error("Error obteniendo el usuario:", error);
        });
    } else {
      console.warn("Token no encontrado en sessionStorage");
    }
  }, []); // Se ejecuta una sola vez al montar el componente

  const handleUpdate = async (field: string) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        console.log(`Actualizando ${field}:`, {
          nombre,
          correo,
          clave,
          habilitado,
          eliminado,
          esAdmin,
        });
        setModalMessage(`El campo ${field} se actualizó correctamente.`);
        openConfirmationModal(() => {}, `¿Estás seguro de que quieres actualizar el ${field}?`);
      } catch (error) {
        console.error("Error actualizando el usuario:", error);
      }
    } else {
      console.warn("Token no encontrado en sessionStorage");
    }
  };

  const handleDeleteAccount = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        // await axios.delete("/api/Usuario/eliminar", {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });
        logout();
        router.push("/login");
      } catch (error) {
        console.error("Error eliminando la cuenta:", error);
      }
    } else {
      console.warn("Token no encontrado en sessionStorage");
    }
  };

  const openConfirmationModal = (action: () => void, message: string = "¿Estás seguro de que quieres realizar esta acción?") => {
    setConfirmAction(() => action);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsModalOpen(false);
    setConfirmAction(() => null); // Usa una función vacía para evitar el error de tipo
    setModalMessage("");
  };

  const confirmActionHandler = () => {
    if (confirmAction) {
      confirmAction();
      closeConfirmationModal();
    }
  };

  const handleUpdateName = async () => {
    const id = usuario?.usuarioId;
  
    // Validar que el nombre no esté vacío
    if (nombre.trim().length === 0) {
      openErrorModal("El nombre no puede estar vacío.");
      return; // Termina la función si el nombre no es válido
    }
  
    if (id) {
      try {
        await UpdateNombreUsuario(id, nombre);
        openSuccessModal("Nombre actualizado correctamente.");
      } catch (error) {
        console.error("Error actualizando el nombre:", error);
        openErrorModal("Error actualizando el nombre.");
      }
    } else {
      console.warn("Id no existe");
    }
  };
  
  
  const handleUpdateClave = async () => {
    const id = usuario?.usuarioId;
  
    // Validar que la clave tenga al menos 6 caracteres
    if (clave.length < 6) {
      openErrorModal("La clave debe tener al menos 6 caracteres.");
      return; // Termina la función si la clave no es válida
    }
  
    if (id) {
      try {
        await UpdateClaveUsuario(id, clave);
        openSuccessModal("Clave actualizada correctamente.");
      } catch (error) {
        console.error("Error actualizando la clave:", error);
        openErrorModal("Error actualizando la clave.");
      }
    } else {
      console.warn("Id no existe");
    }
  };
  
  

  if (!usuario) {
    return <div>Cargando...</div>;
  }

  const openSuccessModal = (message: string) => {
    setModalMessage(message);
    setIsSuccessModalOpen(true);
  };

  const openErrorModal = (message: string) => {
    setModalMessage(message);
    setIsErrorModalOpen(true);
  };

  const closeSuccessModal = () => setIsSuccessModalOpen(false);
  const closeErrorModal = () => setIsErrorModalOpen(false);

  return (
    <MainLayout>
      <section className="p-4 mt-32 gap-10 flex flex-col">
        <NavSetting />
  
        <div>
          <h1 className="font-semibold text-4xl">Tu Configuración</h1>
          <p>Actualizar la configuración de tu cuenta</p>
        </div>
  
        <table className="w-full border">
          <tbody>
            <tr>
              <td className="p-2">Usuario ID:</td>
              <td className="p-2">
                <input
                  type="text"
                  value={usuario?.usuarioId}
                  readOnly
                  className="border p-2 bg-gray-200"
                />
              </td>
              <td className="p-2"></td>
            </tr>
            <tr>
              <td className="p-2">Correo:</td>
              <td className="p-2">
                <input
                  type="text"
                  value={correo}
                  readOnly
                  className="border p-2 bg-gray-200"
                />
              </td>
              <td className="p-2"></td>
            </tr>
            <tr>
              <td className="p-2">Nombre:</td>
              <td className="p-2">
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="border p-2"
                />
              </td>
              <td className="p-2">
                <button
                  type="button"
                  onClick={() => openConfirmationModal(() => handleUpdateName(), "¿Estás seguro de que quieres actualizar el nombre?")}
                  className="bg-blue-500 text-white p-2"
                >
                  Actualizar Nombre
                </button>
              </td>
            </tr>
            <tr>
              <td className="p-2">Clave:</td>
              <td className="p-2">
                <input
                  type="text"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  className="border p-2"
                />
              </td>
              <td className="p-2">
                <button
                  type="button"
                  onClick={() => openConfirmationModal(() => handleUpdateClave(), "¿Estás seguro de que quieres actualizar la clave?")}
                  className="bg-blue-500 text-white p-2"
                >
                  Actualizar Clave
                </button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <div className="mt-4">
          <button
            type="button"
            onClick={() => openConfirmationModal(() => handleDeleteAccount(), "¿Estás seguro de que quieres eliminar tu cuenta?")}
            className="bg-red-500 text-white p-2"
          >
            Eliminar Cuenta
          </button>
        </div>
  
        {/* Modal de Confirmación */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Confirmación</h2>
              <p>{modalMessage}</p>
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={confirmActionHandler}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Confirmar
                </button>
                <button
                  onClick={closeConfirmationModal}
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Modal de Éxito */}
        {isSuccessModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-green-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Éxito</h2>
              <p>{modalMessage}</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeSuccessModal}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
  
        {/* Modal de Error */}
        {isErrorModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-red-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Error</h2>
              <p>{modalMessage}</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeErrorModal}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );  
}
