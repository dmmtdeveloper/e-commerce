import Link from "next/link";
import { useState, useEffect } from "react";
import { FaShoppingCart, FaTimes, FaHome } from "react-icons/fa";
import { useAuthStore } from "@/store/useAuthStore";
import useCartStore from "@/store/cartStore"; // Importa el store del carrito
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { email, isAuthenticated, login, logout } = useAuthStore();
  const { items } = useCartStore(); // Obtenemos los ítems del carrito
  const router = useRouter();

  // Calculamos la cantidad total de productos en el carrito
  const totalItemsInCart = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    const storedToken = sessionStorage.getItem("token");

    if (storedEmail && storedToken) {
      login(storedEmail, storedToken);
    }
  }, [login]);

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="fixed w-full flex justify-between items-center p-4 bg-gray-800 text-white z-[99999]">
      <Link href={"/"}>
        <div className="text-2xl font-bold">e-commerce</div>
      </Link>
      <div className="flex gap-4 items-center">
        <Link href={"/products"} className="relative">
          <FaShoppingCart />
          {totalItemsInCart > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {totalItemsInCart}
            </span>
          )}
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
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-2 py-2 rounded"
            >
              Cerrar sesión
            </button>
          </>
        )}

        <div className="relative">
          <span
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer"
          >
            {email || ""}
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
