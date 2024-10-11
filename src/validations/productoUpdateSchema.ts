import { z } from "zod";

export const productoUpdateSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio."),
    descripcion: z.string().min(1, "La descripción es obligatoria."),
    stock: z.number().min(0, "El stock no puede ser negativo."),
    precio: z.number().min(0, "El precio no puede ser negativo."),
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