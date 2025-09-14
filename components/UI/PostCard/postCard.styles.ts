// src/components/UI/PostCard/PostCard.styles.ts
import styled from "styled-components/native";
import { StyleSheet } from "react-native";
import { theme } from "../../../constants/Theme";

// Shadow styles usando StyleSheet (para compatibilidade)
export const shadowStyles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
});

export const CardContainer = styled.View`
    background-color: ${theme.colors.surface};
    margin-bottom: ${theme.spacing.sm}px;
    border-radius: ${theme.borderRadius.lg}px;
`;

export const CardHeader = styled.View`
    flex-direction: row;
    align-items: center;
    padding: ${theme.spacing.md}px;
`;

export const Avatar = styled.View`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: ${theme.colors.primary};
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing.md}px;
`;

export const AvatarText = styled.Text`
    color: ${theme.colors.text.light};
    font-weight: bold;
    font-size: 16px;
`;

export const UserInfo = styled.View`
    flex: 1;
`;

export const UserName = styled.Text`
    font-size: 15px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
    margin-bottom: 2px;
`;

export const PostMeta = styled.Text`
    font-size: 13px;
    color: ${theme.colors.text.secondary};
`;

export const MoreButton = styled.TouchableOpacity`
    width: 32px;
    height: 32px;
    border-radius: 16px;
    align-items: center;
    justify-content: center;
`;

export const MediaContainer = styled.View`
    height: 240px;
    background-color: ${theme.colors.card};
    margin: 0 ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.md}px;
    align-items: center;
    justify-content: center;
    position: relative;
`;

export const MediaPlaceholder = styled.Text`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    font-weight: 500;
    margin-top: 8px;
`;

export const CategoryBadge = styled.View<{ category: string }>`
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 6px 12px;
    border-radius: 20px;
    background-color: ${({ category }) => {
        switch (category) {
            case "corruption":
                return theme.colors.error;
            case "environment":
                return theme.colors.success;
            case "rights":
                return theme.colors.secondary;
            default:
                return theme.colors.primary;
        }
    }};
`;

export const CategoryText = styled.Text`
    color: white;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
`;

export const MediaCount = styled.View`
    position: absolute;
    top: 12px;
    right: 12px;
    background-color: rgba(0, 0, 0, 0.7);
    padding: 6px 12px;
    border-radius: 20px;
    flex-direction: row;
    align-items: center;
`;

export const MediaCountText = styled.Text`
    color: white;
    font-size: 12px;
    font-weight: 600;
    margin-left: 6px;
`;

export const ActionsContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 12px ${theme.spacing.md}px;
    align-items: center;
`;

export const ActionsLeft = styled.View`
    flex-direction: row;
    gap: 16px;
`;

export const ActionButton = styled.TouchableOpacity<{ isActive?: boolean }>`
    flex-direction: row;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    border-radius: 8px;
    background-color: ${({ isActive }) =>
        isActive ? `${theme.colors.primary}10` : "transparent"};
`;

export const ActionText = styled.Text<{ isActive?: boolean }>`
    font-size: 14px;
    font-weight: 500;
    color: ${({ isActive }) =>
        isActive ? theme.colors.primary : theme.colors.text.secondary};
`;

export const SaveButton = styled.TouchableOpacity<{ isSaved?: boolean }>`
    padding: 6px;
    border-radius: 8px;
    background-color: ${({ isSaved }) =>
        isSaved ? `${theme.colors.primary}10` : "transparent"};
`;

export const ContentContainer = styled.View`
    padding: 0 ${theme.spacing.md}px ${theme.spacing.md}px;
`;

export const LikesCount = styled.Text`
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
    margin-bottom: 8px;
`;

export const PostTitle = styled.Text`
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
    margin-bottom: 4px;
    line-height: 18px;
`;

export const PostContent = styled.Text`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    line-height: 18px;
    margin-bottom: 8px;
`;

export const TagsContainer = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
`;

export const Tag = styled.View`
    padding: 4px 10px;
    background-color: ${theme.colors.primary}10;
    border-radius: 16px;
`;

export const TagText = styled.Text`
    font-size: 12px;
    color: ${theme.colors.primary};
    font-weight: 500;
`;

export const TimeAgo = styled.Text`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
`;
