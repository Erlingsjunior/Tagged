import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { theme } from "../../constants/Theme";
import { useChatStore, Conversation } from "../../stores/chatStore";
import { Avatar } from "../../components/UI/Avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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

const ConversationItem = styled(TouchableOpacity)`
    flex-direction: row;
    padding: ${theme.spacing.md}px;
    background-color: ${theme.colors.surface};
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.border};
`;

const AvatarWrapper = styled(View)`
    margin-right: ${theme.spacing.md}px;
`;

const ConversationInfo = styled(View)`
    flex: 1;
    justify-content: center;
`;

const ConversationHeader = styled(View)`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
`;

const ParticipantName = styled(Text)`
    font-size: 16px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
    flex: 1;
`;

const TimeText = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
`;

const LastMessage = styled(Text)<{ unread?: boolean }>`
    font-size: 14px;
    color: ${(props) => (props.unread ? theme.colors.text.primary : theme.colors.text.secondary)};
    font-weight: ${(props) => (props.unread ? "600" : "normal")};
`;

const UnreadBadge = styled(View)`
    background-color: ${theme.colors.primary};
    border-radius: 10px;
    min-width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    margin-left: ${theme.spacing.sm}px;
`;

const UnreadText = styled(Text)`
    color: ${theme.colors.surface};
    font-size: 12px;
    font-weight: bold;
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

export default function ChatListScreen() {
    const router = useRouter();
    const { getConversations, markAsRead } = useChatStore();
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = () => {
        const convs = getConversations();
        setConversations(convs);
    };

    const handleConversationPress = (conversation: Conversation) => {
        markAsRead(conversation.id);
        router.push(`/chat/${conversation.id}`);
    };

    const renderConversation = ({ item }: { item: Conversation }) => (
        <ConversationItem onPress={() => handleConversationPress(item)}>
            <AvatarWrapper>
                <Avatar name={item.participantName} avatar={item.participantAvatar} size="large" />
            </AvatarWrapper>
            <ConversationInfo>
                <ConversationHeader>
                    <ParticipantName numberOfLines={1}>{item.participantName}</ParticipantName>
                    {item.lastMessage && (
                        <TimeText>
                            {formatDistanceToNow(new Date(item.lastMessage.timestamp), {
                                addSuffix: false,
                                locale: ptBR,
                            })}
                        </TimeText>
                    )}
                </ConversationHeader>
                {item.lastMessage ? (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <LastMessage numberOfLines={1} unread={item.unreadCount > 0} style={{ flex: 1 }}>
                            {item.lastMessage.content}
                        </LastMessage>
                        {item.unreadCount > 0 && (
                            <UnreadBadge>
                                <UnreadText>{item.unreadCount}</UnreadText>
                            </UnreadBadge>
                        )}
                    </View>
                ) : (
                    <LastMessage>Inicie a conversa...</LastMessage>
                )}
            </ConversationInfo>
        </ConversationItem>
    );

    return (
        <Container>
            <Header>
                <BackButton onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </BackButton>
                <HeaderTitle>Mensagens</HeaderTitle>
            </Header>

            {conversations.length === 0 ? (
                <EmptyState>
                    <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.text.secondary} />
                    <EmptyText>
                        Você ainda não tem conversas.{"\n"}Inicie uma conversa com um denunciante através de seus posts!
                    </EmptyText>
                </EmptyState>
            ) : (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id}
                    renderItem={renderConversation}
                    onRefresh={loadConversations}
                    refreshing={false}
                />
            )}
        </Container>
    );
}
