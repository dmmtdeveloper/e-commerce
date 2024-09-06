"use client";

import { useState } from "react";
import { register } from "../../utils/authHelpers";
import MainLayout from "../layouts/MainLayout";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async () => {
    await register(email, password, name);
  };
  

  return (
    <MainLayout>
      <section className="px-96 min-h-screen pt-32">
        <div className="p-4 flex flex-col gap-10">
          <h1 className="text-3xl font-semibold text-center">Register</h1>

          <form action="" className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2"
            />
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
              className="border p-2"
            />
            <button
              onClick={handleRegister}
              className="bg-blue-500 text-white p-2 "
            >
              Registrarse
            </button>
          </form>
        </div>
      </section>
    </MainLayout>
  );
}
