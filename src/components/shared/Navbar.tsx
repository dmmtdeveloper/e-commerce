"use client";
import Link from "next/link";
import { useState } from "react";
import { FaShoppingCart, FaTimes } from "react-icons/fa"; // Importar el ícono de close

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const username = "JohnDoe"; // Simulación de datos del usuario
  const email = "john@example.com";

  return (
    <nav className="fixed w-full flex justify-between items-center p-4 bg-gray-800 text-white z-[99999]">
      <Link href={"/"}>
        <div className="text-2xl font-bold">Logo</div>
      </Link>
      <div className="flex gap-4">
        <FaShoppingCart />
        <Link href={"/register"}>Register</Link>
        <Link href={"/login"}>Login</Link>
      <div className="relative">
        <span onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer">
          {username}
        </span>
        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-white text-black p-4 rounded shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p>{username}</p>
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
              <li>
                <Link href="/signout">Sign Out</Link>
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
