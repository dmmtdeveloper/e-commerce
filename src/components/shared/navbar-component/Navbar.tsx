import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import AdminMenu from "./admin-menu-component/AdminMenu";
import NavbarHeader from "./navbar-header-component/NavbarHeader";
import TopBar from "./top-bar-component/TopBar";
import UserMenu from "./user-menu-component/UserMenu";
import ClouseMenuButton from "@/components/buttons/ClouseMenuButton";
import clsx from "clsx";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { isAuthenticated, logout } = useAuthStore();

  const router = useRouter();

  const handleLogout = () => {
    logout();
    toggleMenu();
    router.push("/");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      {/* Backdrop cuando el menú está abierto */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[99998]"
          onClick={toggleMenu} // Permite cerrar el menú al hacer clic fuera
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
        className={clsx(
          "fixed w-full",
          "flex flex-col",
          "justify-between",
          "items-center",
          "bg-slate-100",
          "border-b-2 z-[99999]"
        )}
      >
        {/* Barra superior */}
        <TopBar />

        {/* Barra principal */}
        <div className="flex w-full items-center justify-between px-4 2xl:px-16">
          <section className="flex w-full items-center justify-between">
            <NavbarHeader menuOpen={menuOpen} toggleMenu={toggleMenu} />
            <div>
              {isAuthenticated && (
                <div className="relative" ref={menuRef}>
                  {/* Modal */}
                  <div
                    className={`absolute mt-4 right-0 h-[37rem] w-[22.5rem] bg-slate-200 text-black p-4 rounded-3xl transition-all duration-300 ease-in-out z-[99999] ${
                      menuOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    }`}
                  >
                    {/* Button clouse modal */}
                    <ClouseMenuButton onClick={toggleMenu} />

                    <div className="p-2">
                      {/* User */}
                      <UserMenu handleLogout={handleLogout} />
                      {/* Admin */}
                      <AdminMenu />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
