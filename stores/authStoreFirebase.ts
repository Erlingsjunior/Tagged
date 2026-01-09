import { create } from "zustand";
import { User } from "../types";
import * as firebaseAuthService from "../services/firebaseAuthService";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, nickname: string, name?: string, cpf?: string, phone?: string) => Promise<boolean>;
    completeProfile: (name: string, cpf: string, phone: string) => Promise<boolean>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    updateUser: (updates: Partial<User>) => Promise<void>;
}

const STORAGE_KEY = "tagged_user";

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    loadUser: async () => {
        try {
            set({ isLoading: true, error: null });

            // Observar estado de autenticação do Firebase
            const unsubscribe = firebaseAuthService.observeAuthState(async (firebaseUser) => {
                if (firebaseUser) {
                    // Buscar dados do usuário no Firestore
                    const userData = await firebaseAuthService.getCurrentUserData(firebaseUser.uid);
                    if (userData) {
                        set({ user: userData, isAuthenticated: true, isLoading: false });
                    } else {
                        set({ user: null, isAuthenticated: false, isLoading: false });
                    }
                } else {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            });

            // Retornar função de cleanup (opcional)
            return unsubscribe;
        } catch (error) {
            console.error("Error loading user:", error);
            set({ error: "Erro ao carregar usuário", isLoading: false });
        }
    },

    register: async (email: string, password: string, nickname: string, name?: string, cpf?: string, phone?: string) => {
        try {
            set({ isLoading: true, error: null });

            console.log("📝 Registrando usuário no Firebase...");

            // Registrar no Firebase
            const result = await firebaseAuthService.registerUser(email, password, nickname, {
                name,
                cpf,
                phone,
            });

            console.log("✅ Usuário registrado:", result.user.email);

            set({ user: result.user, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error: any) {
            console.error("❌ Erro ao registrar:", error);

            let errorMessage = "Erro ao criar conta";
            if (error.code === "auth/email-already-in-use") {
                errorMessage = "Email já cadastrado";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Email inválido";
            } else if (error.code === "auth/weak-password") {
                errorMessage = "Senha muito fraca (mínimo 6 caracteres)";
            }

            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    completeProfile: async (name: string, cpf: string, phone: string) => {
        try {
            const currentUser = get().user;
            if (!currentUser) {
                set({ error: "Usuário não autenticado" });
                return false;
            }

            set({ isLoading: true, error: null });

            console.log("📝 Completando perfil no Firestore...");

            // Atualizar no Firestore
            await firebaseAuthService.completeUserProfile(currentUser.id, {
                name,
                cpf,
                phone,
            });

            console.log("✅ Perfil completado!");

            // Atualizar estado local
            const updatedUser = {
                ...currentUser,
                name,
                cpf,
                phone,
                profileComplete: true,
            };

            set({ user: updatedUser, isLoading: false });
            return true;
        } catch (error: any) {
            console.error("❌ Erro ao completar perfil:", error);
            set({ error: "Erro ao completar perfil", isLoading: false });
            return false;
        }
    },

    login: async (email: string, password: string) => {
        try {
            set({ isLoading: true, error: null });

            console.log("🔐 Fazendo login no Firebase...");

            // Login no Firebase
            const result = await firebaseAuthService.loginUser(email, password);

            console.log("✅ Login bem-sucedido:", result.user.email);

            set({ user: result.user, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error: any) {
            console.error("❌ Erro no login:", error);

            let errorMessage = "Email ou senha incorretos";
            if (error.code === "auth/invalid-credential") {
                errorMessage = "Email ou senha incorretos";
            } else if (error.code === "auth/user-not-found") {
                errorMessage = "Usuário não encontrado";
            } else if (error.code === "auth/wrong-password") {
                errorMessage = "Senha incorreta";
            } else if (error.code === "auth/too-many-requests") {
                errorMessage = "Muitas tentativas. Tente novamente mais tarde";
            }

            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    logout: async () => {
        try {
            console.log("👋 Fazendo logout...");
            await firebaseAuthService.logoutUser();
            set({ user: null, isAuthenticated: false });
            console.log("✅ Logout bem-sucedido");
        } catch (error) {
            console.error("❌ Erro no logout:", error);
        }
    },

    updateProfile: async (updates: Partial<User>) => {
        try {
            const currentUser = get().user;
            if (!currentUser) return;

            const updatedUser = { ...currentUser, ...updates };
            set({ user: updatedUser });

            // Atualizar no Firestore (se necessário)
            // await firebaseAuthService.updateUserData(currentUser.id, updates);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    },

    updateUser: async (updates: Partial<User>) => {
        return get().updateProfile(updates);
    },
}));
