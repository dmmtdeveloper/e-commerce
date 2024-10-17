import Link from "next/link";
import Image from "next/image";
import logo from "@/public/assets/icons/LOGO.svg";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useAuthStore } from "@/store/useAuthStore";
import useCartStore from "@/store/cartStore";
import NavbarToggle from "../navbar-toogle-component/NavbarToggle";
import { FC } from "react";
import { usePathname } from "next/navigation"; // Importar el hook para obtener la ruta actual

interface NavbarHeaderProps {
  menuOpen: boolean;
  toggleMenu: () => void;
}

const NavbarHeader: FC<NavbarHeaderProps> = ({ menuOpen, toggleMenu }) => {
  const pathname = usePathname(); // Obtener la ruta actual
  const { isAuthenticated } = useAuthStore();
  const { items } = useCartStore();

  const totalItemsInCart = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="flex w-full items-center justify-between px-4 2xl:px-8 py-4 gap-4">
      <Link href="/" className="text-2xl font-bold">
        <Image height={100} width={100} src={logo} alt="logo" priority className="w-24 h-auto" />
      </Link>

      <section className="flex gap-4 items-center">
        <div className="flex gap-8">
          <Link href="/cart" className="relative">
            <MdOutlineShoppingCart
              className={`hover:text-blue-500 cursor-pointer text-2xl ${
                pathname === "/cart" ? "active text-blue-500 font-medium" : ""
              }`}
            />
            {totalItemsInCart > 0 && (
              <span className="absolute bottom-2 left-4 bg-blue-500 text-white text-xs rounded-full px-[0.60rem] py-[0.3rem]">
                {totalItemsInCart}
              </span>
            )}
          </Link>
          {!isAuthenticated ? (
            <section className="flex gap-4">
              <article
                className={`hover:text-blue-500 cursor-pointer ${
                  pathname === "/register"
                    ? "active text-blue-500 font-medium"
                    : ""
                }`}
              >
                <Link href="/register" className="hover:text-blue-600">
                  Registro
                </Link>
              </article>
              <article
                className={`hover:text-blue-500 cursor-pointer ${
                  pathname === "/login"
                    ? "active text-blue-500 font-medium"
                    : ""
                }`}
              >
                <Link href="/login" className="hover:text-blue-600">
                  Login
                </Link>
              </article>
            </section>
          ) : (
            <span></span>
          )}
        </div>

        <NavbarToggle menuOpen={menuOpen} toggleMenu={toggleMenu} />
      </section>
    </div>
  );
};

export default NavbarHeader;
