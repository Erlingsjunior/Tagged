# 🔥 FIREBASE ATIVADO!

## ✅ O QUE FOI FEITO

### 1. AuthStore Migrado para Firebase ✅

**ANTES** (`authStore.MOCK.backup.ts`):
- Salvava usuários no AsyncStorage local
- Dados só no seu celular
- Não sincroniza com nada

**AGORA** (`authStore.ts`):
- ✅ Salva usuários no **Firebase Authentication**
- ✅ Perfil salvo no **Firestore Database**
- ✅ Sincroniza em tempo real
- ✅ Dados acessíveis de qualquer dispositivo

---

## 🔧 CORREÇÕES FEITAS

### Problema 1: "database or disk is full" ✅
**Solução**: Botão "🧹 Limpar Storage" na tela de login

**Como usar**:
1. Abrir app
2. Tela de login
3. Rolar até embaixo
4. Clicar em "🧹 Limpar Storage (DEBUG)"
5. Confirmar "Limpar Tudo"
6. **Recarregar o app** (Ctrl+R no simulador ou sacudir o celular)

### Problema 2: Nada aparece no Firebase ✅
**Solução**: AuthStore agora usa Firebase real!

**O que vai acontecer AGORA**:
1. Criar conta → Salva no Firebase Authentication
2. Completar perfil → Salva no Firestore Database
3. Login → Busca do Firebase

---

## 🧪 TESTE AGORA - PASSO A PASSO

### Passo 1: Limpar Storage Antigo
```
1. Abrir app
2. Tela de login → Rolar até o fim
3. Clicar "🧹 Limpar Storage (DEBUG)"
4. Confirmar "Limpar Tudo"
5. Recarregar app (Ctrl+R ou sacudir)
```

### Passo 2: Criar Nova Conta (Firebase Real!)
```
1. Clicar "Criar Conta"
2. Preencher:
   - Email: teste@gmail.com
   - Apelido: erlingCEO
   - Senha: 241206lembr4r
3. Clicar "Criar Conta"
4. AGUARDAR...
```

**O QUE VAI ACONTECER**:
- ✅ Console mostra: "📝 Registrando usuário no Firebase..."
- ✅ Firebase Authentication cria usuário
- ✅ Firestore Database cria documento
- ✅ Console mostra: "✅ Usuário registrado: teste@gmail.com"
- ✅ Redirect para Feed

### Passo 3: Verificar no Firebase Console
```
1. Abrir: https://console.firebase.google.com/project/taggedapp-12645
2. Build → Authentication → Users
3. VER: teste@gmail.com listado!

4. Build → Firestore Database → users collection
5. VER: Documento com seu perfil!
```

### Passo 4: Testar Login
```
1. Fazer logout (perfil → sair)
2. Fazer login novamente:
   - Email: teste@gmail.com
   - Senha: 241206lembr4r
3. FUNCIONA!
```

---

## 📊 ESTRUTURA NO FIRESTORE

### Collection: `users`
```
users/
  ├─ {userId}/
  │   ├─ id: "abc123"
  │   ├─ email: "teste@gmail.com"
  │   ├─ name: "Erling Sriubas Junior"
  │   ├─ nickname: "erlingCEO"
  │   ├─ cpf: "123.456.789-00" (opcional)
  │   ├─ phone: "(11) 98765-4321" (opcional)
  │   ├─ profileComplete: false
  │   ├─ verified: false
  │   ├─ role: "user"
  │   ├─ createdAt: "2024-01-09T10:30:00Z"
  │   ├─ stats: {
  │   │   reportsCreated: 0,
  │   │   reportsSigned: 0,
  │   │   impactScore: 0
  │   │ }
  │   ├─ following: []
  │   └─ followers: []
```

---

## 🔍 LOGS DE DEBUG

### Console do App

**Cadastro bem-sucedido**:
```
📝 Registrando usuário no Firebase...
✅ Usuário registrado: teste@gmail.com
```

**Login bem-sucedido**:
```
🔐 Fazendo login no Firebase...
✅ Login bem-sucedido: teste@gmail.com
```

**Completar perfil**:
```
📝 Completando perfil no Firestore...
✅ Perfil completado!
```

**Logout**:
```
👋 Fazendo logout...
✅ Logout bem-sucedido
```

---

## ⚠️ ERROS COMUNS

### Erro 1: "auth/email-already-in-use"
**Causa**: Email já cadastrado
**Solução**: Usar outro email OU deletar usuário antigo no Firebase Console

### Erro 2: "auth/weak-password"
**Causa**: Senha menor que 6 caracteres
**Solução**: Usar senha com pelo menos 6 caracteres

### Erro 3: "auth/invalid-credential"
**Causa**: Email ou senha incorretos
**Solução**: Verificar email e senha

### Erro 4: "auth/too-many-requests"
**Causa**: Muitas tentativas de login falhas
**Solução**: Aguardar alguns minutos

---

## 🚀 PRÓXIMOS PASSOS

### Depois de Testar Cadastro/Login:

#### 1. Migrar Posts para Firestore
- Posts salvos em `posts/` collection
- Assinaturas em `posts/{postId}/signatures/` subcollection

#### 2. Upload de Imagens para Storage
- Fotos de denúncias
- Avatares de usuários
- Evidências

#### 3. Chat em Tempo Real
- Mensagens em Firestore
- Listeners para novas mensagens
- Notificações

#### 4. Cloud Functions
- Atualizar contadores automaticamente
- Gerar PDFs das petições
- Enviar notificações

---

## 📞 TROUBLESHOOTING

### App não conecta ao Firebase?

**Verificar**:
1. ✅ `google-services.json` existe?
2. ✅ Package name é `com.taggedapp`?
3. ✅ Firebase Authentication habilitado?
4. ✅ Firestore Database criado?
5. ✅ Internet funcionando?

**Console do Firebase**:
```
https://console.firebase.google.com/project/taggedapp-12645
```

**Verificar Regras do Firestore**:
```javascript
// Build → Firestore Database → Regras
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🎉 RESULTADO ESPERADO

### Criar Conta:
```
Você cria → Firebase Authentication registra
           → Firestore Database salva perfil
           → Console.firebase.com mostra usuário
           → Login funcionando!
```

### Completar Perfil:
```
Modal → Preenche CPF, Nome, Telefone
      → Firestore atualiza documento
      → profileComplete = true
      → Like liberado!
```

---

## ✅ CHECKLIST FINAL

Antes de testar:
- [ ] Limpar storage antigo (botão 🧹)
- [ ] Recarregar app (Ctrl+R)
- [ ] Verificar internet funcionando
- [ ] Firebase Console aberto em outra aba

Ao criar conta:
- [ ] Preencher email, apelido, senha
- [ ] Ver logs no console
- [ ] Verificar redirect para feed
- [ ] Abrir Firebase Console → Authentication
- [ ] Ver usuário criado
- [ ] Abrir Firestore Database → users
- [ ] Ver documento criado

**PRONTO! Agora é FIREBASE DE VERDADE!** 🔥
