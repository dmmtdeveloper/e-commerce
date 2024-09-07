"use client"
import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useRouter } from "next/router";
import { login } from "@/utils/authHelpers";
import { setToken } from "@/utils/tokenHelpers";

export default function SettingsPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  return (
    <MainLayout>
      <div className="p-4 mt-32">
        <h1 className="font-semibold text-4xl">Tu Configuracion</h1>
        <p>actualizar la configuración de tu cuenta</p>
        {/* Aquí se incluirán campos para editar la información */}

        <form  className="flex flex-col gap-4">
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
            <button
              type="submit"
              className="bg-blue-500 text-white p-2"
            >
              Guardar cambios
            </button>
          </form>
      </div>
    </MainLayout>
  );
}
