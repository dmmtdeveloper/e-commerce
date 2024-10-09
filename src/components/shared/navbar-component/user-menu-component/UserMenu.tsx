import { BiArrowToRight } from "react-icons/bi";
import Avatar from "@/components/shared/navbar-component/avatar-component/Avatar";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { TbTruckDelivery } from "react-icons/tb";
import { AiOutlineSetting } from "react-icons/ai";

interface UserMenuProps {
  handleLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ handleLogout }) => {
  const { email, name, avatar } = useAuthStore();

  return (
    <div className="py-4">
      <div className="flex flex-col items-center bg-slate-50 p-4 rounded-[2rem]  gap-2">
        <Avatar avatar={avatar} />
        <p className="text-sm">{name}</p>
        <p className="text-sm">{email}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm text-black hover:text-red-500 transition-all hover:bg-slate-200 p-2 rounded-xl border border-slate-200"
        >
          <BiArrowToRight className="text-2xl" />
          Cerrar sesión
        </button>
      </div>
      <h3 className="font-semibold mb-4 mt-4">Menú</h3>
      <ul className="flex flex-col gap-1">
        <li className="flex items-center gap-2 hover:text-blue-500 hover:bg-slate-50 p-2 rounded-xl">
          <TbTruckDelivery className="text-2xl" />
          <Link className="text-sm" href="/orders">
            Mis Compras
          </Link>
        </li>
        <li className="flex items-center gap-2 hover:text-blue-500 hover:bg-slate-50 p-2 rounded-xl">
          <AiOutlineSetting className="text-2xl" />
          <Link className="text-sm" href="/settings">
            Configuración
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
