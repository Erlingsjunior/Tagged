# WiFi Direct Implementation Guide - Tagged P2P

## Status Atual

✅ **Concluído:**
- Tela SpreadTagged com UI completa
- Store de gerenciamento de conexões e estatísticas
- Navegação desde o perfil
- Monitoramento de conexões ativas
- Estatísticas de compartilhamento

⏳ **Pendente:**
- Implementação WiFi Direct nativa
- Permissões Android
- Transferência de arquivos
- Descoberta de dispositivos

---

## Arquitetura Implementada

### 1. Tela Principal (`app/spreadTagged/index.tsx`)

**Recursos:**
- Botão "Compartilhar Core" - Inicia modo de compartilhamento
- Botão "Receber Core" - Busca dispositivos próximos
- Estatísticas em tempo real (total compartilhado, pessoas alcançadas, conexões ativas)
- Lista de conexões ativas com progresso
- Seção informativa sobre WiFi Direct

### 2. Store de Spread (`stores/spreadStore.ts`)

**Gerencia:**
- `stats`: Estatísticas de compartilhamento
- `activeConnections`: Conexões ativas em tempo real
- `isSharing/isReceiving`: Estados de compartilhamento
- Histórico de compartilhamentos (últimos 50)

**Funções principais:**
- `startSharing()` / `stopSharing()`
- `startReceiving()` / `stopReceiving()`
- `addConnection()` / `updateConnection()` / `removeConnection()`
- `incrementShared()` / `addToHistory()`

### 3. Perfil do Usuário

Adicionado menu "Espalhar Tagged" com badge "P2P" na seção de Configurações.

---

## Próximos Passos - Implementação WiFi Direct

### Opção 1: React Native WiFi P2P (Recomendado)

**Biblioteca:** `react-native-wifi-p2p`

```bash
npm install react-native-wifi-p2p
```

**Vantagens:**
- Específico para WiFi Direct
- Suporta descoberta de dispositivos
- Gerenciamento de conexões
- Transferência de dados

**Configuração Android (`android/app/src/main/AndroidManifest.xml`):**

```xml
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>
<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
```

**Código exemplo:**

```typescript
import {
  initialize,
  startDiscoveringPeers,
  stopDiscoveringPeers,
  subscribeOnPeersUpdates,
  connect,
  disconnect,
  getAvailablePeers,
  sendFile,
  receiveFile,
} from 'react-native-wifi-p2p';

// Inicializar WiFi P2P
await initialize();

// Descobrir dispositivos
await startDiscoveringPeers();

// Escutar dispositivos encontrados
subscribeOnPeersUpdates(({ devices }) => {
  console.log('Dispositivos encontrados:', devices);
  // Atualizar UI com dispositivos disponíveis
});

// Conectar a um dispositivo
await connect(deviceAddress);

// Enviar arquivo
await sendFile(filePath);

// Receber arquivo
await receiveFile(destinationPath);
```

---

### Opção 2: Expo Sharing + Local Network (Alternativa Simples)

Se WiFi Direct for muito complexo, você pode usar uma abordagem híbrida:

1. **Expo Sharing** para exportar o APK
2. **Socket.IO** ou **WebRTC** para comunicação P2P local

```bash
npx expo install expo-sharing expo-file-system
```

---

## Implementação Recomendada

### Passo 1: Adicionar Permissões

Editar `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.NEARBY_WIFI_DEVICES" />
```

### Passo 2: Criar Serviço WiFi Direct

Criar `services/wifiDirect.ts`:

```typescript
import { Platform, PermissionsAndroid } from 'react-native';
import {
  initialize,
  startDiscoveringPeers,
  subscribeOnPeersUpdates,
  connect,
  sendFile,
  receiveFile,
} from 'react-native-wifi-p2p';

export class WiFiDirectService {
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') return false;

    const permissions = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_WIFI_STATE,
      PermissionsAndroid.PERMISSIONS.CHANGE_WIFI_STATE,
    ]);

    return Object.values(permissions).every(
      (p) => p === PermissionsAndroid.RESULTS.GRANTED
    );
  }

  static async initializeWiFiDirect(): Promise<void> {
    await initialize();
  }

  static async discoverPeers(
    onDeviceFound: (devices: any[]) => void
  ): Promise<void> {
    await startDiscoveringPeers();

    subscribeOnPeersUpdates(({ devices }) => {
      onDeviceFound(devices);
    });
  }

  static async connectToDevice(deviceAddress: string): Promise<void> {
    await connect(deviceAddress);
  }

  static async shareApp(apkPath: string): Promise<void> {
    await sendFile(apkPath);
  }

  static async receiveApp(destinationPath: string): Promise<void> {
    await receiveFile(destinationPath);
  }
}
```

### Passo 3: Integrar na Tela SpreadTagged

Atualizar `app/spreadTagged/index.tsx`:

```typescript
import { WiFiDirectService } from '../../services/wifiDirect';

// No handleShare:
const handleShare = async () => {
  const hasPermissions = await WiFiDirectService.requestPermissions();

  if (!hasPermissions) {
    Alert.alert('Permissões Necessárias', 'É necessário permitir acesso à localização e WiFi.');
    return;
  }

  startSharing();
  await WiFiDirectService.initializeWiFiDirect();
  await WiFiDirectService.discoverPeers((devices) => {
    // Atualizar lista de dispositivos disponíveis
    console.log('Dispositivos:', devices);
  });
};
```

### Passo 4: Exportar APK para Compartilhamento

O app precisa ter acesso ao próprio APK para compartilhar. Opções:

1. **Buildar APK e incluir no bundle:**
```bash
eas build --platform android --profile production
```

2. **Baixar APK de um servidor:**
```typescript
const APK_URL = 'https://yourdomain.com/tagged.apk';

await FileSystem.downloadAsync(
  APK_URL,
  FileSystem.documentDirectory + 'tagged.apk'
);
```

3. **Compartilhar link de download:**
```typescript
import * as Sharing from 'expo-sharing';

await Sharing.shareAsync(apkPath);
```

---

## Fluxo Completo de Compartilhamento

### Dispositivo Emissor (Share):

1. ✅ Usuário clica em "Compartilhar Core"
2. ✅ App solicita permissões
3. ⏳ Inicializa WiFi Direct
4. ⏳ Fica em modo "discoverable"
5. ⏳ Aguarda conexão de receptores
6. ⏳ Quando receptor conecta, envia APK
7. ✅ Atualiza estatísticas após conclusão

### Dispositivo Receptor (Receive):

1. ✅ Usuário clica em "Receber Core"
2. ✅ App solicita permissões
3. ⏳ Inicializa WiFi Direct
4. ⏳ Busca por dispositivos compartilhando
5. ⏳ Mostra lista de dispositivos encontrados
6. ⏳ Usuário seleciona dispositivo e conecta
7. ⏳ Recebe APK e salva
8. ⏳ Solicita instalação do APK

---

## Considerações Importantes

### Segurança:
- Implementar hash MD5/SHA256 do APK para validação
- Criptografar transferência (opcional)
- Verificar assinatura do APK

### Performance:
- Mostrar progresso da transferência
- Permitir cancelamento
- Implementar retry em caso de falha
- Gerenciar conexões múltiplas

### UX:
- Feedback visual claro
- Notificações de progresso
- Sons de feedback
- Modo offline persistente

### Limitações:
- WiFi Direct é Android-only
- Requer proximidade física (até 200m)
- Dispositivos precisam ter WiFi ativado
- Alguns dispositivos têm implementações bugadas

---

## Bibliotecas Alternativas

Se `react-native-wifi-p2p` não funcionar:

1. **react-native-nearby-api** - Google Nearby Connections (melhor opção)
2. **react-native-ble-plx** - Bluetooth Low Energy (mais lento, mas mais compatível)
3. **WebRTC** - Via hotspot local
4. **Socket.IO** - Via hotspot local

---

## Status das Tarefas

- [x] Interface de usuário completa
- [x] Store de gerenciamento
- [x] Navegação e integração
- [ ] Implementar WiFi Direct Service
- [ ] Adicionar permissões Android
- [ ] Implementar descoberta de dispositivos
- [ ] Implementar transferência de arquivos
- [ ] Implementar instalação de APK
- [ ] Testes em dispositivos reais

---

## Comandos Úteis

```bash
# Instalar biblioteca WiFi P2P
npm install react-native-wifi-p2p

# Rebuild Android
cd android && ./gradlew clean && cd ..
npx expo run:android

# Build APK
eas build --platform android --profile production

# Testar em dispositivo
adb install app.apk
adb logcat *:E
```

---

## Próxima Sessão

Na próxima sessão, podemos:

1. Instalar e configurar `react-native-wifi-p2p`
2. Implementar o serviço WiFi Direct
3. Adicionar descoberta de dispositivos
4. Implementar transferência de arquivos
5. Testar em dispositivos reais

Você quer que eu implemente alguma dessas partes agora?
