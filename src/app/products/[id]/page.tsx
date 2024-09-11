"use client";

import MainLayout from "@/app/layouts/MainLayout";
import { Product } from "@/types/product";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

import fetchProductDetails from "@/services/fetchProductDetails";

import useCartStore from "@/store/cartStore";
import ModalProductId from "@/components/ModalProductId";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { items, updateItemQuantity, addItem, removeItem } = useCartStore(); // Añadir removeItem

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await fetchProductDetails(params.id);
      if (data) {
        setProduct(data);
        const cartItem = items.find(
          (item) => item.id === data.productoId.toString()
        );
        if (cartItem) {
          setQuantity(cartItem.quantity);
        }
      } else {
        notFound();
      }
    };
    fetchProduct();
  }, [params.id, items]);

  // Incrementar la cantidad y actualizar el carrito
  const handleIncreaseQuantity = () => {
    setQuantity((qty) => {
      const newQuantity = qty + 1;
      if (product) {
        addItem({
          id: product.productoId.toString(),
          name: product.nombre,
          quantity: newQuantity,
        });
        updateItemQuantity(product.productoId.toString(), newQuantity);
      }
      return newQuantity;
    });
  };

  // Decrementar la cantidad y actualizar el carrito
  const handleDecreaseQuantity = () => {
    setQuantity((qty) => {
      const newQuantity = qty - 1;
      if (newQuantity >= 0 && product) {
        if (newQuantity === 0) {
          removeItem(product.productoId.toString()); // Eliminar producto si la cantidad es 0
        } else {
          updateItemQuantity(product.productoId.toString(), newQuantity);
        }
      }
      return newQuantity;
    });
  };

  const handleContinueShopping = () => {
    setShowModal(false);
  };
  const handleGoToCart = () => {
    setShowModal(false);
    window.location.href = "/cart";
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <MainLayout>
      <section className="mt-32 p-4">
        <h1 className="text-3xl font-bold">{product.nombre}</h1>
        <p className="text-lg text-gray-600">{product.descripcion}</p>
        <p className="text-xl font-semibold mt-4">Precio: ${product.precio}</p>
        <p className="text-xl font-semibold mt-4">Stock: {product.stock}</p>

        {/* Controles de cantidad */}
        <div className="flex items-center mt-4">
          <button
            onClick={handleDecreaseQuantity}
            className="p-2 bg-gray-200 rounded"
            aria-label="Decrease quantity"
            disabled={quantity <= 0}
          >
            <FaMinus />
          </button>
          <span className="mx-4 text-lg">{quantity}</span>
          <button
            onClick={handleIncreaseQuantity}
            className="p-2 bg-gray-200 rounded"
            aria-label="Increase quantity"
          >
            <FaPlus />
          </button>
        </div>

        {/* Mostrar modal */}
        {showModal && product && (
          <ModalProductId
            product={{
              nombre: product.nombre,
              precio: product.precio,
              quantity: quantity,
            }}
            onClose={() => setShowModal(false)}
            onGoToCart={handleGoToCart}
            onContinueShopping={handleContinueShopping}
          />
        )}
      </section>
    </MainLayout>
  );
}
