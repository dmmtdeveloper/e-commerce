import ProductCard from '@/components/shared/ProductCard';


const products = [  // Simulando productos
  { id: 1, productName: 'Laptop', description: 'Laptop poderosa', price: 1000 },
  { id: 2, productName: 'Mouse', description: 'Mouse ergonómico', price: 50 },
  { id: 3, productName: 'Mouse', description: 'Mouse ergonómico', price: 25 },
];

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
