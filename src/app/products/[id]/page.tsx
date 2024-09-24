"use client";

import MainLayout from "@/app/layouts/MainLayout";
import { Product } from "@/types/product";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

import fetchProductDetails from "@/services/fetchProductDetails";

import useCartStore from "@/store/cartStore";
import ModalProductId from "@/components/ModalProductId"; // Importar el modal

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false); // Controlar visibilidad del modal
  const { items, updateItemQuantity, addItem, removeItem } = useCartStore();

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

  // Manejar el primer producto agregado al carrito y mostrar modal
  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.productoId.toString(),
        name: product.nombre,
        quantity: 1,
      });
      setQuantity(1);
      setShowModal(true); // Mostrar modal cuando se agrega al carrito
    }
  };

  const handleContinueShopping = () => {
    setShowModal(false); // Cerrar modal y continuar comprando
  };

  const handleGoToCart = () => {
    setShowModal(false); // Cerrar modal y redirigir al carrito
    window.location.href = "/cart";
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <MainLayout>
      <section className="mt-32 p-4">
        <div>
          <h1 className="text-3xl font-bold">{product.nombre}</h1>
          <p className="text-lg text-gray-600">{product.descripcion}</p>
          <p className="text-xl font-semibold mt-4">
            Precio: ${product.precio}
          </p>
          <p className="text-xl font-semibold mt-4">Stock: {product.stock}</p>

          {/* Controles de cantidad o botón de agregar al carrito */}
          <div className="flex items-center mt-4">
            {quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Agregar al carrito
              </button>
            ) : (
              <>
                <button
                  onClick={handleDecreaseQuantity}
                  className="p-2 bg-gray-200 rounded"
                  aria-label="Decrease quantity"
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
              </>
            )}
          </div>

          {/* Mostrar modal cuando se agrega un producto */}
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
        </div>
      </section>
    </MainLayout>
  );
}
