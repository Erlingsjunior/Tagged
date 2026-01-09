# 🔥 FIREBASE SETUP - TAGGED APP

## ✅ Status Atual

- [x] Dependências Firebase instaladas
- [x] Arquivo `config/firebase.ts` criado
- [x] `app.json` configurado
- [ ] **Credenciais Firebase configuradas** ← VOCÊ ESTÁ AQUI
- [ ] Serviço de autenticação criado
- [ ] AuthStore migrado para Firebase

---

## 📋 PRÓXIMOS PASSOS (FAÇA AGORA!)

### PASSO 1: Obter Credenciais do Firebase

1. **Acesse o Console do Firebase**: https://console.firebase.google.com/project/taggedapp-12645

2. **Registrar App Android**:
   - Clique no ícone **Android** (ou "Adicionar app")
   - **Nome do pacote**: `com.tagged.app`
   - **Apelido do app**: Tagged App
   - Clique em **"Registrar app"**

3. **Baixar google-services.json**:
   - O Firebase vai gerar o arquivo `google-services.json`
   - **BAIXE ESSE ARQUIVO**
   - Coloque na raiz do projeto: `C:\Users\Ling\Projetos\Tagged\TaggedApp\google-services.json`

4. **Obter Credenciais Web**:
   - No Console Firebase, clique no ícone **Web** (</>) ou "Adicionar app"
   - **Apelido do app**: Tagged Web
   - Clique em **"Registrar app"**
   - Copie o objeto `firebaseConfig` que aparece

5. **Atualizar `config/firebase.ts`**:
   - Abra o arquivo: `config/firebase.ts`
   - Substitua as credenciais placeholder pelas credenciais reais:

```typescript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "taggedapp-12645.firebaseapp.com",
  projectId: "taggedapp-12645",
  storageBucket: "taggedapp-12645.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

---

### PASSO 2: Habilitar Serviços no Firebase

#### 2.1 Authentication (Email/Password)

1. No menu lateral do Firebase, vá em **Build → Authentication**
2. Clique em **"Começar"** (ou "Get started")
3. Na aba **"Sign-in method"**, encontre **"Email/Password"**
4. Clique nele e **HABILITE** o toggle
5. Clique em **"Salvar"**

#### 2.2 Firestore Database

1. No menu lateral do Firebase, vá em **Build → Firestore Database**
2. Clique em **"Criar banco de dados"** (ou "Create database")
3. Escolha **"Modo de teste"** (Start in test mode) - por enquanto
4. Escolha localização: **southamerica-east1** (São Paulo) - mais rápido para Brasil
5. Clique em **"Ativar"**

#### 2.3 Firebase Storage

1. No menu lateral do Firebase, vá em **Build → Storage**
2. Clique em **"Começar"** (ou "Get started")
3. Escolha **"Modo de teste"** (Start in test mode)
4. Clique em **"Concluído"**

---

### PASSO 3: Configurar Regras de Segurança (Básicas)

#### Firestore Rules

1. Vá em **Firestore Database → Rules**
2. Cole estas regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Usuários
    match /users/{userId} {
      allow read: if true; // Perfis são públicos
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if request.auth != null && request.auth.uid == userId;
    }

    // Posts (Denúncias)
    match /posts/{postId} {
      allow read: if true; // Posts são públicos
      allow create: if request.auth != null; // Qualquer usuário autenticado pode criar
      allow update: if request.auth != null &&
                      (request.auth.uid == resource.data.authorId ||
                       request.auth.token.admin == true);
      allow delete: if request.auth != null &&
                      (request.auth.uid == resource.data.authorId ||
                       request.auth.token.admin == true);

      // Assinaturas (Likes/Supports)
      match /signatures/{userId} {
        allow read: if true;
        allow create: if request.auth != null && request.auth.uid == userId;
        allow delete: if request.auth != null && request.auth.uid == userId;
      }

      // Comentários
      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update, delete: if request.auth != null &&
                                request.auth.uid == resource.data.authorId;
      }
    }

    // Conversas (Chat)
    match /conversations/{conversationId} {
      allow read: if request.auth != null &&
                    request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
                      request.auth.uid in resource.data.participants;

      match /messages/{messageId} {
        allow read: if request.auth != null &&
                      request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants;
        allow create: if request.auth != null &&
                        request.auth.uid in get(/databases/$(database)/documents/conversations/$(conversationId)).data.participants;
      }
    }
  }
}
```

3. Clique em **"Publicar"**

#### Storage Rules

1. Vá em **Storage → Rules**
2. Cole estas regras:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Avatares de usuário
    match /users/{userId}/avatar.jpg {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Evidências e mídias de posts
    match /posts/{postId}/{allPaths=**} {
      allow read: if true; // Público
      allow write: if request.auth != null; // Apenas autenticados podem fazer upload
    }
  }
}
```

3. Clique em **"Publicar"**

---

## ✅ CHECKLIST FINAL

Marque quando completar cada item:

- [ ] google-services.json baixado e colocado na raiz do projeto
- [ ] Credenciais atualizadas em `config/firebase.ts`
- [ ] Authentication (Email/Password) habilitado
- [ ] Firestore Database criado
- [ ] Firebase Storage criado
- [ ] Regras de segurança do Firestore publicadas
- [ ] Regras de segurança do Storage publicadas

---

## 🚀 APÓS COMPLETAR O CHECKLIST

Me avise e eu vou:
1. Criar o serviço de autenticação Firebase
2. Migrar o AuthStore para usar Firebase (mantendo backward compatibility)
3. Testar login/registro real
4. Verificar se tudo está funcionando

---

## 🆘 PROBLEMAS COMUNS

### "google-services.json não encontrado"
**Solução**: Certifique-se que o arquivo está em `C:\Users\Ling\Projetos\Tagged\TaggedApp\google-services.json` (raiz do projeto)

### "Firebase not initialized"
**Solução**: Verifique se as credenciais em `config/firebase.ts` estão corretas

### "Permission denied" no Firestore
**Solução**: Verifique se as regras de segurança foram publicadas corretamente

---

## 📞 DÚVIDAS?

Me avise em qual passo você está e eu te ajudo!
