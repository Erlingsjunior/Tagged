import React, { useState } from "react";
import {
    ScrollView,
    Text,
    View,
    Image,
    TouchableOpacity,
    Modal,
    Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import styled from "styled-components/native";
import { usePostsStore } from "../../stores/postsStore";
import { useAuthStore } from "../../stores/authStore";
import { usePetition } from "../../hooks/petition";
import { theme } from "../../constants/Theme";
import { mockComments } from "../../services/mockData";
import { CategoryBadge } from "../../components/UI/CategoryBadge";
import { StatBox } from "../../components/UI/StatBox";
import { ProgressBar } from "../../components/UI/ProgressBar";
import { StatusTag } from "../../components/UI/StatusTag";
import { CommentItem } from "../../components/UI/CommentItem";
import {
    formatNumber,
    getTimeAgo,
    getFileIcon,
    formatFileSize,
} from "../../utils/formatters";

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

const HeroImage = styled(Image)`
    width: 100%;
    height: 300px;
`;

const BadgeWrapper = styled(View)`
    position: absolute;
    top: ${theme.spacing.md}px;
    right: ${theme.spacing.md}px;
`;

const InfoSection = styled(View)`
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.surface};
`;

const PostTitle = styled(Text)`
    font-size: 24px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.sm}px;
    line-height: 32px;
`;

const AuthorInfo = styled(View)`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${theme.spacing.md}px;
`;

const Avatar = styled(View)`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: ${theme.colors.primary};
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing.sm}px;
`;

const AvatarText = styled(Text)`
    color: ${theme.colors.surface};
    font-size: 16px;
    font-weight: bold;
`;

const AuthorName = styled(Text)`
    font-size: 16px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
`;

const PostMeta = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    margin-top: 2px;
`;

const Description = styled(Text)`
    font-size: 16px;
    line-height: 24px;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.md}px;
`;

// Milestone/Progress Section
const MilestoneSection = styled(View)`
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.surface};
    margin-top: ${theme.spacing.sm}px;
`;

const SectionTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.md}px;
`;

const MilestonesRow = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
`;

const MilestoneItem = styled(View)<{ achieved: boolean }>`
    align-items: center;
    width: 18%;
    margin-bottom: ${theme.spacing.md}px;
    opacity: ${(props: { achieved: boolean }) => (props.achieved ? 1 : 0.4)};
`;

const MilestoneIcon = styled(View)<{ color: string }>`
    width: 48px;
    height: 48px;
    border-radius: 24px;
    background-color: ${(props: { color: string }) => props.color}20;
    align-items: center;
    justify-content: center;
    margin-bottom: ${theme.spacing.xs}px;
`;

const MilestoneLabel = styled(Text)`
    font-size: 11px;
    font-weight: 600;
    color: ${theme.colors.text.secondary};
    text-align: center;
`;

const NextGoalText = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    text-align: center;
    margin-top: ${theme.spacing.sm}px;
`;

// Action Status Tags
const StatusTagsSection = styled(View)`
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.surface};
    margin-top: ${theme.spacing.sm}px;
`;

const StatusTagsRow = styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${theme.spacing.sm}px;
`;

// Updates Section
const UpdatesSection = styled(View)`
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.surface};
    margin-top: ${theme.spacing.sm}px;
`;

const UpdateItem = styled(View)`
    border-left-width: 3px;
    border-left-color: ${theme.colors.primary};
    padding-left: ${theme.spacing.md}px;
    margin-bottom: ${theme.spacing.lg}px;
`;

const UpdateHeader = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: ${theme.spacing.xs}px;
`;

const UpdateTitle = styled(Text)`
    font-size: 16px;
    font-weight: 700;
    color: ${theme.colors.text.primary};
    flex: 1;
`;

const UpdateDate = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
`;

const UpdateAuthor = styled(Text)`
    font-size: 13px;
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.xs}px;
`;

const UpdateContent = styled(Text)`
    font-size: 14px;
    line-height: 20px;
    color: ${theme.colors.text.secondary};
`;

// Chat Unlock Banner
const ChatBanner = styled(TouchableOpacity)`
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.primary};
    margin-top: ${theme.spacing.sm}px;
    flex-direction: row;
    align-items: center;
    border-radius: ${theme.borderRadius.md}px;
`;

const ChatBannerText = styled(View)`
    flex: 1;
    margin-left: ${theme.spacing.md}px;
`;

const ChatBannerTitle = styled(Text)`
    font-size: 16px;
    font-weight: bold;
    color: ${theme.colors.surface};
    margin-bottom: 4px;
`;

const ChatBannerSubtitle = styled(Text)`
    font-size: 13px;
    color: ${theme.colors.surface};
    opacity: 0.9;
`;

// Evidence Files Section
const EvidenceSection = styled(View)`
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.surface};
    margin-top: ${theme.spacing.sm}px;
`;

const EvidenceGrid = styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${theme.spacing.sm}px;
`;

const EvidenceItem = styled(TouchableOpacity)`
    width: 48%;
    aspect-ratio: 1.5;
    border-radius: ${theme.borderRadius.md}px;
    overflow: hidden;
    background-color: ${theme.colors.border};
    position: relative;
`;

const EvidenceImage = styled(Image)`
    width: 100%;
    height: 100%;
`;

const EvidenceTypeIcon = styled(View)`
    position: absolute;
    top: ${theme.spacing.xs}px;
    right: ${theme.spacing.xs}px;
    background-color: rgba(0, 0, 0, 0.6);
    padding: ${theme.spacing.xs}px;
    border-radius: ${theme.borderRadius.sm}px;
`;

const EvidenceName = styled(Text)`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: ${theme.spacing.sm}px;
    background-color: rgba(0, 0, 0, 0.7);
    color: ${theme.colors.surface};
    font-size: 11px;
`;

const EvidenceInfo = styled(View)`
    position: absolute;
    bottom: 24px;
    left: 0;
    right: 0;
    padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
    background-color: rgba(0, 0, 0, 0.6);
`;

const EvidenceInfoText = styled(Text)`
    color: ${theme.colors.surface};
    font-size: 9px;
    opacity: 0.95;
`;

// Comments Section
const CommentsSection = styled(View)`
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.surface};
    margin-top: ${theme.spacing.sm}px;
`;

const ViewAllButton = styled(TouchableOpacity)`
    align-items: center;
    padding: ${theme.spacing.md}px;
    margin-top: ${theme.spacing.sm}px;
`;

const ViewAllText = styled(Text)`
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.primary};
`;

// Stats Section
const StatsSection = styled(View)`
    flex-direction: row;
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.surface};
    border-top-width: 1px;
    border-top-color: ${theme.colors.border};
    justify-content: space-around;
`;

// Signatures Section
const SignaturesSection = styled(View)`
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.surface};
    margin-top: ${theme.spacing.sm}px;
`;

const SignatureItem = styled(View)`
    flex-direction: row;
    align-items: center;
    padding: ${theme.spacing.sm}px 0;
`;

const SignatureName = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.text.primary};
    margin-left: ${theme.spacing.sm}px;
`;

// Action Bar
const ActionBar = styled(View)`
    flex-direction: row;
    padding: ${theme.spacing.md}px;
    background-color: ${theme.colors.surface};
    border-top-width: 1px;
    border-top-color: ${theme.colors.border};
    gap: ${theme.spacing.sm}px;
`;

const ActionButton = styled(TouchableOpacity)<{
    variant?: "primary" | "secondary";
}>`
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.md}px;
    background-color: ${(props: { variant?: "primary" | "secondary" }) =>
        props.variant === "primary"
            ? theme.colors.primary
            : theme.colors.background};
`;

const ActionButtonText = styled(Text)<{ variant?: "primary" | "secondary" }>`
    font-size: 14px;
    font-weight: 600;
    color: ${(props: { variant?: "primary" | "secondary" }) =>
        props.variant === "primary"
            ? theme.colors.surface
            : theme.colors.text.primary};
    margin-left: 6px;
`;

export default function PostDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { posts, toggleSignature, hasUserSigned, getSignatures } =
        usePostsStore();
    const { user } = useAuthStore();
    const [showAllComments, setShowAllComments] = useState(false);
    const [showAllBadges, setShowAllBadges] = useState(false);
    const [heartAnimation] = useState(new Animated.Value(0));
    const [showHeart, setShowHeart] = useState(false);

    const post = posts.find((p) => p.id === id);

    if (!post) {
        return (
            <Container>
                <Header>
                    <BackButton onPress={() => router.back()}>
                        <Ionicons
                            name='arrow-back'
                            size={24}
                            color={theme.colors.text.primary}
                        />
                    </BackButton>
                    <HeaderTitle>Post não encontrado</HeaderTitle>
                </Header>
            </Container>
        );
    }

    const {
        canViewPetition,
        canDownloadPetition,
        generatePetitionDocument,
        hasReachedSignatureThreshold,
    } = usePetition(post);

    const signatures = getSignatures(post.id);
    const userHasSigned = user ? hasUserSigned(post.id, user.id) : false;
    const comments = mockComments.get(post.id) || [];
    const displayComments = showAllComments ? comments : comments.slice(0, 3);

    // Calculate progress
    const currentSupports = post.stats.supports;
    const milestones = post.milestones || [];
    const achievedMilestones = milestones.filter((m) => m.achieved);
    const nextMilestone = milestones.find((m) => !m.achieved);
    const previousMilestone = achievedMilestones[achievedMilestones.length - 1];

    const progressStart = previousMilestone ? previousMilestone.target : 0;
    const progressEnd = nextMilestone
        ? nextMilestone.target
        : milestones.length > 0
        ? milestones[milestones.length - 1].target
        : 1000;
    const progressCurrent = currentSupports - progressStart;
    const progressTotal = progressEnd - progressStart;
    const progressPercentage =
        progressTotal > 0
            ? Math.min((progressCurrent / progressTotal) * 100, 100)
            : 0;

    const playHeartSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require("../../assets/sounds/bloop.mp3"),
                { shouldPlay: true, volume: 0.5 }
            );
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                if (
                    "isLoaded" in status &&
                    status.isLoaded &&
                    "didJustFinish" in status &&
                    status.didJustFinish
                ) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.log("Error playing sound:", error);
        }
    };

    const animateHeart = () => {
        setShowHeart(true);
        heartAnimation.setValue(0);

        Animated.sequence([
            Animated.parallel([
                Animated.timing(heartAnimation, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(heartAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => setShowHeart(false));
    };

    const handleSign = () => {
        if (!user) return;
        const wasSigned = hasUserSigned(post.id, user.id);
        toggleSignature(post.id, user.id, user.name, user.avatar);

        // Animar coração apenas quando está assinando (não quando remove)
        if (!wasSigned) {
            animateHeart();
            playHeartSound();
        }
    };

    return (
        <Container>
            <Header>
                <BackButton onPress={() => router.back()}>
                    <Ionicons
                        name='arrow-back'
                        size={24}
                        color={theme.colors.text.primary}
                    />
                </BackButton>
                <HeaderTitle>Detalhes da Denúncia</HeaderTitle>
            </Header>

            <Content>
                
                <View style={{ position: "relative" }}>
                    <HeroImage
                        source={{
                            uri:
                                post.media.length > 0
                                    ? post.media[0].url
                                    : `https://picsum.photos/seed/${post.id}/600/400`,
                        }}
                        resizeMode='cover'
                    />
                    <BadgeWrapper>
                        <CategoryBadge category={post.category} size='medium' />
                    </BadgeWrapper>
                </View>

                
                <InfoSection>
                    <PostTitle>{post.title}</PostTitle>

                    <TouchableOpacity
                        onPress={() => !post.isAnonymous && router.push(`/user/${post.author.id}`)}
                        disabled={post.isAnonymous}
                    >
                        <AuthorInfo>
                            <Avatar>
                                <AvatarText>
                                    {post.author.name.charAt(0).toUpperCase()}
                                </AvatarText>
                            </Avatar>
                            <View>
                                <AuthorName>{post.author.name}</AuthorName>
                                <PostMeta>
                                    {post.location.city}, {post.location.state} •{" "}
                                    {getTimeAgo(post.createdAt)}
                                </PostMeta>
                            </View>
                        </AuthorInfo>
                    </TouchableOpacity>

                    <Description>{post.content}</Description>
                </InfoSection>

                
                <StatsSection>
                    <StatBox
                        value={post.stats.supports}
                        label='Assinaturas'
                        size='large'
                    />
                    <StatBox
                        value={post.stats.comments}
                        label='Comentários'
                        size='large'
                    />
                    <StatBox
                        value={post.stats.shares}
                        label='Compartilhamentos'
                        size='large'
                    />
                </StatsSection>

                
                {milestones.length > 0 && (
                    <MilestoneSection>
                        <SectionTitle>Conquistas e Metas</SectionTitle>
                        <View
                            style={{
                                marginBottom: theme.spacing.xs,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    color: theme.colors.primary,
                                }}
                            >
                                {formatNumber(currentSupports)} assinaturas
                            </Text>
                            {nextMilestone && (
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: theme.colors.text.secondary,
                                    }}
                                >
                                    Meta: {formatNumber(nextMilestone.target)}
                                </Text>
                            )}
                        </View>
                        <View style={{ marginBottom: theme.spacing.md }}>
                            <ProgressBar percentage={progressPercentage} />
                        </View>
                        <MilestonesRow>
                            {(() => {
                                // Mostrar milestones relevantes: últimos 3 conquistados + próximos 4
                                const notAchievedMilestones = milestones.filter(
                                    (m) => !m.achieved
                                );
                                const relevantMilestones = [
                                    ...achievedMilestones.slice(-3), // Últimos 3 conquistados
                                    ...notAchievedMilestones.slice(0, 4), // Próximos 4 a conquistar
                                ];
                                return relevantMilestones.map((milestone) => (
                                    <MilestoneItem
                                        key={milestone.id}
                                        achieved={milestone.achieved}
                                    >
                                        <MilestoneIcon color={milestone.color}>
                                            <Ionicons
                                                name={milestone.icon as any}
                                                size={24}
                                                color={
                                                    milestone.achieved
                                                        ? milestone.color
                                                        : theme.colors.text
                                                              .secondary
                                                }
                                            />
                                        </MilestoneIcon>
                                        <MilestoneLabel>
                                            {milestone.label}
                                        </MilestoneLabel>
                                    </MilestoneItem>
                                ));
                            })()}
                        </MilestonesRow>
                        {nextMilestone && (
                            <NextGoalText>
                                Próxima meta: {nextMilestone.badgeName} -{" "}
                                {formatNumber(nextMilestone.target)} assinaturas
                                (faltam{" "}
                                {formatNumber(
                                    nextMilestone.target - currentSupports
                                )}
                                )
                            </NextGoalText>
                        )}

                        
                        {achievedMilestones.length > 0 && (
                            <View style={{ marginTop: theme.spacing.lg }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: theme.spacing.md,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "600",
                                            color: theme.colors.text.primary,
                                        }}
                                    >
                                        🏆 Selos Conquistados (
                                        {achievedMilestones.length})
                                    </Text>
                                    {achievedMilestones.length > 3 && (
                                        <TouchableOpacity
                                            onPress={() =>
                                                setShowAllBadges(true)
                                            }
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: "600",
                                                    color: theme.colors.primary,
                                                }}
                                            >
                                                Ver Todos
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {achievedMilestones
                                    .slice(-3)
                                    .reverse()
                                    .map((milestone, index) => (
                                        <View
                                            key={milestone.id}
                                            style={{
                                                backgroundColor:
                                                    theme.colors.surface,
                                                padding: theme.spacing.lg,
                                                borderRadius:
                                                    theme.borderRadius.lg,
                                                marginBottom: theme.spacing.md,
                                                borderWidth: 2,
                                                borderColor: milestone.color,
                                                shadowColor: milestone.color,
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 4,
                                                },
                                                shadowOpacity: 0.3,
                                                shadowRadius: 8,
                                                elevation: 5,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "flex-start",
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        width: 64,
                                                        height: 64,
                                                        borderRadius: 32,
                                                        backgroundColor:
                                                            milestone.color,
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                        marginRight:
                                                            theme.spacing.md,
                                                        shadowColor: "#000",
                                                        shadowOffset: {
                                                            width: 0,
                                                            height: 2,
                                                        },
                                                        shadowOpacity: 0.25,
                                                        shadowRadius: 4,
                                                        elevation: 3,
                                                    }}
                                                >
                                                    <Ionicons
                                                        name={
                                                            milestone.icon as any
                                                        }
                                                        size={36}
                                                        color={
                                                            theme.colors.surface
                                                        }
                                                    />
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 18,
                                                            fontWeight: "bold",
                                                            color: milestone.color,
                                                            marginBottom: 4,
                                                        }}
                                                    >
                                                        {milestone.badgeName}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontSize: 14,
                                                            color: theme.colors
                                                                .text.secondary,
                                                            lineHeight: 20,
                                                            marginBottom: 8,
                                                        }}
                                                    >
                                                        {
                                                            milestone.badgeDescription
                                                        }
                                                    </Text>
                                                    <View
                                                        style={{
                                                            backgroundColor: `${milestone.color}15`,
                                                            paddingHorizontal:
                                                                theme.spacing
                                                                    .sm,
                                                            paddingVertical:
                                                                theme.spacing
                                                                    .xs,
                                                            borderRadius:
                                                                theme
                                                                    .borderRadius
                                                                    .full,
                                                            alignSelf:
                                                                "flex-start",
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 12,
                                                                color: milestone.color,
                                                                fontWeight:
                                                                    "700",
                                                            }}
                                                        >
                                                            ✓{" "}
                                                            {formatNumber(
                                                                milestone.target
                                                            )}{" "}
                                                            assinaturas
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                            </View>
                        )}
                    </MilestoneSection>
                )}

                
                {post.actionStatus && (
                    <StatusTagsSection>
                        <SectionTitle>Status da Denúncia</SectionTitle>
                        <StatusTagsRow>
                            <StatusTag
                                label='Em Investigação'
                                icon='search'
                                active={
                                    post.actionStatus.investigating || false
                                }
                            />
                            <StatusTag
                                label='Advogados Atuando'
                                icon='briefcase'
                                active={post.actionStatus.hasLawyers || false}
                            />
                            <StatusTag
                                label='ONGs Envolvidas'
                                icon='people'
                                active={post.actionStatus.hasNGO || false}
                            />
                            <StatusTag
                                label='Ação Judicial'
                                icon='hammer'
                                active={post.actionStatus.legalAction || false}
                            />
                            <StatusTag
                                label='Governo Atuando'
                                icon='shield'
                                active={
                                    post.actionStatus.governmentAction || false
                                }
                            />
                            <StatusTag
                                label='Em Execução'
                                icon='checkmark-circle'
                                active={post.actionStatus.executing || false}
                            />
                        </StatusTagsRow>
                    </StatusTagsSection>
                )}

                
                {post.updates && post.updates.length > 0 && (
                    <UpdatesSection>
                        <SectionTitle>Atualizações do Caso</SectionTitle>
                        {post.updates.map((update) => (
                            <UpdateItem key={update.id}>
                                <UpdateHeader>
                                    <UpdateTitle>{update.title}</UpdateTitle>
                                    <UpdateDate>
                                        {getTimeAgo(update.createdAt)}
                                    </UpdateDate>
                                </UpdateHeader>
                                <UpdateAuthor>
                                    {update.author.name} • {update.author.role}
                                </UpdateAuthor>
                                <UpdateContent>{update.content}</UpdateContent>
                            </UpdateItem>
                        ))}
                    </UpdatesSection>
                )}

                
                {post.chatUnlocked && (
                    <ChatBanner onPress={() => router.push(`/collaborativeChat/${post.id}`)}>
                        <Ionicons
                            name='chatbubbles'
                            size={40}
                            color={theme.colors.surface}
                        />
                        <ChatBannerText>
                            <ChatBannerTitle>
                                Chat Colaborativo Desbloqueado!
                            </ChatBannerTitle>
                            <ChatBannerSubtitle>
                                Participe da discussão com jornalistas,
                                advogados e membros do congresso
                            </ChatBannerSubtitle>
                        </ChatBannerText>
                        <Ionicons
                            name='chevron-forward'
                            size={24}
                            color={theme.colors.surface}
                        />
                    </ChatBanner>
                )}

                
                {post.evidenceFiles && post.evidenceFiles.length > 0 && (
                    <EvidenceSection>
                        <SectionTitle>
                            Arquivos de Evidência ({post.evidenceFiles.length})
                        </SectionTitle>
                        <EvidenceGrid>
                            {post.evidenceFiles.slice(0, 6).map((file) => (
                                <EvidenceItem key={file.id}>
                                    {file.type === "image" ||
                                    file.type === "video" ? (
                                        <EvidenceImage
                                            source={{
                                                uri: file.thumbnail || file.url,
                                            }}
                                            resizeMode='cover'
                                        />
                                    ) : (
                                        <View
                                            style={{
                                                flex: 1,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor:
                                                    theme.colors.border,
                                            }}
                                        >
                                            <Ionicons
                                                name={
                                                    getFileIcon(
                                                        file.type
                                                    ) as any
                                                }
                                                size={48}
                                                color={
                                                    theme.colors.text.secondary
                                                }
                                            />
                                        </View>
                                    )}
                                    <EvidenceTypeIcon>
                                        <Ionicons
                                            name={getFileIcon(file.type) as any}
                                            size={16}
                                            color={theme.colors.surface}
                                        />
                                    </EvidenceTypeIcon>
                                    <EvidenceInfo>
                                        <EvidenceInfoText>
                                            {formatFileSize(file.size)} •{" "}
                                            {getTimeAgo(file.uploadedAt)}
                                        </EvidenceInfoText>
                                    </EvidenceInfo>
                                    <EvidenceName numberOfLines={1}>
                                        {file.name}
                                    </EvidenceName>
                                </EvidenceItem>
                            ))}
                        </EvidenceGrid>
                        {post.evidenceFiles.length > 6 && (
                            <ViewAllButton>
                                <ViewAllText>
                                    Ver todos os {post.evidenceFiles.length}{" "}
                                    arquivos
                                </ViewAllText>
                            </ViewAllButton>
                        )}
                    </EvidenceSection>
                )}

                
                {signatures.length > 0 && (
                    <SignaturesSection>
                        <SectionTitle>
                            Pessoas que assinaram ({signatures.length})
                        </SectionTitle>
                        {signatures.slice(0, 10).map((sig, index) => (
                            <SignatureItem key={index}>
                                <Avatar
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                    }}
                                >
                                    <AvatarText style={{ fontSize: 12 }}>
                                        {sig.userName.charAt(0).toUpperCase()}
                                    </AvatarText>
                                </Avatar>
                                <SignatureName>{sig.userName}</SignatureName>
                            </SignatureItem>
                        ))}
                        {signatures.length > 10 && (
                            <PostMeta style={{ marginTop: 8 }}>
                                e mais {signatures.length - 10} pessoas...
                            </PostMeta>
                        )}
                    </SignaturesSection>
                )}

                {hasReachedSignatureThreshold() && (
                    <View style={{ padding: theme.spacing.md }}>
                        <TouchableOpacity
                            onPress={() => {
                                if (canViewPetition()) {
                                    router.push(`/petition/${post.id}`);
                                } else {
                                    alert('Você precisa assinar esta causa para ver a petição oficial.');
                                }
                            }}
                            style={{
                                backgroundColor: theme.colors.primary,
                                padding: theme.spacing.md,
                                borderRadius: theme.borderRadius.md,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: theme.spacing.sm,
                            }}
                        >
                            <Ionicons name="document-text" size={20} color={theme.colors.surface} />
                            <Text style={{ color: theme.colors.surface, fontWeight: 'bold', fontSize: 16 }}>
                                📄 Ver Petição Oficial ({formatNumber(post.stats.supports)} assinaturas)
                            </Text>
                        </TouchableOpacity>
                        {canDownloadPetition() && (
                            <TouchableOpacity
                                onPress={() => {
                                    const doc = generatePetitionDocument();
                                    console.log('Petition document generated:', doc.substring(0, 200));
                                    alert('Download será implementado em breve!');
                                }}
                                style={{
                                    backgroundColor: 'transparent',
                                    borderWidth: 1,
                                    borderColor: theme.colors.primary,
                                    padding: theme.spacing.sm,
                                    borderRadius: theme.borderRadius.md,
                                    marginTop: theme.spacing.sm,
                                    alignItems: 'center',
                                }}
                            >
                                <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                                    💾 Baixar Documento Oficial
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {comments.length > 0 && (
                    <CommentsSection>
                        <SectionTitle>
                            Comentários ({comments.length})
                        </SectionTitle>
                        {displayComments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                        <ViewAllButton
                            onPress={() => router.push(`/comments/${id}`)}
                        >
                            <ViewAllText>
                                Ver todos os {comments.length} comentários
                            </ViewAllText>
                        </ViewAllButton>
                    </CommentsSection>
                )}
            </Content>

            
            <Modal
                visible={showAllBadges}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setShowAllBadges(false)}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        justifyContent: "flex-end",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: theme.colors.surface,
                            borderTopLeftRadius: theme.borderRadius.xl,
                            borderTopRightRadius: theme.borderRadius.xl,
                            maxHeight: "90%",
                        }}
                    >
                        
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: theme.spacing.lg,
                                borderBottomWidth: 1,
                                borderBottomColor: theme.colors.border,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: theme.colors.text.primary,
                                }}
                            >
                                🏆 Todos os Selos ({achievedMilestones.length})
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowAllBadges(false)}
                            >
                                <Ionicons
                                    name='close'
                                    size={28}
                                    color={theme.colors.text.primary}
                                />
                            </TouchableOpacity>
                        </View>

                        
                        <ScrollView style={{ padding: theme.spacing.lg }}>
                            {achievedMilestones.reverse().map((milestone) => (
                                <View
                                    key={milestone.id}
                                    style={{
                                        backgroundColor: theme.colors.surface,
                                        padding: theme.spacing.lg,
                                        borderRadius: theme.borderRadius.lg,
                                        marginBottom: theme.spacing.md,
                                        borderWidth: 2,
                                        borderColor: milestone.color,
                                        shadowColor: milestone.color,
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 5,
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: 32,
                                                backgroundColor:
                                                    milestone.color,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: theme.spacing.md,
                                                shadowColor: "#000",
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 2,
                                                },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 4,
                                                elevation: 3,
                                            }}
                                        >
                                            <Ionicons
                                                name={milestone.icon as any}
                                                size={36}
                                                color={theme.colors.surface}
                                            />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text
                                                style={{
                                                    fontSize: 18,
                                                    fontWeight: "bold",
                                                    color: milestone.color,
                                                    marginBottom: 4,
                                                }}
                                            >
                                                {milestone.badgeName}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 14,
                                                    color: theme.colors.text
                                                        .secondary,
                                                    lineHeight: 20,
                                                    marginBottom: 8,
                                                }}
                                            >
                                                {milestone.badgeDescription}
                                            </Text>
                                            <View
                                                style={{
                                                    backgroundColor: `${milestone.color}15`,
                                                    paddingHorizontal:
                                                        theme.spacing.sm,
                                                    paddingVertical:
                                                        theme.spacing.xs,
                                                    borderRadius:
                                                        theme.borderRadius.full,
                                                    alignSelf: "flex-start",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        color: milestone.color,
                                                        fontWeight: "700",
                                                    }}
                                                >
                                                    ✓{" "}
                                                    {formatNumber(
                                                        milestone.target
                                                    )}{" "}
                                                    assinaturas
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            
            <ActionBar>
                <ActionButton
                    variant={userHasSigned ? "secondary" : "primary"}
                    onPress={handleSign}
                >
                    <Ionicons
                        name={userHasSigned ? "checkmark-circle" : "heart"}
                        size={20}
                        color={
                            userHasSigned
                                ? theme.colors.primary
                                : theme.colors.surface
                        }
                    />
                    <ActionButtonText
                        variant={userHasSigned ? "secondary" : "primary"}
                    >
                        {userHasSigned ? "Tagged!" : "Taggy"}
                    </ActionButtonText>
                </ActionButton>
                <ActionButton
                    variant='secondary'
                    onPress={() => router.push(`/comments/${id}`)}
                >
                    <Ionicons
                        name='chatbubble-outline'
                        size={20}
                        color={theme.colors.text.primary}
                    />
                    <ActionButtonText variant='secondary'>
                        Comentar
                    </ActionButtonText>
                </ActionButton>
                <ActionButton
                    variant='secondary'
                    onPress={() => console.log("Compartilhar")}
                >
                    <Ionicons
                        name='share-outline'
                        size={20}
                        color={theme.colors.text.primary}
                    />
                    <ActionButtonText variant='secondary'>
                        Compartilhar
                    </ActionButtonText>
                </ActionButton>
            </ActionBar>

            
            {showHeart && (
                <Animated.View
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginLeft: -60,
                        marginTop: -60,
                        opacity: heartAnimation.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, 1, 0],
                        }),
                        transform: [
                            {
                                scale: heartAnimation.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [0.5, 1.2, 0.8],
                                }),
                            },
                        ],
                    }}
                    pointerEvents='none'
                >
                    <Ionicons
                        name='heart'
                        size={120}
                        color={theme.colors.primary}
                    />
                </Animated.View>
            )}
        </Container>
    );
}
