import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { theme } from "../../constants/Theme";
import { useAuthStore } from "../../stores/authStore";
import { usePostsStore } from "../../stores/postsStore";
import { Post } from "../../types";
import { PostCard } from "../../components/UI/PostCard/postCard";

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

const ExploreButton = styled(TouchableOpacity)`
    background-color: ${theme.colors.primary};
    padding: ${theme.spacing.md}px ${theme.spacing.lg}px;
    border-radius: ${theme.borderRadius.md}px;
    margin-top: ${theme.spacing.lg}px;
    flex-direction: row;
    align-items: center;
    gap: ${theme.spacing.sm}px;
`;

const ExploreButtonText = styled(Text)`
    color: ${theme.colors.surface};
    font-size: 16px;
    font-weight: 600;
`;

export default function SavedPostsScreen() {
    const router = useRouter();
    const { user } = useAuthStore();
    const { getSavedPosts, toggleSignature, toggleSave } = usePostsStore();
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadSavedPosts = () => {
        try {
            const posts = getSavedPosts();
            setSavedPosts(posts);
        } catch (error) {
            console.error("Error loading saved posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSavedPosts();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        loadSavedPosts();
        setRefreshing(false);
    };

    const handleLike = async (postId: string) => {
        if (!user) return;
        await toggleSignature(postId, user.id, user.name, user.avatar);
        loadSavedPosts();
    };

    const handleSave = async (postId: string) => {
        await toggleSave(postId);
        loadSavedPosts();
    };

    const handleComment = (postId: string) => {
        router.push(`/postDetails/${postId}`);
    };

    const handleShare = (post: Post) => {
        console.log("Share post:", post.id);
    };

    const handlePostPress = (postId: string) => {
        router.push(`/postDetails/${postId}`);
    };

    if (!user) {
        return null;
    }

    return (
        <Container>
            <Header>
                <BackButton onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </BackButton>
                <HeaderTitle>Denúncias Salvas</HeaderTitle>
            </Header>

            {loading ? (
                <EmptyState>
                    <Ionicons name="hourglass-outline" size={64} color={theme.colors.text.secondary} />
                    <EmptyText>Carregando...</EmptyText>
                </EmptyState>
            ) : savedPosts.length === 0 ? (
                <EmptyState>
                    <Ionicons name="bookmark-outline" size={64} color={theme.colors.text.secondary} />
                    <EmptyText>
                        Você ainda não salvou nenhuma denúncia.{"\n"}Salve para acessar rapidamente depois!
                    </EmptyText>
                    <ExploreButton onPress={() => router.push("/(tabs)/feed")}>
                        <Ionicons name="compass-outline" size={20} color={theme.colors.surface} />
                        <ExploreButtonText>Explorar Feed</ExploreButtonText>
                    </ExploreButton>
                </EmptyState>
            ) : (
                <FlatList
                    data={savedPosts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <PostCard
                            post={item}
                            onPress={() => handlePostPress(item.id)}
                            onLike={() => handleLike(item.id)}
                            onComment={() => handleComment(item.id)}
                            onShare={() => handleShare(item)}
                            onSave={() => handleSave(item.id)}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={[theme.colors.primary]}
                        />
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </Container>
    );
}
