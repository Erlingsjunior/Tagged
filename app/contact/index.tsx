import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { theme } from "../../constants/Theme";
import { useAuthStore } from "../../stores/authStore";

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

const Hero = styled(View)`
    background-color: ${theme.colors.primary};
    padding: ${theme.spacing.xl}px;
    align-items: center;
`;

const HeroIcon = styled(View)`
    width: 100px;
    height: 100px;
    border-radius: 50px;
    background-color: rgba(255, 255, 255, 0.2);
    align-items: center;
    justify-content: center;
    margin-bottom: ${theme.spacing.lg}px;
`;

const HeroTitle = styled(Text)`
    font-size: 28px;
    font-weight: bold;
    color: ${theme.colors.surface};
    text-align: center;
    margin-bottom: ${theme.spacing.sm}px;
`;

const HeroSubtitle = styled(Text)`
    font-size: 16px;
    color: ${theme.colors.surface};
    text-align: center;
    opacity: 0.9;
    line-height: 24px;
`;

const Section = styled(View)`
    background-color: ${theme.colors.surface};
    padding: ${theme.spacing.lg}px;
    margin-top: ${theme.spacing.md}px;
`;

const SectionTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.md}px;
`;

const ContactMethod = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.background};
    border-radius: ${theme.borderRadius.md}px;
    margin-bottom: ${theme.spacing.md}px;
    border-width: 1px;
    border-color: ${theme.colors.border};
`;

const ContactIcon = styled(View)`
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: ${theme.colors.primary}15;
    align-items: center;
    justify-content: center;
`;

const ContactInfo = styled(View)`
    flex: 1;
    margin-left: ${theme.spacing.md}px;
`;

const ContactTitle = styled(Text)`
    font-size: 16px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
    margin-bottom: 4px;
`;

const ContactDetail = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
`;

const FormGroup = styled(View)`
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

const SubmitButton = styled(TouchableOpacity)`
    background-color: ${theme.colors.primary};
    padding: ${theme.spacing.lg}px;
    border-radius: ${theme.borderRadius.md}px;
    align-items: center;
    margin-top: ${theme.spacing.md}px;
`;

const SubmitButtonText = styled(Text)`
    color: ${theme.colors.surface};
    font-size: 16px;
    font-weight: bold;
`;

const InfoBox = styled(View)`
    background-color: ${theme.colors.primary}15;
    padding: ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.md}px;
    margin-bottom: ${theme.spacing.lg}px;
    flex-direction: row;
`;

const InfoText = styled(Text)`
    flex: 1;
    font-size: 14px;
    color: ${theme.colors.text.primary};
    margin-left: ${theme.spacing.sm}px;
    line-height: 20px;
`;

const SocialButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    padding: ${theme.spacing.md}px;
    background-color: ${theme.colors.background};
    border-radius: ${theme.borderRadius.md}px;
    margin-bottom: ${theme.spacing.sm}px;
    border-width: 1px;
    border-color: ${theme.colors.border};
`;

const SocialText = styled(Text)`
    flex: 1;
    font-size: 14px;
    color: ${theme.colors.text.primary};
    margin-left: ${theme.spacing.md}px;
`;

export default function ContactScreen() {
    const router = useRouter();
    const { user } = useAuthStore();

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const contactMethods = [
        {
            id: "email",
            icon: "mail",
            title: "Email",
            detail: "contato@tagged.social",
            action: () => Linking.openURL("mailto:contato@tagged.social"),
        },
        {
            id: "whatsapp",
            icon: "logo-whatsapp",
            title: "WhatsApp",
            detail: "+55 (11) 98765-4321",
            action: () => Linking.openURL("https://wa.me/5511987654321"),
        },
        {
            id: "telegram",
            icon: "send",
            title: "Telegram",
            detail: "@TaggedSupport",
            action: () => Linking.openURL("https://t.me/TaggedSupport"),
        },
    ];

    const socialNetworks = [
        {
            id: "twitter",
            icon: "logo-twitter",
            name: "@TaggedBrasil",
            url: "https://twitter.com/TaggedBrasil",
        },
        {
            id: "instagram",
            icon: "logo-instagram",
            name: "@tagged.brasil",
            url: "https://instagram.com/tagged.brasil",
        },
        {
            id: "linkedin",
            icon: "logo-linkedin",
            name: "Tagged Social",
            url: "https://linkedin.com/company/tagged-social",
        },
    ];

    const handleSubmit = () => {
        if (!subject.trim() || !message.trim()) {
            Alert.alert("Campos Obrigatórios", "Por favor, preencha o assunto e a mensagem.");
            return;
        }

        Alert.alert(
            "Mensagem Enviada!",
            "Recebemos sua mensagem e responderemos em até 48 horas.\n\nObrigado por entrar em contato!",
            [
                {
                    text: "OK",
                    onPress: () => {
                        setSubject("");
                        setMessage("");
                    },
                },
            ]
        );
    };

    const handleOpenSocial = (url: string) => {
        Linking.openURL(url).catch(() => {
            Alert.alert("Erro", "Não foi possível abrir o link.");
        });
    };

    return (
        <Container>
            <Header>
                <BackButton onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </BackButton>
                <HeaderTitle>Fale Conosco</HeaderTitle>
            </Header>

            <Content>
                <Hero>
                    <HeroIcon>
                        <Ionicons name="chatbubbles" size={50} color={theme.colors.surface} />
                    </HeroIcon>
                    <HeroTitle>Estamos Aqui</HeroTitle>
                    <HeroSubtitle>
                        Nossa equipe está pronta para ajudar você com qualquer dúvida, sugestão ou problema.
                    </HeroSubtitle>
                </Hero>

                <Section>
                    <SectionTitle>Canais de Atendimento</SectionTitle>

                    <InfoBox>
                        <Ionicons name="time" size={20} color={theme.colors.primary} />
                        <InfoText>
                            Horário de atendimento: Segunda a Sexta, das 9h às 18h (Horário de Brasília)
                        </InfoText>
                    </InfoBox>

                    {contactMethods.map((method) => (
                        <ContactMethod key={method.id} onPress={method.action}>
                            <ContactIcon>
                                <Ionicons name={method.icon as any} size={24} color={theme.colors.primary} />
                            </ContactIcon>
                            <ContactInfo>
                                <ContactTitle>{method.title}</ContactTitle>
                                <ContactDetail>{method.detail}</ContactDetail>
                            </ContactInfo>
                            <Ionicons name="chevron-forward" size={24} color={theme.colors.text.secondary} />
                        </ContactMethod>
                    ))}
                </Section>

                <Section>
                    <SectionTitle>Enviar Mensagem</SectionTitle>

                    <FormGroup>
                        <Label>Seu Nome</Label>
                        <Input
                            value={user?.name || ""}
                            editable={false}
                            placeholder="Seu nome"
                            placeholderTextColor={theme.colors.text.secondary}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Seu Email</Label>
                        <Input
                            value={user?.email || ""}
                            editable={false}
                            placeholder="seu@email.com"
                            placeholderTextColor={theme.colors.text.secondary}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Assunto *</Label>
                        <Input
                            value={subject}
                            onChangeText={setSubject}
                            placeholder="Ex: Dúvida sobre denúncia"
                            placeholderTextColor={theme.colors.text.secondary}
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label>Mensagem *</Label>
                        <Input
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Descreva sua dúvida, sugestão ou problema..."
                            placeholderTextColor={theme.colors.text.secondary}
                            multiline
                            numberOfLines={6}
                            style={{ height: 150, textAlignVertical: "top" }}
                        />
                    </FormGroup>

                    <SubmitButton onPress={handleSubmit}>
                        <SubmitButtonText>Enviar Mensagem</SubmitButtonText>
                    </SubmitButton>
                </Section>

                <Section>
                    <SectionTitle>Redes Sociais</SectionTitle>

                    {socialNetworks.map((social) => (
                        <SocialButton key={social.id} onPress={() => handleOpenSocial(social.url)}>
                            <Ionicons name={social.icon as any} size={24} color={theme.colors.primary} />
                            <SocialText>{social.name}</SocialText>
                            <Ionicons name="open-outline" size={20} color={theme.colors.text.secondary} />
                        </SocialButton>
                    ))}
                </Section>

                <Section>
                    <SectionTitle>Perguntas Frequentes</SectionTitle>

                    <InfoBox>
                        <Ionicons name="help-circle" size={20} color={theme.colors.primary} />
                        <InfoText>
                            Visite nossa Central de Ajuda para encontrar respostas rápidas para as dúvidas mais comuns.
                        </InfoText>
                    </InfoBox>

                    <TouchableOpacity
                        style={{
                            padding: theme.spacing.md,
                            backgroundColor: theme.colors.background,
                            borderRadius: theme.borderRadius.md,
                            alignItems: "center",
                        }}
                        onPress={() => Alert.alert("FAQ", "Central de Ajuda será aberta em breve!")}
                    >
                        <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>Acessar Central de Ajuda</Text>
                    </TouchableOpacity>
                </Section>

                <View style={{ height: 40 }} />
            </Content>
        </Container>
    );
}
