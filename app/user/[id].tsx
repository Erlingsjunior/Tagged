import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../stores/authStore';
import { usePostsStore } from '../../stores/postsStore';
import { PostCard } from '../../components/UI/PostCard';
import { theme } from '../../constants/Theme';
import { User, Post } from '../../types';

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

const ProfileHeader = styled(View)`
    padding: ${theme.spacing.xl}px;
    background-color: ${theme.colors.surface};
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.border};
`;

const Avatar = styled(View)`
    width: 100px;
    height: 100px;
    border-radius: 50px;
    background-color: ${theme.colors.primary};
    align-items: center;
    justify-content: center;
    margin-bottom: ${theme.spacing.md}px;
`;

const AvatarText = styled(Text)`
    font-size: 40px;
    font-weight: bold;
    color: ${theme.colors.surface};
`;

const UserName = styled(Text)`
    font-size: 24px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.xs}px;
`;

const UserBio = styled(Text)`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    text-align: center;
    margin-bottom: ${theme.spacing.md}px;
`;

const StatsRow = styled(View)`
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    margin-top: ${theme.spacing.md}px;
`;

const StatItem = styled(TouchableOpacity)`
    align-items: center;
`;

const StatValue = styled(Text)`
    font-size: 20px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
`;

const StatLabel = styled(Text)`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    margin-top: 4px;
`;

const FollowButton = styled(TouchableOpacity)<{ isFollowing: boolean }>`
    background-color: ${props => props.isFollowing ? 'transparent' : theme.colors.primary};
    border-width: ${props => props.isFollowing ? '1px' : '0px'};
    border-color: ${theme.colors.primary};
    padding: ${theme.spacing.sm}px ${theme.spacing.xl}px;
    border-radius: ${theme.borderRadius.md}px;
    margin-top: ${theme.spacing.md}px;
`;

const FollowButtonText = styled(Text)<{ isFollowing: boolean }>`
    color: ${props => props.isFollowing ? theme.colors.primary : theme.colors.surface};
    font-weight: bold;
    font-size: 14px;
`;

const TabsContainer = styled(View)`
    flex-direction: row;
    background-color: ${theme.colors.surface};
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.border};
`;

const Tab = styled(TouchableOpacity)<{ active: boolean }>`
    flex: 1;
    padding: ${theme.spacing.md}px;
    border-bottom-width: 2px;
    border-bottom-color: ${props => props.active ? theme.colors.primary : 'transparent'};
`;

const TabText = styled(Text)<{ active: boolean }>`
    text-align: center;
    font-size: 14px;
    font-weight: ${props => props.active ? 'bold' : 'normal'};
    color: ${props => props.active ? theme.colors.primary : theme.colors.text.secondary};
`;

const STORAGE_KEYS = {
    USERS_DB: 'tagged_users_db',
};

export default function UserProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { user: currentUser, updateUser } = useAuthStore();
    const { posts, toggleSignature, toggleSave, hasUserSigned } = usePostsStore();

    // Forçar re-render quando signatures mudar
    const signatures = usePostsStore((state) => state.signatures);

    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'posts' | 'signed'>('posts');
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        loadUserProfile();
    }, [id]);

    useEffect(() => {
        if (currentUser && profileUser) {
            setIsFollowing(currentUser.following?.includes(profileUser.id) || false);
        }
    }, [currentUser, profileUser]);

    const loadUserProfile = async () => {
        console.log(`🔍 Carregando perfil do usuário ID: ${id}`);
        const usersDbJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
        const usersDb = usersDbJson ? JSON.parse(usersDbJson) : {};

        console.log(`📚 UsersDB tem ${Object.keys(usersDb).length} usuários salvos`);

        const user = Object.values(usersDb).find((u: any) => u.id === id) as User;

        if (user) {
            console.log(`✅ Usuário encontrado: ${user.name}`);
        } else {
            console.log(`❌ Usuário com ID ${id} não encontrado no banco de dados`);
            console.log('IDs disponíveis:', Object.values(usersDb).map((u: any) => u.id).join(', '));
        }

        setProfileUser(user || null);
    };

    const handleFollow = async () => {
        if (!currentUser || !profileUser) return;

        const usersDbJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
        const usersDb = usersDbJson ? JSON.parse(usersDbJson) : {};

        const newIsFollowing = !isFollowing;

        const updatedCurrentUser = { ...currentUser };
        const updatedProfileUser = { ...profileUser };

        if (newIsFollowing) {
            updatedCurrentUser.following = [...(updatedCurrentUser.following || []), profileUser.id];
            updatedProfileUser.followers = [...(updatedProfileUser.followers || []), currentUser.id];
        } else {
            updatedCurrentUser.following = updatedCurrentUser.following?.filter(id => id !== profileUser.id) || [];
            updatedProfileUser.followers = updatedProfileUser.followers?.filter(id => id !== currentUser.id) || [];
        }

        Object.keys(usersDb).forEach(email => {
            if (usersDb[email].id === currentUser.id) {
                usersDb[email] = { ...usersDb[email], following: updatedCurrentUser.following };
            }
            if (usersDb[email].id === profileUser.id) {
                usersDb[email] = { ...usersDb[email], followers: updatedProfileUser.followers };
            }
        });

        await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(usersDb));
        await updateUser({ following: updatedCurrentUser.following });
        setProfileUser(updatedProfileUser);
        setIsFollowing(newIsFollowing);
    };

    if (!profileUser) {
        return (
            <Container>
                <Header>
                    <BackButton onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                    </BackButton>
                    <HeaderTitle>Perfil não encontrado</HeaderTitle>
                </Header>
            </Container>
        );
    }

    const isOwnProfile = currentUser?.id === profileUser.id;
    const userPosts = posts.filter(p => p.author.id === profileUser.id && !p.isAnonymous);
    const signedPosts = posts.filter(p => hasUserSigned(p.id, profileUser.id));

    const displayPosts = activeTab === 'posts' ? userPosts : signedPosts;

    return (
        <Container>
            <Header>
                <BackButton onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </BackButton>
                <HeaderTitle>Perfil</HeaderTitle>
            </Header>

            <ScrollView>
                <ProfileHeader>
                    <Avatar>
                        <AvatarText>{profileUser.name.charAt(0).toUpperCase()}</AvatarText>
                    </Avatar>
                    <UserName>{profileUser.name}</UserName>
                    {profileUser.bio && <UserBio>{profileUser.bio}</UserBio>}

                    <StatsRow>
                        <StatItem>
                            <StatValue>{profileUser.stats?.reportsCreated || 0}</StatValue>
                            <StatLabel>Denúncias</StatLabel>
                        </StatItem>
                        <StatItem onPress={() => {}}>
                            <StatValue>{profileUser.followers?.length || 0}</StatValue>
                            <StatLabel>Seguidores</StatLabel>
                        </StatItem>
                        <StatItem onPress={() => {}}>
                            <StatValue>{profileUser.following?.length || 0}</StatValue>
                            <StatLabel>Seguindo</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatValue>{profileUser.stats?.reportsSigned || 0}</StatValue>
                            <StatLabel>Assinadas</StatLabel>
                        </StatItem>
                    </StatsRow>

                    {!isOwnProfile && currentUser && (
                        <FollowButton isFollowing={isFollowing} onPress={handleFollow}>
                            <FollowButtonText isFollowing={isFollowing}>
                                {isFollowing ? 'Seguindo' : 'Seguir'}
                            </FollowButtonText>
                        </FollowButton>
                    )}
                </ProfileHeader>

                <TabsContainer>
                    <Tab active={activeTab === 'posts'} onPress={() => setActiveTab('posts')}>
                        <TabText active={activeTab === 'posts'}>
                            Denúncias ({userPosts.length})
                        </TabText>
                    </Tab>
                    <Tab active={activeTab === 'signed'} onPress={() => setActiveTab('signed')}>
                        <TabText active={activeTab === 'signed'}>
                            Assinadas ({signedPosts.length})
                        </TabText>
                    </Tab>
                </TabsContainer>

                <View style={{ padding: theme.spacing.md }}>
                    {displayPosts.length === 0 ? (
                        <View style={{ alignItems: 'center', marginTop: theme.spacing.xl }}>
                            <Ionicons name="document-outline" size={48} color={theme.colors.text.secondary} />
                            <Text style={{ color: theme.colors.text.secondary, marginTop: theme.spacing.md }}>
                                {activeTab === 'posts' ? 'Nenhuma denúncia pública' : 'Nenhuma denúncia assinada'}
                            </Text>
                        </View>
                    ) : (
                        displayPosts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                onLike={() => toggleSignature(post.id, currentUser!.id, currentUser!.name, currentUser!.avatar)}
                                onSave={() => toggleSave(post.id)}
                                onComment={() => router.push(`/comments/${post.id}`)}
                                onShare={() => {}}
                                onPress={() => router.push(`/postDetails/${post.id}`)}
                                onChat={() => {}}
                                onAuthorPress={(authorId) => router.push(`/user/${authorId}`)}
                                isLiked={currentUser ? hasUserSigned(post.id, currentUser.id) : false}
                                isSaved={false}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </Container>
    );
}
