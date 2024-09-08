// store/useAuthStore.ts
import { create } from "zustand";

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
  login: (email: string, token: string) =>
    set({ email, token, isAuthenticated: true }),
  logout: () => set({ email: "", token: "", isAuthenticated: false }),
}));
