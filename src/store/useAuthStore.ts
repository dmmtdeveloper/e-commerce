import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { clearToken } from "@/utils/tokenHelpers";
import { GetUsuarioByToken, Usuario } from "@/utils/authHelpers";

interface AuthState {
  email: string;
  token: string;
  name: string;
  avatar: string;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  login: (email: string, token: string, name: string, avatar: string) => Promise<void>;
  logout: () => void;
  checkAdmin: () => Promise<void>;
  usuario?: Usuario;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      email: "",
      token: "",
      name: "",
      avatar: "",
      isAuthenticated: false,
      isAdmin: undefined, // Nuevo estado para isAdmin

      // Función de login
      login: async (email: string, token: string, name: string, avatar: string) => {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("avatar", avatar);
        // Establecer el estado inicial
        set({ email, token, name, isAuthenticated: true, avatar});

        // Llamar a la función para verificar si es admin
        await get().checkAdmin();
      },

      // Función de logout
      logout: () => {
        sessionStorage.removeItem("token");
        set({ email: "", token: "", name: "", avatar: "", isAuthenticated: false, isAdmin: undefined });
        clearToken();
      },

      // Función para verificar si es admin
      checkAdmin: async () => {
        const token = sessionStorage.getItem("token");

        if (token) {
          try {
            // Obtener el usuario por token
            const usuario = await GetUsuarioByToken(token);
            console.log("es admin?:", usuario.esAdmin);
            // Actualizar el estado con la información del usuario
            set({
              usuario,
              isAdmin: usuario.esAdmin, // Establecer si es admin
            });
          } catch (error) {
            console.error("Error verificando admin:", error);
            set({ isAdmin: false }); // Si hay error, no es admin
          }
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage), // Persistir en sessionStorage
    }
  )
);
