import ProductCard from "@/components/shared/ProductCard";
import { productDetails } from '../types/products';

export default function ProductsPage() {
  return (
    <section className="mt-32 mb-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {productDetails.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
