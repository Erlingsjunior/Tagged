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
import { useCommentStore, Comment, CommentReply } from "../../stores/commentStore";
import { Avatar } from "../../components/UI/Avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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

const RepliesContainer = styled(View)`
    margin-left: 50px;
    border-left-width: 2px;
    border-left-color: ${theme.colors.border};
    padding-left: ${theme.spacing.md}px;
`;

const ReplyContainer = styled(View)`
    padding-top: ${theme.spacing.md}px;
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
    const { getComments, addComment, addReply, toggleLike, deleteComment, deleteReply } = useCommentStore();

    const [comments, setComments] = useState<Comment[]>([]);
    const [inputText, setInputText] = useState("");
    const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        loadComments();
    }, [postId]);

    const loadComments = () => {
        const postComments = getComments(postId);
        setComments(postComments);
    };

    const handleSendComment = () => {
        if (!inputText.trim() || !user) return;

        if (replyingTo) {
            addReply(postId, replyingTo.id, inputText.trim(), user.id, user.name, user.avatar);
        } else {
            addComment(postId, inputText.trim(), user.id, user.name, user.avatar);
        }

        setInputText("");
        setReplyingTo(null);
        loadComments();

        // Scroll to bottom
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleLike = (comment: Comment, isReply = false, reply?: CommentReply) => {
        if (!user) return;

        if (isReply && reply) {
            toggleLike(postId, comment.id, user.id, true, reply.id);
        } else {
            toggleLike(postId, comment.id, user.id, false);
        }

        loadComments();
    };

    const handleReply = (comment: Comment) => {
        setReplyingTo(comment);
    };

    const handleDelete = (comment: Comment, reply?: CommentReply) => {
        Alert.alert(
            "Excluir Comentário",
            "Tem certeza que deseja excluir este comentário?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => {
                        if (reply) {
                            deleteReply(postId, comment.id, reply.id);
                        } else {
                            deleteComment(postId, comment.id);
                        }
                        loadComments();
                    },
                },
            ]
        );
    };

    const renderReply = (comment: Comment, reply: CommentReply) => {
        const isLiked = user ? reply.likedBy.includes(user.id) : false;
        const isOwner = user?.id === reply.userId;

        return (
            <ReplyContainer key={reply.id}>
                <CommentHeader>
                    <Avatar name={reply.userName} avatar={reply.userAvatar} size="medium" />
                    <CommentInfo>
                        <UserName>{reply.userName}</UserName>
                        <TimeText>{formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale: ptBR })}</TimeText>
                    </CommentInfo>
                    {isOwner && (
                        <TouchableOpacity onPress={() => handleDelete(comment, reply)}>
                            <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                        </TouchableOpacity>
                    )}
                </CommentHeader>

                <CommentContent>{reply.content}</CommentContent>

                <CommentActions>
                    <ActionButton onPress={() => handleLike(comment, true, reply)}>
                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={16}
                            color={isLiked ? theme.colors.error : theme.colors.text.secondary}
                        />
                        <ActionText active={isLiked}>{reply.likes}</ActionText>
                    </ActionButton>
                </CommentActions>
            </ReplyContainer>
        );
    };

    const renderComment = (comment: Comment) => {
        const isLiked = user ? comment.likedBy.includes(user.id) : false;
        const isOwner = user?.id === comment.userId;

        return (
            <CommentContainer key={comment.id}>
                <CommentHeader>
                    <Avatar name={comment.userName} avatar={comment.userAvatar} size="medium" />
                    <CommentInfo>
                        <UserName>{comment.userName}</UserName>
                        <TimeText>
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ptBR })}
                        </TimeText>
                    </CommentInfo>
                    {isOwner && (
                        <TouchableOpacity onPress={() => handleDelete(comment)}>
                            <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                        </TouchableOpacity>
                    )}
                </CommentHeader>

                <CommentContent>{comment.content}</CommentContent>

                <CommentActions>
                    <ActionButton onPress={() => handleLike(comment)}>
                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={16}
                            color={isLiked ? theme.colors.error : theme.colors.text.secondary}
                        />
                        <ActionText active={isLiked}>{comment.likes}</ActionText>
                    </ActionButton>

                    <ActionButton onPress={() => handleReply(comment)}>
                        <Ionicons name="arrow-undo-outline" size={16} color={theme.colors.text.secondary} />
                        <ActionText>Responder</ActionText>
                    </ActionButton>
                </CommentActions>

                {comment.replies.length > 0 && (
                    <RepliesContainer>{comment.replies.map((reply) => renderReply(comment, reply))}</RepliesContainer>
                )}
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
                {comments.length === 0 ? (
                    <EmptyState>
                        <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.text.secondary} />
                        <EmptyText>Nenhum comentário ainda.{"\n"}Seja o primeiro a comentar!</EmptyText>
                    </EmptyState>
                ) : (
                    comments.map(renderComment)
                )}
            </CommentsList>

            <InputContainer behavior={Platform.OS === "ios" ? "padding" : "height"}>
                {replyingTo && (
                    <View style={{ position: "absolute", top: -40, left: 16, right: 16, backgroundColor: theme.colors.background, padding: 8, borderRadius: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={{ color: theme.colors.text.secondary, fontSize: 12 }}>
                            Respondendo @{replyingTo.userName}
                        </Text>
                        <TouchableOpacity onPress={() => setReplyingTo(null)}>
                            <Ionicons name="close" size={20} color={theme.colors.text.secondary} />
                        </TouchableOpacity>
                    </View>
                )}
                <Input
                    placeholder={replyingTo ? `Responder @${replyingTo.userName}...` : "Escreva um comentário..."}
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
