"use client";

import { useState } from "react";
import { register } from "../../utils/authHelpers";
import MainLayout from "../layouts/MainLayout";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    await register(email, password);
  };

  return (
    <MainLayout>
      <div className="p-4">
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
          onClick={handleRegister}
          className="bg-blue-500 text-white p-2 mt-4"
        >
          Registrarse
        </button>
      </div>
    </MainLayout>
  );
}
