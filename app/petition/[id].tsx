import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenCapture from 'expo-screen-capture';
import styled from 'styled-components/native';
import { usePostsStore } from '../../stores/postsStore';
import { useAuthStore } from '../../stores/authStore';
import { petitionService } from '../../services/petitionService';
import { theme } from '../../constants/Theme';

const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${theme.colors.background};
`;

const Header = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing.md}px;
    background-color: ${theme.colors.surface};
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.border};
`;

const BackButton = styled(TouchableOpacity)`
    padding: ${theme.spacing.sm}px;
`;

const HeaderTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    flex: 1;
    margin-left: ${theme.spacing.sm}px;
`;

const WatermarkContainer = styled(View)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    opacity: 0.05;
`;

const WatermarkText = styled(Text)`
    font-size: 60px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    transform: rotate(-45deg);
`;

const Content = styled(ScrollView)`
    flex: 1;
    padding: ${theme.spacing.lg}px;
`;

const DocumentText = styled(Text)`
    font-family: monospace;
    font-size: 12px;
    line-height: 18px;
    color: ${theme.colors.text.primary};
`;

const WarningBanner = styled(View)`
    background-color: ${theme.colors.warning}20;
    border-left-width: 4px;
    border-left-color: ${theme.colors.warning};
    padding: ${theme.spacing.md}px;
    margin-bottom: ${theme.spacing.lg}px;
    border-radius: ${theme.borderRadius.sm}px;
`;

const WarningText = styled(Text)`
    font-size: 13px;
    color: ${theme.colors.text.primary};
    line-height: 20px;
`;

const FriendsSection = styled(View)`
    background-color: ${theme.colors.surface};
    padding: ${theme.spacing.md}px;
    margin-bottom: ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.md}px;
    border-left-width: 4px;
    border-left-color: ${theme.colors.primary};
`;

const FriendsSectionTitle = styled(Text)`
    font-size: 14px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.sm}px;
`;

const FriendsList = styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${theme.spacing.xs}px;
`;

const FriendItem = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    background-color: ${theme.colors.background};
    padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
    border-radius: ${theme.borderRadius.sm}px;
    margin-right: ${theme.spacing.xs}px;
    margin-bottom: ${theme.spacing.xs}px;
`;

const FriendAvatar = styled(View)`
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background-color: ${theme.colors.primary};
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing.xs}px;
`;

const FriendAvatarText = styled(Text)`
    color: ${theme.colors.surface};
    font-size: 10px;
    font-weight: bold;
`;

const FriendName = styled(Text)`
    color: ${theme.colors.text.primary};
    font-size: 12px;
    font-weight: 500;
`;

const SIGNATURES_PER_PAGE = 1000;

export default function PetitionScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { posts } = usePostsStore();
    const { user } = useAuthStore();
    const [currentPage, setCurrentPage] = useState(1);

    const post = posts.find((p) => p.id === id);
    const petition = petitionService.getPetition(id!);
    const totalPages = petition ? petitionService.getTotalPages(id!, SIGNATURES_PER_PAGE) : 0;

    useEffect(() => {
        const preventScreenshots = async () => {
            const hasPermissions = await ScreenCapture.preventScreenCaptureAsync();
            if (!hasPermissions) {
                Alert.alert(
                    'Proteção Ativada',
                    'Screenshots foram bloqueados para proteger a privacidade dos assinantes.'
                );
            }
        };

        preventScreenshots();

        return () => {
            ScreenCapture.allowScreenCaptureAsync();
        };
    }, []);

    if (!post || !petition) {
        return (
            <Container>
                <Header>
                    <BackButton onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                    </BackButton>
                    <HeaderTitle>Petição não encontrada</HeaderTitle>
                </Header>
            </Container>
        );
    }

    const isAdmin = user && user.role === 'admin';
    const canView = isAdmin || petitionService.canViewPetition(id!, user?.id || '', isAdmin);

    if (!canView) {
        return (
            <Container>
                <Header>
                    <BackButton onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                    </BackButton>
                    <HeaderTitle>Acesso Negado</HeaderTitle>
                </Header>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl }}>
                    <Ionicons name="lock-closed" size={64} color={theme.colors.error} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: theme.spacing.lg, color: theme.colors.text.primary }}>
                        Acesso Restrito
                    </Text>
                    <Text style={{ fontSize: 14, marginTop: theme.spacing.md, textAlign: 'center', color: theme.colors.text.secondary }}>
                        Você precisa assinar esta causa para visualizar a petição oficial.
                    </Text>
                </View>
            </Container>
        );
    }

    const documentText = petitionService.generatePetitionDocument(id!, currentPage, SIGNATURES_PER_PAGE);

    const friendsWhoSigned = React.useMemo(() => {
        if (!user || !petition) return [];

        const userFollowing = user.following || [];
        const signerIds = petition.signatures.map(sig => sig.userId);

        const friendIds = userFollowing.filter(friendId => signerIds.includes(friendId));

        return petition.signatures.filter(sig => friendIds.includes(sig.userId)).slice(0, 5);
    }, [user, petition]);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <Container>
            <Header>
                <BackButton onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </BackButton>
                <HeaderTitle>Petição Oficial</HeaderTitle>
                <Ionicons name="shield-checkmark" size={24} color={theme.colors.success} />
            </Header>

            <Content>
                <WarningBanner>
                    <WarningText>
                        🔒 <Text style={{ fontWeight: 'bold' }}>Documento Protegido</Text>{'\n\n'}
                        • Screenshots estão bloqueados{'\n'}
                        • Texto não pode ser copiado{'\n'}
                        • Todas as assinaturas são autênticas e verificáveis{'\n'}
                        • Qualquer vazamento será rastreado
                    </WarningText>
                </WarningBanner>

                {friendsWhoSigned.length > 0 && (
                    <FriendsSection>
                        <FriendsSectionTitle>
                            👥 {friendsWhoSigned.length} {friendsWhoSigned.length === 1 ? 'pessoa que você segue assinou' : 'pessoas que você segue assinaram'}
                        </FriendsSectionTitle>
                        <FriendsList>
                            {friendsWhoSigned.map((friend) => (
                                <FriendItem
                                    key={friend.userId}
                                    onPress={() => router.push(`/user/${friend.userId}`)}
                                >
                                    <FriendAvatar>
                                        <FriendAvatarText>
                                            {friend.name.charAt(0).toUpperCase()}
                                        </FriendAvatarText>
                                    </FriendAvatar>
                                    <FriendName>{friend.name}</FriendName>
                                </FriendItem>
                            ))}
                        </FriendsList>
                    </FriendsSection>
                )}

                <DocumentText selectable={false}>
                    {documentText}
                </DocumentText>

                <View style={{ marginTop: theme.spacing.xl, marginBottom: theme.spacing.xl }}>
                    <Text style={{ fontSize: 12, color: theme.colors.text.secondary, textAlign: 'center' }}>
                        Este documento foi gerado automaticamente pelo Tagged App.{'\n'}
                        Todas as informações podem ser verificadas em nosso banco de dados.
                    </Text>
                </View>
            </Content>

            {totalPages > 1 && (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                }}>
                    <TouchableOpacity
                        onPress={handlePreviousPage}
                        disabled={currentPage === 1}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: theme.spacing.sm,
                            opacity: currentPage === 1 ? 0.3 : 1,
                        }}
                    >
                        <Ionicons name="chevron-back" size={20} color={theme.colors.primary} />
                        <Text style={{ color: theme.colors.primary, fontWeight: 'bold', marginLeft: 4 }}>
                            Anterior
                        </Text>
                    </TouchableOpacity>

                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.text.primary }}>
                            Página {currentPage} de {totalPages}
                        </Text>
                        <Text style={{ fontSize: 11, color: theme.colors.text.secondary, marginTop: 2 }}>
                            {SIGNATURES_PER_PAGE.toLocaleString('pt-BR')} assinaturas por página
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleNextPage}
                        disabled={currentPage === totalPages}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: theme.spacing.sm,
                            opacity: currentPage === totalPages ? 0.3 : 1,
                        }}
                    >
                        <Text style={{ color: theme.colors.primary, fontWeight: 'bold', marginRight: 4 }}>
                            Próxima
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>
            )}

            <WatermarkContainer>
                <WatermarkText>
                    {user?.name || 'TAGGED APP'}
                </WatermarkText>
                <WatermarkText style={{ marginTop: 50 }}>
                    ID: {user?.id.slice(0, 8)}
                </WatermarkText>
            </WatermarkContainer>
        </Container>
    );
}
