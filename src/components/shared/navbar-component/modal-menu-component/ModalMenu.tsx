import { IoClose } from "react-icons/io5";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import AdminMenu from "../admin-menu-component/AdminMenu";
import NavbarToggle from "../navbar-toogle-component/NavbarToggle";
import React, { useRef } from "react";
import UserMenu from "../user-menu-component/UserMenu";

interface ModalMenuProps {
  menuOpen: boolean;
  toggleMenu: () => void;
}

const ModalMenu: React.FC<ModalMenuProps> = ({ menuOpen, toggleMenu }) => {
  const { isAuthenticated, logout, avatar } = useAuthStore();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toggleMenu();
    router.push("/");
  };

  return (
    <div>
      {isAuthenticated && (
        <div className="relative" ref={menuRef}>
          <NavbarToggle menuOpen={menuOpen} toggleMenu={toggleMenu} />

          {/* Modal */}
          <div
            className={`absolute right-0 bg-slate-200 text-black p-4 rounded-3xl transition-all duration-300 ease-in-out z-[99999] ${
              menuOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            style={{ height: "36rem", width: "22.5rem" }}
          >
            <button
              className="absolute right-4 text-black hover:text-red-500"
              onClick={toggleMenu}
              aria-label="Cerrar menú"
            >
              <IoClose className="2xl:block hidden " size={24} />
            </button>

            <div className="p-2">
              {/* user */}
              <UserMenu handleLogout={handleLogout} />
              {/* Admin */}
              <AdminMenu />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalMenu;
