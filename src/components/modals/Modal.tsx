import { Product } from "@/types/product";
import cartSuccess from "@/public/assets/animation/cart-success.json";
import Link from "next/link";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useRef } from "react";
import ButtonCtaComponent from "../buttons-components/button-cta-component";
import ReactDOM from "react-dom";
import Image from "next/image"; // Importamos el componente Image
import noImage from "@/public/assets/img/no_image.jpg"; // Imagen de respaldo si no hay imagen
import clsx from "clsx";
import banco from "@/public/assets/icons/logo-bancoestado-pdp-modyo.svg";

interface ModalProps {
  product: Product;
  onClose: () => void; // Función para cerrar el modal
  onContinueShopping?: () => void;
  onGoToCart?: () => void;
}

const formatCurrency = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// Función para manejar el clic fuera del modal

export default function Modal({ product, onClose }: ModalProps) {
  const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Si el clic se realiza en el contenedor externo (fuera del contenido modal), se cierra el modal
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  const successRef = useRef<LottieRefCurrentProps>(null);

  // Asegúrate de que el modal se monte al final del body usando createPortal
  return ReactDOM.createPortal(
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 w-full h-full bg-black bg-opacity-50 grid items-center justify-center z-50"
    >
      <div
        className={clsx(
          "2xl:px-16",
          "2xl:py-8 2xl:rounded-[3rem]",
          "2xl:w-[50rem]",

          "lg:px-16",
          "lg:py-8 2xl:rounded-[3rem]",
          "lg:w-[50rem]",

          "md:px-16",
          "md:py-8 2xl:rounded-[3rem]",
          "md:w-[50rem]",

          "bg-white",
          "flex flex-col gap-4",
          "p-8 rounded-3xl",
          "shadow-lg"
        )}
      >
        <div className="flex 2xl:gap-4 gap-2 items-center">
          <Lottie
            onComplete={() => {
              successRef.current?.goToAndPlay(45, true);
            }}
            lottieRef={successRef}
            loop={false}
            className="w-10"
            animationData={cartSuccess}
          />
          <h2 className="text-[12px] 2xl:text-normal text-pretty font-semibold">
            Producto agregado al carro de compras
          </h2>
        </div>

        {/* Mostrar la imagen del producto */}
        <div className="flex flex-col 2xl:flex-row 2xl:gap-18  justify-between">
          <div className="2xl:flex md:flex-col lg:flex-col 2xl:flex-col">
            <Image
              className="2xl:w-32 w-44 h-auto 2xl:h-36 "
              width={128}
              height={128}
              src={
                product.foto
                  ? `data:image/${product.extension};base64,${product.foto}` // Si hay imagen, mostrarla
                  : noImage // Si no hay imagen, mostrar la imagen por defecto
              }
              alt={product.nombre}
              priority
            />
            <p className="text-sm font-light text-gray-500">
              {product.nombre ? product.nombre : "Sin Nombre disponible"}
            </p>
            <p className="font-light 2xl:block 2xl:max-w-[30rem] hidden text-gray-700">
              {product.descripcion
                ? product.descripcion
                : "Sin Nombre disponible"}
            </p>
          </div>

          <div className="flex flex-col 2xl:w-52 md:w-52 lg:w-52">
            <div className="flex flex-col justify-center">
              <p className="2xl:font-normal text-[12px]">
                Otros medios de pago
              </p>

              <p className="text-3xl font-semibold">
                {product.precio !== undefined && product.precio !== null
                  ? `$${formatCurrency.format(product.precio)}`
                  : "N/A"}
              </p>
              <p className="font-light text-sm text-gray-400">Transferencia</p>
            </div>
            <div className=" flex justify-center gap-1 mt-4 flex-col">
              <p className="2xl:text-[12px] text-[10px]">
                Hasta 24 cuotas sin interés
              </p>
              <div className="flex gap-2">
                <Image
                  width={90}
                  height={90}
                  src={banco}
                  alt="banco"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <ButtonCtaComponent
            className="bg-green-500 hover:bg-green-700"
            text="Seguir Comprando"
            onClick={onClose}
          />

          <Link href={"/cart"}>
            <ButtonCtaComponent text="Ir al carrito" />
          </Link>
        </div>
      </div>
    </div>,
    document.body // El modal se montará directamente en el body para cubrir toda la pantalla
  );
}
