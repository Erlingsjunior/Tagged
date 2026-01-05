import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Post, Signature } from "../types/index";
import { mockPosts } from "../services/mockData";

interface PostsState {
    posts: Post[];
    signatures: Map<string, Signature[]>; // postId -> array of signatures
    savedPosts: Set<string>;
    loading: boolean;
    error: string | null;

    // Actions
    loadPosts: () => Promise<void>;
    refreshPosts: () => Promise<void>;
    toggleSignature: (postId: string, userId: string, userName: string, userAvatar?: string) => Promise<void>;
    toggleSave: (postId: string) => Promise<void>;
    addPost: (post: Post, authorId: string, isAnonymous: boolean) => Promise<void>;

    // Helper methods
    hasUserSigned: (postId: string, userId: string) => boolean;
    isPostSaved: (postId: string) => boolean;
    getSignatures: (postId: string) => Signature[];
    getPostsByImpact: () => Post[];
}

const STORAGE_KEYS = {
    POSTS: "tagged_posts",
    SIGNATURES: "tagged_signatures",
    SAVED: "tagged_saved_posts",
    ANONYMOUS_OWNERSHIP: "tagged_anonymous_ownership",
};

export const usePostsStore = create<PostsState>((set, get) => ({
    posts: [],
    signatures: new Map(),
    savedPosts: new Set(),
    loading: false,
    error: null,

    loadPosts: async () => {
        try {
            set({ loading: true, error: null });

            const [storedPosts, storedSignatures, storedSaved] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.POSTS),
                AsyncStorage.getItem(STORAGE_KEYS.SIGNATURES),
                AsyncStorage.getItem(STORAGE_KEYS.SAVED),
            ]);

            let posts = storedPosts ? JSON.parse(storedPosts) : mockPosts;
            const signaturesData: Record<string, Signature[]> = storedSignatures ? JSON.parse(storedSignatures) : {};
            const signatures = new Map<string, Signature[]>(Object.entries(signaturesData));
            const savedPosts = storedSaved ? new Set<string>(JSON.parse(storedSaved)) : new Set<string>();

            // Check if stored posts have required fields, if not reload with mockPosts
            if (storedPosts) {
                const firstPost = posts[0];
                if (!firstPost || !firstPost.milestones || !firstPost.evidenceFiles || !firstPost.updates) {
                    console.log("⚠️ Stored posts missing required fields, reloading with fresh mock data...");
                    posts = mockPosts;
                    await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(mockPosts));
                }
            }

            // Save mock data if first time
            if (!storedPosts) {
                await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(mockPosts));
            }

            // Update posts with current signature count
            const postsWithStats = posts.map((post: Post) => {
                const postSigs = signatures.get(post.id);
                return {
                    ...post,
                    stats: {
                        ...post.stats,
                        supports: postSigs ? postSigs.length : post.stats.supports,
                    },
                };
            });

            set({
                posts: postsWithStats,
                signatures,
                savedPosts,
                loading: false,
            });
        } catch (error) {
            console.error("Error loading posts:", error);
            set({ error: "Erro ao carregar posts", loading: false });
        }
    },

    refreshPosts: async () => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        await get().loadPosts();
    },

    toggleSignature: async (postId: string, userId: string, userName: string, userAvatar?: string) => {
        const { signatures, posts } = get();
        const postSignatures = signatures.get(postId) || [];

        // Check if user already signed
        const existingIndex = postSignatures.findIndex((sig) => sig.userId === userId);

        let newSignatures: Signature[];
        if (existingIndex >= 0) {
            // Remove signature
            newSignatures = postSignatures.filter((sig) => sig.userId !== userId);
        } else {
            // Add signature
            const newSignature: Signature = {
                userId,
                userName,
                userAvatar,
                signedAt: new Date().toISOString(),
            };
            newSignatures = [...postSignatures, newSignature];
        }

        const updatedSignaturesMap = new Map(signatures);
        updatedSignaturesMap.set(postId, newSignatures);

        // Update posts stats
        const updatedPosts = posts.map((post) =>
            post.id === postId
                ? {
                      ...post,
                      stats: {
                          ...post.stats,
                          supports: newSignatures.length,
                      },
                  }
                : post
        );

        set({
            signatures: updatedSignaturesMap,
            posts: updatedPosts,
        });

        // Persist to AsyncStorage
        try {
            const signaturesObj = Object.fromEntries(updatedSignaturesMap);
            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEYS.SIGNATURES, JSON.stringify(signaturesObj)),
                AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts)),
            ]);
        } catch (error) {
            console.error("Error saving signatures:", error);
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

        const updatedPosts = posts.map((post) =>
            post.id === postId ? { ...post, isSaved: newSavedPosts.has(postId) } : post
        );

        set({
            savedPosts: newSavedPosts,
            posts: updatedPosts,
        });

        try {
            await AsyncStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify([...newSavedPosts]));
        } catch (error) {
            console.error("Error saving saved posts:", error);
        }
    },

    addPost: async (post: Post, authorId: string, isAnonymous: boolean) => {
        const { posts } = get();

        const newPost: Post = {
            ...post,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isLiked: false,
            isSaved: false,
            stats: {
                likes: 0,
                shares: 0,
                comments: 0,
                supports: 0,
            },
        };

        const newPosts = [newPost, ...posts];
        set({ posts: newPosts });

        try {
            await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts));

            // If anonymous, store the real author relationship privately
            if (isAnonymous) {
                const ownershipJson = await AsyncStorage.getItem(STORAGE_KEYS.ANONYMOUS_OWNERSHIP);
                const ownership = ownershipJson ? JSON.parse(ownershipJson) : {};
                ownership[newPost.id] = authorId;
                await AsyncStorage.setItem(
                    STORAGE_KEYS.ANONYMOUS_OWNERSHIP,
                    JSON.stringify(ownership)
                );
            }
        } catch (error) {
            console.error("Error saving new post:", error);
        }
    },

    // Helper methods
    hasUserSigned: (postId: string, userId: string) => {
        const signatures = get().signatures.get(postId) || [];
        return signatures.some((sig) => sig.userId === userId);
    },

    isPostSaved: (postId: string) => {
        return get().savedPosts.has(postId);
    },

    getSignatures: (postId: string) => {
        return get().signatures.get(postId) || [];
    },

    getPostsByImpact: () => {
        const { posts } = get();
        return [...posts].sort((a, b) => {
            const impactA = a.stats.supports * 3 + a.stats.shares * 2 + a.stats.comments;
            const impactB = b.stats.supports * 3 + b.stats.shares * 2 + b.stats.comments;
            return impactB - impactA;
        });
    },
}));
