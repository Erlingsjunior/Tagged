import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { theme } from "../../constants/Theme";
import { useAuthStore } from "../../stores/authStore";
import { useChatStore, Message } from "../../stores/chatStore";
import { Avatar } from "../../components/UI/Avatar";
import { format } from "date-fns";
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

const AvatarWrapper = styled(View)`
    margin-right: ${theme.spacing.sm}px;
`;

const HeaderInfo = styled(View)`
    flex: 1;
`;

const ParticipantName = styled(Text)`
    font-size: 16px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
`;

const StatusText = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
`;

const MessagesContainer = styled(FlatList)`
    flex: 1;
    padding: ${theme.spacing.md}px;
` as unknown as typeof FlatList;

const MessageBubble = styled(View)<{ isOwn: boolean }>`
    max-width: 75%;
    padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
    border-radius: 16px;
    margin-bottom: ${theme.spacing.sm}px;
    align-self: ${(props) => (props.isOwn ? "flex-end" : "flex-start")};
    background-color: ${(props) => (props.isOwn ? theme.colors.primary : theme.colors.surface)};
`;

const MessageText = styled(Text)<{ isOwn: boolean }>`
    font-size: 14px;
    color: ${(props) => (props.isOwn ? theme.colors.surface : theme.colors.text.primary)};
    line-height: 20px;
`;

const MessageTime = styled(Text)<{ isOwn: boolean }>`
    font-size: 10px;
    color: ${(props) => (props.isOwn ? theme.colors.surface : theme.colors.text.secondary)};
    opacity: 0.7;
    margin-top: 4px;
    align-self: flex-end;
`;

const InputContainer = styled(KeyboardAvoidingView)`
    background-color: ${theme.colors.surface};
    border-top-width: 1px;
    border-top-color: ${theme.colors.border};
    padding: ${theme.spacing.md}px;
    flex-direction: row;
    align-items: center;
    gap: ${theme.spacing.sm}px;
`;

const Input = styled(TextInput)`
    flex: 1;
    background-color: ${theme.colors.background};
    border-radius: 20px;
    padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
    font-size: 14px;
    color: ${theme.colors.text.primary};
    max-height: 100px;
`;

const SendButton = styled(TouchableOpacity)<{ disabled?: boolean }>`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: ${(props) => (props.disabled ? theme.colors.border : theme.colors.primary)};
    align-items: center;
    justify-content: center;
`;

const DateSeparator = styled(View)`
    align-items: center;
    margin: ${theme.spacing.md}px 0;
`;

const DateText = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    background-color: ${theme.colors.background};
    padding: 4px 12px;
    border-radius: 12px;
`;

export default function ConversationScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const conversationId = params.conversationId as string;

    const { user } = useAuthStore();
    const { getConversation, getMessages, sendMessage, markAsRead } = useChatStore();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [conversation, setConversation] = useState(getConversation(conversationId));
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        loadMessages();
        markAsRead(conversationId);
    }, [conversationId]);

    const loadMessages = () => {
        const msgs = getMessages(conversationId);
        setMessages(msgs);
    };

    const handleSend = () => {
        if (!inputText.trim() || !user) return;

        sendMessage(conversationId, inputText.trim(), user.id, user.name, user.avatar);
        setInputText("");
        loadMessages();

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const shouldShowDateSeparator = (currentMsg: Message, previousMsg?: Message): boolean => {
        if (!previousMsg) return true;

        const currentDate = new Date(currentMsg.timestamp).toDateString();
        const previousDate = new Date(previousMsg.timestamp).toDateString();

        return currentDate !== previousDate;
    };

    const renderMessage = ({ item, index }: { item: Message; index: number }) => {
        const isOwn = item.senderId === user?.id;
        const previousMsg = index > 0 ? messages[index - 1] : undefined;
        const showDateSeparator = shouldShowDateSeparator(item, previousMsg);

        return (
            <>
                {showDateSeparator && (
                    <DateSeparator>
                        <DateText>{format(new Date(item.timestamp), "dd 'de' MMMM", { locale: ptBR })}</DateText>
                    </DateSeparator>
                )}
                <MessageBubble isOwn={isOwn}>
                    <MessageText isOwn={isOwn}>{item.content}</MessageText>
                    <MessageTime isOwn={isOwn}>{format(new Date(item.timestamp), "HH:mm")}</MessageTime>
                </MessageBubble>
            </>
        );
    };

    if (!conversation) {
        return (
            <Container>
                <Header>
                    <BackButton onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                    </BackButton>
                    <HeaderInfo>
                        <ParticipantName>Conversa não encontrada</ParticipantName>
                    </HeaderInfo>
                </Header>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <BackButton onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </BackButton>
                <AvatarWrapper>
                    <Avatar name={conversation.participantName} avatar={conversation.participantAvatar} size="medium" />
                </AvatarWrapper>
                <HeaderInfo>
                    <ParticipantName>{conversation.participantName}</ParticipantName>
                    {conversation.postId && <StatusText>Via denúncia</StatusText>}
                </HeaderInfo>
            </Header>

            <MessagesContainer
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                ListEmptyComponent={
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 40 }}>
                        <Ionicons name="chatbubble-outline" size={48} color={theme.colors.text.secondary} />
                        <Text style={{ color: theme.colors.text.secondary, marginTop: 16, textAlign: "center" }}>
                            Nenhuma mensagem ainda. Inicie a conversa!
                        </Text>
                    </View>
                }
            />

            <InputContainer behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Input
                    placeholder="Escreva uma mensagem..."
                    placeholderTextColor={theme.colors.text.secondary}
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                />
                <SendButton disabled={!inputText.trim()} onPress={handleSend}>
                    <Ionicons name="send" size={20} color={theme.colors.surface} />
                </SendButton>
            </InputContainer>
        </Container>
    );
}
