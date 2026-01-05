import React, { useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { PostCard } from "../../components/UI/PostCard";
import { usePostsStore } from "../../stores/postsStore";
import { useAuthStore } from "../../stores/authStore";
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

    useEffect(() => {
        loadPosts();
    }, []);

    const handleSignature = (postId: string) => {
        if (!user) return;
        toggleSignature(postId, user.id, user.name, user.avatar);
    };

    const handleComment = (postId: string) => {
        console.log("Comment on post:", postId);
    };

    const handleShare = (postId: string) => {
        console.log("Share post:", postId);
    };

    const handlePostPress = (postId: string) => {
        router.push(`/postDetails/${postId}`);
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
