import React, { useState } from "react";
import { TouchableOpacity, Image, View, Text, Pressable, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "../../../types";
import { theme } from "../../../constants/Theme";
import styled from "styled-components/native";
import { CategoryBadge } from "../CategoryBadge";
import { formatNumber, getTimeAgo, truncateText } from "../../../utils/formatters";

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onSave: (postId: string) => void;
    onComment: (postId: string) => void;
    onShare: (postId: string) => void;
    onPress?: (postId: string) => void;
    isLiked?: boolean;
    isSaved?: boolean;
}

const Card = styled(Pressable)`
    background-color: ${theme.colors.surface};
    margin-bottom: ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.lg}px;
    overflow: hidden;
`;

const ThumbnailContainer = styled(View)`
    width: 100%;
    height: 200px;
    background-color: ${theme.colors.border};
    position: relative;
`;

const Thumbnail = styled(Image)`
    width: 100%;
    height: 100%;
`;

const BadgeWrapper = styled(View)`
    position: absolute;
    top: ${theme.spacing.sm}px;
    right: ${theme.spacing.sm}px;
`;

const ContentSection = styled(View)`
    padding: ${theme.spacing.md}px;
`;

const Header = styled(View)`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${theme.spacing.sm}px;
`;

const Avatar = styled(View)`
    width: 32px;
    height: 32px;
    border-radius: 16px;
    background-color: ${theme.colors.primary};
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing.sm}px;
`;

const AvatarText = styled(Text)`
    color: ${theme.colors.surface};
    font-size: 14px;
    font-weight: bold;
`;

const UserInfo = styled(View)`
    flex: 1;
`;

const UserName = styled(Text)`
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
`;

const PostMeta = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    margin-top: 2px;
`;

const Title = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    line-height: 24px;
    margin-bottom: ${theme.spacing.xs}px;
`;

const Description = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    line-height: 20px;
    margin-bottom: ${theme.spacing.sm}px;
`;

const TagsContainer = styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${theme.spacing.xs}px;
    margin-bottom: ${theme.spacing.sm}px;
`;

const Tag = styled(View)`
    background-color: ${theme.colors.background};
    padding: 4px 8px;
    border-radius: ${theme.borderRadius.sm}px;
`;

const TagText = styled(Text)`
    font-size: 11px;
    color: ${theme.colors.primary};
    font-weight: 500;
`;

const StatsRow = styled(View)`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${theme.spacing.sm}px;
    padding-top: ${theme.spacing.sm}px;
    border-top-width: 1px;
    border-top-color: ${theme.colors.border};
`;

const StatItem = styled(View)`
    flex-direction: row;
    align-items: center;
    margin-right: ${theme.spacing.lg}px;
`;

const StatText = styled(Text)`
    font-size: 13px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
    margin-left: 4px;
`;

const ActionsRow = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-top: ${theme.spacing.xs}px;
    border-top-width: 1px;
    border-top-color: ${theme.colors.border};
`;

const ActionButton = styled(TouchableOpacity)<{ active?: boolean }>`
    flex-direction: row;
    align-items: center;
    padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
    border-radius: ${theme.borderRadius.md}px;
    background-color: ${(props: { active: any; }) => (props.active ? theme.colors.primary + "15" : "transparent")};
`;

const ActionText = styled(Text)<{ active?: boolean }>`
    font-size: 13px;
    color: ${(props: { active: any; }) => (props.active ? theme.colors.primary : theme.colors.text.secondary)};
    margin-left: 4px;
    font-weight: 500;
`;

const PreviewModalOverlay = styled(View)`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.9);
    justify-content: center;
    align-items: center;
    padding: ${theme.spacing.lg}px;
`;

const PreviewCard = styled(View)`
    background-color: ${theme.colors.surface};
    border-radius: ${theme.borderRadius.lg}px;
    width: 100%;
    max-height: 80%;
    overflow: hidden;
`;

const PreviewHeader = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${theme.spacing.md}px;
    background-color: ${theme.colors.background};
`;

const PreviewTitle = styled(Text)`
    font-size: 16px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
`;

const CloseButton = styled(TouchableOpacity)`
    padding: ${theme.spacing.xs}px;
`;

const PreviewImage = styled(Image)`
    width: 100%;
    height: 250px;
`;

const PreviewContent = styled(View)`
    padding: ${theme.spacing.lg}px;
`;

const PreviewPostTitle = styled(Text)`
    font-size: 20px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.sm}px;
`;

const PreviewDescription = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    line-height: 20px;
    margin-bottom: ${theme.spacing.md}px;
`;

const PreviewStats = styled(View)`
    flex-direction: row;
    justify-content: space-around;
    padding-top: ${theme.spacing.md}px;
    border-top-width: 1px;
    border-top-color: ${theme.colors.border};
`;

const PreviewStatItem = styled(View)`
    align-items: center;
`;

const PreviewStatNumber = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${theme.colors.primary};
`;

const PreviewStatLabel = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    margin-top: 4px;
`;

export const PostCard: React.FC<PostCardProps> = ({
    post,
    onLike,
    onSave,
    onComment,
    onShare,
    onPress,
    isLiked = false,
    isSaved = false,
}) => {
    const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    const handlePressIn = () => {
        const timer = setTimeout(() => {
            setShowPreview(true);
            console.log("🔍 LONG PRESS DETECTADO - Abrindo preview...");
        }, 2000);
        setLongPressTimer(timer as unknown as number);
    };

    const handlePressOut = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
    };

    const handlePress = () => {
        if (showPreview) {
            return;
        }

        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }

        console.log("👆 CLICK DETECTADO - Abrindo detalhes do post:", post.id);
        if (onPress) {
            onPress(post.id);
        }
    };

    const handleClosePreview = () => {
        setShowPreview(false);
    };

    const handleOpenDetails = () => {
        setShowPreview(false);
        if (onPress) {
            onPress(post.id);
        }
    };

    const shortDescription = truncateText(post.content, 100);

    return (
        <>
            <Card
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
            >
                {/* Thumbnail */}
                <ThumbnailContainer>
                    {post.media.length > 0 ? (
                        <Thumbnail source={{ uri: post.media[0].url }} resizeMode="cover" />
                    ) : (
                        <Thumbnail source={{ uri: `https://picsum.photos/seed/${post.id}/600/400` }} resizeMode="cover" />
                    )}
                    <BadgeWrapper>
                        <CategoryBadge category={post.category} size="small" />
                    </BadgeWrapper>
                </ThumbnailContainer>

                <ContentSection>
                    {/* Header */}
                    <Header>
                        <Avatar>
                            <AvatarText>{post.author.name.charAt(0).toUpperCase()}</AvatarText>
                        </Avatar>
                        <UserInfo>
                            <UserName>{post.author.name}</UserName>
                            <PostMeta>
                                {post.location.city}, {post.location.state} • {getTimeAgo(post.createdAt)}
                            </PostMeta>
                        </UserInfo>
                        <TouchableOpacity onPress={() => onSave(post.id)}>
                            <Ionicons
                                name={isSaved ? "bookmark" : "bookmark-outline"}
                                size={22}
                                color={isSaved ? theme.colors.primary : theme.colors.text.secondary}
                            />
                        </TouchableOpacity>
                    </Header>

                    {/* Title & Description */}
                    <Title numberOfLines={2}>{post.title}</Title>
                    <Description numberOfLines={2}>{shortDescription}</Description>

                    {/* Tags */}
                    <TagsContainer>
                        {post.tags.slice(0, 3).map((tag, index) => (
                            <Tag key={index}>
                                <TagText>#{tag}</TagText>
                            </Tag>
                        ))}
                    </TagsContainer>

                    {/* Stats */}
                    <StatsRow>
                        <StatItem>
                            <Ionicons name="people" size={16} color={theme.colors.text.secondary} />
                            <StatText>{formatNumber(post.stats.supports)}</StatText>
                        </StatItem>
                        <StatItem>
                            <Ionicons name="chatbubble" size={16} color={theme.colors.text.secondary} />
                            <StatText>{formatNumber(post.stats.comments)}</StatText>
                        </StatItem>
                        <StatItem>
                            <Ionicons name="share-social" size={16} color={theme.colors.text.secondary} />
                            <StatText>{formatNumber(post.stats.shares)}</StatText>
                        </StatItem>
                    </StatsRow>

                    {/* Actions */}
                    <ActionsRow>
                        <ActionButton active={isLiked} onPress={() => onLike(post.id)}>
                            <Ionicons
                                name={isLiked ? "heart" : "heart-outline"}
                                size={20}
                                color={isLiked ? theme.colors.primary : theme.colors.text.secondary}
                            />
                            <ActionText active={isLiked}>Assinar</ActionText>
                        </ActionButton>

                        <ActionButton onPress={() => onComment(post.id)}>
                            <Ionicons name="chatbubble-outline" size={20} color={theme.colors.text.secondary} />
                            <ActionText>Comentar</ActionText>
                        </ActionButton>

                        <ActionButton onPress={() => onShare(post.id)}>
                            <Ionicons name="share-outline" size={20} color={theme.colors.text.secondary} />
                            <ActionText>Compartilhar</ActionText>
                        </ActionButton>
                    </ActionsRow>
                </ContentSection>
            </Card>

            <Modal
                visible={showPreview}
                transparent={true}
                animationType="fade"
                onRequestClose={handleClosePreview}
            >
                <PreviewModalOverlay>
                    <PreviewCard>
                        <PreviewHeader>
                            <PreviewTitle>Prévia da Denúncia</PreviewTitle>
                            <CloseButton onPress={handleClosePreview}>
                                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
                            </CloseButton>
                        </PreviewHeader>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <PreviewImage
                                source={{
                                    uri: post.media.length > 0
                                        ? post.media[0].url
                                        : `https://picsum.photos/seed/${post.id}/600/400`,
                                }}
                                resizeMode="cover"
                            />

                            <PreviewContent>
                                <CategoryBadge
                                    category={post.category}
                                    style={{ marginBottom: 12 }}
                                />

                                <PreviewPostTitle>{post.title}</PreviewPostTitle>
                                <PreviewDescription>{post.content}</PreviewDescription>

                                <PreviewStats>
                                    <PreviewStatItem>
                                        <PreviewStatNumber>{formatNumber(post.stats.supports)}</PreviewStatNumber>
                                        <PreviewStatLabel>Assinaturas</PreviewStatLabel>
                                    </PreviewStatItem>
                                    <PreviewStatItem>
                                        <PreviewStatNumber>{formatNumber(post.stats.comments)}</PreviewStatNumber>
                                        <PreviewStatLabel>Comentários</PreviewStatLabel>
                                    </PreviewStatItem>
                                    <PreviewStatItem>
                                        <PreviewStatNumber>{formatNumber(post.stats.shares)}</PreviewStatNumber>
                                        <PreviewStatLabel>Compartilhamentos</PreviewStatLabel>
                                    </PreviewStatItem>
                                </PreviewStats>

                                <TouchableOpacity
                                    onPress={handleOpenDetails}
                                    style={{
                                        backgroundColor: theme.colors.primary,
                                        padding: 16,
                                        borderRadius: 8,
                                        marginTop: 16,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: theme.colors.surface, fontWeight: 'bold', fontSize: 16 }}>
                                        Ver Detalhes Completos
                                    </Text>
                                </TouchableOpacity>
                            </PreviewContent>
                        </ScrollView>
                    </PreviewCard>
                </PreviewModalOverlay>
            </Modal>
        </>
    );
};
