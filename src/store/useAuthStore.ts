import { create } from "zustand";
import { clearToken } from "@/utils/tokenHelpers"; // Función para limpiar el token de sessionStorage

interface AuthState {
  email: string;
  token: string;
  isAuthenticated: boolean;
  setEmail: (email: string) => void;
  setToken: (token: string) => void;
  login: (email: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: "",
  token: "",
  isAuthenticated: false,
  setEmail: (email: string) => set({ email }),
  setToken: (token: string) => set({ token }),
  login: (email: string, token: string) => {
    sessionStorage.setItem("email", email); // Guarda el email en sessionStorage
    sessionStorage.setItem("token", token); // Guarda el token en sessionStorage
    set({ email, token, isAuthenticated: true });
  },
  logout: () => {
    clearToken(); // Limpia el token de sessionStorage
    set({ email: "", token: "", isAuthenticated: false });
  },
}));
