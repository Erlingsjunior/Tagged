# SpreadTagged - Implementação P2P

## Visão Geral

O sistema SpreadTagged permite que usuários compartilhem o app Tagged diretamente entre dispositivos, sem necessidade de internet, usando WiFi Direct (Android) ou tecnologias P2P equivalentes.

## Arquitetura

### 1. WiFi Direct Service (`services/wifiDirectService.ts`)

Serviço singleton que gerencia toda a lógica de comunicação P2P:

#### Funcionalidades Principais:

- **Inicialização e Permissões**
  - Solicita permissões necessárias (WiFi, Location, Nearby Devices)
  - Verifica disponibilidade da plataforma
  - Inicializa o serviço WiFi Direct

- **Modo Compartilhamento (Share)**
  - `startSharing()`: Inicia o modo de compartilhamento
  - Torna o dispositivo visível para outros
  - Aguarda conexões de dispositivos receptores
  - `stopSharing()`: Encerra o compartilhamento

- **Modo Recepção (Receive)**
  - `startReceiving()`: Inicia a busca por dispositivos
  - Descobre dispositivos próximos compartilhando o Tagged
  - `stopReceiving()`: Encerra a busca

- **Transferência de Arquivos**
  - `connectToDevice(deviceId)`: Conecta a um dispositivo específico
  - Simula transferência de APK (~50MB)
  - Atualiza progresso em tempo real
  - Notifica conclusão e atualiza estatísticas

#### Estruturas de Dados:

```typescript
interface DeviceInfo {
    id: string;
    name: string;
    type: "android" | "ios" | "unknown";
}

interface TransferProgress {
    connectionId: string;
    bytesTransferred: number;
    totalBytes: number;
    percentage: number;
}
```

### 2. Spread Store (`stores/spreadStore.ts`)

Store Zustand com persistência que gerencia o estado global do sistema P2P:

#### Estado:

- `stats`: Estatísticas de compartilhamento do usuário
  - `totalShared`: Total de vezes que compartilhou
  - `peopleReached`: Total de pessoas alcançadas
  - `totalBytesShared`: Total de dados compartilhados
  - `shareHistory`: Histórico dos últimos 50 compartilhamentos

- `activeConnections`: Array de conexões ativas
- `isSharing`: Flag indicando se está compartilhando
- `isReceiving`: Flag indicando se está recebendo

#### Actions:

- `startSharing()` / `stopSharing()`
- `startReceiving()` / `stopReceiving()`
- `addConnection()` / `updateConnection()` / `removeConnection()`
- `incrementShared()` / `addToHistory()` / `updateBytesShared()`

### 3. SpreadTagged Screen (`app/spreadTagged/index.tsx`)

Interface do usuário completa para gerenciar compartilhamento P2P:

#### Componentes Principais:

1. **Hero Section**
   - Título com o motto "Nossa voz, sua força, muda tudo."
   - Ícone de compartilhamento
   - Descrição da funcionalidade

2. **Action Buttons**
   - Botão "Compartilhar Core" (azul)
     - Alterna para "Parar Compartilhamento" quando ativo
     - Desabilitado quando está no modo Receive
   - Botão "Receber Core" (verde)
     - Alterna para "Parar Busca" quando ativo
     - Desabilitado quando está no modo Share

3. **Discovered Devices** (visível apenas no modo Receive)
   - Lista de dispositivos encontrados
   - Toque para conectar e iniciar download
   - Ícone baseado no tipo de dispositivo

4. **Stats Section**
   - Vezes Compartilhado
   - Pessoas Alcançadas
   - Conexões Ativas

5. **Active Connections**
   - Lista de transferências em andamento
   - Barra de progresso para cada transferência
   - Status em tempo real (connecting, transferring, completed, failed)

6. **Info Section**
   - Informações sobre como usar o recurso
   - Requisitos e limitações

## Fluxo de Uso

### Compartilhar Tagged:

1. Usuário toca em "Compartilhar Core"
2. Sistema solicita confirmação
3. WiFi Direct é iniciado (solicita permissões se necessário)
4. Dispositivo fica visível para outros
5. Quando outro dispositivo conecta:
   - Conexão aparece na lista "Conexões Ativas"
   - Progresso da transferência é exibido em tempo real
   - Ao concluir, estatísticas são atualizadas
6. Usuário pode parar o compartilhamento a qualquer momento

### Receber Tagged:

1. Usuário toca em "Receber Core"
2. Sistema solicita confirmação
3. WiFi Direct inicia busca por dispositivos
4. Dispositivos encontrados aparecem na seção "Dispositivos Encontrados"
5. Usuário toca em um dispositivo para conectar
6. Sistema inicia download do APK
7. Progresso é exibido em "Conexões Ativas"
8. Ao concluir, usuário pode instalar o APK

## Implementação Atual

### Status: Funcional com Simulação

A implementação atual é funcional e está pronta para uso, mas utiliza simulação para algumas funcionalidades:

#### Implementado:
✅ Interface completa e responsiva
✅ Gerenciamento de estado com Zustand
✅ Sistema de permissões
✅ Descoberta de dispositivos (simulada)
✅ Conexão e transferência (simulada)
✅ Progresso em tempo real
✅ Estatísticas e histórico
✅ Integração com perfil do usuário

#### Simulado (requer implementação nativa):
⚠️ WiFi Direct real (Android)
⚠️ Descoberta real de dispositivos
⚠️ Transferência real de arquivos
⚠️ APK bundling e extração

## Próximos Passos para Produção

### 1. Implementar Módulo Nativo WiFi Direct

```bash
# Opção 1: Criar módulo nativo customizado
# - Criar módulo Android em Java/Kotlin
# - Implementar WiFi Direct APIs
# - Bridge com React Native

# Opção 2: Usar biblioteca existente
npm install react-native-wifi-p2p
```

### 2. Build e Bundle do APK

- Configurar build do APK
- Incluir APK nos assets do app
- Implementar extração do APK em runtime

### 3. Adicionar Permissões ao AndroidManifest.xml

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
<uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES" />
```

### 4. Implementar Transferência Real

- Usar FileSystem API para ler/escrever arquivos
- Implementar protocolo de transferência (chunks)
- Adicionar verificação de integridade (checksum)
- Implementar retry em caso de falha

### 5. Melhorias de UX

- Adicionar notificações durante transferência
- Implementar auto-instalação do APK (Android)
- Adicionar QR Code para facilitar emparelhamento
- Implementar descoberta via Bluetooth como fallback

## Considerações de Segurança

- Implementar autenticação entre dispositivos
- Verificar integridade do APK (SHA256)
- Criptografar transferência
- Validar permissões antes de iniciar

## Testes

### Teste Manual:
1. Abrir app em dois dispositivos Android
2. Device A: Tocar em "Compartilhar Core"
3. Device B: Tocar em "Receber Core"
4. Verificar se Device B encontra Device A
5. Conectar e verificar progresso
6. Verificar estatísticas atualizadas

### Teste Automatizado:
- Unit tests para wifiDirectService
- Integration tests para spreadStore
- E2E tests para fluxo completo

## Dependências

```json
{
  "expo-file-system": "^17.0.0",
  "expo-sharing": "^12.0.0",
  "zustand": "^4.5.0",
  "@react-native-async-storage/async-storage": "^1.21.0"
}
```

## Referências

- [Android WiFi Direct Documentation](https://developer.android.com/guide/topics/connectivity/wifip2p)
- [React Native WiFi P2P](https://github.com/kirillzyusko/react-native-wifi-p2p)
- [Expo File System](https://docs.expo.dev/versions/latest/sdk/filesystem/)
