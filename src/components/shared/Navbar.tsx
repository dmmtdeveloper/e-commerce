import { AiFillProduct } from "react-icons/ai";
import { AiOutlineSetting } from "react-icons/ai";
import { BiArrowToRight } from "react-icons/bi";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaBagShopping } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoClose } from "react-icons/io5"; // Importamos el icono de la X
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, MutableRefObject } from "react";

import Image from "next/image";
import Link from "next/link";
import useCartStore from "@/store/cartStore";
import userImg from "@/public/assets/img/user.png";
import logo from "@/public/assets/icons/LOGO.svg";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { email, name, isAuthenticated, logout, isAdmin, avatar } = useAuthStore();
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
    setMenuOpen(false);
    router.push("/");
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
    <>
      {/* Fondo oscurecido */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[99998]"
          onClick={() => setMenuOpen(false)} // Cierra el modal al hacer clic en el fondo
        />
      )}

      <motion.nav
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.25 }}
        className="fixed w-full flex justify-between items-center bg-slate-100 z-[99999]  flex-col"
      >
        <div className="bg-blue-500 w-full py-2">
          <p className="text-center text-sm text-slate-50">
            Precios únicos | adelantamos el{" "}
            <span className="font-semibold">Cyber</span>
          </p>
        </div>

        <div className="flex w-full justify-between px-4 2xl:px-16 mt-2 py-4">
          <Link href="/" className="text-2xl font-bold">
            <Image height={100} width={100} src={logo} alt="logo" priority />
          </Link>

          <section className="flex gap-8 items-center">
            <div className="flex gap-4">
              {!isAuthenticated && (
                <>
                  <Link href="/register" className=" hover:text-blue-600">
                    Registro
                  </Link>
                  <Link href="/login" className="hover:hover:text-blue-600">
                    Login
                  </Link>
                </>
              )}

              <Link href="/cart" className="relative">
                <MdOutlineShoppingCart className="text-2xl" />
                {totalItemsInCart > 0 && (
                  <span className="absolute bottom-2 left-4 bg-red-500 text-white text-xs rounded-full px-[0.65rem] py-[0.3rem]">
                    {totalItemsInCart}
                  </span>
                )}
              </Link>
            </div>

            {/* Modal de usuario */}
            <div className="relative" ref={menuRef}>
              {isAuthenticated && (
                <>
                  <span
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="cursor-pointer hidden md:block hover:text-blue-600"
                  >
                    {name || email}
                  </span>

                  <span
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="cursor-pointer md:hidden"
                  >
                    <GiHamburgerMenu className="text-2xl" />
                  </span>
                </>
              )}

              {/* Modal con transición */}
              <div
                className={`absolute right-0 h-[36rem] bg-slate-200 text-black p-4 md:w-[28rem] w-[22.5rem] 2xl:w-72 2xl:h-[36rem] rounded-3xl transform transition-transform duration-300 ease-in-out z-[99999] ${
                  menuOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
              >
                {/* Botón de Cerrar (X) */}
                <button
                  className="absolute top-4 right-4 text-black hover:text-red-500"
                  onClick={() => setMenuOpen(false)} // Cerrar modal con la X
                >
                  <IoClose size={24} />
                </button>

                <div className="p-4">
                  <article className="flex justify-center items-center bg-slate-300 p-6 rounded-3xl shadow-sm">
                    <div className="flex flex-col items-center justify-center gap-2">
                    {avatar !== null && avatar !== ""  && avatar !== undefined ? (
                      // <img src={avatar} alt="Avatar" style={{ borderRadius: '50%', objectFit: 'cover' }}  width={50} height={50}/>
                      <Image src={avatar} alt="Avatar" style={{ borderRadius: '50%', objectFit: 'cover' }}  width={50} height={50} priority/>
                    ) : (
                      <Image
                        width={50}
                        height={50}
                        priority
                        src={userImg}
                        alt="user"
                      />
                    )}
                      
                      <p className="text-sm">{name}</p>
                      <p className="text-sm">{email}</p>
                      <button
                        onClick={handleLogout}
                        className="flex items-center text-sm gap-1 text-black hover:text-red-500 transition-all bg-slate-200 p-2 rounded-xl"
                      >
                        <BiArrowToRight className="text-2xl" />
                        Cerrar sesión
                      </button>
                    </div>
                  </article>

                  <h3 className="font-semibold mb-4 mt-4">Menú</h3>
                  <article className="flex flex-col gap-4">
                    <ul className="flex flex-col gap-1">
                      <li className="flex items-center gap-2 hover:text-blue-500 transition-all duration-300 hover:bg-slate-50 p-2 rounded-xl">
                        <CiDeliveryTruck className="text-2xl" />
                        <Link className="text-sm" href="/orders">
                          Mis Pedidos
                        </Link>
                      </li>
                      <li className="flex items-center gap-2 hover:text-blue-500 transition-all hover:bg-slate-50 p-2 rounded-xl">
                        <AiOutlineSetting className="text-2xl" />
                        <Link className="text-sm" href="/settings">
                          Configuración
                        </Link>
                      </li>
                    </ul>
                  </article>

                  {isAdmin && (
                    <article className="mt-4">
                      <h3 className="font-bold mb-4">Administración</h3>

                      <div className="flex flex-col gap-2">
                        <ul className="flex flex-col gap-1">
                          <li className="font-normal flex gap-4 hover:text-blue-500 transition-all hover:bg-slate-50 p-2 rounded-xl">
                            <AiFillProduct className="text-2xl" />
                            <Link className="text-sm" href="/admin/products">
                              Productos
                            </Link>
                          </li>

                          <li className="flex gap-4 hover:text-blue-500 transition-all hover:bg-slate-50 p-2 rounded-xl">
                            <FaUsers className="text-2xl" />
                            <Link className="text-sm" href="/admin/users">
                              Usuarios
                            </Link>
                          </li>

                          <li className="items-center flex gap-4 hover:text-blue-500 transition-all hover:bg-slate-50 p-2 rounded-xl">
                            <FaBagShopping className="text-2xl" />
                            <Link className="text-sm" href="/admin/orders">
                              Pedidos
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </article>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
