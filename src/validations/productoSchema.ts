import { z } from 'zod';

export const productoSaveSchema = z.object({
  nombre: z.string()
    .min(1, { message: 'El campo nombre es obligatorio'})
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(100, { message: "El nombre no puede tener más de 100 caracteres." }),
  
  descripcion: z.string()
    .min(1,{ message: "La descripción no puede estar vacía." })
    .max(500, { message: "La descripción no puede tener más de 500 caracteres." }),
  
  precio: z.number()
    .positive({ message: "El precio debe ser mayor que 0." }),
  
  stock: z.number()
    .min(0, { message: "El stock no puede ser negativo." }),
  
  stockReservado: z.number()
    .min(0, { message: "El stock reservado no puede ser negativo." }),
  
  habilitado: z.boolean()
    .refine((value) => value !== null, { message: "El campo habilitado es obligatorio." }),
  
  eliminado: z.boolean()
    .refine((value) => value !== null, { message: "El campo eliminado es obligatorio." }),
  
  foto: z.string()
    .min(1,{ message: "El campo foto es obligatorio." }),

  nombreFoto: z.string()
    .min(1,{ message: "El campo nombreFoto es obligatorio." }),

    extension: z.string()
    .min(1,{ message: "El campo extension es obligatorio." }),

  
});
export type SaveProductoSchema = z.infer<typeof productoSaveSchema>;
