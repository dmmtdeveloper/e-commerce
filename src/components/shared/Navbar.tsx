"use client";
import Link from "next/link";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const username = "JohnDoe"; // Simulación de datos del usuario
  const email = "john@example.com";

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link href={"/"}>
        <div className="text-2xl font-bold">Logo</div>
      </Link>
      <div className="relative">
        <span onClick={() => setMenuOpen(!menuOpen)} className="cursor-pointer">
          {username}
        </span>
        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-white text-black p-4 rounded shadow-lg">
            <p>{username}</p>
            <p>{email}</p>
            <ul>
              <li>
                <a href="/settings">Settings</a>
              </li>
              <li>
                <a href="/orders">Mis Órdenes</a>
              </li>
              <li>
                <a href="/signout">Sign Out</a>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <FaShoppingCart />
        <Link href={"/register"}>Register</Link>
        <Link href={"/login"}>Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
