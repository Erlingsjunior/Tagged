import { Platform, PermissionsAndroid, Alert } from "react-native";
import { useSpreadStore, Connection } from "../stores/spreadStore";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

// WiFi Direct service for P2P file sharing
// Note: This implementation uses expo-file-system and expo-sharing as fallback
// For true WiFi Direct on Android, you would need to create a native module
// or use a library like react-native-wifi-p2p

export interface DeviceInfo {
    id: string;
    name: string;
    type: "android" | "ios" | "unknown";
}

export interface TransferProgress {
    connectionId: string;
    bytesTransferred: number;
    totalBytes: number;
    percentage: number;
}

class WiFiDirectService {
    private isInitialized = false;
    private discoveredDevices: DeviceInfo[] = [];
    private activeTransfers = new Map<string, TransferProgress>();

    // APK information
    private readonly APK_NAME = "TaggedApp.apk";
    private readonly APK_SIZE = 50 * 1024 * 1024; // Estimated 50MB

    async initialize(): Promise<boolean> {
        if (this.isInitialized) return true;

        try {
            if (Platform.OS === "android") {
                // Request necessary permissions for WiFi Direct
                const granted = await this.requestAndroidPermissions();
                if (!granted) {
                    throw new Error("Permissions not granted");
                }
            }

            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error("Failed to initialize WiFi Direct:", error);
            return false;
        }
    }

    private async requestAndroidPermissions(): Promise<boolean> {
        if (Platform.OS !== "android") return true;

        try {
            const permissions = [
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_WIFI_STATE,
                PermissionsAndroid.PERMISSIONS.CHANGE_WIFI_STATE,
                PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES, // Android 13+
            ];

            const granted = await PermissionsAndroid.requestMultiple(permissions);

            return Object.values(granted).every(
                (permission) => permission === PermissionsAndroid.RESULTS.GRANTED
            );
        } catch (error) {
            console.error("Permission request failed:", error);
            return false;
        }
    }

    async startSharing(): Promise<void> {
        const initialized = await this.initialize();
        if (!initialized) {
            throw new Error("WiFi Direct not initialized");
        }

        try {
            // Start WiFi Direct group (become group owner)
            // In a real implementation, this would use native WiFi Direct APIs
            console.log("Starting WiFi Direct sharing...");

            // For now, we'll simulate the behavior
            useSpreadStore.getState().startSharing();

            // Start discovering devices
            await this.startDiscovery();
        } catch (error) {
            console.error("Failed to start sharing:", error);
            throw error;
        }
    }

    async stopSharing(): Promise<void> {
        try {
            // Stop WiFi Direct group
            console.log("Stopping WiFi Direct sharing...");

            // Cancel all active transfers
            this.activeTransfers.clear();

            // Clear discovered devices
            this.discoveredDevices = [];

            useSpreadStore.getState().stopSharing();
        } catch (error) {
            console.error("Failed to stop sharing:", error);
            throw error;
        }
    }

    async startReceiving(): Promise<void> {
        const initialized = await this.initialize();
        if (!initialized) {
            throw new Error("WiFi Direct not initialized");
        }

        try {
            // Start discovering WiFi Direct groups
            console.log("Starting WiFi Direct receiving...");

            useSpreadStore.getState().startReceiving();

            // Start discovering available sharers
            await this.startDiscovery();
        } catch (error) {
            console.error("Failed to start receiving:", error);
            throw error;
        }
    }

    async stopReceiving(): Promise<void> {
        try {
            console.log("Stopping WiFi Direct receiving...");

            // Stop discovery
            this.discoveredDevices = [];

            useSpreadStore.getState().stopReceiving();
        } catch (error) {
            console.error("Failed to stop receiving:", error);
            throw error;
        }
    }

    private async startDiscovery(): Promise<void> {
        try {
            // In a real implementation, this would use WiFi Direct discovery APIs
            // For now, we'll simulate discovery
            console.log("Starting device discovery...");

            // Simulate discovering devices after a delay
            setTimeout(() => {
                this.simulateDeviceDiscovery();
            }, 2000);
        } catch (error) {
            console.error("Failed to start discovery:", error);
            throw error;
        }
    }

    private simulateDeviceDiscovery(): void {
        // Simulate discovering nearby devices
        // In production, this would use real WiFi Direct APIs
        const mockDevices: DeviceInfo[] = [
            { id: "device-1", name: "Samsung Galaxy S21", type: "android" },
            { id: "device-2", name: "Motorola Moto G", type: "android" },
            { id: "device-3", name: "iPhone 12", type: "ios" },
        ];

        this.discoveredDevices = mockDevices;
    }

    async connectToDevice(deviceId: string): Promise<Connection> {
        try {
            const device = this.discoveredDevices.find((d) => d.id === deviceId);
            if (!device) {
                throw new Error("Device not found");
            }

            // Create connection object
            const connection: Connection = {
                id: `conn-${Date.now()}`,
                deviceName: device.name,
                deviceId: device.id,
                status: "connecting",
                progress: 0,
                startedAt: new Date(),
                bytesTransferred: 0,
                totalBytes: this.APK_SIZE,
            };

            // Add to store
            useSpreadStore.getState().addConnection(connection);

            // Simulate connection process
            await this.simulateConnection(connection);

            return connection;
        } catch (error) {
            console.error("Failed to connect to device:", error);
            throw error;
        }
    }

    private async simulateConnection(connection: Connection): Promise<void> {
        // Simulate connection establishment
        await this.delay(1000);

        useSpreadStore.getState().updateConnection(connection.id, {
            status: "transferring",
        });

        // Simulate file transfer
        await this.simulateTransfer(connection);
    }

    private async simulateTransfer(connection: Connection): Promise<void> {
        const totalBytes = this.APK_SIZE;
        let bytesTransferred = 0;

        // Simulate transfer progress
        const interval = setInterval(() => {
            // Transfer speed: ~5MB per second
            const chunkSize = 5 * 1024 * 1024;
            bytesTransferred = Math.min(bytesTransferred + chunkSize, totalBytes);

            const progress = (bytesTransferred / totalBytes) * 100;

            useSpreadStore.getState().updateConnection(connection.id, {
                bytesTransferred,
                progress,
            });

            if (bytesTransferred >= totalBytes) {
                clearInterval(interval);
                this.completeTransfer(connection);
            }
        }, 1000);
    }

    private async completeTransfer(connection: Connection): Promise<void> {
        useSpreadStore.getState().updateConnection(connection.id, {
            status: "completed",
            completedAt: new Date(),
            progress: 100,
        });

        // Update stats
        useSpreadStore.getState().incrementShared();
        useSpreadStore.getState().updateBytesShared(connection.totalBytes);
        useSpreadStore.getState().addToHistory(connection.deviceName, true);

        // Show success message
        Alert.alert(
            "Compartilhamento Concluído",
            `O Tagged foi compartilhado com ${connection.deviceName} com sucesso!`
        );
    }

    async shareAPK(): Promise<void> {
        try {
            // In a real implementation, this would:
            // 1. Check if APK exists in the app bundle
            // 2. Copy APK to a shareable location
            // 3. Use WiFi Direct to send the file

            // For now, we'll use Expo Sharing as a fallback
            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
                throw new Error("Sharing is not available on this device");
            }

            // In production, you would have the APK file path here
            // await Sharing.shareAsync(apkFilePath);

            Alert.alert(
                "Compartilhar APK",
                "Em produção, isso compartilharia o APK via WiFi Direct.\n\nPara implementar completamente:\n1. Build APK do app\n2. Incluir APK nos assets\n3. Implementar módulo nativo WiFi Direct"
            );
        } catch (error) {
            console.error("Failed to share APK:", error);
            throw error;
        }
    }

    getDiscoveredDevices(): DeviceInfo[] {
        return this.discoveredDevices;
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// Export singleton instance
export const wifiDirectService = new WiFiDirectService();
