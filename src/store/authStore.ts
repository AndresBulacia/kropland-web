import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type userRol = 'admin' | 'tecnico' | 'cliente';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: userRol;
  fincasAsignadas?: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  clearError: () => void;
  isAdmin: () => boolean;
  isTecnico: () => boolean;
  isCliente: () => boolean;
}

const DEMO_USERS = {
  'admin@kropland.com': {
    id: 'admin-1',
    nombre: 'Administrador',
    email: 'admin@kropland.com',
    rol: 'admin' as userRol,
    password: 'admin123',
  },
  'tecnico@kropland.com': {
    id: 'tecnico-1',
    nombre: 'Juan García (Técnico)',
    email: 'tecnico@kropland.com',
    rol: 'tecnico' as userRol,
    password: 'tecnico123',
    fincasAsignadas: ['1', '2', '3'],
  },
  'cliente@kropland.com': {
    id: 'cliente-1',
    nombre: 'María López (Cliente)',
    email: 'cliente@kropland.com',
    rol: 'cliente' as userRol,
    password: 'cliente123',
    fincasAsignadas: ['1', '2'],
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];

          if (!demoUser) {
            throw new Error('Usuario no encontrado');
          }

          if (demoUser.password !== password) {
            throw new Error('Contraseña incorrecta');
          }

          const { password: _, ...userWithoutPassword } = demoUser;

          set({
            user: userWithoutPassword as User,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Error desconocido',
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: user !== null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      isAdmin: (): boolean => {
        return get().user?.rol === 'admin';
      },

      isTecnico: (): boolean => {
        return get().user?.rol === 'tecnico';
      },

      isCliente: (): boolean => {
        return get().user?.rol === 'cliente';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const useAuth = () => {
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const login = useAuthStore(state => state.login);
  const logout = useAuthStore(state => state.logout);
  const isAdmin = useAuthStore(state => state.isAdmin);
  const isTecnico = useAuthStore(state => state.isTecnico);
  const isCliente = useAuthStore(state => state.isCliente);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    isAdmin,
    isTecnico,
    isCliente,
  };
};