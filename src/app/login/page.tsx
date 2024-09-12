"use client";
import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { login } from "../../utils/authHelpers";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  // const loginStore = login();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });

      alert("Login exitoso");
      // loginStore(email, data.token); // Inicia sesión en el store
      router.push("/");
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
            <button type="submit" className="bg-blue-500 text-white p-2">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
