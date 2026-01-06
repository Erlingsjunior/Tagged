# 📦 Guia Completo: Gerar APK do Tagged

## 🎯 Objetivo
Gerar o arquivo APK instalável do Tagged para distribuição Android.

---

## 🚀 MÉTODO 1: EAS Build (RECOMENDADO - MAIS FÁCIL)

### Pré-requisitos
- Conta Expo (gratuita)
- Node.js instalado
- Internet

### Passo 1: Instalar EAS CLI
```bash
npm install -g eas-cli
```

### Passo 2: Login no Expo
```bash
eas login
```
*Caso não tenha conta, crie gratuitamente em: https://expo.dev/signup*

### Passo 3: Configurar o Projeto (já configurado!)
✅ O arquivo `eas.json` já está pronto!
✅ O `app.json` já está configurado!

### Passo 4: Gerar APK
```bash
# APK de Preview (para testes)
eas build --platform android --profile preview

# OU APK de Produção
eas build --platform android --profile production
```

### Passo 5: Aguardar o Build
- O EAS vai buildar na nuvem (~10-20 minutos)
- Você receberá um link para baixar o APK
- O APK pode ser instalado diretamente em qualquer Android

### Passo 6: Download e Instalação
1. Acesse o link fornecido pelo EAS
2. Baixe o arquivo `.apk`
3. Transfira para o celular Android
4. Habilite "Fontes Desconhecidas" nas configurações
5. Instale o APK

---

## 🛠️ MÉTODO 2: Build Local (Mais Controle)

### Pré-requisitos
- Android Studio instalado
- JDK 17 instalado
- Android SDK configurado
- Variáveis de ambiente configuradas

### Passo 1: Preparar o Projeto
```bash
npx expo prebuild
```

### Passo 2: Navegar para pasta Android
```bash
cd android
```

### Passo 3: Gerar APK Debug (para testes)
```bash
# Windows
gradlew assembleDebug

# Linux/Mac
./gradlew assembleDebug
```

O APK estará em: `android/app/build/outputs/apk/debug/app-debug.apk`

### Passo 4: Gerar APK Release (produção)
```bash
# Windows
gradlew assembleRelease

# Linux/Mac
./gradlew assembleRelease
```

O APK estará em: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🔑 Assinatura do APK (Para Google Play)

### Criar Keystore
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore tagged-upload-key.keystore -alias tagged-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### Configurar no android/gradle.properties
```properties
TAGGED_UPLOAD_STORE_FILE=tagged-upload-key.keystore
TAGGED_UPLOAD_KEY_ALIAS=tagged-key-alias
TAGGED_UPLOAD_STORE_PASSWORD=sua_senha_aqui
TAGGED_UPLOAD_KEY_PASSWORD=sua_senha_aqui
```

---

## 📱 WiFi Direct - Núcleo do APK

O APK gerado é o "núcleo" que pode ser compartilhado via WiFi Direct:

1. ✅ Gere o APK usando EAS ou Build Local
2. ✅ O APK terá ~50-80MB
3. ✅ Compartilhe via função "Espalhar Tagged" no app
4. ✅ Outros usuários podem instalar diretamente

---

## 🎯 Comandos Rápidos

### Build Rápido (EAS)
```bash
# Instalar EAS globalmente
npm install -g eas-cli

# Login
eas login

# Build APK
eas build --platform android --profile preview
```

### Verificar Status do Build
```bash
eas build:list
```

### Cancelar Build
```bash
eas build:cancel
```

---

## ⚠️ Troubleshooting

### Erro: "eas not found"
```bash
npm install -g eas-cli
```

### Erro: "Not logged in"
```bash
eas login
```

### Erro: "Build failed"
- Verifique os logs no dashboard do Expo
- Confira se todos os pacotes estão instalados
- Execute: `npm install`

### APK não instala no Android
- Habilite "Instalação de fontes desconhecidas"
- Configurações > Segurança > Fontes Desconhecidas

---

## 📊 Tamanhos Esperados

- **APK Debug**: ~80-100MB
- **APK Release**: ~50-70MB
- **APK com Proguard**: ~30-50MB

---

## 🌟 Próximos Passos

Após gerar o APK:

1. ✅ Teste em dispositivos reais
2. ✅ Configure WiFi Direct para compartilhamento P2P
3. ✅ Distribua para beta testers
4. ✅ Publique na Google Play (opcional)
5. ✅ Espalhe via WiFi Direct para ativistas

---

## 🎉 Pronto!

Agora você tem o APK do **Tagged** - A plataforma de denúncias sociais incensurável!

**VAMOS MUDAR O MUNDO!** 🚀🔥
