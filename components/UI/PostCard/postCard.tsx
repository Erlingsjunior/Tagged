import React, { useState } from "react";
import {
    TouchableOpacity,
    Image,
    View,
    Text,
    Pressable,
    Modal,
    ScrollView,
    Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Post } from "../../../types";
import { theme } from "../../../constants/Theme";
import styled from "styled-components/native";
import { CategoryBadge } from "../CategoryBadge";
import {
    formatNumber,
    getTimeAgo,
    truncateText,
    getFileIcon,
    formatFileSize,
} from "../../../utils/formatters";
import { ProgressBar } from "../ProgressBar";

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onSave: (postId: string) => void;
    onComment: (postId: string) => void;
    onShare: (postId: string) => void;
    onPress?: (postId: string) => void;
    onChat?: (post: Post) => void;
    onAuthorPress?: (authorId: string) => void;
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
    background-color: ${(props: { active: any }) =>
        props.active ? theme.colors.primary + "15" : "transparent"};
`;

const ActionText = styled(Text)<{ active?: boolean }>`
    font-size: 13px;
    color: ${(props: { active: any }) =>
        props.active ? theme.colors.primary : theme.colors.text.secondary};
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

const PreviewSection = styled(View)`
    margin-top: ${theme.spacing.lg}px;
    padding-top: ${theme.spacing.lg}px;
    border-top-width: 1px;
    border-top-color: ${theme.colors.border};
`;

const PreviewSectionTitle = styled(Text)`
    font-size: 16px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.md}px;
`;

const PreviewMilestonesRow = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: ${theme.spacing.sm}px;
`;

const PreviewMilestoneItem = styled(View)<{ achieved: boolean }>`
    align-items: center;
    width: 18%;
    margin-bottom: ${theme.spacing.sm}px;
    opacity: ${(props: { achieved: boolean }) => (props.achieved ? 1 : 0.4)};
`;

const PreviewMilestoneIcon = styled(View)<{ color: string }>`
    width: 36px;
    height: 36px;
    border-radius: 18px;
    background-color: ${(props: { color: string }) => props.color}20;
    align-items: center;
    justify-content: center;
    margin-bottom: ${theme.spacing.xs}px;
`;

const PreviewMilestoneLabel = styled(Text)`
    font-size: 9px;
    font-weight: 600;
    color: ${theme.colors.text.secondary};
    text-align: center;
`;

const PreviewEvidenceGrid = styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${theme.spacing.xs}px;
`;

const PreviewEvidenceItem = styled(TouchableOpacity)`
    width: 48%;
    aspect-ratio: 1.5;
    border-radius: ${theme.borderRadius.sm}px;
    overflow: hidden;
    background-color: ${theme.colors.border};
    position: relative;
`;

const PreviewEvidenceImage = styled(Image)`
    width: 100%;
    height: 100%;
`;

const PreviewEvidenceTypeIcon = styled(View)`
    position: absolute;
    top: ${theme.spacing.xs}px;
    right: ${theme.spacing.xs}px;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 4px;
    border-radius: ${theme.borderRadius.xl}px;
`;

const PreviewEvidenceName = styled(Text)`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: ${theme.spacing.xs}px;
    background-color: rgba(0, 0, 0, 0.7);
    color: ${theme.colors.surface};
    font-size: 9px;
`;

const PreviewEvidenceInfo = styled(View)`
    position: absolute;
    bottom: 16px;
    left: 0;
    right: 0;
    padding: 2px ${theme.spacing.xs}px;
    background-color: rgba(0, 0, 0, 0.6);
`;

const PreviewEvidenceInfoText = styled(Text)`
    color: ${theme.colors.surface};
    font-size: 8px;
    opacity: 0.95;
`;

export const PostCard: React.FC<PostCardProps> = ({
    post,
    onLike,
    onSave,
    onComment,
    onShare,
    onPress,
    onChat,
    onAuthorPress,
    isLiked = false,
    isSaved = false,
}) => {
    const [longPressTimer, setLongPressTimer] = useState<number | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [lastTap, setLastTap] = useState<number>(0);
    const [isDoubleTapping, setIsDoubleTapping] = useState(false);
    const [showHeartAnimation, setShowHeartAnimation] = useState(false);
    const [heartAnimation] = useState(new Animated.Value(0));

    const playHeartSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require("../../../assets/sounds/bloop.mp3"),
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
        setShowHeartAnimation(true);
        heartAnimation.setValue(0);

        Animated.sequence([
            Animated.timing(heartAnimation, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(heartAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => setShowHeartAnimation(false));
    };

    const handlePressIn = () => {
        const timer = setTimeout(() => {
            setShowPreview(true);
            console.log("🔍 LONG PRESS DETECTADO - Abrindo preview...");
        }, 1400); // Reduzido de 2000ms para 1400ms
        setLongPressTimer(timer as unknown as number);
    };

    const handlePressOut = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
    };

    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_TAP_DELAY = 300; // 300ms para detectar double tap

        if (now - lastTap < DOUBLE_TAP_DELAY) {
            // Double tap detectado!
            console.log("❤️ DOUBLE TAP - Dando like!");
            setIsDoubleTapping(true);

            if (!isLiked) {
                onLike(post.id);
                animateHeart();
                playHeartSound();
            }

            // Reset the flag after a delay
            setTimeout(() => {
                setIsDoubleTapping(false);
            }, 400);
        }
        setLastTap(now);
    };

    const handlePress = () => {
        if (showPreview || isDoubleTapping) {
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
                <ThumbnailContainer onTouchEnd={handleDoubleTap}>
                    {post.media.length > 0 ? (
                        <Thumbnail
                            source={{ uri: post.media[0].url }}
                            resizeMode='cover'
                        />
                    ) : (
                        <Thumbnail
                            source={{
                                uri: `https://picsum.photos/seed/${post.id}/600/400`,
                            }}
                            resizeMode='cover'
                        />
                    )}
                    <BadgeWrapper>
                        <CategoryBadge category={post.category} size='small' />
                    </BadgeWrapper>

                    {showHeartAnimation && (
                        <Animated.View
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: "none",
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
                        >
                            <Ionicons
                                name='heart'
                                size={100}
                                color={theme.colors.primary}
                            />
                        </Animated.View>
                    )}
                </ThumbnailContainer>

                <ContentSection>
                    <Header>
                        <TouchableOpacity
                            onPress={() => !post.isAnonymous && onAuthorPress?.(post.author.id)}
                            disabled={post.isAnonymous}
                            style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                        >
                            <Avatar>
                                <AvatarText>
                                    {post.author.name.charAt(0).toUpperCase()}
                                </AvatarText>
                            </Avatar>
                            <UserInfo>
                                <UserName>{post.author.name}</UserName>
                                <PostMeta>
                                    {post.location.city}, {post.location.state} •{" "}
                                    {getTimeAgo(post.createdAt)}
                                </PostMeta>
                            </UserInfo>
                        </TouchableOpacity>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                            }}
                        >
                            {!post.isAnonymous && onChat && (
                                <TouchableOpacity onPress={() => onChat(post)}>
                                    <Ionicons
                                        name='chatbubble'
                                        size={22}
                                        color={theme.colors.primary}
                                    />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity onPress={() => onSave(post.id)}>
                                <Ionicons
                                    name={
                                        isSaved
                                            ? "bookmark"
                                            : "bookmark-outline"
                                    }
                                    size={22}
                                    color={
                                        isSaved
                                            ? theme.colors.primary
                                            : theme.colors.text.secondary
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </Header>

                    <Title numberOfLines={2}>{post.title}</Title>
                    <Description numberOfLines={2}>
                        {shortDescription}
                    </Description>

                    <TagsContainer>
                        {post.tags.slice(0, 3).map((tag, index) => (
                            <Tag key={index}>
                                <TagText>#{tag}</TagText>
                            </Tag>
                        ))}
                    </TagsContainer>

                    <StatsRow>
                        <StatItem>
                            <Ionicons
                                name='people'
                                size={16}
                                color={theme.colors.text.secondary}
                            />
                            <StatText>
                                {formatNumber(post.stats.supports)}
                            </StatText>
                        </StatItem>
                        <StatItem>
                            <Ionicons
                                name='chatbubble'
                                size={16}
                                color={theme.colors.text.secondary}
                            />
                            <StatText>
                                {formatNumber(post.stats.comments)}
                            </StatText>
                        </StatItem>
                        <StatItem>
                            <Ionicons
                                name='share-social'
                                size={16}
                                color={theme.colors.text.secondary}
                            />
                            <StatText>
                                {formatNumber(post.stats.shares)}
                            </StatText>
                        </StatItem>
                    </StatsRow>

                    <ActionsRow>
                        <ActionButton
                            active={isLiked}
                            onPress={() => {
                                onLike(post.id);
                            }}
                        >
                            <Ionicons
                                name={isLiked ? "heart" : "heart-outline"}
                                size={20}
                                color={
                                    isLiked
                                        ? theme.colors.primary
                                        : theme.colors.text.secondary
                                }
                            />
                            <ActionText active={isLiked}>
                                {isLiked ? "Tagged!" : "Taggy"}
                            </ActionText>
                        </ActionButton>

                        <ActionButton onPress={() => onComment(post.id)}>
                            <Ionicons
                                name='chatbubble-outline'
                                size={20}
                                color={theme.colors.text.secondary}
                            />
                            <ActionText>Comentar</ActionText>
                        </ActionButton>

                        <ActionButton onPress={() => onShare(post.id)}>
                            <Ionicons
                                name='share-outline'
                                size={20}
                                color={theme.colors.text.secondary}
                            />
                            <ActionText>Compartilhar</ActionText>
                        </ActionButton>
                    </ActionsRow>
                </ContentSection>
            </Card>

            <Modal
                visible={showPreview}
                transparent={true}
                animationType='fade'
                onRequestClose={handleClosePreview}
            >
                <PreviewModalOverlay>
                    <PreviewCard>
                        <PreviewHeader>
                            <PreviewTitle>Prévia da Denúncia</PreviewTitle>
                            <CloseButton onPress={handleClosePreview}>
                                <Ionicons
                                    name='close'
                                    size={24}
                                    color={theme.colors.text.primary}
                                />
                            </CloseButton>
                        </PreviewHeader>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <PreviewImage
                                source={{
                                    uri:
                                        post.media.length > 0
                                            ? post.media[0].url
                                            : `https://picsum.photos/seed/${post.id}/600/400`,
                                }}
                                resizeMode='cover'
                            />

                            <PreviewContent>
                                <CategoryBadge
                                    category={post.category}
                                    style={{ marginBottom: 12 }}
                                />

                                <PreviewPostTitle>
                                    {post.title}
                                </PreviewPostTitle>
                                <PreviewDescription>
                                    {post.content}
                                </PreviewDescription>

                                <PreviewStats>
                                    <PreviewStatItem>
                                        <PreviewStatNumber>
                                            {formatNumber(post.stats.supports)}
                                        </PreviewStatNumber>
                                        <PreviewStatLabel>
                                            Assinaturas
                                        </PreviewStatLabel>
                                    </PreviewStatItem>
                                    <PreviewStatItem>
                                        <PreviewStatNumber>
                                            {formatNumber(post.stats.comments)}
                                        </PreviewStatNumber>
                                        <PreviewStatLabel>
                                            Comentários
                                        </PreviewStatLabel>
                                    </PreviewStatItem>
                                    <PreviewStatItem>
                                        <PreviewStatNumber>
                                            {formatNumber(post.stats.shares)}
                                        </PreviewStatNumber>
                                        <PreviewStatLabel>
                                            Compartilhamentos
                                        </PreviewStatLabel>
                                    </PreviewStatItem>
                                </PreviewStats>

                                {post.milestones &&
                                    post.milestones.length > 0 && (
                                        <PreviewSection>
                                            <PreviewSectionTitle>
                                                Conquistas
                                            </PreviewSectionTitle>
                                            <View
                                                style={{
                                                    marginBottom:
                                                        theme.spacing.xs,
                                                    flexDirection: "row",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        fontWeight: "600",
                                                        color: theme.colors
                                                            .primary,
                                                    }}
                                                >
                                                    {formatNumber(
                                                        post.stats.supports
                                                    )}{" "}
                                                    assinaturas
                                                </Text>
                                                {(() => {
                                                    const nextMilestone =
                                                        post.milestones.find(
                                                            (m) => !m.achieved
                                                        );
                                                    return nextMilestone ? (
                                                        <Text
                                                            style={{
                                                                fontSize: 11,
                                                                color: theme
                                                                    .colors.text
                                                                    .secondary,
                                                            }}
                                                        >
                                                            Meta:{" "}
                                                            {formatNumber(
                                                                nextMilestone.target
                                                            )}
                                                        </Text>
                                                    ) : null;
                                                })()}
                                            </View>
                                            <View
                                                style={{
                                                    marginBottom:
                                                        theme.spacing.sm,
                                                }}
                                            >
                                                <ProgressBar
                                                    percentage={(() => {
                                                        const currentSupports =
                                                            post.stats.supports;
                                                        const achievedMilestones =
                                                            post.milestones.filter(
                                                                (m) =>
                                                                    m.achieved
                                                            );
                                                        const nextMilestone =
                                                            post.milestones.find(
                                                                (m) =>
                                                                    !m.achieved
                                                            );
                                                        const previousMilestone =
                                                            achievedMilestones[
                                                                achievedMilestones.length - 1
                                                            ];
                                                        const progressStart =
                                                            previousMilestone
                                                                ? previousMilestone.target
                                                                : 0;
                                                        const progressEnd =
                                                            nextMilestone
                                                                ? nextMilestone.target
                                                                : post
                                                                      .milestones[
                                                                      post
                                                                          .milestones
                                                                          .length - 1
                                                                  ].target;
                                                        const progressCurrent =
                                                            currentSupports -
                                                            progressStart;
                                                        const progressTotal =
                                                            progressEnd -
                                                            progressStart;
                                                        return progressTotal > 0
                                                            ? Math.min(
                                                                  (progressCurrent /
                                                                      progressTotal) *
                                                                      100,
                                                                  100
                                                              )
                                                            : 0;
                                                    })()}
                                                />
                                            </View>
                                            <PreviewMilestonesRow>
                                                {(() => {
                                                    // Mostrar milestones relevantes: últimos 2 conquistados + próximos 3
                                                    const achieved =
                                                        post.milestones.filter(
                                                            (m) => m.achieved
                                                        );
                                                    const notAchieved =
                                                        post.milestones.filter(
                                                            (m) => !m.achieved
                                                        );
                                                    const relevantMilestones = [
                                                        ...achieved.slice(-2),
                                                        ...notAchieved.slice(
                                                            0,
                                                            3
                                                        ),
                                                    ];
                                                    return relevantMilestones.map(
                                                        (milestone) => (
                                                            <PreviewMilestoneItem
                                                                key={
                                                                    milestone.id
                                                                }
                                                                achieved={
                                                                    milestone.achieved
                                                                }
                                                            >
                                                                <PreviewMilestoneIcon
                                                                    color={
                                                                        milestone.color
                                                                    }
                                                                >
                                                                    <Ionicons
                                                                        name={
                                                                            milestone.icon as any
                                                                        }
                                                                        size={
                                                                            18
                                                                        }
                                                                        color={
                                                                            milestone.achieved
                                                                                ? milestone.color
                                                                                : theme
                                                                                      .colors
                                                                                      .text
                                                                                      .secondary
                                                                        }
                                                                    />
                                                                </PreviewMilestoneIcon>
                                                                <PreviewMilestoneLabel>
                                                                    {
                                                                        milestone.label
                                                                    }
                                                                </PreviewMilestoneLabel>
                                                            </PreviewMilestoneItem>
                                                        )
                                                    );
                                                })()}
                                            </PreviewMilestonesRow>
                                        </PreviewSection>
                                    )}

                                {post.evidenceFiles &&
                                    post.evidenceFiles.length > 0 && (
                                        <PreviewSection>
                                            <PreviewSectionTitle>
                                                Evidências (
                                                {post.evidenceFiles.length})
                                            </PreviewSectionTitle>
                                            <PreviewEvidenceGrid>
                                                {post.evidenceFiles
                                                    .slice(0, 4)
                                                    .map((file) => (
                                                        <PreviewEvidenceItem
                                                            key={file.id}
                                                        >
                                                            {file.type ===
                                                                "image" ||
                                                            file.type ===
                                                                "video" ? (
                                                                <PreviewEvidenceImage
                                                                    source={{
                                                                        uri:
                                                                            file.thumbnail ||
                                                                            file.url,
                                                                    }}
                                                                    resizeMode='cover'
                                                                />
                                                            ) : (
                                                                <View
                                                                    style={{
                                                                        flex: 1,
                                                                        justifyContent:
                                                                            "center",
                                                                        alignItems:
                                                                            "center",
                                                                        backgroundColor:
                                                                            theme
                                                                                .colors
                                                                                .border,
                                                                    }}
                                                                >
                                                                    <Ionicons
                                                                        name={
                                                                            getFileIcon(
                                                                                file.type
                                                                            ) as any
                                                                        }
                                                                        size={
                                                                            36
                                                                        }
                                                                        color={
                                                                            theme
                                                                                .colors
                                                                                .text
                                                                                .secondary
                                                                        }
                                                                    />
                                                                </View>
                                                            )}
                                                            <PreviewEvidenceTypeIcon>
                                                                <Ionicons
                                                                    name={
                                                                        getFileIcon(
                                                                            file.type
                                                                        ) as any
                                                                    }
                                                                    size={12}
                                                                    color={
                                                                        theme
                                                                            .colors
                                                                            .surface
                                                                    }
                                                                />
                                                            </PreviewEvidenceTypeIcon>
                                                            <PreviewEvidenceInfo>
                                                                <PreviewEvidenceInfoText>
                                                                    {formatFileSize(
                                                                        file.size
                                                                    )}
                                                                </PreviewEvidenceInfoText>
                                                            </PreviewEvidenceInfo>
                                                            <PreviewEvidenceName
                                                                numberOfLines={
                                                                    1
                                                                }
                                                            >
                                                                {file.name}
                                                            </PreviewEvidenceName>
                                                        </PreviewEvidenceItem>
                                                    ))}
                                            </PreviewEvidenceGrid>
                                            {post.evidenceFiles.length > 4 && (
                                                <Text
                                                    style={{
                                                        fontSize: 12,
                                                        color: theme.colors.text
                                                            .secondary,
                                                        textAlign: "center",
                                                        marginTop:
                                                            theme.spacing.sm,
                                                    }}
                                                >
                                                    +
                                                    {post.evidenceFiles.length -
                                                        4}{" "}
                                                    mais
                                                </Text>
                                            )}
                                        </PreviewSection>
                                    )}

                                <TouchableOpacity
                                    onPress={handleOpenDetails}
                                    style={{
                                        backgroundColor: theme.colors.primary,
                                        padding: 16,
                                        borderRadius: 8,
                                        marginTop: 16,
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: theme.colors.surface,
                                            fontWeight: "bold",
                                            fontSize: 16,
                                        }}
                                    >
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
