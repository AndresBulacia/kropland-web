import { create } from "zustand";
import { persist } from "zustand/middleware";

export type userRol = 'admin' | 'tecnico' | 'cliente';

export interface User {
    id: string;
    nombre: string;
    email: string;
    rol: userRol;
    fincasAsignadas?: string[];
}

export interface AuthState {
    // Estado
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Acciones
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
    clearError: () => void;
    isAdmin: () => boolean;
    isTecnico: () => boolean;
    isCliente: () => boolean;
}

// usuarios de demo para desarrollo/testing
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
        (set) => ({
            // Estado inicial
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Login
            login: async (email: string, password: string) => {
                set({isLoading: true, error: null});

                try {
                    // Simular delay de red
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];

                    if (!demoUser) {
                        throw new Error('Usuario no encontrado');
                    }

                    if (demoUser.password !== password) {
                        throw new Error('Contraseña incorrecta');
                    }

                    // Extraer contraseña del objeto (no guardar en estado)
                    const {password: _, ...userWithoutPassword} = demoUser;

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
                        error: error instanceof Error ? error.message: 'Error desconocido',
                    });
                    throw error;
                }
            },

            // Logout
            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            // Set user
            setUser: (user: User | null) => {
                set({
                    user,
                    isAuthenticated: user !== null,
                });
            },

            // Clear error
            clearError: () => {
                set({error: null});
            },

            // Checks de rols
            isAdmin: () => {
                return useAuthStore.getState().user?.rol === 'admin';
            },

            isTecnico: () => {
                return useAuthStore.getState().user?.rol === 'tecnico';
            },

            isCliente: () => {
                return useAuthStore.getState().user?.rol === 'cliente';
            },
        }),
        {
            name: 'auth-storaged',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

// Hook personalizado para usar el auth
export const useAuth = () => {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);
    const isAdmin = useAuthStore((state) => state.isAdmin);
    const isTecnico = useAuthStore((state) => state.isTecnico);
    const isCliente = useAuthStore((state) => state.isCliente);

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