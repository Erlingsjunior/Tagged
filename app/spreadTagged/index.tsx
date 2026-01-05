import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { theme } from "../../constants/Theme";
import { useAuthStore } from "../../stores/authStore";
import { useSpreadStore } from "../../stores/spreadStore";
import { wifiDirectService, DeviceInfo } from "../../services/wifiDirectService";

const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${theme.colors.background};
`;

const Header = styled(View)`
    flex-direction: row;
    align-items: center;
    padding: ${theme.spacing.md}px;
    background-color: ${theme.colors.surface};
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.border};
`;

const BackButton = styled(TouchableOpacity)`
    padding: ${theme.spacing.sm}px;
    margin-right: ${theme.spacing.sm}px;
`;

const HeaderTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    flex: 1;
`;

const Content = styled(ScrollView)`
    flex: 1;
`;

const HeroSection = styled(View)`
    padding: ${theme.spacing.xl}px;
    background: ${theme.colors.primary};
    align-items: center;
`;

const HeroTitle = styled(Text)`
    font-size: 28px;
    font-weight: bold;
    color: ${theme.colors.surface};
    margin-bottom: ${theme.spacing.sm}px;
    text-align: center;
`;

const HeroSubtitle = styled(Text)`
    font-size: 16px;
    color: ${theme.colors.surface};
    opacity: 0.9;
    text-align: center;
    line-height: 24px;
`;

const ActionSection = styled(View)`
    padding: ${theme.spacing.xl}px;
`;

const ActionButton = styled(TouchableOpacity)<{ variant?: "share" | "receive" }>`
    background-color: ${(props) => (props.variant === "share" ? theme.colors.primary : "#059669")};
    padding: ${theme.spacing.xl}px;
    border-radius: ${theme.borderRadius.lg}px;
    margin-bottom: ${theme.spacing.md}px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    elevation: 4;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 4px;
`;

const ActionButtonContent = styled(View)`
    align-items: center;
    flex: 1;
`;

const ActionButtonTitle = styled(Text)`
    font-size: 20px;
    font-weight: bold;
    color: ${theme.colors.surface};
    margin-top: ${theme.spacing.sm}px;
    margin-bottom: ${theme.spacing.xs}px;
`;

const ActionButtonDescription = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.surface};
    opacity: 0.9;
    text-align: center;
`;

const StatsSection = styled(View)`
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.surface};
    margin: ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.lg}px;
`;

const StatsSectionTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.md}px;
`;

const StatsGrid = styled(View)`
    flex-direction: row;
    justify-content: space-around;
`;

const StatItem = styled(View)`
    align-items: center;
`;

const StatNumber = styled(Text)`
    font-size: 32px;
    font-weight: bold;
    color: ${theme.colors.primary};
`;

const StatLabel = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    margin-top: ${theme.spacing.xs}px;
    text-align: center;
`;

const InfoSection = styled(View)`
    padding: ${theme.spacing.lg}px;
    margin: ${theme.spacing.md}px;
    background-color: ${theme.colors.surface};
    border-radius: ${theme.borderRadius.lg}px;
    border-left-width: 4px;
    border-left-color: ${theme.colors.primary};
`;

const InfoTitle = styled(Text)`
    font-size: 16px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.sm}px;
`;

const InfoText = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    line-height: 22px;
`;

const ActiveConnectionsSection = styled(View)`
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.surface};
    margin: ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.lg}px;
`;

const ConnectionItem = styled(View)`
    flex-direction: row;
    align-items: center;
    padding: ${theme.spacing.md}px;
    background-color: ${theme.colors.background};
    border-radius: ${theme.borderRadius.md}px;
    margin-bottom: ${theme.spacing.sm}px;
`;

const ConnectionInfo = styled(View)`
    flex: 1;
    margin-left: ${theme.spacing.md}px;
`;

const ConnectionName = styled(Text)`
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
`;

const ConnectionStatus = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    margin-top: 2px;
`;

const ProgressBar = styled(View)`
    height: 6px;
    background-color: ${theme.colors.border};
    border-radius: 3px;
    margin-top: ${theme.spacing.xs}px;
    overflow: hidden;
`;

const ProgressFill = styled(View)<{ width: number }>`
    height: 100%;
    background-color: ${theme.colors.primary};
    width: ${(props) => props.width}%;
`;

export default function SpreadTaggedScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const {
        stats,
        activeConnections,
        isSharing,
        isReceiving,
        startSharing,
        stopSharing,
        startReceiving,
        stopReceiving,
    } = useSpreadStore();

    const [discoveredDevices, setDiscoveredDevices] = useState<DeviceInfo[]>([]);
    const [isInitializing, setIsInitializing] = useState(false);

    // Update discovered devices periodically when in receiving mode
    useEffect(() => {
        if (isReceiving) {
            const interval = setInterval(() => {
                const devices = wifiDirectService.getDiscoveredDevices();
                setDiscoveredDevices(devices);
            }, 2000);

            return () => clearInterval(interval);
        } else {
            setDiscoveredDevices([]);
        }
    }, [isReceiving]);

    const handleShare = async () => {
        Alert.alert(
            "Compartilhar Tagged Core",
            "Você está prestes a compartilhar o núcleo do Tagged via WiFi Direct. Outros dispositivos próximos poderão se conectar e baixar o app.",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Iniciar",
                    onPress: async () => {
                        try {
                            setIsInitializing(true);
                            await wifiDirectService.startSharing();
                            Alert.alert(
                                "Modo Compartilhamento Ativo",
                                "Seu dispositivo está visível para outros. Aguardando conexões..."
                            );
                        } catch (error) {
                            Alert.alert(
                                "Erro",
                                "Não foi possível iniciar o compartilhamento. Verifique as permissões."
                            );
                        } finally {
                            setIsInitializing(false);
                        }
                    },
                },
            ]
        );
    };

    const handleStopSharing = async () => {
        try {
            await wifiDirectService.stopSharing();
            Alert.alert("Compartilhamento Encerrado", "Você não está mais compartilhando o Tagged.");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível encerrar o compartilhamento.");
        }
    };

    const handleReceive = async () => {
        Alert.alert(
            "Receber Tagged Core",
            "Você vai procurar por dispositivos próximos compartilhando o Tagged Core.",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Procurar",
                    onPress: async () => {
                        try {
                            setIsInitializing(true);
                            await wifiDirectService.startReceiving();
                            Alert.alert(
                                "Procurando Dispositivos",
                                "Buscando dispositivos próximos que estejam compartilhando o Tagged..."
                            );
                        } catch (error) {
                            Alert.alert(
                                "Erro",
                                "Não foi possível iniciar a busca. Verifique as permissões."
                            );
                        } finally {
                            setIsInitializing(false);
                        }
                    },
                },
            ]
        );
    };

    const handleStopReceiving = async () => {
        try {
            await wifiDirectService.stopReceiving();
            setDiscoveredDevices([]);
            Alert.alert("Busca Encerrada", "Você não está mais procurando dispositivos.");
        } catch (error) {
            Alert.alert("Erro", "Não foi possível encerrar a busca.");
        }
    };

    const handleConnectToDevice = async (device: DeviceInfo) => {
        Alert.alert(
            "Conectar",
            `Deseja se conectar a ${device.name} para baixar o Tagged?`,
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Conectar",
                    onPress: async () => {
                        try {
                            await wifiDirectService.connectToDevice(device.id);
                        } catch (error) {
                            Alert.alert("Erro", "Não foi possível conectar ao dispositivo.");
                        }
                    },
                },
            ]
        );
    };

    return (
        <Container>
            <Header>
                <BackButton onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </BackButton>
                <HeaderTitle>Espalhar Tagged</HeaderTitle>
            </Header>

            <Content>
                {/* Hero Section */}
                <HeroSection>
                    <Ionicons name="share-social" size={64} color={theme.colors.surface} />
                    <HeroTitle>Nossa voz, sua força, muda tudo.</HeroTitle>
                    <HeroSubtitle>
                        Espalhe o Tagged para sua comunidade. Compartilhe o app diretamente, sem internet!
                    </HeroSubtitle>
                </HeroSection>

                {/* Action Buttons */}
                <ActionSection>
                    {isInitializing ? (
                        <View style={{ padding: 40, alignItems: "center" }}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={{ marginTop: 16, color: theme.colors.text.secondary }}>
                                Inicializando...
                            </Text>
                        </View>
                    ) : (
                        <>
                            <ActionButton
                                variant="share"
                                onPress={isSharing ? handleStopSharing : handleShare}
                                disabled={isReceiving}
                            >
                                <ActionButtonContent>
                                    <Ionicons
                                        name={isSharing ? "stop-circle" : "cloud-upload"}
                                        size={48}
                                        color={theme.colors.surface}
                                    />
                                    <ActionButtonTitle>
                                        {isSharing ? "Parar Compartilhamento" : "Compartilhar Core"}
                                    </ActionButtonTitle>
                                    <ActionButtonDescription>
                                        {isSharing
                                            ? "Compartilhando... Aguardando conexões"
                                            : "Envie o Tagged para outros dispositivos"}
                                    </ActionButtonDescription>
                                </ActionButtonContent>
                            </ActionButton>

                            <ActionButton
                                variant="receive"
                                onPress={isReceiving ? handleStopReceiving : handleReceive}
                                disabled={isSharing}
                            >
                                <ActionButtonContent>
                                    <Ionicons
                                        name={isReceiving ? "stop-circle" : "cloud-download"}
                                        size={48}
                                        color={theme.colors.surface}
                                    />
                                    <ActionButtonTitle>
                                        {isReceiving ? "Parar Busca" : "Receber Core"}
                                    </ActionButtonTitle>
                                    <ActionButtonDescription>
                                        {isReceiving
                                            ? "Procurando dispositivos..."
                                            : "Baixe o Tagged de um dispositivo próximo"}
                                    </ActionButtonDescription>
                                </ActionButtonContent>
                            </ActionButton>
                        </>
                    )}
                </ActionSection>

                {/* Discovered Devices */}
                {isReceiving && discoveredDevices.length > 0 && (
                    <ActiveConnectionsSection>
                        <StatsSectionTitle>Dispositivos Encontrados</StatsSectionTitle>
                        {discoveredDevices.map((device) => (
                            <TouchableOpacity
                                key={device.id}
                                onPress={() => handleConnectToDevice(device)}
                            >
                                <ConnectionItem>
                                    <Ionicons
                                        name={device.type === "android" ? "phone-portrait" : "phone-portrait"}
                                        size={32}
                                        color={theme.colors.primary}
                                    />
                                    <ConnectionInfo>
                                        <ConnectionName>{device.name}</ConnectionName>
                                        <ConnectionStatus>Toque para conectar</ConnectionStatus>
                                    </ConnectionInfo>
                                    <Ionicons name="chevron-forward" size={24} color={theme.colors.text.secondary} />
                                </ConnectionItem>
                            </TouchableOpacity>
                        ))}
                    </ActiveConnectionsSection>
                )}

                {/* Stats */}
                <StatsSection>
                    <StatsSectionTitle>Seu Impacto</StatsSectionTitle>
                    <StatsGrid>
                        <StatItem>
                            <StatNumber>{stats.totalShared}</StatNumber>
                            <StatLabel>Vezes{"\n"}Compartilhado</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNumber>{stats.peopleReached}</StatNumber>
                            <StatLabel>Pessoas{"\n"}Alcançadas</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNumber>{activeConnections.length}</StatNumber>
                            <StatLabel>Conexões{"\n"}Ativas</StatLabel>
                        </StatItem>
                    </StatsGrid>
                </StatsSection>

                {/* Active Connections */}
                {activeConnections.length > 0 && (
                    <ActiveConnectionsSection>
                        <StatsSectionTitle>Conexões Ativas</StatsSectionTitle>
                        {activeConnections.map((conn, index) => (
                            <ConnectionItem key={index}>
                                <Ionicons name="phone-portrait" size={32} color={theme.colors.primary} />
                                <ConnectionInfo>
                                    <ConnectionName>{conn.deviceName}</ConnectionName>
                                    <ConnectionStatus>{conn.status}</ConnectionStatus>
                                    <ProgressBar>
                                        <ProgressFill width={conn.progress} />
                                    </ProgressBar>
                                </ConnectionInfo>
                                <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>{conn.progress}%</Text>
                            </ConnectionItem>
                        ))}
                    </ActiveConnectionsSection>
                )}

                {/* Info Section */}
                <InfoSection>
                    <InfoTitle>Como funciona?</InfoTitle>
                    <InfoText>
                        O Tagged usa WiFi Direct para compartilhar o aplicativo diretamente entre dispositivos, sem necessidade de
                        internet. Perfeito para comunidades com acesso limitado à rede!
                    </InfoText>
                </InfoSection>

                <InfoSection>
                    <InfoTitle>Por que isso é importante?</InfoTitle>
                    <InfoText>
                        Em áreas com censura ou acesso limitado à internet, a capacidade de compartilhar o Tagged peer-to-peer garante
                        que a voz do povo não seja silenciada. Você se torna um nó da rede de resistência democrática!
                    </InfoText>
                </InfoSection>
            </Content>
        </Container>
    );
}
