"use client";

import { useEffect, useState } from "react";
import { login } from "../../utils/authHelpers";
import MainLayout from "../layouts/MainLayout";
import { useRouter } from "next/navigation";
import { setToken, getToken } from "@/utils/tokenHelpers"; // Importa las funciones
import { useAuthStore } from "@/store/useAuthStore"; // Importa tu store de Zustand

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const loginStore = useAuthStore((state) => state.login); // Obtén la función login del store

  useEffect(() => {
    const storedToken = getToken(); // Revisa si ya hay un token guardado

    if (storedToken) {
      // Aquí puedes decodificar el token o hacer alguna validación adicional
      loginStore(email, storedToken); // Autenticar al usuario si ya hay un token
      router.push("/"); // Redirigir al home u otra página
    }
  }, [email,loginStore, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ email, password }); // Pasamos email y password a la función login
      
      setToken(data.token); // Guarda el token en sessionStorage
      setEmail(email); // Guarda el email en sessionStorage
      alert("Login exitoso");
      loginStore(email, data.token); // Inicia sesión en el store
      router.push("/"); // Redirige al usuario

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error en el login");
    }
  };

  return (
    <MainLayout>
      <section className="px-96 min-h-screen pt-32">
        <div className="p-4 flex flex-col gap-10">
          <h1 className="text-3xl font-semibold text-center">Iniciar Sesión</h1>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2"
              autoComplete="true"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2"
              autoComplete="true"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
