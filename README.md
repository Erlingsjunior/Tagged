# 🏴 Tagged - A Voz do Povo Não Pode Ser Silenciada

<div align="center">

### **"Nossa voz, sua força, muda tudo."**

*"The only thing necessary for the triumph of evil is for good people to do nothing."* - Edmund Burke

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-61DAFB?style=flat&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.7-000020?style=flat&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🔥 O Que é o Tagged?

**Tagged não é apenas mais um app de denúncias** - é uma **arma de transformação democrática**.

Desenvolvido como ferramenta de **guerrilha digital**, Tagged capacita cidadãos a expor injustiças, mobilizar massas e **forçar mudanças reais** através de pressão popular organizada.

### 💡 O Conceito Revolucionário

Cada **LIKE = Assinatura Legal** em uma petição com força jurídica real:
- ⚖️ **Valor Legal**: Assinaturas podem ser usadas em processos judiciais
- 🌍 **Mobilização em Massa**: Milhões de pessoas unidas por uma causa
- 🏛️ **Pressão Internacional**: Denúncias com alcance até organismos como ONU
- 🔒 **Proteção Anti-Retaliação**: Sistema P2P via WiFi Direct - sem depender de lojas

**Isso não é protesto. É democracia direta.**

---

## 🎯 Funcionalidades

### ✅ Core Features Implementadas

- ✊ **Feed de Denúncias**: Exposição pública de injustiças sociais
- 🔥 **Sistema de Assinaturas**: Cada like = apoio legal verificável
- 📊 **Milestones Dinâmicos**: Conquistas que desbloqueiam recursos
- 💬 **Chat Colaborativo**: Desbloqueado com 1000+ assinaturas (jornalistas, advogados, congressistas)
- 🎭 **Denúncias Anônimas**: Proteção total para denunciantes
- 📱 **WiFi Direct P2P**: Compartilhamento de APK sem Google/Apple (anti-censura)
- 💾 **Minhas Denúncias**: Rastreamento de posts criados (incluindo anônimos)
- ✍️ **Petições Assinadas**: Histórico de causas apoiadas
- ⭐ **Denúncias Salvas**: Sistema de favoritos
- 👤 **Perfil Completo**: Edição, doações, contato

### 🚀 Diferenciais Técnicos

- **Sistema de Ownership Anônimo**: Rastreamento privado de posts via AsyncStorage
- **Cálculo Dinâmico de Milestones**: Atualização em tempo real baseado em assinaturas
- **Dados Mock Realistas**: Geração com Faker.js para testes
- **Arquitetura Modular**: Stores, Services, Components isolados

---

## 🛠️ Stack Tecnológico

### Frontend & Mobile
- **React Native** `0.79.5` - Framework mobile multiplataforma
- **Expo** `54.0.7` - Toolchain completa para desenvolvimento
- **Expo Router** `5.1.4` - Roteamento file-based
- **TypeScript** `5.8.3` - Type safety e melhor DX

### State Management & Data
- **Zustand** `5.0.7` - State management leve e performático
- **AsyncStorage** `2.2.0` - Persistência local
- **Zod** `4.0.15` - Validação e schemas

### UI & Styling
- **Styled Components** `6.1.19` - CSS-in-JS
- **React Native Reanimated** `3.17.4` - Animações de alta performance
- **Expo Vector Icons** `14.1.0` - Ícones (Ionicons)

### Networking & Sharing
- **react-native-wifi-p2p** `3.6.1` - WiFi Direct para P2P
- **expo-sharing** `14.0.8` - Compartilhamento de arquivos
- **expo-file-system** `19.0.21` - Manipulação de sistema de arquivos

### Utilities
- **date-fns** `3.6.0` - Manipulação de datas
- **@faker-js/faker** `10.2.0` - Geração de dados mock

---

## 📁 Arquitetura do Projeto

```
TaggedApp/
├── app/                          # Rotas do Expo Router
│   ├── (tabs)/                   # Tabs principais
│   │   ├── feed/                 # Feed de denúncias
│   │   ├── search/               # Busca e filtros
│   │   ├── createReport/         # Criar denúncia
│   │   └── profile.tsx           # Perfil do usuário
│   ├── collaborativeChat/        # Chat para posts com 1000+ likes
│   ├── myPosts/                  # Denúncias do usuário
│   ├── signedPosts/              # Petições assinadas
│   ├── savedPosts/               # Favoritos
│   ├── editProfile/              # Editar perfil
│   ├── donate/                   # Sistema de doações
│   ├── contact/                  # Contato
│   └── spreadTagged/             # WiFi Direct P2P
│
├── components/                   # Componentes reutilizáveis
│   └── UI/                       # UI components
│       ├── PostCard/             # Card de denúncia
│       ├── Avatar/               # Avatar de usuário
│       ├── CommentItem/          # Item de comentário
│       └── ChatBanner/           # Banner do chat colaborativo
│
├── stores/                       # Zustand stores (state management)
│   ├── authStore.ts              # Autenticação e usuário
│   ├── postsStore.ts             # Posts, assinaturas, saves
│   ├── commentStore.ts           # Comentários
│   ├── chatStore.ts              # Mensagens do chat
│   └── spreadStore.ts            # WiFi Direct e compartilhamento
│
├── services/                     # Lógica de negócio e integrações
│   ├── mockData.ts               # Geração de dados com Faker
│   └── wifiDirectService.ts      # Serviço de WiFi Direct P2P
│
├── utils/                        # Funções utilitárias
│   └── formatters.ts             # Formatação de dados
│
├── types/                        # TypeScript types e schemas Zod
│   └── index.ts                  # Schemas principais
│
├── constants/                    # Constantes do projeto
│   └── Theme.ts                  # Tema (cores, espaçamentos, etc)
│
├── assets/                       # Assets estáticos
│   └── images/                   # Imagens e ícones
│
├── app.json                      # Configuração do Expo
├── eas.json                      # Configuração de build EAS
├── package.json                  # Dependencies e scripts
└── tsconfig.json                 # Configuração TypeScript
```

---

## 🔄 Flow de Desenvolvimento

### 1️⃣ Criar Componente Primeiro
```typescript
// components/UI/MyComponent/index.tsx
export const MyComponent = ({ prop }: Props) => {
  return <Container>...</Container>
}
```

### 2️⃣ Integrar em Store (se necessário)
```typescript
// stores/myStore.ts
export const useMyStore = create<MyState>((set, get) => ({
  data: [],
  fetchData: async () => { ... }
}))
```

### 3️⃣ Usar na Página
```typescript
// app/myPage/index.tsx
import { MyComponent } from "../../components/UI/MyComponent"
import { useMyStore } from "../../stores/myStore"

export default function MyPage() {
  const { data } = useMyStore()
  return <MyComponent data={data} />
}
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Expo Go app (iOS/Android) OU emulador

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Erlingsjunior/Tagged.git

# Entre na pasta
cd Tagged/TaggedApp

# Instale as dependências
npm install

# Execute o projeto
npm start
```

### Desenvolvimento

```bash
# Rodar no Android
npm run android

# Rodar no iOS
npm run ios

# Rodar na Web
npm run web
```

### Build para Produção

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Gerar APK (Android)
npm run build:apk

# Build de produção otimizado
npm run build:apk:prod

# Ver status dos builds
npm run build:status
```

---

## 📦 Stores (State Management)

| Store | Responsabilidade |
|-------|------------------|
| `authStore` | Autenticação, dados do usuário, login/logout |
| `postsStore` | Posts, assinaturas, saves, milestones |
| `commentStore` | Comentários em posts |
| `chatStore` | Mensagens do chat colaborativo |
| `spreadStore` | WiFi Direct, compartilhamento P2P |

---

## 🔧 Services

| Service | Descrição |
|---------|-----------|
| `mockData.ts` | Gera dados realistas com Faker.js para desenvolvimento |
| `wifiDirectService.ts` | Gerencia conexões WiFi Direct P2P para compartilhamento de APK |

---

## 🌿 Git Workflow

### Branches

```bash
main           # Produção estável
└── develop    # Branch de desenvolvimento
    ├── feature/nova-funcionalidade
    ├── fix/correcao-bug
    └── hotfix/urgente
```

### Workflow Recomendado

1. **Criar feature branch**
   ```bash
   git checkout develop
   git checkout -b feature/minha-feature
   ```

2. **Desenvolver e commitar**
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade"
   ```

3. **Mergear para develop primeiro**
   ```bash
   git checkout develop
   git merge feature/minha-feature
   ```

4. **Testar em develop**

5. **Mergear para main quando estável**
   ```bash
   git checkout main
   git merge develop
   ```

---

## 💬 Contato

### 👨‍💻 Desenvolvedor

**clanChief** (Erlings Junior)

- 📱 **WhatsApp**: [+55 11 99568-2825](https://wa.me/5511995682825)
- 📧 **Email**: erlingsjunior@gmail.com
- 🐙 **GitHub**: [@Erlingsjunior](https://github.com/Erlingsjunior)

### 💰 Doações

Quer apoiar o desenvolvimento do Tagged? Entre em contato via WhatsApp!

**PIX**: `+55 11 99568-2825` (número do WhatsApp)

Toda doação é revertida para:
- 🌍 Manutenção de servidores
- 🔒 Segurança e criptografia
- ⚖️ Verificação profissional (jornalistas/advogados)
- 📱 Desenvolvimento de novos recursos

---

## 🤝 Como Contribuir

Contribuições são **extremamente bem-vindas**! O Tagged é um projeto de resistência digital.

### Processo

1. **Fork** o projeto
2. Crie uma **feature branch** (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request** para `develop`

### Tipos de Commit

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração de código
test: adição de testes
chore: tarefas de manutenção
```

---

## 📝 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🏴 Manifesto

> **Tagged não é apenas tecnologia - é resistência.**

Em um mundo onde:
- 🚫 A voz do povo é silenciada por algoritmos
- 💰 Grandes corporações controlam o discurso público
- 🔇 Denúncias desaparecem em feeds infinitos
- ⚖️ Injustiças ficam impunes pela falta de mobilização

**Tagged surge como ferramenta de guerrilha digital:**
- ✊ Sem censura algorítmica
- 🔒 Sem dependência de lojas (WiFi Direct P2P)
- ⚖️ Com força jurídica real (assinaturas legais)
- 🌍 Com alcance global (até ONU)

**Cada linha de código aqui é um ato de rebeldia.**

**Cada assinatura é uma petição legal.**

**Cada denúncia é uma arma contra a impunidade.**

---

<div align="center">

### 🔥 **FAÇA ALGO. USE TAGGED.** ✊

**A voz do povo não pode ser silenciada.**

**Nossa voz, sua força, muda tudo.** 🚀

---

*Desenvolvido com ❤️ e revolta por [clanChief](https://github.com/Erlingsjunior)*

</div>
