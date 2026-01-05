import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import { CommentItemProps } from "./commentItem.types";
import { theme } from "../../../constants/Theme";
import { getTimeAgo } from "../../../utils/formatters";

const Container = styled(View)`
    flex-direction: row;
    margin-bottom: ${theme.spacing.md}px;
    padding-bottom: ${theme.spacing.md}px;
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.border};
`;

const Avatar = styled(View)`
    width: 36px;
    height: 36px;
    border-radius: 18px;
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

const Content = styled(View)`
    flex: 1;
`;

const Author = styled(Text)`
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
    margin-bottom: 4px;
`;

const CommentText = styled(Text)`
    font-size: 14px;
    line-height: 20px;
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.xs}px;
`;

const Meta = styled(View)`
    flex-direction: row;
    gap: ${theme.spacing.md}px;
`;

const MetaText = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
`;

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
    return (
        <Container>
            <Avatar>
                <AvatarText>{comment.author.name.charAt(0).toUpperCase()}</AvatarText>
            </Avatar>
            <Content>
                <Author>{comment.author.name}</Author>
                <CommentText>{comment.content}</CommentText>
                <Meta>
                    <MetaText>{getTimeAgo(comment.createdAt)}</MetaText>
                    <MetaText>{comment.likes} curtidas</MetaText>
                    {comment.replies > 0 && <MetaText>{comment.replies} respostas</MetaText>}
                </Meta>
            </Content>
        </Container>
    );
};
