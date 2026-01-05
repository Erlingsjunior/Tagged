import React, { useState } from "react";
import { ScrollView, Text, View, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { usePostsStore } from "../../stores/postsStore";
import { useAuthStore } from "../../stores/authStore";
import { theme } from "../../constants/Theme";
import { mockComments } from "../../services/mockData";
import { CategoryBadge } from "../../components/UI/CategoryBadge";
import { StatBox } from "../../components/UI/StatBox";
import { ProgressBar } from "../../components/UI/ProgressBar";
import { StatusTag } from "../../components/UI/StatusTag";
import { CommentItem } from "../../components/UI/CommentItem";
import { formatNumber, getTimeAgo, getFileIcon } from "../../utils/formatters";

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
const ChatBanner = styled(View)`
    padding: ${theme.spacing.lg}px;
    background: linear-gradient(135deg, ${theme.colors.primary} 0%, #7C3AED 100%);
    background-color: ${theme.colors.primary};
    margin-top: ${theme.spacing.sm}px;
    flex-direction: row;
    align-items: center;
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

const ActionButton = styled(TouchableOpacity)<{ variant?: "primary" | "secondary" }>`
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.md}px;
    background-color: ${(props: { variant?: "primary" | "secondary" }) =>
        props.variant === "primary" ? theme.colors.primary : theme.colors.background};
`;

const ActionButtonText = styled(Text)<{ variant?: "primary" | "secondary" }>`
    font-size: 14px;
    font-weight: 600;
    color: ${(props: { variant?: "primary" | "secondary" }) =>
        props.variant === "primary" ? theme.colors.surface : theme.colors.text.primary};
    margin-left: 6px;
`;

export default function PostDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { posts, toggleSignature, hasUserSigned, getSignatures } = usePostsStore();
    const { user } = useAuthStore();
    const [showAllComments, setShowAllComments] = useState(false);

    const post = posts.find((p) => p.id === id);

    if (!post) {
        return (
            <Container>
                <Header>
                    <BackButton onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                    </BackButton>
                    <HeaderTitle>Post não encontrado</HeaderTitle>
                </Header>
            </Container>
        );
    }

    const signatures = getSignatures(post.id);
    const userHasSigned = user ? hasUserSigned(post.id, user.id) : false;
    const comments = mockComments.get(post.id) || [];
    const displayComments = showAllComments ? comments : comments.slice(0, 3);

    // Calculate progress
    const currentSupports = post.stats.supports;
    const achievedMilestones = post.milestones.filter((m) => m.achieved);
    const nextMilestone = post.milestones.find((m) => !m.achieved);
    const previousMilestone = achievedMilestones[achievedMilestones.length - 1];

    const progressStart = previousMilestone ? previousMilestone.target : 0;
    const progressEnd = nextMilestone ? nextMilestone.target : post.milestones[post.milestones.length - 1].target;
    const progressCurrent = currentSupports - progressStart;
    const progressTotal = progressEnd - progressStart;
    const progressPercentage = Math.min((progressCurrent / progressTotal) * 100, 100);

    const handleSign = () => {
        if (!user) return;
        toggleSignature(post.id, user.id, user.name, user.avatar);
    };

    return (
        <Container>
            <Header>
                <BackButton onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </BackButton>
                <HeaderTitle>Detalhes da Denúncia</HeaderTitle>
            </Header>

            <Content>
                {/* Hero Image */}
                <View style={{ position: "relative" }}>
                    <HeroImage
                        source={{
                            uri:
                                post.media.length > 0
                                    ? post.media[0].url
                                    : `https://picsum.photos/seed/${post.id}/600/400`,
                        }}
                        resizeMode="cover"
                    />
                    <BadgeWrapper>
                        <CategoryBadge category={post.category} size="medium" />
                    </BadgeWrapper>
                </View>

                {/* Info */}
                <InfoSection>
                    <PostTitle>{post.title}</PostTitle>

                    <AuthorInfo>
                        <Avatar>
                            <AvatarText>{post.author.name.charAt(0).toUpperCase()}</AvatarText>
                        </Avatar>
                        <View>
                            <AuthorName>{post.author.name}</AuthorName>
                            <PostMeta>
                                {post.location.city}, {post.location.state} • {getTimeAgo(post.createdAt)}
                            </PostMeta>
                        </View>
                    </AuthorInfo>

                    <Description>{post.content}</Description>
                </InfoSection>

                {/* Stats */}
                <StatsSection>
                    <StatBox value={post.stats.supports} label="Assinaturas" size="large" />
                    <StatBox value={post.stats.comments} label="Comentários" size="large" />
                    <StatBox value={post.stats.shares} label="Compartilhamentos" size="large" />
                </StatsSection>

                {/* Milestones / Achievements */}
                <MilestoneSection>
                    <SectionTitle>Conquistas e Metas</SectionTitle>
                    <ProgressBarContainer>
                        <ProgressBarFill width={`${progressPercentage}%`} />
                    </ProgressBarContainer>
                    <MilestonesRow>
                        {post.milestones.map((milestone) => (
                            <MilestoneItem key={milestone.id} achieved={milestone.achieved}>
                                <MilestoneIcon color={milestone.color}>
                                    <Ionicons
                                        name={milestone.icon as any}
                                        size={24}
                                        color={milestone.achieved ? milestone.color : theme.colors.text.secondary}
                                    />
                                </MilestoneIcon>
                                <MilestoneLabel>{milestone.label}</MilestoneLabel>
                            </MilestoneItem>
                        ))}
                    </MilestonesRow>
                    {nextMilestone && (
                        <NextGoalText>
                            Próxima meta: {formatNumber(nextMilestone.target)} assinaturas (faltam {formatNumber(nextMilestone.target - currentSupports)})
                        </NextGoalText>
                    )}
                </MilestoneSection>

                {/* Status Tags */}
                <StatusTagsSection>
                    <SectionTitle>Status da Denúncia</SectionTitle>
                    <StatusTagsRow>
                        <StatusTag active={post.actionStatus.investigating}>
                            <Ionicons
                                name="search"
                                size={16}
                                color={post.actionStatus.investigating ? theme.colors.primary : theme.colors.text.secondary}
                            />
                            <StatusTagText active={post.actionStatus.investigating}>Em Investigação</StatusTagText>
                        </StatusTag>
                        <StatusTag active={post.actionStatus.hasLawyers}>
                            <Ionicons
                                name="briefcase"
                                size={16}
                                color={post.actionStatus.hasLawyers ? theme.colors.primary : theme.colors.text.secondary}
                            />
                            <StatusTagText active={post.actionStatus.hasLawyers}>Advogados Atuando</StatusTagText>
                        </StatusTag>
                        <StatusTag active={post.actionStatus.hasNGO}>
                            <Ionicons
                                name="people"
                                size={16}
                                color={post.actionStatus.hasNGO ? theme.colors.primary : theme.colors.text.secondary}
                            />
                            <StatusTagText active={post.actionStatus.hasNGO}>ONGs Envolvidas</StatusTagText>
                        </StatusTag>
                        <StatusTag active={post.actionStatus.legalAction}>
                            <Ionicons
                                name="hammer"
                                size={16}
                                color={post.actionStatus.legalAction ? theme.colors.primary : theme.colors.text.secondary}
                            />
                            <StatusTagText active={post.actionStatus.legalAction}>Ação Judicial</StatusTagText>
                        </StatusTag>
                        <StatusTag active={post.actionStatus.governmentAction}>
                            <Ionicons
                                name="shield"
                                size={16}
                                color={post.actionStatus.governmentAction ? theme.colors.primary : theme.colors.text.secondary}
                            />
                            <StatusTagText active={post.actionStatus.governmentAction}>Governo Atuando</StatusTagText>
                        </StatusTag>
                        <StatusTag active={post.actionStatus.executing}>
                            <Ionicons
                                name="checkmark-circle"
                                size={16}
                                color={post.actionStatus.executing ? theme.colors.primary : theme.colors.text.secondary}
                            />
                            <StatusTagText active={post.actionStatus.executing}>Em Execução</StatusTagText>
                        </StatusTag>
                    </StatusTagsRow>
                </StatusTagsSection>

                {/* Updates/News */}
                {post.updates.length > 0 && (
                    <UpdatesSection>
                        <SectionTitle>Atualizações do Caso</SectionTitle>
                        {post.updates.map((update) => (
                            <UpdateItem key={update.id}>
                                <UpdateHeader>
                                    <UpdateTitle>{update.title}</UpdateTitle>
                                    <UpdateDate>{getTimeAgo(update.createdAt)}</UpdateDate>
                                </UpdateHeader>
                                <UpdateAuthor>
                                    {update.author.name} • {update.author.role}
                                </UpdateAuthor>
                                <UpdateContent>{update.content}</UpdateContent>
                            </UpdateItem>
                        ))}
                    </UpdatesSection>
                )}

                {/* Chat Unlock Banner */}
                {post.chatUnlocked && (
                    <ChatBanner>
                        <Ionicons name="chatbubbles" size={40} color={theme.colors.surface} />
                        <ChatBannerText>
                            <ChatBannerTitle>Chat Colaborativo Desbloqueado!</ChatBannerTitle>
                            <ChatBannerSubtitle>
                                Participe da discussão com jornalistas, advogados e membros do congresso
                            </ChatBannerSubtitle>
                        </ChatBannerText>
                        <Ionicons name="chevron-forward" size={24} color={theme.colors.surface} />
                    </ChatBanner>
                )}

                {/* Evidence Files */}
                {post.evidenceFiles.length > 0 && (
                    <EvidenceSection>
                        <SectionTitle>Arquivos de Evidência ({post.evidenceFiles.length})</SectionTitle>
                        <EvidenceGrid>
                            {post.evidenceFiles.slice(0, 6).map((file) => (
                                <EvidenceItem key={file.id}>
                                    {file.type === "image" || file.type === "video" ? (
                                        <EvidenceImage source={{ uri: file.thumbnail || file.url }} resizeMode="cover" />
                                    ) : (
                                        <View
                                            style={{
                                                flex: 1,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: theme.colors.border,
                                            }}
                                        >
                                            <Ionicons name={getFileIcon(file.type) as any} size={48} color={theme.colors.text.secondary} />
                                        </View>
                                    )}
                                    <EvidenceTypeIcon>
                                        <Ionicons name={getFileIcon(file.type) as any} size={16} color={theme.colors.surface} />
                                    </EvidenceTypeIcon>
                                    <EvidenceName numberOfLines={1}>{file.name}</EvidenceName>
                                </EvidenceItem>
                            ))}
                        </EvidenceGrid>
                        {post.evidenceFiles.length > 6 && (
                            <ViewAllButton>
                                <ViewAllText>Ver todos os {post.evidenceFiles.length} arquivos</ViewAllText>
                            </ViewAllButton>
                        )}
                    </EvidenceSection>
                )}

                {/* Signatures List */}
                {signatures.length > 0 && (
                    <SignaturesSection>
                        <SectionTitle>Pessoas que assinaram ({signatures.length})</SectionTitle>
                        {signatures.slice(0, 10).map((sig, index) => (
                            <SignatureItem key={index}>
                                <Avatar style={{ width: 32, height: 32, borderRadius: 16 }}>
                                    <AvatarText style={{ fontSize: 12 }}>{sig.userName.charAt(0).toUpperCase()}</AvatarText>
                                </Avatar>
                                <SignatureName>{sig.userName}</SignatureName>
                            </SignatureItem>
                        ))}
                        {signatures.length > 10 && (
                            <PostMeta style={{ marginTop: 8 }}>e mais {signatures.length - 10} pessoas...</PostMeta>
                        )}
                    </SignaturesSection>
                )}

                {/* Comments Preview */}
                {comments.length > 0 && (
                    <CommentsSection>
                        <SectionTitle>Comentários ({comments.length})</SectionTitle>
                        {displayComments.map((comment) => (
                            <CommentItem key={comment.id}>
                                <CommentAvatar>
                                    <AvatarText style={{ fontSize: 14 }}>{comment.author.name.charAt(0).toUpperCase()}</AvatarText>
                                </CommentAvatar>
                                <CommentContent>
                                    <CommentAuthor>{comment.author.name}</CommentAuthor>
                                    <CommentText>{comment.content}</CommentText>
                                    <CommentMeta>
                                        <CommentMetaText>{getTimeAgo(comment.createdAt)}</CommentMetaText>
                                        <CommentMetaText>{comment.likes} curtidas</CommentMetaText>
                                        {comment.replies > 0 && <CommentMetaText>{comment.replies} respostas</CommentMetaText>}
                                    </CommentMeta>
                                </CommentContent>
                            </CommentItem>
                        ))}
                        {comments.length > 3 && !showAllComments && (
                            <ViewAllButton onPress={() => setShowAllComments(true)}>
                                <ViewAllText>Ver todos os {comments.length} comentários</ViewAllText>
                            </ViewAllButton>
                        )}
                    </CommentsSection>
                )}
            </Content>

            {/* Action Bar */}
            <ActionBar>
                <ActionButton variant={userHasSigned ? "secondary" : "primary"} onPress={handleSign}>
                    <Ionicons
                        name={userHasSigned ? "checkmark-circle" : "heart"}
                        size={20}
                        color={userHasSigned ? theme.colors.primary : theme.colors.surface}
                    />
                    <ActionButtonText variant={userHasSigned ? "secondary" : "primary"}>
                        {userHasSigned ? "Assinado" : "Assinar Petição"}
                    </ActionButtonText>
                </ActionButton>
                <ActionButton variant="secondary" onPress={() => console.log("Compartilhar")}>
                    <Ionicons name="share-outline" size={20} color={theme.colors.text.primary} />
                    <ActionButtonText variant="secondary">Compartilhar</ActionButtonText>
                </ActionButton>
            </ActionBar>
        </Container>
    );
}
