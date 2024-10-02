// components/Pagination.tsx

import { FC } from "react";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

interface PaginationProps {
  currentPage: number; // Asegúrate de que este tipo sea un número
  totalPages: number;   // Asegúrate de que este tipo sea un número
  setCurrentPage: (page: number) => void; // La función debe aceptar un número
}

const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, setCurrentPage }) => {
  return (
    <div className="flex items-center justify-center gap-5">
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} // Ir a la página anterior
        disabled={currentPage === 1}
      >
        <div className="bg-slate-300 p-2 rounded-full hover:bg-blue-600 transition-all duration-300 group">
          <GoChevronLeft className="text-2xl text-slate-50 group-hover:text-slate-50" />
        </div>
      </button>

      <p className="text-sm">
        Página {currentPage} de {totalPages}
      </p>

      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} // Ir a la página siguiente
        disabled={currentPage === totalPages}
      >
        <div className="bg-slate-300 p-2 rounded-full hover:bg-blue-600 transition-all duration-300 group">
          <GoChevronRight className="text-2xl text-slate-50 group-hover:text-slate-50" />
        </div>
      </button>
    </div>
  );
};

export default Pagination;
