// src/app/page.tsx
"use client";

import { ProductoList } from './../components/ProductoList';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-4xl w-full">
        <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">Lista de Productos</h1>
        <ProductoList />
      </div>
    </div>
  );
}
