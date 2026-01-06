import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { theme } from "../../constants/Theme";
import { useAuthStore } from "../../stores/authStore";
import { usePostsStore } from "../../stores/postsStore";
import { Avatar } from "../../components/UI/Avatar";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${theme.colors.background};
`;

const Header = styled(View)`
    background-color: ${theme.colors.primary};
    padding: ${theme.spacing.md}px;
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.border};
`;

const HeaderTop = styled(View)`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${theme.spacing.sm}px;
`;

const BackButton = styled(TouchableOpacity)`
    padding: ${theme.spacing.sm}px;
    margin-right: ${theme.spacing.sm}px;
`;

const HeaderInfo = styled(View)`
    flex: 1;
`;

const HeaderTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${theme.colors.surface};
`;

const HeaderSubtitle = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.surface};
    opacity: 0.9;
    margin-top: 2px;
`;

const PostBanner = styled(View)`
    background-color: rgba(255, 255, 255, 0.1);
    padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.md}px;
    margin-top: ${theme.spacing.sm}px;
`;

const PostTitle = styled(Text)`
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.surface};
    margin-bottom: 4px;
`;

const PostStats = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.surface};
    opacity: 0.8;
`;

const MessagesContainer = styled(FlatList)`
    flex: 1;
    padding: ${theme.spacing.md}px;
` as unknown as typeof FlatList;

const MessageBubble = styled(View)<{ isOwn: boolean }>`
    max-width: 75%;
    padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
    border-radius: 16px;
    margin-bottom: ${theme.spacing.md}px;
    align-self: ${(props: any) => (props.isOwn ? "flex-end" : "flex-start")};
    background-color: ${(props: any) => (props.isOwn ? theme.colors.primary : theme.colors.surface)};
`;

const MessageHeader = styled(View)`
    flex-direction: row;
    align-items: center;
    margin-bottom: 4px;
`;

const SenderName = styled(Text)<{ isOwn: boolean }>`
    font-size: 12px;
    font-weight: 600;
    color: ${(props: any) => (props.isOwn ? theme.colors.surface : theme.colors.primary)};
    margin-right: ${theme.spacing.xs}px;
`;

const SenderRole = styled(Text)<{ isOwn: boolean }>`
    font-size: 10px;
    color: ${(props: any) => (props.isOwn ? theme.colors.surface : theme.colors.text.secondary)};
    opacity: 0.7;
`;

const MessageText = styled(Text)<{ isOwn: boolean }>`
    font-size: 14px;
    color: ${(props: any) => (props.isOwn ? theme.colors.surface : theme.colors.text.primary)};
    line-height: 20px;
`;

const MessageTime = styled(Text)<{ isOwn: boolean }>`
    font-size: 10px;
    color: ${(props: any) => (props.isOwn ? theme.colors.surface : theme.colors.text.secondary)};
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
    background-color: ${(props: any) => (props.disabled ? theme.colors.border : theme.colors.primary)};
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

const ParticipantsBanner = styled(View)`
    background-color: ${theme.colors.surface};
    padding: ${theme.spacing.md}px;
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.border};
`;

const ParticipantsTitle = styled(Text)`
    font-size: 12px;
    font-weight: 600;
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.sm}px;
`;

const ParticipantsList = styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${theme.spacing.xs}px;
`;

const ParticipantTag = styled(View)`
    flex-direction: row;
    align-items: center;
    background-color: ${theme.colors.background};
    padding: 4px 8px;
    border-radius: 12px;
`;

const ParticipantIcon = styled(Text)`
    margin-right: 4px;
`;

const ParticipantName = styled(Text)`
    font-size: 11px;
    color: ${theme.colors.text.primary};
`;

// Mock collaborative message interface
interface CollaborativeMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: "citizen" | "journalist" | "lawyer" | "congressman" | "moderator";
    content: string;
    timestamp: Date;
}

// Role mapping
const roleLabels = {
    citizen: "Cidadão",
    journalist: "Jornalista",
    lawyer: "Advogado",
    congressman: "Congressista",
    moderator: "Moderador",
};

const roleIcons = {
    citizen: "person",
    journalist: "newspaper",
    lawyer: "briefcase",
    congressman: "business",
    moderator: "shield-checkmark",
};

export default function CollaborativeChatScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const postId = params.postId as string;

    const { user } = useAuthStore();
    const { posts } = usePostsStore();

    const [messages, setMessages] = useState<CollaborativeMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const flatListRef = useRef<FlatList>(null);

    const post = posts.find((p) => p.id === postId);

    useEffect(() => {
        // Load mock collaborative messages
        loadMessages();
    }, [postId]);

    const loadMessages = () => {
        // Mock messages for demonstration
        const mockMessages: CollaborativeMessage[] = [
            {
                id: "1",
                senderId: "journalist1",
                senderName: "Maria Silva",
                senderRole: "journalist",
                content: "Estou investigando este caso. Alguém tem mais informações sobre os envolvidos?",
                timestamp: new Date(Date.now() - 3600000),
            },
            {
                id: "2",
                senderId: "lawyer1",
                senderName: "Dr. João Santos",
                senderRole: "lawyer",
                content: "Do ponto de vista jurídico, isso configura crime de corrupção passiva. Temos precedentes semelhantes.",
                timestamp: new Date(Date.now() - 1800000),
            },
            {
                id: "3",
                senderId: "congressman1",
                senderName: "Dep. Ana Costa",
                senderRole: "congressman",
                content: "Vou levar este caso ao plenário. Precisamos de mais evidências documentais.",
                timestamp: new Date(Date.now() - 900000),
            },
        ];
        setMessages(mockMessages);
    };

    const handleSend = () => {
        if (!inputText.trim() || !user) return;

        const newMessage: CollaborativeMessage = {
            id: `msg-${Date.now()}`,
            senderId: user.id,
            senderName: user.name,
            senderRole: "citizen", // Default role for regular users
            content: inputText.trim(),
            timestamp: new Date(),
        };

        setMessages([...messages, newMessage]);
        setInputText("");

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const shouldShowDateSeparator = (currentMsg: CollaborativeMessage, previousMsg?: CollaborativeMessage): boolean => {
        if (!previousMsg) return true;

        const currentDate = new Date(currentMsg.timestamp).toDateString();
        const previousDate = new Date(previousMsg.timestamp).toDateString();

        return currentDate !== previousDate;
    };

    const renderMessage = ({ item, index }: { item: CollaborativeMessage; index: number }) => {
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
                    <MessageHeader>
                        <SenderName isOwn={isOwn}>{item.senderName}</SenderName>
                        <SenderRole isOwn={isOwn}>• {roleLabels[item.senderRole]}</SenderRole>
                    </MessageHeader>
                    <MessageText isOwn={isOwn}>{item.content}</MessageText>
                    <MessageTime isOwn={isOwn}>{format(new Date(item.timestamp), "HH:mm")}</MessageTime>
                </MessageBubble>
            </>
        );
    };

    if (!post) {
        return (
            <Container>
                <Header>
                    <HeaderTop>
                        <BackButton onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={theme.colors.surface} />
                        </BackButton>
                        <HeaderInfo>
                            <HeaderTitle>Denúncia não encontrada</HeaderTitle>
                        </HeaderInfo>
                    </HeaderTop>
                </Header>
            </Container>
        );
    }

    if (!post.chatUnlocked) {
        Alert.alert(
            "Chat Não Disponível",
            "Este chat colaborativo ainda não foi desbloqueado. É necessário atingir 1.000 assinaturas.",
            [{ text: "OK", onPress: () => router.back() }]
        );
        return null;
    }

    return (
        <Container>
            <Header>
                <HeaderTop>
                    <BackButton onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.surface} />
                    </BackButton>
                    <HeaderInfo>
                        <HeaderTitle>Chat Colaborativo</HeaderTitle>
                        <HeaderSubtitle>Discussão pública sobre esta denúncia</HeaderSubtitle>
                    </HeaderInfo>
                </HeaderTop>

                <PostBanner>
                    <PostTitle numberOfLines={1}>{post.title}</PostTitle>
                    <PostStats>{post.stats.supports.toLocaleString("pt-BR")} apoios</PostStats>
                </PostBanner>
            </Header>

            <ParticipantsBanner>
                <ParticipantsTitle>Participantes Verificados:</ParticipantsTitle>
                <ParticipantsList>
                    <ParticipantTag>
                        <Ionicons name={roleIcons.journalist as any} size={12} color={theme.colors.primary} />
                        <ParticipantName> 3 Jornalistas</ParticipantName>
                    </ParticipantTag>
                    <ParticipantTag>
                        <Ionicons name={roleIcons.lawyer as any} size={12} color={theme.colors.primary} />
                        <ParticipantName> 2 Advogados</ParticipantName>
                    </ParticipantTag>
                    <ParticipantTag>
                        <Ionicons name={roleIcons.congressman as any} size={12} color={theme.colors.primary} />
                        <ParticipantName> 1 Congressista</ParticipantName>
                    </ParticipantTag>
                    <ParticipantTag>
                        <Ionicons name={roleIcons.citizen as any} size={12} color={theme.colors.primary} />
                        <ParticipantName> {post.stats.supports} Cidadãos</ParticipantName>
                    </ParticipantTag>
                </ParticipantsList>
            </ParticipantsBanner>

            <MessagesContainer
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                ListEmptyComponent={
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 40 }}>
                        <Ionicons name="chatbubbles-outline" size={48} color={theme.colors.text.secondary} />
                        <Text style={{ color: theme.colors.text.secondary, marginTop: 16, textAlign: "center" }}>
                            Seja o primeiro a iniciar a discussão!
                        </Text>
                    </View>
                }
            />

            <InputContainer behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Input
                    placeholder="Contribua com a discussão..."
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
