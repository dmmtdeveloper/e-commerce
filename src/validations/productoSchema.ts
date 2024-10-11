import { z } from "zod";

export const productoSaveSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El campo nombre es obligatorio" })
    .max(200, { message: "El nombre no puede tener más de 200 caracteres." }),

  descripcion: z
    .string()
    .min(1, { message: "La descripción no puede estar vacía." })
    .max(500, {
      message: "La descripción no puede tener más de 500 caracteres.",
    }),

    precio: z
    .string()
    .min(1, { message: "El precio es obligatorio." })
    .transform((value) => parseFloat(value)) // Transformar a número
    .refine((value) => !isNaN(value) && value >= 0, {
      message: "El precio no puede ser negativo.",
    })
    .refine((value) => value > 0, {
      message: "El precio debe ser mayor que 0.",
    }),
  
  stock: z
    .string()
    .min(1, { message: "El stock es obligatorio." })
    .transform((value) => parseFloat(value)) // Transformar a número
    .refine((value) => !isNaN(value) && value >= 0, {
      message: "El stock no puede ser negativo.",
    }),

  stockReservado: z.number().int()
    .nonnegative("El stock reservado no puede ser negativo.").optional(), // Asegúrate de que sea opcional si no siempre se incluye
  
  foto:  z.string().optional(),
  nombreFoto: z.string().optional(), // Puede ser opcional
  extension: z.string().optional(), // Puede ser opcional
});
export type SaveProductoSchema = z.infer<typeof productoSaveSchema>;
