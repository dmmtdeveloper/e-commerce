import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { clearToken } from "@/utils/tokenHelpers";

interface AuthState {
  email: string;
  token: string;
  name: string;
  isAuthenticated: boolean;
  login: (email: string, token: string, name: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: "",
      token: "",
      name: "",
      isAuthenticated: false,
      login: (email: string, token: string, name: string) => {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("name", name);
        console.log(sessionStorage.getItem("name"));
        console.log(name);

        set({ email, token, name, isAuthenticated: true });
      },
      logout: () => {
        sessionStorage.removeItem("token");
        set({ email: "", token: "", name: "", isAuthenticated: false });
        clearToken();
      },
    }),
    {
      name: "auth-storage", // Nombre del ítem en sessionStorage
      storage: createJSONStorage(() => sessionStorage), // Persistir en sessionStorage
    }
  )
);
