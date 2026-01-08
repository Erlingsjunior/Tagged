# 📋 Como Usar o Sistema de Petições

## 🎯 Uso Básico - Tela de Detalhes do Post

```typescript
import { usePetition } from '../../hooks/petition';

export default function PostDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { posts } = usePostsStore();
    const post = posts.find((p) => p.id === id);

    // ✅ Hook principal - inicializa e monitora TUDO automaticamente
    const {
        canViewPetition,
        canDownloadPetition,
        generatePetitionDocument,
        getPetition,
        hasReachedSignatureThreshold,
    } = usePetition(post!);

    // Verifica se o botão "Ver Petição" deve aparecer
    const showPetitionButton = hasReachedSignatureThreshold();

    // Handler para visualizar petição
    const handleViewPetition = () => {
        if (canViewPetition()) {
            router.push(`/petition/${post.id}`);
        } else {
            Alert.alert('Acesso Negado', 'Você precisa assinar esta causa para ver a petição.');
        }
    };

    // Handler para download (apenas autor ou admin)
    const handleDownloadPetition = () => {
        if (canDownloadPetition()) {
            const document = generatePetitionDocument();
            // Implementar download aqui (próximo passo)
        } else {
            Alert.alert('Acesso Negado', 'Apenas o autor pode fazer download da petição.');
        }
    };

    return (
        <Container>
            {/* ... conteúdo existente ... */}

            {/* Botão "Ver Petição" aparece com >= 1000 assinaturas */}
            {showPetitionButton && (
                <TouchableOpacity
                    onPress={handleViewPetition}
                    style={{
                        backgroundColor: theme.colors.primary,
                        padding: 16,
                        borderRadius: 8,
                        margin: 16,
                        alignItems: 'center',
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                        📄 Ver Petição Oficial ({post.stats.supports.toLocaleString('pt-BR')} assinaturas)
                    </Text>
                </TouchableOpacity>
            )}
        </Container>
    );
}
```

## 🔄 Como os Hooks Trabalham em Conjunto

### 1. **Quando o usuário abre a tela de detalhes:**

```typescript
usePetition(post) {
    // 1️⃣ usePetitionContent - Cria a petição inicial
    initializePetition()

    // 2️⃣ usePetitionSignatures - Sincroniza assinaturas existentes
    syncSignaturesToPetition()

    // 3️⃣ usePetitionStats - Sincroniza estatísticas
    syncStatsToPetition()

    // 4️⃣ usePetitionUpdates - Sincroniza atualizações
    syncUpdatesToPetition()

    // 5️⃣ usePetitionAchievements - Sincroniza conquistas
    syncAchievementsToPetition()
}
```

### 2. **Quando o usuário dá like (assina):**

```typescript
const handleSignature = async (postId: string) => {
    if (!user) return;

    // 1. Adiciona assinatura no PostsStore (já existe)
    await toggleSignature(postId, user.id, user.name, user.avatar);

    // 2. O hook usePetitionSignatures detecta automaticamente e adiciona na petição
    // Não precisa fazer nada manualmente!
};
```

### 3. **Monitoramento em Tempo Real:**

- ✅ **usePetitionStats**: Atualiza stats a cada 5 segundos
- ✅ **usePetitionAchievements**: Verifica conquistas a cada 10 segundos
- ✅ **usePetitionSignatures**: Reage instantaneamente a novas assinaturas

## 📊 Exemplo: Integração com PostCard

```typescript
import { usePetitionSignatures } from '../../hooks/petition';

export const PostCard: React.FC<PostCardProps> = ({ post, onLike }) => {
    const { handleNewSignature } = usePetitionSignatures(post.id);
    const { user } = useAuthStore();

    const handleLike = async () => {
        // Executa ação normal
        await onLike(post.id);

        // Adiciona na petição automaticamente
        if (user) {
            handleNewSignature(
                user.id,
                user.name,
                (user as any).cpf,
                user.email
            );
        }
    };

    return (
        <Card>
            {/* ... */}
            <ActionButton onPress={handleLike}>
                <ActionText>Taggy</ActionText>
            </ActionButton>
        </Card>
    );
};
```

## 🔐 Controle de Permissões

### Regras de Visualização:

```typescript
// ✅ Pode ver SEMPRE:
// - Admin da Tagged

// ✅ Pode ver após 1000 assinaturas:
// - Quem assinou a causa
// - Autor da denúncia (se não anônima)

// ❌ NÃO pode ver:
// - Usuários não autenticados
// - Usuários que não assinaram (antes de 1000)
```

### Regras de Download:

```typescript
// ✅ Pode baixar SEMPRE:
// - Admin da Tagged
// - Autor da denúncia (se não anônima)

// ❌ NÃO pode baixar:
// - Assinantes (apenas visualizam)
// - Outros usuários
```

## 📄 Estrutura do Documento Gerado

O documento inclui automaticamente:

1. ✅ Dados do solicitante (ou "ANÔNIMO")
2. ✅ Descrição completa da denúncia
3. ✅ Todas as evidências anexadas
4. ✅ Estatísticas de engajamento
5. ✅ Conquistas alcançadas
6. ✅ Atualizações do caso
7. ✅ **LISTA COMPLETA de assinantes** (linha por linha)
   - Nome, CPF, Email, Data
   - Até 10.000.000+ linhas!
8. ✅ Hash de verificação para autenticidade

## 🚀 Próximos Passos

### Fase 2 - Visualização Protegida:
- [ ] Criar tela `/petition/[id].tsx`
- [ ] Bloquear screenshot com `expo-screen-capture`
- [ ] Watermark dinâmico com ID do usuário
- [ ] Texto não selecionável

### Fase 3 - Download (PDF):
- [ ] Integrar `react-native-html-to-pdf`
- [ ] Gerar PDF do documento
- [ ] Botão download apenas para autor/admin

### Fase 4 - Backend Real:
- [ ] Migrar de memória para banco de dados
- [ ] API para salvar/recuperar petições
- [ ] Sincronização em tempo real

## 📝 Observações Importantes

⚠️ **IMPORTANTE**: O sistema atual funciona 100% em MEMÓRIA (Map).
- ✅ Perfeito para desenvolvimento e testes
- ❌ Dados são perdidos ao recarregar app
- 🔜 Próximo passo: Persistir no AsyncStorage ou Backend

⚠️ **CPF e Email**: Atualmente usa valores placeholder.
- 🔜 Adicionar campos CPF e Email no cadastro de usuário
- 🔜 Validar CPF antes de permitir assinatura
