import Link from "next/link";
import { useState } from "react";
import { FaShoppingCart, FaTimes, FaHome } from "react-icons/fa";
import { useAuthStore } from "@/store/useAuthStore";
import useCartStore from "@/store/cartStore";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { email, name, isAuthenticated, logout, isAdmin } = useAuthStore();
  const { items } = useCartStore();
  const router = useRouter();

  const totalItemsInCart = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="fixed w-full flex justify-between items-center p-4 bg-gray-800 text-white z-[99999]">
      <Link href="/">
        <div className="text-2xl font-bold">e-commerce</div>
      </Link>
      <div className="flex gap-4 items-center">
        {/* Menú principal */}
        <Link href="/cart" className="relative">
          <FaShoppingCart />
          {totalItemsInCart > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {totalItemsInCart}
            </span>
          )}
        </Link>
        <Link href="/">
          <FaHome />
        </Link>

        {/* Links de autenticación */}
        {!isAuthenticated ? (
          <>
            <Link href="/register">Register</Link>
            <Link href="/login" className="cursor-pointer">
              Login
            </Link>
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

        {/* Menú desplegable */}
        <div className="relative">
          <span
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer"
          >
            {name || email} {/* Mostrar nombre si está disponible, de lo contrario el email */}
          </span>

          {menuOpen && isAuthenticated && (
            <div className="absolute right-0 mt-2 bg-white text-black p-4 rounded shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p>{name || email}</p> {/* Mostrar nombre o email en el menú */}
                </div>
                <button onClick={() => setMenuOpen(false)}>
                  <FaTimes />
                </button>
              </div>
              <br></br>
              {/* Sección Menú */}
              <h3 className="text-lg font-semibold">Menú</h3>
              <ul>
                <li>
                  <Link href="/settings">Configuración</Link>
                </li>
                <li>
                  <Link href="/orders">Mis Pedidos</Link>
                </li>
              </ul>

              {/* Sección Admin (solo si es administrador) */}
              {isAdmin && (
                <>
                  <h3 className="text-lg font-semibold mt-4">Admin</h3>
                  <ul>
                    <li>
                      <Link href="/admin/products">Productos</Link>
                    </li>
                    <li>
                      <Link href="/admin/users">Usuarios</Link>
                    </li>
                    <li>
                      <Link href="/admin/orders">Pedidos</Link>
                    </li>
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
