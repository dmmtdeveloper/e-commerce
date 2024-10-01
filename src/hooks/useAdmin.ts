// hooks/useAdmin.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAdmin = () => {
    const router = useRouter();
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

    useEffect(() => {
        if (!isAdmin) {
            // Redirigir a una página de acceso denegado o a la página principal
            router.push('/notfound'); // O redirigir a otra ruta según tu aplicación
        }
    }, [isAdmin, router]);
};

export default useAdmin;
