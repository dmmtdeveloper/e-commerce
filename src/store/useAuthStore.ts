// store/useAuthStore.ts
import create from 'zustand';

interface AuthState {
  email: string;
  isAuthenticated: boolean;
  setEmail: (email: string) => void;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: '',
  isAuthenticated: false,
  setEmail: (email: string) => set({ email }),
  login: (email: string) => set({ email, isAuthenticated: true }),
  logout: () => set({ email: '', isAuthenticated: false }),
}));
