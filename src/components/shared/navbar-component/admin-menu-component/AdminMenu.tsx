import { AiFillProduct } from "react-icons/ai";
import { FaBagShopping, FaUsers } from "react-icons/fa6";
import Link from "next/link";
import { BsGraphUpArrow } from "react-icons/bs";

const AdminMenu: React.FC = () => (
  <div className="mt-4">
    <h3 className="font-bold mb-4">Administración</h3>
    <ul className="flex flex-col gap-1">
      <li className="flex items-center gap-4 hover:text-blue-500 hover:bg-slate-50 p-2 rounded-xl">
        <AiFillProduct className="text-2xl" />
        <Link className="text-sm" href="/admin/products">
          Productos
        </Link>
      </li>
      <li className="flex items-center gap-4 hover:text-blue-500 hover:bg-slate-50 p-2 rounded-xl">
        <FaUsers className="text-2xl" />
        <Link className="text-sm" href="/admin/users">
          Usuarios
        </Link>
      </li>
      <li className="flex items-center gap-4 hover:text-blue-500 hover:bg-slate-50 p-2 rounded-xl">
        <FaBagShopping className="text-2xl" />
        <Link className="text-sm" href="/admin/orders">
          Pedidos
        </Link>
      </li>

      <li className="flex items-center gap-4 hover:text-blue-500 hover:bg-slate-50 p-2 rounded-xl">
        <BsGraphUpArrow className="text-2xl" />
        <Link className="text-sm" href="/admin/dashboards">Dashboards</Link>
      </li>
    </ul>
  </div>
);

export default AdminMenu;
