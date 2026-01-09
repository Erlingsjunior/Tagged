# 📋 Tagged - Documentação Completa de Features

## Índice
1. [Sistema de Perfis de Usuário](#sistema-de-perfis-de-usuário)
2. [Sistema de Assinaturas e Petições](#sistema-de-assinaturas-e-petições)
3. [Feed e Navegação](#feed-e-navegação)
4. [Sistema de Comentários](#sistema-de-comentários)
5. [Chat e Mensagens](#chat-e-mensagens)
6. [AsyncStorage e Persistência](#asyncstorage-e-persistência)
7. [Pull to Refresh](#pull-to-refresh)
8. [Sistema de Follow/Unfollow](#sistema-de-followunfollow)

---

## Sistema de Perfis de Usuário

### Visão Geral
Cada usuário tem um perfil completo acessível através da rota `/user/[id]`. Perfis podem ser acessados clicando em avatares ou nomes em qualquer parte do app.

### Arquivos Principais
- **Página**: `app/user/[id].tsx`
- **Store**: `stores/authStore.ts`
- **Componente**: `components/UI/PostCard/postCard.tsx` (com prop `onAuthorPress`)

### Funcionalidades

#### 1. Visualização de Perfil
```typescript
// Acesso ao perfil via rota dinâmica
router.push(`/user/${userId}`)
```

**Informações exibidas:**
- Nome completo
- Avatar (iniciais ou imagem)
- Bio/descrição
- Localização (cidade, estado, país)
- Badge de verificação (se verificado)

#### 2. Estatísticas do Usuário
```typescript
stats: {
  reportsCreated: number;    // Denúncias criadas
  reportsSigned: number;     // Denúncias assinadas
  impactScore: number;       // Score de impacto
}
```

**Cálculo do Impact Score:**
```typescript
impactScore = (reportsCreated * 10) + (reportsSigned * 2)
```

#### 3. Navegação Contextual
Perfis são acessíveis de:
- ✅ **PostCard** (feed)
- ✅ **PostDetails** (detalhes do post)
- ✅ **Preview Modal** (preview de post)
- ✅ **Comments** (seção de comentários)
- ✅ **Chat** (lista de conversas)

**Implementação:**
```typescript
// PostCard
<PostCard
  post={post}
  onAuthorPress={(authorId) => router.push(`/user/${authorId}`)}
/>

// PostDetails
<TouchableOpacity
  onPress={() => !post.isAnonymous && router.push(`/user/${post.author.id}`)}
>
  <AuthorInfo>
    <Avatar>{post.author.name.charAt(0).toUpperCase()}</Avatar>
    <AuthorName>{post.author.name}</AuthorName>
  </AuthorInfo>
</TouchableOpacity>
```

#### 4. Tabs de Conteúdo

##### Tab "Denúncias" (Posts Criados)
Mostra todas as denúncias criadas pelo usuário (exceto anônimas).

```typescript
const userPosts = posts.filter(
  p => !p.isAnonymous && p.author.id === profileUser.id
);
```

##### Tab "Assinadas" (Posts que o usuário assinou)
Mostra todas as petições que o usuário assinou.

```typescript
const signedPosts = posts.filter(p => hasUserSigned(p.id, profileUser.id));
```

**Função `hasUserSigned`:**
```typescript
hasUserSigned: (postId: string, userId: string) => {
  const postSignatures = get().signatures.get(postId) || [];
  return postSignatures.some(sig => sig.userId === userId);
}
```

---

## Sistema de Assinaturas e Petições

### Visão Geral
Sistema completo de petições legais com assinaturas verificáveis, paginação e visualização de amigos que assinaram.

### Arquivos Principais
- **Página**: `app/petition/[id].tsx`
- **Service**: `services/petitionService.ts`
- **Store**: `stores/postsStore.ts`
- **Mock Data**: `services/mockData.ts` (função `generateMockSignatures`)

### Funcionalidades

#### 1. Documento de Petição Dinâmico

**Estrutura do Documento:**
```
┌─────────────────────────────────────┐
│ PETIÇÃO PÚBLICA - #[ID]             │
│ [Título da Denúncia]                │
├─────────────────────────────────────┤
│ Denunciante: [Nome]                 │
│ Local: [Cidade, Estado]             │
│ Data: [DD/MM/YYYY às HH:MM]         │
├─────────────────────────────────────┤
│ FUNDAMENTAÇÃO LEGAL                 │
│ [Conteúdo da denúncia]              │
├─────────────────────────────────────┤
│ PEDIDOS                             │
│ 1. Investigação                     │
│ 2. Responsabilização                │
│ 3. Transparência                    │
├─────────────────────────────────────┤
│ ASSINATURAS ([total] assinaturas)   │
│ Página [current] de [total]         │
│                                     │
│ [Lista de 1000 assinaturas]         │
│ Nome | CPF (parcial) | Data/Hora   │
└─────────────────────────────────────┘
```

#### 2. Geração de Assinaturas Mockadas

**Localização:** `services/mockData.ts` - função `generateMockSignatures()`

```typescript
export const generateMockSignatures = (
  postId: string,
  totalSupports: number,
  allUsers: any[]
) => {
  const signatures: any[] = [];

  // Gera 80% do total de supports como assinaturas
  const mockSignaturesCount = Math.floor(totalSupports * 0.8);

  for (let i = 0; i < mockSignaturesCount; i++) {
    let user;

    // Reutiliza usuários existentes quando possível
    if (i < allUsers.length && faker.datatype.boolean()) {
      user = allUsers[i % allUsers.length];
    } else {
      // Cria usuário temporário
      user = {
        id: `temp_user_${postId}_${i}`,
        name: faker.person.fullName(),
        cpf: faker.string.numeric(11),
        email: `supporter${i}@tagged.com`,
      };
    }

    signatures.push({
      userId: user.id,
      userName: user.name,
      signedAt: faker.date.recent({ days: 30 }),
    });
  }

  return signatures;
};
```

**Processo de Geração:**
1. Para cada post com `stats.supports > 1000`:
2. Gera ~80% do total de supports como assinaturas
3. Reutiliza usuários existentes quando possível
4. Cria usuários temporários para completar o volume
5. Salva no AsyncStorage em `tagged_signatures`

#### 3. Paginação de Assinaturas

**Constantes:**
```typescript
const SIGNATURES_PER_PAGE = 1000;
const totalPages = Math.ceil(signatures.length / SIGNATURES_PER_PAGE);
```

**Navegação:**
```typescript
// Página anterior
setCurrentPage(prev => Math.max(1, prev - 1));

// Próxima página
setCurrentPage(prev => Math.min(totalPages, prev + 1));

// Página específica
setCurrentPage(pageNumber);
```

**Controles de Navegação:**
- Visível apenas quando `totalPages > 1`
- Botões: Primeira | Anterior | [Páginas] | Próxima | Última
- Indicador: "Página X de Y"

#### 4. Amigos que Assinaram

**Funcionalidade:**
Mostra quais seguidores mútuos assinaram a petição.

```typescript
// Obter usuário atual
const { user } = useAuthStore();

// Obter dados do perfil do usuário logado
const currentUserProfile = allUsersDb[user?.email || ''];

// Filtrar seguidores mútuos que assinaram
const friendSignatures = signatures.filter(sig => {
  const isFollowing = currentUserProfile?.following?.includes(sig.userId);
  const isFollower = currentUserProfile?.followers?.includes(sig.userId);
  return (isFollowing || isFollower) && sig.userId !== user?.id;
});
```

**Exibição:**
```tsx
{friendSignatures.length > 0 && (
  <FriendsSection>
    <SectionTitle>
      👥 Amigos que assinaram ({friendSignatures.length})
    </SectionTitle>
    <FriendsList>
      {friendSignatures.slice(0, 5).map((sig) => (
        <FriendItem key={sig.userId}>
          <Avatar>{sig.userName.charAt(0).toUpperCase()}</Avatar>
          <FriendName>{sig.userName}</FriendName>
        </FriendItem>
      ))}
    </FriendsList>
  </FriendsSection>
)}
```

---

## Feed e Navegação

### Pull to Refresh
Funcionalidade que permite ao usuário atualizar o feed puxando a tela para baixo.

**Arquivo:** `Views/FeedView/feedView.tsx`

```tsx
<FlatList
  data={filteredPosts}
  refreshing={loading}
  onRefresh={refreshPosts}  // Função que limpa e recria todos os dados
  // ... outros props
/>
```

**Implementação do refreshPosts** (`stores/postsStore.ts`):

```typescript
refreshPosts: async () => {
  console.log("🔄 Pull to Refresh: Recriando todos os dados mockados...");

  // Limpar TODOS os dados do AsyncStorage
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.POSTS,
    STORAGE_KEYS.SIGNATURES,
    STORAGE_KEYS.SAVED,
    STORAGE_KEYS.BASE_SUPPORTS,
    "tagged_users_db",
    "tagged_migration_v5",
  ]);

  console.log("✅ Dados limpos! Recriando com novos dados mockados...");

  // Delay para mostrar o loading
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Recarregar tudo do zero
  await get().loadPosts();

  console.log("✅ Pull to Refresh completo! Novos dados carregados.");
}
```

**Comportamento:**
1. Usuário puxa a tela para baixo
2. Aparece o spinner de loading
3. Todos os dados são apagados do AsyncStorage
4. Novos dados mockados são gerados:
   - Novos usuários com nomes diferentes
   - Novas assinaturas
   - Novos posts (se aplicável)
5. Feed é atualizado com os novos dados

---

## AsyncStorage e Persistência

### Chaves do AsyncStorage

```typescript
const STORAGE_KEYS = {
  POSTS: "tagged_posts",
  SIGNATURES: "tagged_signatures",
  SAVED: "tagged_saved_posts",
  ANONYMOUS_OWNERSHIP: "tagged_anonymous_ownership",
  BASE_SUPPORTS: "tagged_base_supports",
};

// Chaves adicionais
const USERS_DB_KEY = 'tagged_users_db';
const MIGRATION_KEY = 'tagged_migration_v5';
```

### Sistema de Migrations

**Versão Atual:** v5

```typescript
const migrationKey = "tagged_migration_v5";
const migrationDone = await AsyncStorage.getItem(migrationKey);

if (!migrationDone) {
  console.log("🔄 Running migration v5...");

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
```

**Quando criar nova migration:**
- Mudanças na estrutura de dados
- Novos campos em types/schemas
- Correção de dados corrompidos
- Adição de novas features que requerem dados diferentes

### Dados Armazenados

#### 1. Posts (`tagged_posts`)
```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  author: UserInfo;
  isAnonymous: boolean;
  location: Location;
  tags: string[];
  stats: PostStats;
  milestones: Milestone[];
  chatUnlocked: boolean;
  createdAt: string;
  // ... outros campos
}
```

#### 2. Signatures (`tagged_signatures`)
```typescript
// Estrutura: Record<postId, Signature[]>
{
  "post-1": [
    {
      userId: "user-123",
      userName: "João Silva",
      signedAt: "2025-01-08T10:30:00.000Z"
    },
    // ... mais assinaturas
  ],
  "post-2": [...]
}
```

#### 3. Users Database (`tagged_users_db`)
```typescript
// Estrutura: Record<email, User>
{
  "user1@tagged.com": {
    id: "uuid-123",
    email: "user1@tagged.com",
    name: "Maria Santos",
    cpf: "12345678901",
    phone: "+55 11 98765-4321",
    avatar: "url_ou_undefined",
    verified: false,
    role: "user",
    bio: "Bio do usuário",
    location: {
      city: "São Paulo",
      state: "SP",
      country: "Brasil"
    },
    stats: {
      reportsCreated: 5,
      reportsSigned: 23,
      impactScore: 96
    },
    following: ["user-id-1", "user-id-2"],
    followers: ["user-id-3", "user-id-4"],
    createdAt: "2024-06-15T08:00:00.000Z",
    password: "password123"
  },
  // ... mais usuários
}
```

---

## Sistema de Follow/Unfollow

### Visão Geral
Usuários podem seguir e deixar de seguir outros usuários. Isso afeta funcionalidades como "Amigos que assinaram".

### Implementação

**Store:** `stores/authStore.ts`

```typescript
followUser: async (userId: string) => {
  const { user } = get();
  if (!user) return;

  // Atualizar following do usuário atual
  const updatedUser = {
    ...user,
    following: [...(user.following || []), userId],
  };

  set({ user: updatedUser });

  // Salvar no AsyncStorage
  const USERS_DB_KEY = 'tagged_users_db';
  const usersDbJson = await AsyncStorage.getItem(USERS_DB_KEY);
  const usersDb = usersDbJson ? JSON.parse(usersDbJson) : {};

  if (usersDb[user.email]) {
    usersDb[user.email].following = updatedUser.following;
  }

  // Adicionar usuário atual aos followers do outro usuário
  const targetUserEmail = Object.values(usersDb).find(
    (u: any) => u.id === userId
  )?.email;

  if (targetUserEmail && usersDb[targetUserEmail]) {
    usersDb[targetUserEmail].followers = [
      ...(usersDb[targetUserEmail].followers || []),
      user.id,
    ];
  }

  await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
}
```

### UI - Botão de Follow/Unfollow

```tsx
{!isOwnProfile && (
  <FollowButton
    onPress={() => isFollowing ? unfollowUser(profileUser.id) : followUser(profileUser.id)}
  >
    <ButtonText>{isFollowing ? 'Deixar de seguir' : 'Seguir'}</ButtonText>
  </FollowButton>
)}
```

**Lógica de verificação:**
```typescript
const isFollowing = user?.following?.includes(profileUser.id) || false;
const isOwnProfile = user?.id === profileUser.id;
```

---

## Fluxo de Dados Completo

### 1. Inicialização do App

```
App Start
  ↓
authStore.initializeAuth()
  ↓
Carrega usuário do AsyncStorage
  ↓
postsStore.loadPosts()
  ↓
Verifica migration_v5
  ↓
[Se primeira vez ou migration forçada]
  ↓
Gera Mock Users (generateMockUsers)
  ↓
Gera Mock Signatures (generateMockSignatures)
  ↓
Salva tudo no AsyncStorage
  ↓
Feed renderizado com dados
```

### 2. Pull to Refresh

```
Usuário puxa tela para baixo
  ↓
refreshPosts() chamado
  ↓
AsyncStorage.multiRemove() - Limpa tudo
  ↓
loadPosts() chamado
  ↓
Gera novos dados mockados
  ↓
Feed atualizado
```

### 3. Navegação para Perfil

```
Usuário clica em avatar/nome
  ↓
onAuthorPress(authorId) disparado
  ↓
router.push(`/user/${authorId}`)
  ↓
Página user/[id].tsx carregada
  ↓
Busca usuário em tagged_users_db
  ↓
Renderiza perfil com tabs
  ↓
[Tab Denúncias]: Filtra posts por author.id
[Tab Assinadas]: Filtra posts por hasUserSigned()
```

### 4. Visualização de Petição

```
Usuário clica em "Ver Petição"
  ↓
router.push(`/petition/${postId}`)
  ↓
Carrega assinaturas do post
  ↓
Calcula total de páginas (signatures.length / 1000)
  ↓
Filtra amigos que assinaram
  ↓
Renderiza documento com paginação
```

---

## Referências Rápidas

### Rotas Principais
- `/` - Feed principal
- `/user/[id]` - Perfil de usuário
- `/postDetails/[id]` - Detalhes do post
- `/petition/[id]` - Documento de petição
- `/comments/[postId]` - Comentários
- `/chat/[conversationId]` - Chat privado
- `/collaborativeChat/[postId]` - Chat colaborativo

### AsyncStorage Keys
- `tagged_posts` - Posts
- `tagged_signatures` - Assinaturas
- `tagged_users_db` - Banco de usuários
- `tagged_saved_posts` - Posts salvos
- `tagged_migration_v5` - Flag de migration

### Funções Importantes
- `generateMockUsers()` - Gera usuários mockados
- `generateMockSignatures()` - Gera assinaturas mockadas
- `hasUserSigned(postId, userId)` - Verifica se usuário assinou
- `refreshPosts()` - Pull to refresh
- `followUser(userId)` - Seguir usuário
- `unfollowUser(userId)` - Deixar de seguir

---

**Última atualização:** 08/01/2026
**Versão da Migration:** v5
