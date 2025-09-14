// stores/postsStore.ts - VERSÃO COMPLETA COM IMAGENS
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {} from "../types/index";
import { mockPosts } from "../services/mockData";

interface PostsState {
    posts: Post[];
    likedPosts: Set<string>;
    savedPosts: Set<string>;
    loading: boolean;
    error: string | null;

    // Actions
    loadPosts: () => Promise<void>;
    refreshPosts: () => Promise<void>;
    toggleLike: (postId: string) => Promise<void>;
    toggleSave: (postId: string) => Promise<void>;
    addPost: (post: Post) => Promise<void>;

    // Helper methods
    isPostLiked: (postId: string) => boolean;
    isPostSaved: (postId: string) => boolean;
    getPostWithStats: (post: Post) => Post;
}

export const usePostsStore = create<PostsState>((set, get) => ({
    posts: [],
    likedPosts: new Set(),
    savedPosts: new Set(),
    loading: false,
    error: null,

    loadPosts: async () => {
        try {
            set({ loading: true, error: null });

            // Load from AsyncStorage
            const [storedPosts, storedLikes, storedSaved] = await Promise.all([
                AsyncStorage.getItem("tagged_posts"),
                AsyncStorage.getItem("tagged_liked_posts"),
                AsyncStorage.getItem("tagged_saved_posts"),
            ]);

            const posts = storedPosts ? JSON.parse(storedPosts) : mockPosts;
            const likedPosts = storedLikes
                ? new Set(JSON.parse(storedLikes))
                : new Set();
            const savedPosts = storedSaved
                ? new Set(JSON.parse(storedSaved))
                : new Set();

            // If no stored posts, save mock data
            if (!storedPosts) {
                await AsyncStorage.setItem(
                    "tagged_posts",
                    JSON.stringify(mockPosts)
                );
            }

            // Update posts with current like/save status
            const postsWithStatus = posts.map((post: Post) => ({
                ...post,
                isLiked: likedPosts.has(post.id),
                isSaved: savedPosts.has(post.id),
            }));

            set({
                posts: postsWithStatus,
                likedPosts,
                savedPosts,
                loading: false,
            });
        } catch (error) {
            console.error("Error loading posts:", error);
            set({
                error: "Erro ao carregar posts",
                loading: false,
            });
        }
    },

    refreshPosts: async () => {
        // Simulate refresh delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        await get().loadPosts();
    },

    toggleLike: async (postId: string) => {
        const { likedPosts, posts } = get();
        const newLikedPosts = new Set(likedPosts);

        if (newLikedPosts.has(postId)) {
            newLikedPosts.delete(postId);
        } else {
            newLikedPosts.add(postId);
        }

        // Update posts with new like status and stats
        const updatedPosts = posts.map((post) =>
            post.id === postId
                ? {
                      ...post,
                      isLiked: newLikedPosts.has(postId),
                      stats: {
                          ...post.stats,
                          likes: newLikedPosts.has(postId)
                              ? post.stats.likes + 1
                              : post.stats.likes - 1,
                      },
                  }
                : post
        );

        set({
            likedPosts: newLikedPosts,
            posts: updatedPosts,
        });

        // Persist to AsyncStorage
        try {
            await AsyncStorage.setItem(
                "tagged_liked_posts",
                JSON.stringify([...newLikedPosts])
            );
        } catch (error) {
            console.error("Error saving liked posts:", error);
        }
    },

    toggleSave: async (postId: string) => {
        const { savedPosts, posts } = get();
        const newSavedPosts = new Set(savedPosts);

        if (newSavedPosts.has(postId)) {
            newSavedPosts.delete(postId);
        } else {
            newSavedPosts.add(postId);
        }

        // Update posts with new save status
        const updatedPosts = posts.map((post) =>
            post.id === postId
                ? { ...post, isSaved: newSavedPosts.has(postId) }
                : post
        );

        set({
            savedPosts: newSavedPosts,
            posts: updatedPosts,
        });

        // Persist to AsyncStorage
        try {
            await AsyncStorage.setItem(
                "tagged_saved_posts",
                JSON.stringify([...newSavedPosts])
            );
        } catch (error) {
            console.error("Error saving saved posts:", error);
        }
    },

    addPost: async (post: Post) => {
        const { posts } = get();
        const newPost = {
            ...post,
            id: post.id || Date.now().toString(),
            createdAt: post.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isLiked: false,
            isSaved: false,
            stats: {
                likes: 0,
                shares: 0,
                comments: 0,
                supports: 0,
                ...post.stats,
            },
        };

        const newPosts = [newPost, ...posts];
        set({ posts: newPosts });

        // Persist to AsyncStorage
        try {
            await AsyncStorage.setItem(
                "tagged_posts",
                JSON.stringify(newPosts)
            );
        } catch (error) {
            console.error("Error saving new post:", error);
        }
    },

    // Helper methods
    isPostLiked: (postId: string) => {
        return get().likedPosts.has(postId);
    },

    isPostSaved: (postId: string) => {
        return get().savedPosts.has(postId);
    },

    getPostWithStats: (post: Post) => {
        const { likedPosts, savedPosts } = get();
        return {
            ...post,
            isLiked: likedPosts.has(post.id),
            isSaved: savedPosts.has(post.id),
        };
    },
}));

// types/index.ts - TIPOS COMPLETOS COM IMAGENS
export interface PostMedia {
    type: "image" | "video" | "audio";
    url: string;
    thumbnail?: string;
    width?: number;
    height?: number;
    caption?: string;
    duration?: number; // Para vídeos/áudios em segundos
}

export interface PostAuthor {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
}

export interface PostLocation {
    city: string;
    state: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface PostStats {
    likes: number;
    shares: number;
    comments: number;
    supports: number;
}

export type PostCategory =
    | "corruption"
    | "police_violence"
    | "discrimination"
    | "environment"
    | "health"
    | "education"
    | "transport"
    | "other";

export type PostStatus = "active" | "investigating" | "resolved" | "archived";

export interface Post {
    id: string;
    title: string;
    content: string;
    category: PostCategory;
    status: PostStatus;
    author: PostAuthor;
    location: PostLocation;
    stats: PostStats;
    media: PostMedia[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
    isLiked: boolean;
    isSaved: boolean;
}
