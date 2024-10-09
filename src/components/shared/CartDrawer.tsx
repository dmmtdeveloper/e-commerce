import Image from 'next/image';
import useCartStore from "@/store/cartStore"; // Importación corregida

export default function CartDrawer() {
  // Obtenemos los items del carrito y calculamos el totalPrice
  const { items } = useCartStore();

  const totalPrice = items.reduce((total, item) => total + item.totalPrice, 0); // Calculo del totalPrice

  return (
    <div className="fixed right-0 top-0 w-1/3 h-full bg-white shadow-lg p-4">
      <h2 className="text-lg font-bold">Carrito de Compras</h2>
      <ul className="mt-4">
        {items.map((item: any) => (
          <li key={item.id} className="flex justify-between items-center">
            <Image src={item.image} alt={item.productName} className="h-16 w-16" />
            <div className="flex-1 ml-4">
              <h3 className="text-md font-semibold">{item.productName}</h3>
              <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
            </div>
            <p>${item.price}</p>
          </li>
        ))}
      </ul>
      <p className="text-lg font-bold mt-4">Total: ${totalPrice}</p>
      <button className="bg-green-500 text-white w-full p-2 mt-4">
        Finalizar compra
      </button>
    </div>
  );
}
