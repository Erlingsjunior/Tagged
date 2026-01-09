import React, { useEffect, useState, useMemo } from "react";
import { FlatList, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PostCard } from "../../components/UI/PostCard";
import { SearchBar } from "../../components/UI/SearchBar";
import type { SearchFilters } from "../../components/UI/SearchBar";
import CompleteProfileModal from "../../components/CompleteProfileModal";
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
        refreshPosts,
        toggleSignature,
        toggleSave,
        hasUserSigned,
    } = usePostsStore();

    // Forçar re-render quando signatures mudar
    const signatures = usePostsStore((state) => state.signatures);

    const { user } = useAuthStore();
    const { getOrCreateConversation, canStartConversation } = useChatStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<SearchFilters>({
        sortBy: "relevance",
        location: "all",
        tags: [],
    });
    const [showCompleteProfile, setShowCompleteProfile] = useState(false);
    const [pendingPostId, setPendingPostId] = useState<string | null>(null);

    useEffect(() => {
        loadPosts();
    }, []);

    // Filter and sort posts based on search and filters
    const filteredPosts = useMemo(() => {
        let result = [...posts];

        // Filter by search query (title and content)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (post) =>
                    post.title.toLowerCase().includes(query) ||
                    post.content.toLowerCase().includes(query) ||
                    post.tags.some((tag) => tag.toLowerCase().includes(query))
            );
        }

        // Filter by tags
        if (filters.tags.length > 0) {
            result = result.filter((post) =>
                filters.tags.some((tag) => post.tags.includes(tag))
            );
        }

        // Filter by location (simulated - would need user location in real app)
        if (filters.location !== "all" && user) {
            // For now, this is a placeholder - would need real geolocation logic
            // result = result.filter((post) => matchesLocationFilter(post, filters.location, user));
        }

        // Sort
        switch (filters.sortBy) {
            case "recent":
                result.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
                break;
            case "popular":
                result.sort((a, b) => b.stats.supports - a.stats.supports);
                break;
            case "nearby":
                // Sortear por proximidade (simulado - em produção usaria geolocalização real)
                // Por enquanto, priorizamos denúncias da mesma cidade do usuário
                if (user) {
                    result.sort((a, b) => {
                        // Placeholder: Em produção, calcularia distância real
                        // Por enquanto, mantém a ordem original (pode ser expandido depois)
                        return 0;
                    });
                }
                break;
            case "relevance":
            default:
                // Score baseado em múltiplos fatores:
                // - Assinaturas (peso 3): indica engajamento massivo
                // - Compartilhamentos (peso 2): indica alcance viral
                // - Comentários (peso 1): indica discussão ativa
                result.sort((a, b) => {
                    const scoreA =
                        a.stats.supports * 3 +
                        a.stats.shares * 2 +
                        a.stats.comments;
                    const scoreB =
                        b.stats.supports * 3 +
                        b.stats.shares * 2 +
                        b.stats.comments;
                    return scoreB - scoreA;
                });
                break;
        }

        return result;
    }, [posts, searchQuery, filters, user]);

    const handleSearch = (query: string, newFilters: SearchFilters) => {
        setSearchQuery(query);
        setFilters(newFilters);
    };

    const handleSignature = async (postId: string) => {
        if (!user) return;

        // Verificar se perfil está completo
        if (!user.profileComplete) {
            setPendingPostId(postId);
            setShowCompleteProfile(true);
            return;
        }

        await toggleSignature(postId, user.id, user.name, user.avatar);
    };

    const handleProfileCompleted = async () => {
        setShowCompleteProfile(false);

        // Dar like no post pendente
        if (pendingPostId && user) {
            await toggleSignature(pendingPostId, user.id, user.name, user.avatar);
            setPendingPostId(null);
        }
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
            Alert.alert(
                "Login Necessário",
                "Você precisa estar logado para iniciar uma conversa."
            );
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
        const acceptsMessages = true;

        if (
            !canStartConversation(
                post.author.id,
                post.isAnonymous,
                acceptsMessages
            )
        ) {
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

    const handleAuthorPress = (authorId: string) => {
        router.push(`/user/${authorId}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <SearchBar
                onSearch={handleSearch}
                placeholder='Buscar denúncias, tags...'
            />
            <FlatList
                data={filteredPosts}
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
                        onAuthorPress={handleAuthorPress}
                        isLiked={user ? hasUserSigned(item.id, user.id) : false}
                        isSaved={savedPosts.has(item.id)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshing={loading}
                onRefresh={refreshPosts}
                removeClippedSubviews={false}
                windowSize={21}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={50}
                initialNumToRender={10}
            />

            <CompleteProfileModal
                visible={showCompleteProfile}
                onClose={() => {
                    setShowCompleteProfile(false);
                    setPendingPostId(null);
                }}
                onSuccess={handleProfileCompleted}
                message="Complete seu perfil para dar likes e apoiar denúncias!"
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
