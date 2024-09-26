import Link from "next/link";
import { useState, useRef, useEffect, MutableRefObject } from "react";
import { FaShoppingCart, FaHome } from "react-icons/fa";
import { useAuthStore } from "@/store/useAuthStore";
import useCartStore from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { BiArrowToRight } from "react-icons/bi";
import { AiOutlineSetting } from "react-icons/ai";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaUsers } from "react-icons/fa6";
import Image from "next/image";
import userImg from "@/public/assets/img/user.png";
import { FaBagShopping } from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { email, name, isAuthenticated, logout, isAdmin } = useAuthStore();
  const { items } = useCartStore();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(
    null
  ) as MutableRefObject<HTMLDivElement | null>;

  const totalItemsInCart = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = (): void => {
    logout();
    router.push("/login");
  };

  const handleClickOutside = (event: MouseEvent): void => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect((): (() => void) => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <nav className="fixed w-full flex justify-between items-center p-4 bg-gray-800 text-white z-[99999]">
      <Link href="/" className="text-2xl font-bold">
        e-commerce
      </Link>

      <section className="flex gap-4 items-center">
        {!isAuthenticated && (
          <>
            <Link href="/register">Register</Link>
            <Link href="/login">Login</Link>
          </>
        )}

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

        {/* Modal de usuario */}
        <div className="relative" ref={menuRef}>
          <span
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer"
          >
            {name || email}
          </span>

          {/* Modal con transición */}
          <div
            className={`absolute right-0 mt-2 bg-white text-black p-4 shadow-lg w-72 rounded-3xl transform transition-transform duration-300 ease-in-out ${
              menuOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <div className="p-4">
              <article className="flex justify-between items-center bg-slate-300 p-6 rounded-3xl shadow-sm">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Image
                    width={50}
                    height={50}
                    priority
                    src={userImg}
                    alt="user"
                  />
                  <p>{name}</p>
                  <p>{email}</p>
                </div>
              </article>
              <h3 className="text-xl font-semibold mb-4 mt-4">Menú</h3>
              <article className="flex flex-col gap-4">
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-2 hover:text-purple-500 transition-all hover:bg-slate-200 p-2 rounded-xl">
                    <CiDeliveryTruck className="text-2xl" />
                    <Link href="/orders">Mis Pedidos</Link>
                  </li>
                  <li className="flex items-center gap-2 hover:text-purple-500 transition-all hover:bg-slate-200 p-2 rounded-xl">
                    <AiOutlineSetting className="text-2xl" />
                    <Link href="/settings">Configuración</Link>
                  </li>
                </ul>
              </article>
              {isAdmin && (
                <article className="mt-4">
                  <h3 className="text-xl font-bold mb-4">Administración</h3>

                  <div className="flex flex-col gap-2">
                    <ul className="flex flex-col gap-2">
                      <li className="font-normal flex gap-4 hover:text-purple-500 transition-all hover:bg-slate-200 p-2 rounded-xl">
                        <AiFillProduct className="text-2xl" />
                        <Link href="/admin/products">Productos</Link>
                      </li>

                      <li className="flex gap-4 hover:text-purple-500 transition-all hover:bg-slate-200 p-2 rounded-xl">
                        <FaUsers className="text-2xl" />
                        <Link href="/admin/users">Usuarios</Link>
                      </li>

                      <li className="items-center flex gap-4 hover:text-purple-500 transition-all hover:bg-slate-200 p-2 rounded-xl">
                        <FaBagShopping className="text-2xl" />
                        <Link href="/admin/orders">Pedidos</Link>
                      </li>
                    </ul>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-4 text-black hover:text-red-500 transition-all hover:bg-slate-200 p-2 rounded-xl"
                    >
                      <BiArrowToRight className="text-2xl" />
                      Cerrar sesión
                    </button>
                  </div>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
