import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.productoId}`}>
      <div className="border p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <h2 className="text-lg font-bold mt-2">{product.nombre}</h2>
        <p className="text-sm text-gray-600">{product.descripcion}</p>
        <p className="text-md font-semibold mt-2">${product.precio}</p>
        <p className="text-md font-semibold mt-2">stock en tienda: {product.stock}</p>
        <button className="bg-blue-500 text-white p-2 mt-4 w-full">
          Agregar al carrito
        </button>
      </div>
    </Link>
  );
}
