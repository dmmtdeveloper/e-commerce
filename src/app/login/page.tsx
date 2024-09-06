"use client";
import { useState } from "react";
import { login } from "../../utils/authHelpers";
import MainLayout from "../layouts/MainLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await login(email, password); // Función de autenticación
  };

  return (
    <MainLayout>
      <section className="min-h-screen px-96 pt-32">
        <div className="p-4 flex flex-col gap-10">
          <h1 className="text-3xl font-semibold text-center">Login</h1>

          <form action="" className="flex flex-col">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 mt-2"
            />
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white p-2 mt-4"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
