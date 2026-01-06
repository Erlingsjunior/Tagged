import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { theme } from "../../constants/Theme";

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

const SectionText = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    line-height: 22px;
    margin-bottom: ${theme.spacing.md}px;
`;

const AmountGrid = styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${theme.spacing.md}px;
    margin-bottom: ${theme.spacing.lg}px;
`;

const AmountButton = styled(TouchableOpacity)<{ selected: boolean }>`
    flex: 1;
    min-width: 45%;
    padding: ${theme.spacing.lg}px;
    border-radius: ${theme.borderRadius.md}px;
    border-width: 2px;
    border-color: ${(props: any) => (props.selected ? theme.colors.primary : theme.colors.border)};
    background-color: ${(props: any) => (props.selected ? theme.colors.primary + "15" : theme.colors.background)};
    align-items: center;
`;

const AmountValue = styled(Text)<{ selected: boolean }>`
    font-size: 24px;
    font-weight: bold;
    color: ${(props: any) => (props.selected ? theme.colors.primary : theme.colors.text.primary)};
    margin-bottom: 4px;
`;

const AmountLabel = styled(Text)<{ selected: boolean }>`
    font-size: 12px;
    color: ${(props: any) => (props.selected ? theme.colors.primary : theme.colors.text.secondary)};
`;

const PaymentMethodButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    padding: ${theme.spacing.lg}px;
    border-radius: ${theme.borderRadius.md}px;
    background-color: ${theme.colors.background};
    margin-bottom: ${theme.spacing.md}px;
    border-width: 1px;
    border-color: ${theme.colors.border};
`;

const PaymentMethodInfo = styled(View)`
    flex: 1;
    margin-left: ${theme.spacing.md}px;
`;

const PaymentMethodName = styled(Text)`
    font-size: 16px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
    margin-bottom: 4px;
`;

const PaymentMethodDescription = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
`;

const DonateButton = styled(TouchableOpacity)`
    background-color: ${theme.colors.primary};
    padding: ${theme.spacing.lg}px;
    border-radius: ${theme.borderRadius.md}px;
    align-items: center;
    margin-top: ${theme.spacing.lg}px;
`;

const DonateButtonText = styled(Text)`
    color: ${theme.colors.surface};
    font-size: 18px;
    font-weight: bold;
`;

const ImpactCard = styled(View)`
    background-color: ${theme.colors.primary}15;
    padding: ${theme.spacing.lg}px;
    border-radius: ${theme.borderRadius.md}px;
    margin-bottom: ${theme.spacing.md}px;
    border-left-width: 4px;
    border-left-color: ${theme.colors.primary};
`;

const ImpactTitle = styled(Text)`
    font-size: 16px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.sm}px;
`;

const ImpactText = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    line-height: 20px;
`;

const amounts = [
    { value: 10, label: "Apoio Básico" },
    { value: 25, label: "Ajuda Ativa" },
    { value: 50, label: "Apoio Forte" },
    { value: 100, label: "Mudança Real" },
];

const paymentMethods = [
    {
        id: "pix",
        name: "PIX",
        description: "Transferência instantânea",
        icon: "flash",
    },
    {
        id: "credit",
        name: "Cartão de Crédito",
        description: "Parcele sua doação",
        icon: "card",
    },
    {
        id: "crypto",
        name: "Criptomoedas",
        description: "Bitcoin, Ethereum, etc",
        icon: "logo-bitcoin",
    },
];

export default function DonateScreen() {
    const router = useRouter();
    const [selectedAmount, setSelectedAmount] = useState(25);
    const [customAmount, setCustomAmount] = useState("");

    const handleDonate = (method: string) => {
        Alert.alert(
            "Processar Doação",
            `Você está prestes a doar R$ ${selectedAmount} via ${paymentMethods.find((m) => m.id === method)?.name}`,
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Continuar",
                    onPress: () => {
                        if (method === "pix") {
                            handlePixDonation();
                        } else {
                            Alert.alert(
                                "Em Desenvolvimento",
                                `O método ${paymentMethods.find((m) => m.id === method)?.name} será implementado em breve!`
                            );
                        }
                    },
                },
            ]
        );
    };

    const handlePixDonation = () => {
        // Chave PIX fictícia - em produção, seria uma chave real
        const pixKey = "tagged@social.org";

        Alert.alert(
            "Doação via PIX",
            `Valor: R$ ${selectedAmount}\n\nChave PIX:\n${pixKey}\n\nCopie a chave e faça a transferência através do app do seu banco.`,
            [
                {
                    text: "Copiar Chave",
                    onPress: () => {
                        // Em produção, copiaria para clipboard
                        Alert.alert("Chave Copiada", "Cole no app do seu banco para fazer a transferência.");
                    },
                },
                {
                    text: "Abrir App do Banco",
                    onPress: () => {
                        // Em produção, tentaria abrir apps bancários
                        Alert.alert("Info", "Abra o app do seu banco manualmente para fazer a transferência.");
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
                <HeaderTitle>Fazer Doação</HeaderTitle>
            </Header>

            <Content>
                <Hero>
                    <HeroIcon>
                        <Ionicons name="heart" size={50} color={theme.colors.surface} />
                    </HeroIcon>
                    <HeroTitle>Apoie a Democracia</HeroTitle>
                    <HeroSubtitle>
                        Sua doação mantém o Tagged independente, livre de anúncios e 100% focado na voz do povo.
                    </HeroSubtitle>
                </Hero>

                <Section>
                    <SectionTitle>Escolha o Valor</SectionTitle>

                    <AmountGrid>
                        {amounts.map((amount) => (
                            <AmountButton
                                key={amount.value}
                                selected={selectedAmount === amount.value}
                                onPress={() => setSelectedAmount(amount.value)}
                            >
                                <AmountValue selected={selectedAmount === amount.value}>
                                    R$ {amount.value}
                                </AmountValue>
                                <AmountLabel selected={selectedAmount === amount.value}>{amount.label}</AmountLabel>
                            </AmountButton>
                        ))}
                    </AmountGrid>
                </Section>

                <Section>
                    <SectionTitle>Impacto da Sua Doação</SectionTitle>

                    <ImpactCard>
                        <ImpactTitle>🌍 Infraestrutura Global</ImpactTitle>
                        <ImpactText>
                            Mantém servidores funcionando 24/7 para que denúncias sejam sempre acessíveis.
                        </ImpactText>
                    </ImpactCard>

                    <ImpactCard>
                        <ImpactTitle>🔒 Segurança & Privacidade</ImpactTitle>
                        <ImpactText>
                            Investe em criptografia de ponta e proteção de denunciantes contra retaliação.
                        </ImpactText>
                    </ImpactCard>

                    <ImpactCard>
                        <ImpactTitle>⚖️ Verificação Profissional</ImpactTitle>
                        <ImpactText>
                            Suporta nossa equipe de jornalistas e advogados que validam e amplificam denúncias.
                        </ImpactText>
                    </ImpactCard>

                    <ImpactCard>
                        <ImpactTitle>📱 Desenvolvimento Contínuo</ImpactTitle>
                        <ImpactText>
                            Permite adicionar novos recursos e melhorias solicitadas pela comunidade.
                        </ImpactText>
                    </ImpactCard>
                </Section>

                <Section>
                    <SectionTitle>Método de Pagamento</SectionTitle>

                    {paymentMethods.map((method) => (
                        <PaymentMethodButton key={method.id} onPress={() => handleDonate(method.id)}>
                            <Ionicons name={method.icon as any} size={32} color={theme.colors.primary} />
                            <PaymentMethodInfo>
                                <PaymentMethodName>{method.name}</PaymentMethodName>
                                <PaymentMethodDescription>{method.description}</PaymentMethodDescription>
                            </PaymentMethodInfo>
                            <Ionicons name="chevron-forward" size={24} color={theme.colors.text.secondary} />
                        </PaymentMethodButton>
                    ))}
                </Section>

                <Section>
                    <SectionTitle>💝 Transparência Total</SectionTitle>
                    <SectionText>
                        100% das doações vão para manutenção e desenvolvimento do Tagged. Somos uma organização sem
                        fins lucrativos comprometida com a transparência fiscal.
                    </SectionText>
                    <SectionText>
                        Publicamos relatórios trimestrais detalhando como cada centavo é usado para fortalecer a
                        democracia.
                    </SectionText>
                </Section>

                <View style={{ height: 40 }} />
            </Content>
        </Container>
    );
}
