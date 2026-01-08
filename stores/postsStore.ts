import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { faker } from "@faker-js/faker/locale/pt_BR";
import { Post, Signature } from "../types/index";
import { mockPosts, generateMockUsers, generateMockSignatures } from "../services/mockData";

interface PostsState {
    posts: Post[];
    signatures: Map<string, Signature[]>; // postId -> array of signatures
    baseSupports: Map<string, number>; // postId -> initial supports from mock
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
    updatePostMilestones: (post: Post) => Post; // Nova função para recalcular milestones
    getMyPosts: (userId: string) => Promise<Post[]>; // Minhas denúncias
    getSignedPosts: (userId: string) => Post[]; // Petições assinadas
    getSavedPosts: () => Post[]; // Denúncias salvas
}

const STORAGE_KEYS = {
    POSTS: "tagged_posts",
    SIGNATURES: "tagged_signatures",
    SAVED: "tagged_saved_posts",
    ANONYMOUS_OWNERSHIP: "tagged_anonymous_ownership",
    BASE_SUPPORTS: "tagged_base_supports",
};

// Achievement tiers definition (mesmos do mockData)
const ACHIEVEMENT_TIERS = [
    { target: 100, label: "100", badgeName: "Primeira Voz", description: "Primeiras 100 pessoas se manifestaram", icon: "megaphone", color: "#10B981" },
    { target: 500, label: "500", badgeName: "Ecos da Comunidade", description: "A comunidade começou a ouvir", icon: "people", color: "#3B82F6" },
    { target: 1000, label: "1K", badgeName: "Causa em Alta", description: "1 mil vozes unidas pela justiça", icon: "trending-up", color: "#8B5CF6" },
    { target: 5000, label: "5K", badgeName: "Denunciador Profissional", description: "Impacto significativo na região", icon: "shield-checkmark", color: "#EC4899" },
    { target: 10000, label: "10K", badgeName: "Voz da Cidade", description: "Toda a cidade está atenta", icon: "business", color: "#F59E0B" },
    { target: 50000, label: "50K", badgeName: "Movimento Regional", description: "Mobilização em todo o estado", icon: "flame", color: "#EF4444" },
    { target: 100000, label: "100K", badgeName: "Impacto Nacional", description: "O país inteiro está discutindo", icon: "flag", color: "#DC2626" },
    { target: 500000, label: "500K", badgeName: "Engajando pela Paz", description: "Meio milhão por um futuro melhor", icon: "heart", color: "#DB2777" },
    { target: 1000000, label: "1M", badgeName: "Mudando o Mundo", description: "1 milhão de pessoas querem mudança", icon: "globe", color: "#7C3AED" },
    { target: 5000000, label: "5M", badgeName: "Revolução Social", description: "Transformação em escala massiva", icon: "flash", color: "#2563EB" },
    { target: 10000000, label: "10M", badgeName: "Fenômeno Viral", description: "Impossível de ser ignorado", icon: "rocket", color: "#0891B2" },
    { target: 25000000, label: "25M", badgeName: "Clamor Popular", description: "A voz do povo não se cala", icon: "thunderstorm", color: "#059669" },
    { target: 50000000, label: "50M+", badgeName: "Engajamento Mundial", description: "O mundo inteiro se uniu por essa causa", icon: "earth", color: "#D97706" },
];

export const usePostsStore = create<PostsState>((set, get) => ({
    posts: [],
    signatures: new Map(),
    baseSupports: new Map(),
    savedPosts: new Set(),
    loading: false,
    error: null,

    updatePostMilestones: (post: Post): Post => {
        const currentSupports = post.stats.supports;

        // Recalcular milestones baseado no supports ATUAL
        const updatedMilestones = ACHIEVEMENT_TIERS.map((tier, index) => ({
            id: `milestone_${post.id}_${index}`,
            target: tier.target,
            label: tier.label,
            badgeName: tier.badgeName,
            badgeDescription: tier.description,
            achieved: currentSupports >= tier.target,
            achievedAt: currentSupports >= tier.target ? new Date().toISOString() : undefined,
            icon: tier.icon,
            color: currentSupports >= tier.target ? tier.color : "#94A3B8",
        }));

        // Recalcular chatUnlocked baseado no supports ATUAL (>= 1000)
        const chatUnlocked = currentSupports >= 1000;

        return {
            ...post,
            milestones: updatedMilestones,
            chatUnlocked, // Atualizar dinamicamente
        };
    },

    loadPosts: async () => {
        try {
            set({ loading: true, error: null });

            // MIGRATION: Check if we need to clear old data
            const migrationKey = "tagged_migration_v5";
            const migrationDone = await AsyncStorage.getItem(migrationKey);

            if (!migrationDone) {
                console.log("🔄 Running migration v5: clearing old data and regenerating mock signatures...");
                await AsyncStorage.multiRemove([
                    STORAGE_KEYS.POSTS,
                    STORAGE_KEYS.SIGNATURES,
                    STORAGE_KEYS.SAVED,
                    STORAGE_KEYS.BASE_SUPPORTS,
                    "tagged_users_db",
                    "tagged_migration_v2",
                    "tagged_migration_v3",
                    "tagged_migration_v4",
                ]);
                await AsyncStorage.setItem(migrationKey, "done");
                console.log("✅ Migration v5 completed!");
            }

            const [storedPosts, storedSignatures, storedSaved, storedBaseSupports] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.POSTS),
                AsyncStorage.getItem(STORAGE_KEYS.SIGNATURES),
                AsyncStorage.getItem(STORAGE_KEYS.SAVED),
                AsyncStorage.getItem(STORAGE_KEYS.BASE_SUPPORTS),
            ]);

            // Se não há posts armazenados, usar mockPosts apenas se for primeira vez
            // Se já tem posts salvos, manter apenas eles
            let posts = storedPosts ? JSON.parse(storedPosts) : [];

            // Inicializar signaturesData primeiro
            let signaturesData: Record<string, Signature[]> = storedSignatures ? JSON.parse(storedSignatures) : {};

            // Se não há nenhum post (primeira inicialização), carregar mockPosts
            if (posts.length === 0 && !storedPosts) {
                posts = mockPosts;

                // Gerar e salvar usuários mockados
                const USERS_DB_KEY = 'tagged_users_db';
                const usersDbJson = await AsyncStorage.getItem(USERS_DB_KEY);
                let existingUsersDb = usersDbJson ? JSON.parse(usersDbJson) : {};

                // Gerar usuários apenas se ainda não existem
                if (Object.keys(existingUsersDb).length === 0) {
                    const mockUsers = generateMockUsers();
                    await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(mockUsers));
                    existingUsersDb = mockUsers; // Atualizar para usar na geração de assinaturas
                    console.log('✅ Mock users created and saved!');
                }

                // Gerar assinaturas mockadas para posts com alto número de supports
                if (!storedSignatures) {
                    const allUsersArray = Object.values(existingUsersDb);
                    let tempUsersCreated = 0;

                    posts.forEach((post: Post) => {
                        if (post.stats.supports > 1000) {
                            const mockSigs = generateMockSignatures(post.id, post.stats.supports, allUsersArray);
                            const signaturesForPost = mockSigs.map(sig => {
                                // Se o usuário da assinatura não existe no usersDb, criar
                                if (sig.userId.startsWith('temp_user_')) {
                                    const tempEmail = `temp_${tempUsersCreated}@tagged.com`;
                                    existingUsersDb[tempEmail] = {
                                        id: sig.userId,
                                        email: tempEmail,
                                        name: sig.userName,
                                        cpf: faker.string.numeric(11),
                                        role: 'user',
                                        verified: false,
                                        createdAt: new Date().toISOString(),
                                        stats: {
                                            reportsCreated: 0,
                                            reportsSigned: 1,
                                            impactScore: 2,
                                        },
                                        following: [],
                                        followers: [],
                                        password: 'password123',
                                    };
                                    tempUsersCreated++;
                                }

                                return {
                                    userId: sig.userId,
                                    userName: sig.userName,
                                    signedAt: sig.signedAt,
                                };
                            });
                            signaturesData[post.id] = signaturesForPost as any;
                        }
                    });

                    // Salvar usuários temporários criados
                    if (tempUsersCreated > 0) {
                        await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(existingUsersDb));
                        console.log(`✅ ${tempUsersCreated} temporary users created for signatures!`);
                    }

                    // Salvar assinaturas mockadas
                    if (Object.keys(signaturesData).length > 0) {
                        await AsyncStorage.setItem(STORAGE_KEYS.SIGNATURES, JSON.stringify(signaturesData));
                        console.log('✅ Mock signatures created and saved!');
                    }
                }
            }
            const signatures = new Map<string, Signature[]>(Object.entries(signaturesData));
            const savedPosts = storedSaved ? new Set<string>(JSON.parse(storedSaved)) : new Set<string>();

            // Load or create baseSupports
            let baseSupportsData: Record<string, number> = storedBaseSupports ? JSON.parse(storedBaseSupports) : {};

            if (Object.keys(baseSupportsData).length === 0) {
                posts.forEach((post: Post) => {
                    baseSupportsData[post.id] = post.stats.supports;
                });
                await AsyncStorage.setItem(STORAGE_KEYS.BASE_SUPPORTS, JSON.stringify(baseSupportsData));
            }

            const baseSupports = new Map<string, number>(Object.entries(baseSupportsData));

            // Check if stored posts have required fields
            if (storedPosts) {
                const firstPost = posts[0];
                if (!firstPost || !firstPost.milestones || !firstPost.evidenceFiles || !firstPost.updates) {
                    console.log("⚠️ Stored posts missing required fields, reloading with fresh mock data...");
                    posts = mockPosts;

                    // Reset baseSupports
                    baseSupportsData = {};
                    posts.forEach((post: Post) => {
                        baseSupportsData[post.id] = post.stats.supports;
                    });
                    await AsyncStorage.setItem(STORAGE_KEYS.BASE_SUPPORTS, JSON.stringify(baseSupportsData));
                    baseSupports.clear();
                    Object.entries(baseSupportsData).forEach(([key, value]) => baseSupports.set(key, value));
                }
            }

            // Calculate current supports and update milestones dynamically
            const postsWithStats = posts.map((post: Post) => {
                const postSigs = signatures.get(post.id);
                const signaturesCount = postSigs ? postSigs.length : 0;
                const baseSupportsValue = baseSupports.get(post.id) || post.stats.supports;

                const postWithUpdatedStats = {
                    ...post,
                    stats: {
                        ...post.stats,
                        supports: baseSupportsValue + signaturesCount, // SOMA base + assinaturas
                    },
                };

                // Recalcular milestones baseado no supports atual
                return get().updatePostMilestones(postWithUpdatedStats);
            });

            // Save posts if first time
            if (!storedPosts) {
                await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(postsWithStats));
            }

            set({
                posts: postsWithStats,
                signatures,
                baseSupports,
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
        const { signatures, posts, baseSupports } = get();
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

        // Update posts stats - SOMA base + assinaturas reais
        const updatedPosts = posts.map((post) => {
            if (post.id === postId) {
                const baseSupportsValue = baseSupports.get(postId) || 0;
                const postWithUpdatedStats = {
                    ...post,
                    stats: {
                        ...post.stats,
                        supports: baseSupportsValue + newSignatures.length, // SOMA base + assinaturas
                    },
                };

                // Recalcular milestones dinamicamente
                return get().updatePostMilestones(postWithUpdatedStats);
            }
            return post;
        });

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
        const { posts, baseSupports } = get();

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

        // Add base supports for new post
        const updatedBaseSupports = new Map(baseSupports);
        updatedBaseSupports.set(newPost.id, 0);

        // Recalcular milestones para o novo post
        const newPostWithMilestones = get().updatePostMilestones(newPost);
        const newPosts = [newPostWithMilestones, ...posts];

        set({ posts: newPosts, baseSupports: updatedBaseSupports });

        try {
            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(newPosts)),
                AsyncStorage.setItem(STORAGE_KEYS.BASE_SUPPORTS, JSON.stringify(Object.fromEntries(updatedBaseSupports))),
            ]);

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

    // Retorna posts criados pelo usuário (incluindo anônimos)
    getMyPosts: async (userId: string): Promise<Post[]> => {
        const { posts } = get();

        // Carregar ownership de posts anônimos
        const ownershipJson = await AsyncStorage.getItem(STORAGE_KEYS.ANONYMOUS_OWNERSHIP);
        const ownership = ownershipJson ? JSON.parse(ownershipJson) : {};

        return posts.filter(post => {
            // Post criado com ID do usuário (não-anônimo)
            if (post.author.id === userId) {
                return true;
            }
            // Post anônimo que pertence ao usuário
            if (ownership[post.id] === userId) {
                return true;
            }
            return false;
        });
    },

    // Retorna posts que o usuário assinou
    getSignedPosts: (userId: string): Post[] => {
        const { posts, signatures } = get();

        return posts.filter(post => {
            const postSignatures = signatures.get(post.id) || [];
            return postSignatures.some(sig => sig.userId === userId);
        });
    },

    // Retorna posts salvos (favoritos)
    getSavedPosts: (): Post[] => {
        const { posts, savedPosts } = get();
        return posts.filter(post => savedPosts.has(post.id));
    },
}));
