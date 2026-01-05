import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface CommentReply {
    id: string;
    commentId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: Date;
    likes: number;
    likedBy: string[];
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    content: string;
    createdAt: Date;
    likes: number;
    likedBy: string[];
    replies: CommentReply[];
    replyCount: number;
}

interface CommentState {
    comments: Record<string, Comment[]>; // postId -> comments

    // Actions
    getComments: (postId: string) => Comment[];
    addComment: (postId: string, content: string, userId: string, userName: string, userAvatar?: string) => void;
    addReply: (postId: string, commentId: string, content: string, userId: string, userName: string, userAvatar?: string) => void;
    toggleLike: (postId: string, commentId: string, userId: string, isReply?: boolean, replyId?: string) => void;
    deleteComment: (postId: string, commentId: string) => void;
    deleteReply: (postId: string, commentId: string, replyId: string) => void;
}

export const useCommentStore = create<CommentState>()(
    persist(
        (set, get) => ({
            comments: {},

            getComments: (postId: string) => {
                return get().comments[postId] || [];
            },

            addComment: (postId: string, content: string, userId: string, userName: string, userAvatar?: string) => {
                const newComment: Comment = {
                    id: `comment-${Date.now()}`,
                    postId,
                    userId,
                    userName,
                    userAvatar,
                    content,
                    createdAt: new Date(),
                    likes: 0,
                    likedBy: [],
                    replies: [],
                    replyCount: 0,
                };

                set((state) => ({
                    comments: {
                        ...state.comments,
                        [postId]: [...(state.comments[postId] || []), newComment],
                    },
                }));
            },

            addReply: (postId: string, commentId: string, content: string, userId: string, userName: string, userAvatar?: string) => {
                const newReply: CommentReply = {
                    id: `reply-${Date.now()}`,
                    commentId,
                    userId,
                    userName,
                    userAvatar,
                    content,
                    createdAt: new Date(),
                    likes: 0,
                    likedBy: [],
                };

                set((state) => ({
                    comments: {
                        ...state.comments,
                        [postId]: (state.comments[postId] || []).map((comment) =>
                            comment.id === commentId
                                ? {
                                      ...comment,
                                      replies: [...comment.replies, newReply],
                                      replyCount: comment.replyCount + 1,
                                  }
                                : comment
                        ),
                    },
                }));
            },

            toggleLike: (postId: string, commentId: string, userId: string, isReply = false, replyId?: string) => {
                set((state) => ({
                    comments: {
                        ...state.comments,
                        [postId]: (state.comments[postId] || []).map((comment) => {
                            if (comment.id === commentId) {
                                if (isReply && replyId) {
                                    // Toggle like on reply
                                    return {
                                        ...comment,
                                        replies: comment.replies.map((reply) => {
                                            if (reply.id === replyId) {
                                                const hasLiked = reply.likedBy.includes(userId);
                                                return {
                                                    ...reply,
                                                    likes: hasLiked ? reply.likes - 1 : reply.likes + 1,
                                                    likedBy: hasLiked
                                                        ? reply.likedBy.filter((id) => id !== userId)
                                                        : [...reply.likedBy, userId],
                                                };
                                            }
                                            return reply;
                                        }),
                                    };
                                } else {
                                    // Toggle like on comment
                                    const hasLiked = comment.likedBy.includes(userId);
                                    return {
                                        ...comment,
                                        likes: hasLiked ? comment.likes - 1 : comment.likes + 1,
                                        likedBy: hasLiked
                                            ? comment.likedBy.filter((id) => id !== userId)
                                            : [...comment.likedBy, userId],
                                    };
                                }
                            }
                            return comment;
                        }),
                    },
                }));
            },

            deleteComment: (postId: string, commentId: string) => {
                set((state) => ({
                    comments: {
                        ...state.comments,
                        [postId]: (state.comments[postId] || []).filter((comment) => comment.id !== commentId),
                    },
                }));
            },

            deleteReply: (postId: string, commentId: string, replyId: string) => {
                set((state) => ({
                    comments: {
                        ...state.comments,
                        [postId]: (state.comments[postId] || []).map((comment) =>
                            comment.id === commentId
                                ? {
                                      ...comment,
                                      replies: comment.replies.filter((reply) => reply.id !== replyId),
                                      replyCount: comment.replyCount - 1,
                                  }
                                : comment
                        ),
                    },
                }));
            },
        }),
        {
            name: "comment-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
