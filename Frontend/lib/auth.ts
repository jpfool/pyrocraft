import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: { username: string; role: string } | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (token: string, user: any) => void;
  logout: () => void;
  setToken: (token: string | null) => void;
  setHydrated: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (token: string, user: any) => {
        set({
          token,
          user,
          isAuthenticated: true
        });
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false
        });
      },

      setToken: (token: string | null) => {
        set({ token });
      },

      setHydrated: () => set({ isHydrated: true })
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: (state) => {
        return () => {
          state?.setHydrated();
        };
      }
    }
  )
);
