import React, { useEffect } from "react";
import { FlatList, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PostCard } from "../../components/UI/PostCard";
import { usePostsStore } from "../../stores/postsStore";
import { useAuthStore } from "../../stores/authStore";
import { useChatStore } from "../../stores/chatStore";
import { Post } from "../../types";
import { theme } from "../../constants/Theme";

export const FeedView: React.FC = () => {
    const router = useRouter();
    const {
        posts,
        savedPosts,
        loading,
        loadPosts,
        toggleSignature,
        toggleSave,
        hasUserSigned,
    } = usePostsStore();

    const { user } = useAuthStore();
    const { getOrCreateConversation, canStartConversation } = useChatStore();

    useEffect(() => {
        loadPosts();
    }, []);

    const handleSignature = (postId: string) => {
        if (!user) return;
        toggleSignature(postId, user.id, user.name, user.avatar);
    };

    const handleComment = (postId: string) => {
        router.push(`/comments/${postId}`);
    };

    const handleShare = (postId: string) => {
        console.log("Share post:", postId);
    };

    const handlePostPress = (postId: string) => {
        router.push(`/postDetails/${postId}`);
    };

    const handleChat = (post: Post) => {
        if (!user) {
            Alert.alert("Login Necessário", "Você precisa estar logado para iniciar uma conversa.");
            return;
        }

        // Check if can start conversation
        if (post.isAnonymous) {
            Alert.alert(
                "Denúncia Anônima",
                "Não é possível conversar com denunciantes anônimos."
            );
            return;
        }

        // Check if author accepts messages (we'll assume true for now, can be extended)
        const acceptsMessages = true; // TODO: Add this field to Post type

        if (!canStartConversation(post.author.id, post.isAnonymous, acceptsMessages)) {
            Alert.alert(
                "Conversa Indisponível",
                "Este usuário não está aceitando mensagens no momento."
            );
            return;
        }

        // Create or get existing conversation
        const conversation = getOrCreateConversation(
            post.author.id,
            post.author.name,
            post.author.avatar,
            post.id
        );

        // Navigate to conversation
        router.push(`/chat/${conversation.id}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        onLike={handleSignature}
                        onSave={toggleSave}
                        onComment={handleComment}
                        onShare={handleShare}
                        onPress={handlePostPress}
                        onChat={handleChat}
                        isLiked={user ? hasUserSigned(item.id, user.id) : false}
                        isSaved={savedPosts.has(item.id)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={loadPosts}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    listContent: {
        padding: theme.spacing.md,
    },
});
