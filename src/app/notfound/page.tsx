// pages/403.tsx
import MainLayout from "../../components/layouts/MainLayout"; // Asegúrate de tener esta ruta correcta
import { Title } from "@/components/title/Title"; // Importa el componente Title si lo necesitas
import Link from "next/link";

const Custom403 = () => {
  return (
    <MainLayout>
      <section className="min-h-screen flex items-center justify-center bg-slate-100">
        <article className="p-4 w-full 2xl:w-[60rem] flex flex-col items-center justify-center">
          <Title text="403 - Acceso Denegado" />
          <p className="mt-4 text-lg text-center">
            No tienes permiso para acceder a esta página.
          </p>
          <Link href="/" className="mt-6 text-blue-500 hover:underline text-lg">
            Volver a la página principal
          </Link>
        </article>
      </section>
    </MainLayout>
  );
};

export default Custom403;
