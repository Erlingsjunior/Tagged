import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

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
    updateUser: (updates: Partial<User>) => Promise<void>; // Alias para updateProfile
}

const STORAGE_KEYS = {
    USER: "tagged_user",
    USERS_DB: "tagged_users_db",
};

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    loadUser: async () => {
        try {
            set({ isLoading: true, error: null });
            const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);

            if (userJson) {
                const user = JSON.parse(userJson);
                set({ user, isAuthenticated: true, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error("Error loading user:", error);
            set({ error: "Erro ao carregar usuário", isLoading: false });
        }
    },

    register: async (email: string, password: string, nickname: string, name?: string, cpf?: string, phone?: string) => {
        try {
            set({ isLoading: true, error: null });

            // Get users database
            const usersDbJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
            const usersDb = usersDbJson ? JSON.parse(usersDbJson) : {};

            // Check if email already exists
            if (usersDb[email]) {
                set({ error: "Email já cadastrado", isLoading: false });
                return false;
            }

            // Check if CPF already exists (only if provided)
            if (cpf) {
                const cpfExists = Object.values(usersDb).some((u: any) => u.cpf === cpf);
                if (cpfExists) {
                    set({ error: "CPF já cadastrado", isLoading: false });
                    return false;
                }
            }

            // Determine if profile is complete
            const profileComplete = !!(name && cpf && phone);

            // Create new user
            const newUser: User = {
                id: Date.now().toString(),
                email,
                name: name || nickname, // Use nickname if name not provided
                nickname,
                cpf: cpf || undefined,
                phone: phone || undefined,
                role: 'user',
                verified: false,
                createdAt: new Date().toISOString(),
                stats: {
                    reportsCreated: 0,
                    reportsSigned: 0,
                    impactScore: 0,
                },
                following: [],
                followers: [],
                profileComplete,
            };

            // Save to database
            usersDb[email] = {
                ...newUser,
                password, // In production, this would be hashed
            };

            await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(usersDb));
            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));

            set({ user: newUser, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            console.error("Error registering:", error);
            set({ error: "Erro ao criar conta", isLoading: false });
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

            // Get users database
            const usersDbJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
            const usersDb = usersDbJson ? JSON.parse(usersDbJson) : {};

            // Check if CPF already exists (by another user)
            const cpfExists = Object.values(usersDb).some(
                (u: any) => u.cpf === cpf && u.id !== currentUser.id
            );
            if (cpfExists) {
                set({ error: "CPF já cadastrado", isLoading: false });
                return false;
            }

            // Update user
            const updates = {
                name,
                cpf,
                phone,
                profileComplete: true,
            };

            const updatedUser = { ...currentUser, ...updates };

            // Update in database
            if (usersDb[currentUser.email]) {
                usersDb[currentUser.email] = {
                    ...usersDb[currentUser.email],
                    ...updates,
                };
                await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(usersDb));
            }

            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
            set({ user: updatedUser, isLoading: false });
            return true;
        } catch (error) {
            console.error("Error completing profile:", error);
            set({ error: "Erro ao completar perfil", isLoading: false });
            return false;
        }
    },

    login: async (email: string, password: string) => {
        try {
            set({ isLoading: true, error: null });

            // Get users database
            const usersDbJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
            const usersDb = usersDbJson ? JSON.parse(usersDbJson) : {};

            // Check credentials
            const userRecord = usersDb[email];
            if (!userRecord || userRecord.password !== password) {
                set({ error: "Email ou senha incorretos", isLoading: false });
                return false;
            }

            // Remove password from user object
            const { password: _, ...user } = userRecord;

            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            console.error("Error logging in:", error);
            set({ error: "Erro ao fazer login", isLoading: false });
            return false;
        }
    },

    logout: async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEYS.USER);
            set({ user: null, isAuthenticated: false });
        } catch (error) {
            console.error("Error logging out:", error);
        }
    },

    updateProfile: async (updates: Partial<User>) => {
        try {
            const currentUser = get().user;
            if (!currentUser) return;

            const updatedUser = { ...currentUser, ...updates };

            // Update in users database
            const usersDbJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
            const usersDb = usersDbJson ? JSON.parse(usersDbJson) : {};

            if (usersDb[currentUser.email]) {
                usersDb[currentUser.email] = {
                    ...usersDb[currentUser.email],
                    ...updates,
                };
                await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(usersDb));
            }

            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
            set({ user: updatedUser });
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    },

    // Alias para updateProfile
    updateUser: async (updates: Partial<User>) => {
        return get().updateProfile(updates);
    },
}));
