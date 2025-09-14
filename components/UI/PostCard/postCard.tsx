import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "../../../types";
import { theme } from "../../../constants/Theme";
import * as S from "./postCard.styles";

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
    onSave: (postId: string) => void;
    onComment: (postId: string) => void;
    onShare: (postId: string) => void;
    isLiked?: boolean;
    isSaved?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
    post,
    onLike,
    onSave,
    onComment,
    onShare,
    isLiked = false,
    isSaved = false,
}) => {
    const getCategoryLabel = (category: string) => {
        switch (category) {
            case "corruption":
                return "Corrupção";
            case "environment":
                return "Meio Ambiente";
            case "rights":
                return "Direitos";
            default:
                return "Geral";
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    return (
        <S.CardContainer style={S.shadowStyles.cardShadow}>
            {/* Header */}
            <S.CardHeader>
                <S.Avatar>
                    <S.AvatarText>👤</S.AvatarText>
                </S.Avatar>
                <S.UserInfo>
                    <S.UserName>{post.authorName}</S.UserName>
                    <S.PostMeta>
                        {post.location} • {post.timeAgo}
                    </S.PostMeta>
                </S.UserInfo>
                <S.MoreButton>
                    <Ionicons
                        name='ellipsis-vertical'
                        size={16}
                        color={theme.colors.text.secondary}
                    />
                </S.MoreButton>
            </S.CardHeader>

            {/* Media */}
            <S.MediaContainer>
                <Ionicons
                    name='image-outline'
                    size={48}
                    color={theme.colors.text.secondary}
                />
                <S.MediaPlaceholder>
                    {post.mediaCount} arquivos de evidência
                </S.MediaPlaceholder>

                <S.CategoryBadge category={post.category}>
                    <S.CategoryText>
                        {getCategoryLabel(post.category)}
                    </S.CategoryText>
                </S.CategoryBadge>

                <S.MediaCount>
                    <Ionicons name='images-outline' size={16} color='white' />
                    <S.MediaCountText>{post.mediaCount}</S.MediaCountText>
                </S.MediaCount>
            </S.MediaContainer>

            {/* Actions */}
            <S.ActionsContainer>
                <S.ActionsLeft>
                    <S.ActionButton
                        isActive={isLiked}
                        onPress={() => onLike(post.id)}
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
                        <S.ActionText isActive={isLiked}>Apoiar</S.ActionText>
                    </S.ActionButton>

                    <S.ActionButton onPress={() => onComment(post.id)}>
                        <Ionicons
                            name='chatbubble-outline'
                            size={20}
                            color={theme.colors.text.secondary}
                        />
                        <S.ActionText>Comentar</S.ActionText>
                    </S.ActionButton>

                    <S.ActionButton onPress={() => onShare(post.id)}>
                        <Ionicons
                            name='share-outline'
                            size={20}
                            color={theme.colors.text.secondary}
                        />
                        <S.ActionText>Compartilhar</S.ActionText>
                    </S.ActionButton>
                </S.ActionsLeft>

                <S.SaveButton isSaved={isSaved} onPress={() => onSave(post.id)}>
                    <Ionicons
                        name={isSaved ? "bookmark" : "bookmark-outline"}
                        size={20}
                        color={
                            isSaved
                                ? theme.colors.primary
                                : theme.colors.text.secondary
                        }
                    />
                </S.SaveButton>
            </S.ActionsContainer>

            {/* Content */}
            <S.ContentContainer>
                <S.LikesCount>
                    {formatNumber(isLiked ? post.likes + 1 : post.likes)}{" "}
                    apoiadores
                </S.LikesCount>

                <S.PostTitle>{post.title}</S.PostTitle>
                <S.PostContent>{post.content}</S.PostContent>

                <S.TagsContainer>
                    {post.tags.map((tag, index) => (
                        <S.Tag key={index}>
                            <S.TagText>{tag}</S.TagText>
                        </S.Tag>
                    ))}
                </S.TagsContainer>

                <S.TimeAgo>{post.timeAgo} atrás</S.TimeAgo>
            </S.ContentContainer>
        </S.CardContainer>
    );
};
