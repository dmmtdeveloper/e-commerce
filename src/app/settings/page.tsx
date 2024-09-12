"use client";
import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import { NavSetting } from "@/components/shared/NavSetting";
import { GetUsuarioByToken } from "@/utils/authHelpers"; // Ajusta el path correctamente
import { Usuario } from "@/utils/authHelpers"; // Asegúrate de importar la interfaz correctamente

export default function SettingsPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [nuevaPassword, setNuevaPassword] = useState<string>("");
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      // Si el token existe, hacemos la llamada al servicio para obtener el usuario
      GetUsuarioByToken(token)
        .then((usuario) => {
          setUsuario(usuario);
          setEmail(usuario.correo); // Asigna el correo obtenido
          setPassword(usuario.clave); // Asigna la clave obtenida
        })
        .catch((error) => {
          console.error("Error obteniendo el usuario:", error);
        });
        console.log("id" + usuario?.usuarioId)
    } else {
      console.warn("Token no encontrado en sessionStorage");
    }
  }, [usuario?.usuarioId]); // Se ejecuta una sola vez al montar el componente

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Lógica para guardar los cambios, usando los estados email, password y nuevaPassword
    console.log("Guardar cambios con:", { email, password, nuevaPassword });
  };

  return (
    <MainLayout>
      <section className="p-4 mt-32 gap-10 flex flex-col">
        <NavSetting />

        <div>
          <h1 className="font-semibold text-4xl">Tu Configuración</h1>
          <p>Actualizar la configuración de tu cuenta</p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2"
          />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            className="border p-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2">
            Guardar cambios
          </button>
        </form>
      </section>
    </MainLayout>
  );
}
