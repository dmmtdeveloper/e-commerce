"use client";

import { useState } from "react";
import { register } from "../../utils/authHelpers";
import MainLayout from "../layouts/MainLayout";
import { useRouter } from "next/navigation"; // Importa el hook useRouter

export default function RegisterPage() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [nombre, setNombre] = useState("");
  const router = useRouter(); // Inicializa el router

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(nombre, correo, clave);
      alert('Usuario registrado con éxito');
      router.push("/login"); // Redirige a la página de login
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert('Error en el registro');
    }
  };

  return (
    <MainLayout>
      <section className="px-96 min-h-screen pt-32">
        <div className="p-4 flex flex-col gap-10">
          <h1 className="text-3xl font-semibold text-center">Registro</h1>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="border p-2"
            />
            <input
              type="email"
              placeholder="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="border p-2"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="border p-2"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2"
            >
              Registrarse
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
