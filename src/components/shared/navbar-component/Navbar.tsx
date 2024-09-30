import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import NavbarHeader from "./navbar-header-component/NavbarHeader";
import ModalMenu from "./modal-menu-component/ModalMenu";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
        className="fixed w-full flex flex-col justify-between items-center bg-slate-300 z-[99999]"
      >
        {/* Barra superior */}
        <div className="bg-blue-500 w-full py-2">
          <p className="text-center text-sm text-slate-50">
            Precios únicos | adelantamos el{" "}
            <span className="font-semibold">Cyber</span>
          </p>
        </div>

        {/* Barra principal */}
        <div className="flex w-full items-center justify-between px-4 2xl:px-16">
          <section className="flex w-full items-center justify-between">
            <NavbarHeader />
            <ModalMenu menuOpen={menuOpen} toggleMenu={toggleMenu} />
          </section>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
