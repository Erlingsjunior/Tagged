import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { theme } from "../../constants/Theme";
import { useAuthStore } from "../../stores/authStore";
import { Avatar } from "../../components/UI/Avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { mockComments } from "../../services/mockData";
import { Comment } from "../../types";

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

const CommentsList = styled(ScrollView)`
    flex: 1;
`;

const CommentContainer = styled(View)`
    padding: ${theme.spacing.md}px;
    background-color: ${theme.colors.surface};
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.border};
`;

const CommentHeader = styled(View)`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${theme.spacing.sm}px;
    gap: ${theme.spacing.sm}px;
`;

const CommentInfo = styled(View)`
    flex: 1;
`;

const UserName = styled(Text)`
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
`;

const TimeText = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
`;

const CommentContent = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.text.primary};
    line-height: 20px;
    margin-bottom: ${theme.spacing.sm}px;
`;

const CommentActions = styled(View)`
    flex-direction: row;
    align-items: center;
    gap: ${theme.spacing.md}px;
`;

const ActionButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    gap: 4px;
`;

const ActionText = styled(Text)<{ active?: boolean }>`
    font-size: 12px;
    color: ${(props) => (props.active ? theme.colors.primary : theme.colors.text.secondary)};
    font-weight: ${(props) => (props.active ? "600" : "normal")};
`;

const InputContainer = styled(KeyboardAvoidingView)`
    background-color: ${theme.colors.surface};
    border-top-width: 1px;
    border-top-color: ${theme.colors.border};
    padding: ${theme.spacing.md}px;
    flex-direction: row;
    align-items: center;
    gap: ${theme.spacing.sm}px;
`;

const Input = styled(TextInput)`
    flex: 1;
    background-color: ${theme.colors.background};
    border-radius: 20px;
    padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
    font-size: 14px;
    color: ${theme.colors.text.primary};
    max-height: 100px;
`;

const SendButton = styled(TouchableOpacity)<{ disabled?: boolean }>`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: ${(props) => (props.disabled ? theme.colors.border : theme.colors.primary)};
    align-items: center;
    justify-content: center;
`;

const EmptyState = styled(View)`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.xl}px;
`;

const EmptyText = styled(Text)`
    font-size: 16px;
    color: ${theme.colors.text.secondary};
    text-align: center;
    margin-top: ${theme.spacing.md}px;
`;

export default function CommentsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const postId = params.postId as string;

    const { user } = useAuthStore();

    const [inputText, setInputText] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);

    const comments = mockComments.get(postId) || [];
    const sortedComments = [...comments].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const handleSendComment = () => {
        if (!inputText.trim() || !user) return;

        // Mock data is read-only - just show feedback
        Alert.alert(
            "Comentário Enviado",
            "Em um app real, seu comentário seria adicionado aqui!",
            [{ text: "OK" }]
        );
        setInputText("");
    };

    const handleLike = (comment: Comment) => {
        if (!user) return;

        // Mock data is read-only - just show feedback
        Alert.alert(
            "Like Registrado",
            "Em um app real, seu like seria contabilizado!",
            [{ text: "OK" }]
        );
    };

    const renderComment = (comment: Comment) => {
        return (
            <CommentContainer key={comment.id}>
                <CommentHeader>
                    <Avatar
                        name={comment.author.name}
                        avatar={comment.author.avatar}
                        size="medium"
                    />
                    <CommentInfo>
                        <UserName>
                            {comment.author.name}
                            {comment.author.verified && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={14}
                                    color={theme.colors.primary}
                                    style={{ marginLeft: 4 }}
                                />
                            )}
                        </UserName>
                        <TimeText>
                            {formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                                locale: ptBR
                            })}
                        </TimeText>
                    </CommentInfo>
                </CommentHeader>

                <CommentContent>{comment.content}</CommentContent>

                <CommentActions>
                    <ActionButton onPress={() => handleLike(comment)}>
                        <Ionicons
                            name="heart-outline"
                            size={16}
                            color={theme.colors.text.secondary}
                        />
                        <ActionText>{comment.likes}</ActionText>
                    </ActionButton>

                    {comment.replies > 0 && (
                        <ActionButton disabled>
                            <Ionicons
                                name="chatbubble-outline"
                                size={16}
                                color={theme.colors.text.secondary}
                            />
                            <ActionText>{comment.replies}</ActionText>
                        </ActionButton>
                    )}
                </CommentActions>
            </CommentContainer>
        );
    };

    return (
        <Container>
            <Header>
                <BackButton onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </BackButton>
                <HeaderTitle>Comentários ({comments.length})</HeaderTitle>
            </Header>

            <CommentsList ref={scrollViewRef}>
                {sortedComments.length === 0 ? (
                    <EmptyState>
                        <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.text.secondary} />
                        <EmptyText>Nenhum comentário ainda.{"\n"}Seja o primeiro a comentar!</EmptyText>
                    </EmptyState>
                ) : (
                    sortedComments.map(renderComment)
                )}
            </CommentsList>

            <InputContainer behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Input
                    placeholder="Escreva um comentário..."
                    placeholderTextColor={theme.colors.text.secondary}
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <SendButton disabled={!inputText.trim()} onPress={handleSendComment}>
                    <Ionicons name="send" size={20} color={theme.colors.surface} />
                </SendButton>
            </InputContainer>
        </Container>
    );
}
