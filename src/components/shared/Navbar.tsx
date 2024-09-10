"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaTimes, FaHome } from "react-icons/fa";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { email, isAuthenticated, login, logout } = useAuthStore(); // Obtenemos login y logout del store
  const router = useRouter();

  // Al cargar la página, verifica si el usuario está autenticado en sessionStorage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedToken = sessionStorage.getItem("token");

    if (storedEmail && storedToken) {
      login(storedEmail, storedToken); // Autentica al usuario automáticamente
    }
  }, [login]); // Dependencia de login

  const handleLogout = () => {
    logout(); // Limpia el estado de autenticación
    sessionStorage.removeItem("email"); // Limpia sessionStorage
    sessionStorage.removeItem("token"); // Limpia sessionStorage
    router.push("/login"); // Redirige al login
  };

  return (
    <nav className="fixed w-full flex justify-between items-center p-4 bg-gray-800 text-white z-[99999]">
      <Link href={"/"}>
        <div className="text-2xl font-bold">e-commerce</div>
      </Link>
      <div className="flex gap-4">
        <Link href={"/products"}>
          <FaShoppingCart />
        </Link>
        <Link href={"/"}>
          <FaHome />
        </Link>

        {!isAuthenticated ? (
          <>
            <Link href={"/register"}>Register</Link>
            <button className="cursor-pointer">
              <Link href={"/login"}>Login</Link>
            </button>
          </>
        ) : (
          <>
            {/* Botón de cerrar sesión si está autenticado */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-2 py-2 rounded"
            >
              Cerrar sesión
            </button>

            {/* Muestra el email del usuario autenticado */}
            {/* <span>{email}</span> */}
          </>
        )}

        <div className="relative">
          <span
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer"
          >
            {email || ""} {/* Muestra el email si está autenticado */}
          </span>
          {menuOpen && isAuthenticated && (
            <div className="absolute right-0 mt-2 bg-white text-black p-4 rounded shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p>{email}</p>
                </div>
                <button onClick={() => setMenuOpen(false)}>
                  <FaTimes />
                </button>
              </div>
              <ul>
                <li>
                  <Link href="/settings">Settings</Link>
                </li>
                <li>
                  <Link href="/orders">Mis Órdenes</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
