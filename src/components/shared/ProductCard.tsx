// import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        {/* <Image
          src={product.imageUrl}  // Reemplaza esto con tu fuente real
          alt={product.productName}
          className="h-40 w-full object-cover"
        /> */}
        <h2 className="text-lg font-bold mt-2">{product.productName}</h2>
        <p className="text-sm text-gray-600">{product.description}</p>
        <p className="text-md font-semibold mt-2">${product.price}</p>
        <button className="bg-blue-500 text-white p-2 mt-4 w-full">
          Agregar al carrito
        </button>
      </div>
    </Link>
  );
}
