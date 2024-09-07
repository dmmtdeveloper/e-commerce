"use client"
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProductDetailProps {
  params: { id: string };
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Lógica para cargar el producto usando el parámetro id
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${params.id}`);
      if (res.status === 404) {
        notFound();  // Manejo de error 404
      } else {
        const data = await res.json();
        setProduct(data);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (!product) {
    return <div>Loading...</div>;  // Estado de carga
  }

  return (
    <section>
      <h1>producto</h1>
      {/* <h1>{product.name}</h1> */}
      {/* <p>{product.description}</p> */}
      {/* Otros detalles del producto */}
    </section>
  );
}
