import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { useAuthStore } from "@/store/useAuthStore";

import Avatar from "@/components/shared/navbar-component/avatar-component/Avatar";

interface NavbarToggleProps {
  menuOpen: boolean;
  toggleMenu: () => void;
  avatar?: string;
}

const NavbarToggle: React.FC<NavbarToggleProps> = ({
  menuOpen,
  toggleMenu,
}) => {
  const { avatar } = useAuthStore();

  return (
    <>
      <span
        onClick={toggleMenu}
        className="cursor-pointer hidden md:block 2xl:block hover:text-blue-600"
      >
        <Avatar avatar={avatar} />
      </span>
      <span onClick={toggleMenu} className="cursor-pointer md:hidden">
        {menuOpen ? (
          <IoClose className="text-2xl" />
        ) : (
          <GiHamburgerMenu className="text-2xl" />
        )}
      </span>
    </>
  );
};
export default NavbarToggle;
