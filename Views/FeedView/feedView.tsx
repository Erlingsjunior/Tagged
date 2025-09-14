import React, { useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PostCard } from "../../components/UI/PostCard";
import { usePostsStore } from "../../stores/postsStore";

import { theme } from "../../constants/Theme";

export const FeedView: React.FC = () => {
    const {
        posts,
        likedPosts,
        savedPosts,
        loading,
        loadPosts,
        toggleLike,
        toggleSave,
    } = usePostsStore();

    useEffect(() => {
        loadPosts();
    }, []);

    const handleComment = (postId: string) => {
        console.log("Comment on post:", postId);
    };

    const handleShare = (postId: string) => {
        console.log("Share post:", postId);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        onLike={toggleLike}
                        onSave={toggleSave}
                        onComment={handleComment}
                        onShare={handleShare}
                        isLiked={likedPosts.has(item.id)}
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
