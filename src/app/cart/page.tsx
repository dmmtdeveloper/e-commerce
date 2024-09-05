"use client"
import { useCartStore } from '../../store/cartStore';
export default function CartPage() {
  const { cartItems } = useCartStore();

  return (
    <div className="p-4">
      <h1>Carrito de Compras</h1>
      {cartItems.map(item => (
        <div key={item.id}>
          <p>{item.productName} - {item.quantity}</p>
        </div>
      ))}
    </div>
  );
}
