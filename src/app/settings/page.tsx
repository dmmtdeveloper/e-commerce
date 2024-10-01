"use client";
import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { NavSetting } from "@/components/shared/NavSetting";
import { GetUsuarioByToken, UpdateNombreUsuario, UpdateClaveUsuario, UpdateLimpiaFotoUsuario, UpdateFotoUsuario } from "@/utils/authHelpers"; // Ajusta el path correctamente
import { Usuario } from "@/utils/authHelpers"; // Asegúrate de importar la interfaz correctamente
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { uploadImage, deleteImage} from "@/utils/firebase"; // Función para subir imágenes
import Image from "next/image";

// export default function UserProfile() {
//   const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       const filePath = `avatars/${file.name}`; // Definir una ruta en Firebase Storage
//       const imageUrl = await uploadImage(file, filePath);
//       console.log(imageUrl)
//       setProfileImageUrl(imageUrl); // Establecemos la URL de la imagen
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleFileChange} />
//       {profileImageUrl && <img src={profileImageUrl} alt="User Avatar" />}
//     </div>
//   );
// }


export default function SettingsPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nuevaPassword, setNuevaPassword] = useState<string>("");

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [clave, setClave] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);


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
          setAvatar(usuario.foto);
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
  }, []); 

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = usuario?.usuarioId;
    if (!file) return;

    console.log("Selected file:", file);
    console.log("User ID:", id); // Verifica que el ID es correcto

    try {
        const filePath = `avatars/usuarioId${id}-${file.name}`; // Definir una ruta en Firebase Storage
        const imageUrl = await uploadImage(file, filePath);
        console.log("Uploaded image URL:", imageUrl);
        setAvatar(imageUrl); // Establecemos la URL de la imagen
        sessionStorage.setItem("avatar", imageUrl);
        if (imageUrl && id) {
            await UpdateFotoUsuario(id, imageUrl);
            openSuccessModal("Avatar actualizado de forma correcta.");
        } else {
            console.warn("Avatar no existe");
        }       
    } catch (error) {
        console.error("Error uploading image:", error);
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
  
  const handleUpdateLimpiarFoto= async () => {
    const id = usuario?.usuarioId;
    if (id) {
      if (avatar) {
        try {
          await UpdateLimpiaFotoUsuario(id);
          try {
            await deleteImage(avatar);
            console.log("Imagen eliminada exitosamente");
          } catch (error) {
            console.error("Error al eliminar la imagen:", error);
          }
          openSuccessModal("Foto eliminada de forma correcta.");
          setAvatar(null);
        } catch (error) {
          console.error("Error al eliminar la foto en catch:", error);
          openErrorModal("Error al eliminar la foto.");
        }
      } else {
        console.log("No se puede subir el avatar, valor es null");
      }
      
    } else {
      console.warn("productId no existe");
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
      <section className="p-4 mt-16 gap-10 flex flex-col">
        <NavSetting />
  
        <div>
          <h1 className="font-semibold text-4xl">Tu Configuración</h1>
          <p>Actualizar la configuración de tu cuenta</p>
        </div>
  
        <table className="w-full border">
          <tbody>
          <tr>
              <td className="p-2">Avatar:</td>
              <td className="p-2">
              {!avatar && <input type="file" onChange={handleFileChange} />}
              
              {avatar && <Image src={avatar} width={300} height={300} alt="User Avatar"/>}
              </td>
              <td className="p-2">
                  {avatar && 
                  <button
                    type="button"
                    onClick={() => openConfirmationModal(() => handleUpdateLimpiarFoto(), "¿Estás seguro de que quieres remover la imagen de tu avatar?")}
                    className="bg-blue-500 text-white p-2"
                  >
                    Remover Avatar
                  </button>}
              </td>
            </tr>
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
