import { z } from "zod";

const userSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "el nombre deberia ser de almenos 3 caracteres de largo",
    })
    .max(200, {
      message: "Eel nombre deberia ser de menos 200 caracteres",
    }),

  email: z.string().email().min(3, {
    message: "Porfavor ingresa un correo valido",
  }),

  password: z.string().email().min(3, {
    message: "Porfavor ingresa un minimo de 6 caracteres",
  }),
});
