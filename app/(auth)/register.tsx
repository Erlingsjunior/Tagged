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
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import { useAuthStore } from "../../stores/authStore";
import { theme } from "../../constants/Theme";
import { UserSchema } from "../../types";

const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${theme.colors.background};
`;

const Content = styled(KeyboardAvoidingView)`
    flex: 1;
`;

const ScrollContent = styled(ScrollView)`
    flex: 1;
    padding: ${theme.spacing.xl}px;
`;

const Logo = styled(Text)`
    font-size: 48px;
    font-weight: bold;
    color: ${theme.colors.primary};
    text-align: center;
    margin-top: ${theme.spacing.xl}px;
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

const TermsText = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    text-align: center;
    margin-bottom: ${theme.spacing.lg}px;
    line-height: 18px;
`;

const TermsLink = styled(Text)`
    color: ${theme.colors.primary};
    font-weight: bold;
`;

const formatCPF = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

export default function RegisterScreen() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();
    const { register, isLoading, error } = useAuthStore();

    const handleRegister = async () => {
        if (!name || !email || !cpf || !password || !confirmPassword) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        const cpfValidation = UserSchema.shape.cpf.safeParse(cpf);
        if (!cpfValidation.success) {
            Alert.alert("Erro", cpfValidation.error.errors[0].message);
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
            return;
        }

        const success = await register(email, password, name, cpf);
        if (success) {
            Alert.alert(
                "Bem-vindo ao Tagged!",
                "Sua conta foi criada com sucesso. Juntos vamos defender a verdade!",
                [
                    {
                        text: "Começar",
                        onPress: () => router.replace("/(tabs)/feed"),
                    },
                ]
            );
        }
    };

    return (
        <Container>
            <Content behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollContent showsVerticalScrollIndicator={false}>
                    <Logo>Tagged</Logo>
                    <Tagline>Nossa voz, sua força, muda tudo.</Tagline>

                    <Input
                        placeholder="Nome completo"
                        placeholderTextColor={theme.colors.text.secondary}
                        value={name}
                        onChangeText={setName}
                        editable={!isLoading}
                    />

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
                        placeholder="CPF (000.000.000-00)"
                        placeholderTextColor={theme.colors.text.secondary}
                        value={cpf}
                        onChangeText={(text) => setCpf(formatCPF(text))}
                        keyboardType="numeric"
                        maxLength={14}
                        editable={!isLoading}
                    />

                    <Input
                        placeholder="Senha (mínimo 6 caracteres)"
                        placeholderTextColor={theme.colors.text.secondary}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!isLoading}
                    />

                    <Input
                        placeholder="Confirmar senha"
                        placeholderTextColor={theme.colors.text.secondary}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        editable={!isLoading}
                    />

                    {error && <ErrorText>{error}</ErrorText>}

                    <TermsText>
                        Ao criar uma conta, você concorda com nossos{" "}
                        <TermsLink>Termos de Uso</TermsLink> e{" "}
                        <TermsLink>Política de Privacidade</TermsLink>. Você se compromete a
                        usar a plataforma de forma responsável e ética.
                    </TermsText>

                    <Button onPress={handleRegister} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color={theme.colors.surface} />
                        ) : (
                            <ButtonText>Criar Conta</ButtonText>
                        )}
                    </Button>

                    <Button
                        variant="secondary"
                        onPress={() => router.back()}
                        disabled={isLoading}
                    >
                        <ButtonText variant="secondary">Já tenho conta</ButtonText>
                    </Button>
                </ScrollContent>
            </Content>
        </Container>
    );
}
