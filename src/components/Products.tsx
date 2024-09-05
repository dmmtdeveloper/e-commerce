import ProductCard from "@/components/shared/ProductCard";

const products = [
  // Simulando productos
  { id: 1, productName: "Laptop", description: "Laptop poderosa", price: 1000 },
  { id: 2, productName: "Mouse", description: "Mouse ergonómico", price: 50 },
];

export default function ProductsPage() {
  return (
    <section className="min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
