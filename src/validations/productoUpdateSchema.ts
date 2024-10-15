import { z } from "zod";

export const productoUpdateSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio."),
    descripcion: z.string().min(1, "La descripción es obligatoria."),
    stock: z
      .number()
      .min(1, { message: "El stock es obligatorio." })
      // .transform((value) => parseFloat(value)) // Transformar a número
      .refine((value) => !isNaN(value) && value >= 0, {
        message: "El stock no puede ser negativo.",
    }),    
    precio: z
      .number()
      .min(1, { message: "El precio es obligatorio." })
      // .transform((value) => parseFloat(value)) // Transformar a número
      .refine((value) => !isNaN(value) && value >= 0, {
        message: "El precio no puede ser negativo.",
      })
      .refine((value) => value > 0, {
        message: "El precio debe ser mayor que 0.",  
      })
});

export type updateProductoSchema = z.infer<typeof productoUpdateSchema>;

// export const productoEditSchema = z.object({
//     nombre: z.string().min(1, { message: "El nombre es obligatorio." }),
//     descripcion: z.string().min(1, { message: "La descripción es obligatoria." }),
//     precio: z
//       .number()
//       .min(0, { message: "El precio no puede ser negativo." }),
//     stock: z
//       .number()
//       .min(0, { message: "El stock no puede ser negativo." }),
//   });