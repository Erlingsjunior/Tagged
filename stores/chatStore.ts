import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    timestamp: Date;
    read: boolean;
}

export interface Conversation {
    id: string;
    postId?: string; // If conversation started from a post
    participantId: string;
    participantName: string;
    participantAvatar?: string;
    lastMessage?: Message;
    unreadCount: number;
    acceptsMessages: boolean; // Whether the other user accepts messages
    isAnonymous: boolean; // Whether the post was anonymous
    createdAt: Date;
    updatedAt: Date;
}

interface ChatState {
    conversations: Conversation[];
    messages: Record<string, Message[]>; // conversationId -> messages

    // Actions
    getConversations: () => Conversation[];
    getConversation: (conversationId: string) => Conversation | undefined;
    getOrCreateConversation: (
        participantId: string,
        participantName: string,
        participantAvatar?: string,
        postId?: string
    ) => Conversation;
    getMessages: (conversationId: string) => Message[];
    sendMessage: (
        conversationId: string,
        content: string,
        senderId: string,
        senderName: string,
        senderAvatar?: string
    ) => void;
    markAsRead: (conversationId: string) => void;
    getTotalUnreadCount: () => number;
    deleteConversation: (conversationId: string) => void;
    canStartConversation: (postAuthorId: string, isAnonymous: boolean, acceptsMessages: boolean) => boolean;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            messages: {},

            getConversations: () => {
                return get().conversations.sort((a, b) => {
                    const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                    const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                    return bTime - aTime;
                });
            },

            getConversation: (conversationId: string) => {
                return get().conversations.find((c) => c.id === conversationId);
            },

            getOrCreateConversation: (
                participantId: string,
                participantName: string,
                participantAvatar?: string,
                postId?: string
            ) => {
                const existing = get().conversations.find(
                    (c) => c.participantId === participantId && (!postId || c.postId === postId)
                );

                if (existing) {
                    return existing;
                }

                const newConversation: Conversation = {
                    id: `conv-${Date.now()}`,
                    postId,
                    participantId,
                    participantName,
                    participantAvatar,
                    unreadCount: 0,
                    acceptsMessages: true, // Assume true when creating
                    isAnonymous: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                set((state) => ({
                    conversations: [...state.conversations, newConversation],
                }));

                return newConversation;
            },

            getMessages: (conversationId: string) => {
                return get().messages[conversationId] || [];
            },

            sendMessage: (
                conversationId: string,
                content: string,
                senderId: string,
                senderName: string,
                senderAvatar?: string
            ) => {
                const newMessage: Message = {
                    id: `msg-${Date.now()}`,
                    conversationId,
                    senderId,
                    senderName,
                    senderAvatar,
                    content,
                    timestamp: new Date(),
                    read: false,
                };

                set((state) => {
                    // Add message
                    const updatedMessages = {
                        ...state.messages,
                        [conversationId]: [...(state.messages[conversationId] || []), newMessage],
                    };

                    // Update conversation
                    const updatedConversations = state.conversations.map((conv) =>
                        conv.id === conversationId
                            ? {
                                  ...conv,
                                  lastMessage: newMessage,
                                  updatedAt: new Date(),
                                  unreadCount: conv.participantId === senderId ? conv.unreadCount : conv.unreadCount + 1,
                              }
                            : conv
                    );

                    return {
                        messages: updatedMessages,
                        conversations: updatedConversations,
                    };
                });
            },

            markAsRead: (conversationId: string) => {
                set((state) => ({
                    conversations: state.conversations.map((conv) =>
                        conv.id === conversationId
                            ? {
                                  ...conv,
                                  unreadCount: 0,
                              }
                            : conv
                    ),
                    messages: {
                        ...state.messages,
                        [conversationId]: (state.messages[conversationId] || []).map((msg) => ({
                            ...msg,
                            read: true,
                        })),
                    },
                }));
            },

            getTotalUnreadCount: () => {
                return get().conversations.reduce((total, conv) => total + conv.unreadCount, 0);
            },

            deleteConversation: (conversationId: string) => {
                set((state) => {
                    const { [conversationId]: _, ...remainingMessages } = state.messages;
                    return {
                        conversations: state.conversations.filter((conv) => conv.id !== conversationId),
                        messages: remainingMessages,
                    };
                });
            },

            canStartConversation: (postAuthorId: string, isAnonymous: boolean, acceptsMessages: boolean) => {
                // Cannot start conversation if:
                // 1. Post is anonymous
                // 2. Author doesn't accept messages
                return !isAnonymous && acceptsMessages;
            },
        }),
        {
            name: "chat-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
