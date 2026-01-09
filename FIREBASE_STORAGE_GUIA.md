# 📸 Firebase Storage - Guia Completo

## 🎯 O QUE FOI IMPLEMENTADO

### ✅ Recursos Prontos

1. **Service de Upload** (`services/firebaseStorageService.ts`)
   - Upload de imagens (até 10 MB)
   - Upload de vídeos (até 100 MB)
   - Upload de avatares (até 5 MB)
   - Upload múltiplo com progresso
   - Deletar arquivos
   - Validação de tamanho
   - Formatação de tamanho de arquivo

2. **Componente MediaPicker** (`components/MediaPicker.tsx`)
   - Selecionar fotos/vídeos da galeria
   - Tirar foto/vídeo com câmera
   - Preview de mídia selecionada
   - Upload automático para Firebase Storage
   - Barra de progresso
   - Limite de arquivos configurável
   - Validação de permissões

3. **Integração no CreateReportView**
   - Upload de fotos/vídeos ao criar denúncia
   - URLs salvas no post
   - Feedback visual de progresso

---

## 🔧 CONFIGURAÇÃO DO FIREBASE STORAGE

### Passo 1: Criar Storage no Console

1. Acesse: https://console.firebase.google.com/project/taggedapp-12645/storage
2. Clique em **"Get Started"**
3. Escolha **"Test mode"** (por enquanto)
4. Escolha localização: **`southamerica-east1` (São Paulo)**
5. Clique em **"Done"**

### Passo 2: Configurar Regras de Segurança

Vá em **Storage → Rules** e cole estas regras:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Qualquer usuário autenticado pode ler
    match /{allPaths=**} {
      allow read: if request.auth != null;
    }

    // Upload de avatares (apenas dono pode escrever)
    match /avatars/{userId}/{allPaths=**} {
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }

    // Upload de mídia de posts (qualquer autenticado pode escrever)
    match /posts/{postId}/{allPaths=**} {
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

Clique em **"Publish"**.

### Passo 3: Verificar Configuração

No arquivo `config/firebase.ts`, o Storage já está configurado:

```typescript
import { getStorage } from 'firebase/storage';

export const storage = getStorage(app);
```

---

## 📱 COMO USAR

### 1. Upload de Mídia em Posts

Já está integrado no `CreateReportView`:

```tsx
import MediaPicker from '../../components/MediaPicker';
import { UploadResult } from '../../services/firebaseStorageService';

// No componente:
const [uploadedMedia, setUploadedMedia] = useState<UploadResult[]>([]);
const [postId] = useState(`post-${Date.now()}`);

// No JSX:
<MediaPicker
    postId={postId}
    maxFiles={5}
    allowImages={true}
    allowVideos={true}
    onUploadComplete={(results) => {
        console.log('✅ Upload completo:', results);
        setUploadedMedia(results);
    }}
/>

// Ao criar o post:
const newPost: Post = {
    // ...outros campos
    media: uploadedMedia.map(upload => ({
        type: upload.type,
        url: upload.url,
        thumbnailUrl: upload.url,
    })),
};
```

### 2. Upload de Avatar

```tsx
import { uploadAvatar } from '../services/firebaseStorageService';

const handleAvatarUpload = async (uri: string, userId: string) => {
    try {
        const avatarUrl = await uploadAvatar(
            uri,
            userId,
            (progress) => {
                console.log(`Upload: ${progress.progress}%`);
            }
        );

        console.log('✅ Avatar URL:', avatarUrl);
        // Atualizar usuário no Firestore com avatarUrl
    } catch (error) {
        console.error('❌ Erro no upload:', error);
    }
};
```

### 3. Upload Manual de Arquivo

```tsx
import { uploadFile, UploadResult } from '../services/firebaseStorageService';

const handleUpload = async (uri: string) => {
    try {
        const result: UploadResult = await uploadFile(
            uri,
            'image', // ou 'video', 'document', 'audio'
            'posts/post-123', // pasta de destino
            (progress) => {
                console.log(`Upload: ${progress.progress}%`);
            }
        );

        console.log('✅ Upload completo:', result);
        console.log('URL:', result.url);
        console.log('Path:', result.path);
        console.log('Size:', result.size);
    } catch (error) {
        console.error('❌ Erro no upload:', error);
    }
};
```

### 4. Upload Múltiplo

```tsx
import { uploadMultipleFiles } from '../services/firebaseStorageService';

const handleMultipleUpload = async () => {
    const files = [
        { uri: 'file:///path/to/image1.jpg', type: 'image' as const },
        { uri: 'file:///path/to/video1.mp4', type: 'video' as const },
    ];

    try {
        const results = await uploadMultipleFiles(
            files,
            'posts/post-123',
            (fileIndex, progress) => {
                console.log(`Arquivo ${fileIndex}: ${progress.progress}%`);
            }
        );

        console.log('✅ Todos os uploads concluídos:', results);
    } catch (error) {
        console.error('❌ Erro no upload:', error);
    }
};
```

### 5. Deletar Arquivo

```tsx
import { deleteFile } from '../services/firebaseStorageService';

const handleDelete = async (path: string) => {
    try {
        await deleteFile(path);
        console.log('✅ Arquivo deletado!');
    } catch (error) {
        console.error('❌ Erro ao deletar:', error);
    }
};
```

---

## 📊 ESTRUTURA DO STORAGE

```
taggedapp-12645.firebasestorage.app/
├── avatars/
│   ├── {userId}/
│   │   ├── 1234567890.jpg
│   │   └── 1234567891.jpg
│   └── ...
└── posts/
    ├── {postId}/
    │   ├── 1234567890.jpg
    │   ├── 1234567891.mp4
    │   └── ...
    └── ...
```

---

## 💰 CUSTOS E LIMITES

### Plano Blaze (Pay-as-you-go)

**QUOTA GRATUITA** (renovada mensalmente):
- ✅ **5 GB de armazenamento**
- ✅ **1 GB de download por dia**
- ✅ **20.000 uploads por dia**
- ✅ **50.000 downloads por dia**

**CUSTO APÓS EXCEDER** (São Paulo - southamerica-east1):
- Armazenamento: **$0.026 por GB/mês** (~R$ 0.13/GB)
- Download: **$0.12 por GB** (~R$ 0.60/GB)
- Upload: **$0.05 por GB** (~R$ 0.25/GB)

### Limites de Arquivo (Otimizados para Reduzir Custos)

**IMPORTANTE**: Limites ajustados para economizar tráfego e dinheiro!

- 📸 **Fotos**: 2 MB máximo (compressão 70%, qualidade ótima)
- 🎥 **Vídeos**: 15 MB máximo, 30 segundos, 720p
- 📄 **Documentos**: 5 MB máximo
- 🎵 **Áudios**: 10 MB máximo
- 👤 **Avatares**: 1 MB máximo

### Estimativa de Uso Inicial

Para **100 usuários ativos**:
- 100 avatares (300 KB cada) = 30 MB
- 200 posts com 2 fotos (4 MB) + 1 vídeo (10 MB) cada = 200 × 14 MB = 2.8 GB
- **Total: ~2.8 GB** (muito abaixo dos 5 GB grátis!)

Para **1.000 usuários ativos**:
- 1.000 avatares = 300 MB
- 2.000 posts = ~28 GB armazenamento
- **Tráfego diário** (100 posts visualizados por 1000 pessoas): ~1.4 GB
- **Conclusão**: Com esses limites, você fica dentro da quota gratuita por muito mais tempo!

### Por que esses limites?

**Antes** (limites antigos):
- 1 vídeo de 100 MB × 100 visualizações = **10 GB de tráfego** (10x a quota diária!)
- Insustentável financeiramente

**Agora** (limites otimizados):
- 1 vídeo de 15 MB × 100 visualizações = **1.5 GB de tráfego** (dentro da quota!)
- Qualidade ainda ótima para denúncias
- 30 segundos é tempo suficiente para capturar evidências
- Fotos de 2 MB em 720p são nítidas e claras

---

## 🔒 SEGURANÇA

### Regras Implementadas

1. **Leitura**: Apenas usuários autenticados
2. **Upload de Avatares**: Apenas o dono pode fazer upload/deletar
3. **Upload de Posts**: Qualquer usuário autenticado pode fazer upload
4. **Validação de Tamanho**: Feita no client-side antes do upload

### Melhorias Futuras

- Validar tipo de arquivo no server-side (Cloud Functions)
- Gerar thumbnails automáticos para vídeos
- Compressão automática de imagens grandes
- Watermark em imagens para proteção

---

## 🧪 TESTES

### Testar Upload de Foto

1. Abrir app
2. Ir em "Criar Denúncia"
3. Avançar para etapa "Evidências"
4. Clicar em "Galeria" e selecionar uma foto
5. Verificar barra de progresso
6. Verificar console: `✅ Upload concluído`
7. Continuar criando o post
8. Verificar no Firebase Console → Storage se arquivo apareceu em `posts/{postId}/`

### Testar Upload de Vídeo

1. Seguir passos acima
2. Clicar em "Câmera" e gravar um vídeo curto
3. Verificar upload com progresso
4. Verificar arquivo no Storage

### Verificar no Firebase Console

1. Acessar: https://console.firebase.google.com/project/taggedapp-12645/storage
2. Navegar em `posts/`
3. Clicar em um arquivo
4. Copiar URL pública
5. Colar no navegador para confirmar que abre

---

## 🐛 TROUBLESHOOTING

### Erro: "Storage not configured"

**Solução**: Verificar se `config/firebase.ts` tem:
```typescript
export const storage = getStorage(app);
```

### Erro: "Permission denied"

**Solução**: Verificar regras do Storage no console. Certifique-se de que usuário está autenticado.

### Erro: "File too large"

**Solução**: Validação de tamanho está ativa:
- Imagens: 10 MB
- Vídeos: 100 MB
- Avatares: 5 MB

### Upload trava em 0%

**Possíveis causas**:
1. Internet lenta/instável
2. Arquivo corrompido
3. Permissões de leitura do arquivo negadas

**Solução**: Verificar console do navegador/app para erros detalhados.

---

## 📚 PRÓXIMOS PASSOS

### Curto Prazo
- [ ] Testar upload de foto/vídeo no app
- [ ] Exibir mídia nos posts do feed
- [ ] Implementar upload de avatar do usuário
- [ ] Adicionar compressão de imagens antes do upload

### Médio Prazo
- [ ] Gerar thumbnails de vídeos (Cloud Functions)
- [ ] Cache de imagens para melhor performance
- [ ] Upload em background (continuar mesmo se sair do app)
- [ ] Retry automático em caso de falha

### Longo Prazo
- [ ] Migrar para CDN para melhor performance global
- [ ] Implementar moderação de conteúdo (Cloud Vision API)
- [ ] Sistema de relatório de conteúdo impróprio
- [ ] Backup automático do Storage

---

## 🎓 RECURSOS ADICIONAIS

- **Documentação Oficial**: https://firebase.google.com/docs/storage
- **Pricing**: https://firebase.google.com/pricing
- **Regras de Segurança**: https://firebase.google.com/docs/storage/security
- **Expo Image Picker**: https://docs.expo.dev/versions/latest/sdk/imagepicker/

---

**Última atualização**: 2026-01-09
**Versão**: 1.0
**Autor**: Claude + Ling
