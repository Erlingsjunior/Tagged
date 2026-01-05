import React from "react";
import { ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { useAuthStore } from "../../stores/authStore";
import { theme } from "../../constants/Theme";

const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${theme.colors.background};
`;

const Header = styled(View)`
    background-color: ${theme.colors.primary};
    padding: ${theme.spacing.xl}px;
    align-items: center;
`;

const Avatar = styled(View)`
    width: 100px;
    height: 100px;
    border-radius: 50px;
    background-color: ${theme.colors.surface};
    align-items: center;
    justify-content: center;
    margin-bottom: ${theme.spacing.md}px;
`;

const AvatarText = styled(Text)`
    font-size: 40px;
    font-weight: bold;
    color: ${theme.colors.primary};
`;

const Name = styled(Text)`
    font-size: 24px;
    font-weight: bold;
    color: ${theme.colors.surface};
    margin-bottom: ${theme.spacing.xs}px;
`;

const Email = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.surface};
    opacity: 0.8;
`;

const StatsContainer = styled(View)`
    flex-direction: row;
    justify-content: space-around;
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.surface};
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.border};
`;

const StatItem = styled(View)`
    align-items: center;
`;

const StatValue = styled(Text)`
    font-size: 24px;
    font-weight: bold;
    color: ${theme.colors.primary};
`;

const StatLabel = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    margin-top: ${theme.spacing.xs}px;
`;

const Content = styled(ScrollView)`
    flex: 1;
`;

const Section = styled(View)`
    background-color: ${theme.colors.surface};
    margin-top: ${theme.spacing.md}px;
    padding: ${theme.spacing.md}px;
`;

const SectionTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.md}px;
`;

const MenuItem = styled(TouchableOpacity)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${theme.spacing.md}px;
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.border};
`;

const MenuItemText = styled(Text)`
    font-size: 16px;
    color: ${theme.colors.text.primary};
`;

const LogoutButton = styled(TouchableOpacity)`
    background-color: ${theme.colors.error};
    margin: ${theme.spacing.lg}px;
    padding: ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.md}px;
    align-items: center;
`;

const LogoutText = styled(Text)`
    color: ${theme.colors.surface};
    font-size: 16px;
    font-weight: bold;
`;

export default function ProfileScreen() {
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = () => {
        Alert.alert("Sair", "Tem certeza que deseja sair?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Sair",
                style: "destructive",
                onPress: async () => {
                    await logout();
                    router.replace("/(auth)/login");
                },
            },
        ]);
    };

    if (!user) {
        return null;
    }

    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <Container>
            <Header>
                <Avatar>
                    <AvatarText>{initials}</AvatarText>
                </Avatar>
                <Name>{user.name}</Name>
                <Email>{user.email}</Email>
            </Header>

            <StatsContainer>
                <StatItem>
                    <StatValue>{user.stats?.reportsCreated || 0}</StatValue>
                    <StatLabel>Denúncias</StatLabel>
                </StatItem>
                <StatItem>
                    <StatValue>{user.stats?.reportsSigned || 0}</StatValue>
                    <StatLabel>Assinaturas</StatLabel>
                </StatItem>
                <StatItem>
                    <StatValue>{user.stats?.impactScore || 0}</StatValue>
                    <StatLabel>Impacto</StatLabel>
                </StatItem>
            </StatsContainer>

            <Content>
                <Section>
                    <SectionTitle>Minhas Atividades</SectionTitle>
                    <MenuItem>
                        <MenuItemText>Minhas Denúncias</MenuItemText>
                    </MenuItem>
                    <MenuItem>
                        <MenuItemText>Petições Assinadas</MenuItemText>
                    </MenuItem>
                    <MenuItem>
                        <MenuItemText>Denúncias Salvas</MenuItemText>
                    </MenuItem>
                </Section>

                <Section>
                    <SectionTitle>Configurações</SectionTitle>
                    <MenuItem>
                        <MenuItemText>Editar Perfil</MenuItemText>
                    </MenuItem>
                    <MenuItem>
                        <MenuItemText>Notificações</MenuItemText>
                    </MenuItem>
                    <MenuItem>
                        <MenuItemText>Privacidade</MenuItemText>
                    </MenuItem>
                </Section>

                <Section>
                    <SectionTitle>Sobre</SectionTitle>
                    <MenuItem>
                        <MenuItemText>Termos de Uso</MenuItemText>
                    </MenuItem>
                    <MenuItem>
                        <MenuItemText>Política de Privacidade</MenuItemText>
                    </MenuItem>
                    <MenuItem>
                        <MenuItemText>Sobre o Tagged</MenuItemText>
                    </MenuItem>
                </Section>

                <LogoutButton onPress={handleLogout}>
                    <LogoutText>Sair da Conta</LogoutText>
                </LogoutButton>
            </Content>
        </Container>
    );
}
