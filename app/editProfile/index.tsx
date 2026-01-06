import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { theme } from "../../constants/Theme";
import { useAuthStore } from "../../stores/authStore";
// import * as ImagePicker from "expo-image-picker"; // Remover após instalar expo-image-picker

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

const SaveButton = styled(TouchableOpacity)`
    padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
`;

const SaveButtonText = styled(Text)`
    color: ${theme.colors.primary};
    font-size: 16px;
    font-weight: 600;
`;

const Content = styled(ScrollView)`
    flex: 1;
`;

const Section = styled(View)`
    background-color: ${theme.colors.surface};
    padding: ${theme.spacing.lg}px;
    margin-top: ${theme.spacing.md}px;
`;

const SectionTitle = styled(Text)`
    font-size: 16px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.md}px;
`;

const AvatarSection = styled(View)`
    align-items: center;
    padding: ${theme.spacing.xl}px;
    background-color: ${theme.colors.surface};
`;

const AvatarContainer = styled(TouchableOpacity)`
    position: relative;
`;

const Avatar = styled(View)`
    width: 120px;
    height: 120px;
    border-radius: 60px;
    background-color: ${theme.colors.primary};
    align-items: center;
    justify-content: center;
    margin-bottom: ${theme.spacing.sm}px;
`;

const AvatarImage = styled(Image)`
    width: 120px;
    height: 120px;
    border-radius: 60px;
`;

const AvatarText = styled(Text)`
    font-size: 48px;
    font-weight: bold;
    color: ${theme.colors.surface};
`;

const AvatarEditBadge = styled(View)`
    position: absolute;
    bottom: 0;
    right: 0;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: ${theme.colors.primary};
    align-items: center;
    justify-content: center;
    border-width: 3px;
    border-color: ${theme.colors.surface};
`;

const AvatarHint = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    margin-top: ${theme.spacing.sm}px;
`;

const InputGroup = styled(View)`
    margin-bottom: ${theme.spacing.lg}px;
`;

const Label = styled(Text)`
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.xs}px;
`;

const Input = styled(TextInput)`
    background-color: ${theme.colors.background};
    padding: ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.md}px;
    font-size: 16px;
    color: ${theme.colors.text.primary};
    border-width: 1px;
    border-color: ${theme.colors.border};
`;

const InputHint = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    margin-top: ${theme.spacing.xs}px;
`;

const DangerZone = styled(View)`
    background-color: ${theme.colors.surface};
    padding: ${theme.spacing.lg}px;
    margin-top: ${theme.spacing.md}px;
    border-left-width: 4px;
    border-left-color: ${theme.colors.error};
`;

const DangerButton = styled(TouchableOpacity)`
    background-color: ${theme.colors.error};
    padding: ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.md}px;
    align-items: center;
    margin-top: ${theme.spacing.md}px;
`;

const DangerButtonText = styled(Text)`
    color: ${theme.colors.surface};
    font-size: 16px;
    font-weight: 600;
`;

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, updateUser } = useAuthStore();

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");
    const [bio, setBio] = useState(user?.bio || "");

    const handlePickImage = async () => {
        // Simulação - em produção, integraria com expo-image-picker
        Alert.alert(
            "Alterar Foto",
            "Funcionalidade de câmera/galeria será implementada em breve!\n\nPor enquanto, você pode usar as iniciais do seu nome.",
            [
                {
                    text: "OK",
                },
            ]
        );

        // TODO: Após instalar expo-image-picker, descomentar o código abaixo
        /*
        Alert.alert(
            "Alterar Foto",
            "Escolha uma opção",
            [
                {
                    text: "Câmera",
                    onPress: async () => {
                        const { status } = await ImagePicker.requestCameraPermissionsAsync();
                        if (status !== "granted") {
                            Alert.alert("Permissão negada", "Precisamos de acesso à câmera.");
                            return;
                        }

                        const result = await ImagePicker.launchCameraAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.8,
                        });

                        if (!result.canceled && result.assets[0]) {
                            setAvatar(result.assets[0].uri);
                        }
                    },
                },
                {
                    text: "Galeria",
                    onPress: async () => {
                        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (status !== "granted") {
                            Alert.alert("Permissão negada", "Precisamos de acesso à galeria.");
                            return;
                        }

                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 0.8,
                        });

                        if (!result.canceled && result.assets[0]) {
                            setAvatar(result.assets[0].uri);
                        }
                    },
                },
                {
                    text: "Cancelar",
                    style: "cancel",
                },
            ]
        );
        */
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert("Erro", "O nome não pode estar vazio.");
            return;
        }

        if (!email.trim() || !email.includes("@")) {
            Alert.alert("Erro", "Por favor, insira um email válido.");
            return;
        }

        try {
            await updateUser({
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim(),
                avatar,
                bio: bio.trim(),
            });

            Alert.alert("Sucesso", "Perfil atualizado com sucesso!", [
                {
                    text: "OK",
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            console.error("Error updating profile:", error);
            Alert.alert("Erro", "Não foi possível atualizar o perfil. Tente novamente.");
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            "Excluir Conta",
            "Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.\n\nTodos os seus dados, denúncias e assinaturas serão permanentemente removidos.",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => {
                        Alert.alert(
                            "Confirmação Final",
                            "Digite 'EXCLUIR' para confirmar a exclusão da conta",
                            [
                                {
                                    text: "Cancelar",
                                    style: "cancel",
                                },
                            ]
                        );
                    },
                },
            ]
        );
    };

    if (!user) {
        return null;
    }

    const getInitials = () => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Container>
            <Header>
                <BackButton onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </BackButton>
                <HeaderTitle>Editar Perfil</HeaderTitle>
                <SaveButton onPress={handleSave}>
                    <SaveButtonText>Salvar</SaveButtonText>
                </SaveButton>
            </Header>

            <Content>
                <AvatarSection>
                    <AvatarContainer onPress={handlePickImage}>
                        <Avatar>
                            {avatar ? (
                                <AvatarImage source={{ uri: avatar }} />
                            ) : (
                                <AvatarText>{getInitials()}</AvatarText>
                            )}
                        </Avatar>
                        <AvatarEditBadge>
                            <Ionicons name="camera" size={20} color={theme.colors.surface} />
                        </AvatarEditBadge>
                    </AvatarContainer>
                    <AvatarHint>Toque para alterar foto</AvatarHint>
                </AvatarSection>

                <Section>
                    <SectionTitle>Informações Pessoais</SectionTitle>

                    <InputGroup>
                        <Label>Nome Completo</Label>
                        <Input
                            value={name}
                            onChangeText={setName}
                            placeholder="Seu nome completo"
                            placeholderTextColor={theme.colors.text.secondary}
                        />
                        <InputHint>Este nome será exibido nas suas denúncias públicas</InputHint>
                    </InputGroup>

                    <InputGroup>
                        <Label>Email</Label>
                        <Input
                            value={email}
                            onChangeText={setEmail}
                            placeholder="seu@email.com"
                            placeholderTextColor={theme.colors.text.secondary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <InputHint>Usado para notificações e recuperação de conta</InputHint>
                    </InputGroup>

                    <InputGroup>
                        <Label>Telefone (Opcional)</Label>
                        <Input
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="(00) 00000-0000"
                            placeholderTextColor={theme.colors.text.secondary}
                            keyboardType="phone-pad"
                        />
                        <InputHint>Mantenha privado - nunca será exibido publicamente</InputHint>
                    </InputGroup>

                    <InputGroup>
                        <Label>Biografia (Opcional)</Label>
                        <Input
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Conte um pouco sobre você..."
                            placeholderTextColor={theme.colors.text.secondary}
                            multiline
                            numberOfLines={4}
                            style={{ height: 100, textAlignVertical: "top" }}
                        />
                        <InputHint>Máximo 200 caracteres</InputHint>
                    </InputGroup>
                </Section>

                <DangerZone>
                    <SectionTitle style={{ color: theme.colors.error }}>Zona de Perigo</SectionTitle>
                    <Text style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing.md }}>
                        Ações irreversíveis que afetam permanentemente sua conta
                    </Text>
                    <DangerButton onPress={handleDeleteAccount}>
                        <DangerButtonText>Excluir Conta Permanentemente</DangerButtonText>
                    </DangerButton>
                </DangerZone>

                <View style={{ height: 40 }} />
            </Content>
        </Container>
    );
}
