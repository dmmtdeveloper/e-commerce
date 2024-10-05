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


  
export const userLoginSchema = z.object({

  email: z.string().email({ message: "Por favor ingresa un correo válido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener 6 caracteres" }),
});

export type SignUpSchema = z.infer<typeof userRegisterSchema>;
export type LoginUpSchema = z.infer<typeof userLoginSchema>;
