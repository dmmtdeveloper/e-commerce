// src/app/page.tsx
"use client";

import { ProductoList } from './../components/ProductoList';
import { Card } from '@/components/Card';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-[970px] w-full p-6 rounded-lg md:p-12">
        <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">Lista de Productos</h1>
        <ProductoList />
        <h1 className="text-3xl text-center font-bold text-gray-800 mt-6">Carrito de Compras</h1>
        <h1 className="text-3xl text-center font-bold text-gray-800 mt-6">Total: $0.00</h1>
      </div>
    </div>
  );
}
