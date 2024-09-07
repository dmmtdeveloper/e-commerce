// components/shared/Navbar.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { FaShoppingCart, FaTimes, FaHome } from "react-icons/fa";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { email, isAuthenticated, logout } = useAuthStore();  // Obtenemos el estado de autenticación
  const router = useRouter();

  const handleLogout = () => {
    logout();  // Limpia el estado de autenticación
    router.push("/login");  // Redirige al login
  };

  return (
    <nav className="fixed w-full flex justify-between items-center p-4 bg-gray-800 text-white z-[99999]">
      <Link href={"/"}>
        <div className="text-2xl font-bold">Logo</div>
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
            <Link href={"/login"}>Login</Link>
          </>
        ) : (
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
            Cerrar sesión
          </button>
        )}

        <div className="relative">
          <span
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer"
          >
            {email || "Guest"} {/* Muestra el email si está autenticado */}
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
