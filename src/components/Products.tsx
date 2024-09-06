import ProductCard from "@/components/shared/ProductCard";
import { productDetails } from '../types/products';
import Link from "next/link";



export default function ProductsPage() {
  return (
    <section className="mt-32">
      <Link href={"/product"}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {productDetails.map((product) => (
          <ProductCard key={product.id}  product={product}/>
        ))}
      </div>
      </Link>
    </section>
  );
}
