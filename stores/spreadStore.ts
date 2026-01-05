import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Connection {
    id: string;
    deviceName: string;
    deviceId: string;
    status: "connecting" | "transferring" | "completed" | "failed";
    progress: number;
    startedAt: Date;
    completedAt?: Date;
    bytesTransferred: number;
    totalBytes: number;
}

export interface SpreadStats {
    totalShared: number; // Total de vezes que compartilhou
    peopleReached: number; // Total de pessoas que receberam
    totalBytesShared: number; // Total de dados compartilhados
    lastSharedAt?: Date;
    shareHistory: {
        date: Date;
        recipientDevice: string;
        success: boolean;
    }[];
}

interface SpreadState {
    // Stats
    stats: SpreadStats;

    // Active connections
    activeConnections: Connection[];

    // Sharing state
    isSharing: boolean;
    isReceiving: boolean;

    // Actions
    startSharing: () => void;
    stopSharing: () => void;
    startReceiving: () => void;
    stopReceiving: () => void;

    // Connection management
    addConnection: (connection: Connection) => void;
    updateConnection: (id: string, updates: Partial<Connection>) => void;
    removeConnection: (id: string) => void;

    // Stats updates
    incrementShared: () => void;
    addToHistory: (recipientDevice: string, success: boolean) => void;
    updateBytesShared: (bytes: number) => void;
}

export const useSpreadStore = create<SpreadState>()(
    persist(
        (set) => ({
            stats: {
                totalShared: 0,
                peopleReached: 0,
                totalBytesShared: 0,
                shareHistory: [],
            },
            activeConnections: [],
            isSharing: false,
            isReceiving: false,

            startSharing: () => set({ isSharing: true }),
            stopSharing: () => set({ isSharing: false, activeConnections: [] }),

            startReceiving: () => set({ isReceiving: true }),
            stopReceiving: () => set({ isReceiving: false }),

            addConnection: (connection) =>
                set((state) => ({
                    activeConnections: [...state.activeConnections, connection],
                })),

            updateConnection: (id, updates) =>
                set((state) => ({
                    activeConnections: state.activeConnections.map((conn) =>
                        conn.id === id ? { ...conn, ...updates } : conn
                    ),
                })),

            removeConnection: (id) =>
                set((state) => ({
                    activeConnections: state.activeConnections.filter((conn) => conn.id !== id),
                })),

            incrementShared: () =>
                set((state) => ({
                    stats: {
                        ...state.stats,
                        totalShared: state.stats.totalShared + 1,
                        peopleReached: state.stats.peopleReached + 1,
                        lastSharedAt: new Date(),
                    },
                })),

            addToHistory: (recipientDevice, success) =>
                set((state) => ({
                    stats: {
                        ...state.stats,
                        shareHistory: [
                            ...state.stats.shareHistory,
                            {
                                date: new Date(),
                                recipientDevice,
                                success,
                            },
                        ].slice(-50), // Keep only last 50 entries
                    },
                })),

            updateBytesShared: (bytes) =>
                set((state) => ({
                    stats: {
                        ...state.stats,
                        totalBytesShared: state.stats.totalBytesShared + bytes,
                    },
                })),
        }),
        {
            name: "spread-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
