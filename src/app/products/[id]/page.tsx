"use client";
import { FaPlus, FaMinus } from "react-icons/fa";
import { notFound } from "next/navigation";
import { Product } from "@/types/product";
import { useState, useEffect } from "react";

import banco from "@/public/assets/icons/logo-bancoestado-pdp-modyo.svg";
import ButtonCtaComponent from "@/components/buttons-components/button-cta-component";
import fetchProductDetails from "@/services/fetchProductDetails";
import Image from "next/image";
import Link from "next/link";
import MainLayout from "@/components/layouts/MainLayout";
import ModalProductId from "@/components/modals/ModalProductId"; // Importar el modal
import useCartStore from "@/store/cartStore";

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
        const cartItem = items.find((item) => item.id === params.id);
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
          price: product.precio,
          totalPrice: product.precio,
          quantity: newQuantity,
          foto: product.foto,
          extension: product.extension,
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
        price: product.precio,
        totalPrice: product.precio,
        quantity: 1,
        foto: product.foto,
        extension: product.extension,
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

  const formatCurrency = new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <MainLayout>
      <section className="mt-32 p-4 grid 2xl:grid-cols-2 2xl:px-80 items-center">
        <div>
          {product.foto && product.foto !== "" ? (
            <Image
              src={`data:image/${product.extension};base64,${product.foto}`}
              alt={product.nombre}
              className="w-500 h-500 object-cover rounded hover:scale-125 transition-all duration-300"
              height={500}
              width={500}
              priority
            />
          ) : (
            <div className="h-32 w-32 bg-gray-200 mr-4"></div>
          )}
        </div>
        <div>
          <div className="flex flex-col">
            <h2 className="text-normal">{product.nombre}</h2>
            <p className="text-lg text-gray-600">{product.descripcion}</p>
            <p className="text-5xl font-semibold mt-4">
              $
              {product.precio !== undefined && product.precio !== null
                ? `${formatCurrency.format(product.precio)}`
                : "N/A"}
            </p>
            <div className="flex gap-1 items-center mt-2">
              <p>Stock disponible:</p>
              <p className="text-md font-semibold">
                {product.stock - product.stockReservado}
              </p>
              <p>ud.</p>
            </div>
          </div>

          {/* Controles de cantidad o botón de agregar al carrito */}

          <div className="flex mt-4">
            {product.stock - product.stockReservado === 0 ? (
              <div className="px-4 py-2  bg-gray-200 text-slate-400 rounded-xl">
                No Disponible
              </div>
            ) : quantity === 0 ? (
              <ButtonCtaComponent
                onClick={handleAddToCart}
                text="Agregar al carrito"
              />
            ) : (
              <div className="flex flex-col">
                <div>
                  <div>
                    <div className="text-lg">
                      Total: ${formatCurrency.format(product.precio * quantity)}
                    </div>
                    <button
                      onClick={handleDecreaseQuantity}
                      className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus />
                    </button>
                    <span className="mx-4 text-lg">{quantity}</span>

                    <button
                      onClick={handleIncreaseQuantity}
                      className="p-2 bg-gray-200 rounded  hover:bg-gray-300"
                      aria-label="Increase quantity"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <div className="flex space-x-4 mt-4">
                  <Link href="/cart">
                    <ButtonCtaComponent text="Ir al carro" />
                  </Link>
                  <Link href="/">
                    <ButtonCtaComponent
                      className="bg-green-400 hover:bg-green-500"
                      text="Seguir comprando"
                    />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 flex  flex-col">
            <p>Aprovecha las cuotas sin interés</p>
            <div className="flex gap-2">
              <p className="text-sm">Hasta 24 cuotas</p>
              <Image width={90} height={90} src={banco} alt="banco" priority />
            </div>
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
