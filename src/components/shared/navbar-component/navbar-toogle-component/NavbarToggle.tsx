import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { useAuthStore } from "@/store/useAuthStore";
import Avatar from "@/components/shared/navbar-component/avatar-component/Avatar";

interface NavbarToggleProps {
  menuOpen: boolean;
  toggleMenu: () => void;
}

const NavbarToggle: React.FC<NavbarToggleProps> = ({
  menuOpen,
  toggleMenu,
}) => {
  const { avatar, isAuthenticated } = useAuthStore(); // Asegúrate de que isAuthenticated esté disponible

  return (
    <>
      {/* Solo muestra el avatar si el usuario está autenticado */}
      {isAuthenticated && (
        <span
          onClick={toggleMenu}
          className="cursor-pointer hidden md:block 2xl:block hover:text-blue-600"
        >
          <Avatar avatar={avatar} />
        </span>
      )}
      {/* Solo muestra el botón del menú hamburguesa si el usuario está autenticado */}
      {isAuthenticated && (
        <span onClick={toggleMenu} className="cursor-pointer md:hidden">
          {menuOpen ? (
            <IoClose className="text-2xl hover:text-red-500" />
          ) : (
            <GiHamburgerMenu className="text-2xl" />
          )}
        </span>
      )}
    </>
  );
};

export default NavbarToggle;
