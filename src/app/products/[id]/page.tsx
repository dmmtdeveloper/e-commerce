import { useRouter } from 'next/router';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;  // Captura el ID dinámico

  return (
    <div>
      <h1>Detalles del producto {id}</h1>
      {/* Aquí puedes mostrar detalles específicos */}
    </div>
  );
}
