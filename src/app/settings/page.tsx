"use client";
import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  GetUsuarioByToken,
  UpdateNombreUsuario,
  UpdateClaveUsuario,
  UpdateLimpiaFotoUsuario,
  UpdateFotoUsuario,
  UpdateCorreoUsuario,
} from "@/utils/authHelpers"; // Asegúrate de ajustar el path correctamente
import { Usuario } from "@/utils/authHelpers"; // Asegúrate de importar la interfaz correctamente
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { uploadImage, deleteImage } from "@/utils/firebase"; // Función para subir y eliminar imágenes
import { InputComponent } from "@/components/input/InputComponent";
import { Title } from "@/components/title/Title";
import { NavSetting } from "@/components/shared/NavSetting";

import Image from "next/image";
import ConfirmationModal from "@/components/ConfirmationModal";
import SuccessModal from "@/components/modals/setting-modal-component/sucess-modal-component/success-modal-component";
import ErrorModal from "@/components/modals/setting-modal-component/error-modal-component/error-modal-component";
import ButtonCtaComponent from "@/components/buttons-components/button-cta-component";
import LabelComponent from "@/components/label-component/label-component";
import NavAdmin from "@/components/shared/NavAdmin";

export default function SettingsPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nombre, setNombre] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [clave, setClave] = useState<string>("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const [habilitado, setHabilitado] = useState<boolean>(false);
  const [eliminado, setEliminado] = useState<boolean>(false);
  const [esAdmin, setEsAdmin] = useState<boolean>(false);

  const { logout, isAdmin } = useAuthStore();

  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  // Estado para manejar la visibilidad de los modales
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [modalMessage, setModalMessage] = useState<string>("");

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true); // Asegura que el hook useRouter solo se use en el cliente
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
        openSuccessModal("Avatar actualizado correctamente.");
      } else {
        console.warn("Error: Avatar no existe.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      openErrorModal("Error subiendo la imagen.");
    }
  };

  const handleDeleteAccount = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        logout();
        router.push("/login");
      } catch (error) {
        console.error("Error eliminando la cuenta:", error);
        openErrorModal("Error eliminando la cuenta.");
      }
    } else {
      console.warn("Token no encontrado en sessionStorage");
    }
  };

  const openConfirmationModal = (
    action: () => void,
    message: string = "¿Estás seguro de que quieres realizar esta acción?"
  ) => {
    setConfirmAction(() => action);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsModalOpen(false);
    setConfirmAction(() => null);
    setModalMessage("");
  };

  const confirmActionHandler = () => {
    if (confirmAction) {
      confirmAction();
      closeConfirmationModal();
    }
  };

  const handleSaveChanges = async () => {
    const id = usuario?.usuarioId;

    // Validación de nombre
    if (!nombre.trim()) {
      openErrorModal("El nombre no puede estar vacío.");
      return;
    }

    // Validación de clave
    if (clave.length < 6) {
      openErrorModal("La clave debe tener al menos 6 caracteres.");
      return;
    }

    // Validación de correo electrónico
    if (!correo.trim()) {
      openErrorModal("El correo no puede estar vacío.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      openErrorModal("Por favor ingresa un correo electrónico válido.");
      return;
    }

    if (id) {
      try {
        await UpdateNombreUsuario(id, nombre);
        await UpdateClaveUsuario(id, clave);
        await UpdateCorreoUsuario(id, correo);
        openSuccessModal("Cambios guardados exitosamente.");
      } catch (error) {
        openErrorModal("Error actualizando los datos.");
      }
    } else {
      console.warn("ID de usuario no existe.");
    }
  };

  const handleUpdateLimpiarFoto = async () => {
    const id = usuario?.usuarioId;
    if (id && avatar) {
      try {
        await UpdateLimpiaFotoUsuario(id);
        await deleteImage(avatar);
        setAvatar(null);
        openSuccessModal("Foto eliminada correctamente.");
      } catch (error) {
        console.error("Error al eliminar la foto:", error);
        openErrorModal("Error al eliminar la foto.");
      }
    } else {
      console.warn("No se puede eliminar el avatar, valor nulo.");
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
      <section className="bg-slate-100 w-full pt-20 2xl:pt-20 md:pt-10 lg:pt-10">
        <div className="2xl:px-24 px-4 flex flex-col gap-8 bg-slate-100 w-full">
          {!isAdmin ? <NavSetting /> : <NavAdmin />}

          <div>
            <Title className="text-left" text="Tu configuración" />
            <p className="text-gray-500">
              Actualizar la configuración de tu cuenta
            </p>
          </div>
          <div>
            <article className="flex flex-col gap-4">
              <div className="flex gap-4 flex-col">
                <LabelComponent text="Avatar" />
                <div className="flex items-center gap-8">
                  <div>
                    {!avatar && (
                      <input type="file" onChange={handleFileChange} />
                    )}
                    {avatar && (
                      <Image
                        src={avatar}
                        alt="Avatar"
                        className="h-28 w-28 object-cover"
                        width={112}
                        height={112}
                      />
                    )}
                  </div>
                  {avatar && (
                    <ButtonCtaComponent
                      text="Cambiar Avatar"
                      onClick={() =>
                        openConfirmationModal(
                          handleUpdateLimpiarFoto,
                          "¿Estás seguro de que quieres Cambiar tu avatar?"
                        )
                      }
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <LabelComponent text="Nombre" className="pl-1" />
                <InputComponent
                  name="nombre"
                  placeholder="Ingresa tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <LabelComponent text="Correo electrónico" className="pl-1" />
                <InputComponent
                  name="email"
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <LabelComponent text="Contraseña" className="pl-1" />
                <InputComponent
                  name="password"
                  type="password"
                  placeholder="Ingresa tu clave"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <ButtonSettingComponent
                  text="Guardar Cambios"
                  onClick={handleSaveChanges}
                />

                <ButtonSettingComponent
                  className="bg-red-500 hover:bg-red-600"
                  text="Eliminar Cuenta"
                  onClick={() =>
                    openConfirmationModal(
                      handleDeleteAccount,
                      "¿Estás seguro de que quieres eliminar tu cuenta?"
                    )
                  }
                />
              </div>
            </article>
          </div>
        </div>

        {/* Modales */}
        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onCancel={closeConfirmationModal}
            onConfirm={confirmActionHandler}
            message={modalMessage}
          />
        )}

        {isSuccessModalOpen && (
          <SuccessModal
            isOpen={isSuccessModalOpen}
            onClose={closeSuccessModal}
            message={modalMessage}
          />
        )}

        {isErrorModalOpen && (
          <ErrorModal
            isOpen={isErrorModalOpen}
            onClose={closeErrorModal}
            message={modalMessage}
          />
        )}
      </section>
    </MainLayout>
  );
}
