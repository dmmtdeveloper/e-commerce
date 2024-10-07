import { z } from "zod";

export const userRegisterSchema = z
  .object({
    // registro
    nombre: z
      .string()
      .min(3, { message: "El nombre debe tener mínimo 3 caracteres." }),
    correo: z.string().email({ message: "Por favor ingresa un correo válido" }),
    clave: z
      .string()
      .min(6, { message: "La contraseña debe tener 6 caracteres" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Las contraseñas deben coincidir" }),
  })
  .refine((data) => data.clave === data.confirmPassword, {
    message: "Las contraseñas deben coincidir",
    path: ["confirmPassword"],
  });
export type SignUpSchema = z.infer<typeof userRegisterSchema>;




export const userLoginSchema = z.object({
  email: z.string().email({ message: "Por favor ingresa un correo válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener 6 caracteres" }),
});
export type LoginUpSchema = z.infer<typeof userLoginSchema>;



export const userSaveSchema = z.object({
  nombre: 
  z.string()
    .min(3, { message: "El nombre debe tener mínimo 3 caracteres" }),

  clave: 
  z.string()
    .min(6, { message: "La contraseña debe tener 6 caracteres" }),

  correo: z.string().email({ message: "Por favor ingresa un correo válido" }),
});
export type SaveUserSchema = z.infer<typeof userSaveSchema>;
