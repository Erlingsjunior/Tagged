import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "../../stores/authStore";
import { theme } from "../../constants/Theme";

const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${theme.colors.background};
`;

const Content = styled(KeyboardAvoidingView)`
    flex: 1;
    padding: ${theme.spacing.xl}px;
    justify-content: center;
`;

const Logo = styled(Text)`
    font-size: 48px;
    font-weight: bold;
    color: ${theme.colors.primary};
    text-align: center;
    margin-bottom: ${theme.spacing.md}px;
`;

const Tagline = styled(Text)`
    font-size: 16px;
    color: ${theme.colors.text.secondary};
    text-align: center;
    margin-bottom: ${theme.spacing.xl}px;
`;

const Input = styled(TextInput)`
    background-color: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md}px;
    padding: ${theme.spacing.md}px;
    font-size: 16px;
    margin-bottom: ${theme.spacing.md}px;
    color: ${theme.colors.text.primary};
`;

const Button = styled(TouchableOpacity)<{ variant?: "primary" | "secondary" }>`
    background-color: ${(props) =>
        props.variant === "secondary" ? "transparent" : theme.colors.primary};
    padding: ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.md}px;
    align-items: center;
    margin-bottom: ${theme.spacing.md}px;
    ${(props) =>
        props.variant === "secondary" && `border: 1px solid ${theme.colors.primary};`}
`;

const ButtonText = styled(Text)<{ variant?: "primary" | "secondary" }>`
    color: ${(props) =>
        props.variant === "secondary" ? theme.colors.primary : theme.colors.surface};
    font-size: 16px;
    font-weight: bold;
`;

const ErrorText = styled(Text)`
    color: ${theme.colors.error};
    text-align: center;
    margin-bottom: ${theme.spacing.md}px;
`;

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { login, isLoading, error } = useAuthStore();

    const handleClearStorage = async () => {
        Alert.alert(
            "Limpar Storage",
            "Isso vai apagar TODOS os dados locais. Tem certeza?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Limpar Tudo",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            Alert.alert("✅ Sucesso", "Storage limpo! Recarregue o app.");
                        } catch (error) {
                            Alert.alert("❌ Erro", "Não foi possível limpar o storage");
                        }
                    },
                },
            ]
        );
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        const success = await login(email, password);
        if (success) {
            router.replace("/(tabs)/feed");
        }
    };

    return (
        <Container>
            <Content behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Logo>Tagged</Logo>
                <Tagline>Nossa voz, sua força, muda tudo.</Tagline>

                <Input
                    placeholder="Email"
                    placeholderTextColor={theme.colors.text.secondary}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!isLoading}
                />

                <Input
                    placeholder="Senha"
                    placeholderTextColor={theme.colors.text.secondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!isLoading}
                />

                {error && <ErrorText>{error}</ErrorText>}

                <Button onPress={handleLogin} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color={theme.colors.surface} />
                    ) : (
                        <ButtonText>Entrar</ButtonText>
                    )}
                </Button>

                <Button
                    variant="secondary"
                    onPress={() => router.push("/(auth)/register")}
                    disabled={isLoading}
                >
                    <ButtonText variant="secondary">Criar Conta</ButtonText>
                </Button>

                <TouchableOpacity
                    onPress={handleClearStorage}
                    style={{ marginTop: 20, padding: 10 }}
                >
                    <Text style={{ color: theme.colors.error, textAlign: "center", fontSize: 12 }}>
                        🧹 Limpar Storage (DEBUG)
                    </Text>
                </TouchableOpacity>
            </Content>
        </Container>
    );
}
