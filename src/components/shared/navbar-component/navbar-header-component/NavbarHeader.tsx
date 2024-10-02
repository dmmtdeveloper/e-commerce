import Link from "next/link";
import Image from "next/image";
import logo from "@/public/assets/icons/LOGO.svg";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useAuthStore } from "@/store/useAuthStore";
import useCartStore from "@/store/cartStore";
import NavbarToggle from "../navbar-toogle-component/NavbarToggle";
import { FC } from "react";

interface NavbarHeaderProps {
  menuOpen: boolean;
  toggleMenu: () => void;
}

const NavbarHeader: FC<NavbarHeaderProps> = ({ menuOpen, toggleMenu }) => {
  const { isAuthenticated } = useAuthStore();
  const { items } = useCartStore();

  const totalItemsInCart = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="flex w-full items-center justify-between px-4 2xl:px-8 py-4 gap-4">
      <Link href="/" className="text-2xl font-bold">
        <Image height={100} width={100} src={logo} alt="logo" priority />
      </Link>

      <section className="flex gap-4 items-center">
        <div className="flex gap-4">
          <Link href="/cart" className="relative">
            <MdOutlineShoppingCart className="text-2xl" />
            {totalItemsInCart > 0 && (
              <span className="absolute bottom-2 left-4 bg-blue-500 text-white text-xs rounded-full px-[0.65rem] py-[0.3rem]">
                {totalItemsInCart}
              </span>
            )}
          </Link>
          {!isAuthenticated ? (
            <>
              <Link href="/register" className="hover:text-blue-600">
                Registro
              </Link>
              <Link href="/login" className="hover:text-blue-600">
                Login
              </Link>
            </>
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
