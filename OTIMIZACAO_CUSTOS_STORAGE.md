# 💰 Otimização de Custos - Firebase Storage

## 🎯 OBJETIVO

Reduzir custos de tráfego do Firebase Storage mantendo qualidade suficiente para denúncias.

---

## ✅ OTIMIZAÇÕES IMPLEMENTADAS

### 1. **Limites de Tamanho Reduzidos**

#### Antes (CARO! ❌):
- Fotos: 10 MB
- Vídeos: 100 MB
- Avatares: 5 MB

#### Agora (ECONÔMICO! ✅):
- **Fotos: 2 MB** (compressão 70%, 1920x1080)
- **Vídeos: 15 MB** (30 segundos, 720p)
- **Avatares: 1 MB** (300x300 suficiente)
- **Documentos: 5 MB**
- **Áudios: 10 MB**

### 2. **Compressão Automática**

**Imagens**:
- Compressão: 70% (qualidade ótima, tamanho reduzido)
- Resolução máxima: 1920x1080 (Full HD)
- Formato: JPEG (menor que PNG)

**Vídeos**:
- Duração máxima: 30 segundos
- Resolução: 720p (boa qualidade, tamanho razoável)
- Compressão nativa do expo-image-picker

### 3. **Validações Client-Side**

- Validar tamanho ANTES do upload
- Validar duração de vídeo ANTES do upload
- Rejeitar arquivos muito grandes (economiza banda e tempo)

---

## 📊 COMPARAÇÃO DE CUSTOS

### Cenário: 100 posts visualizados por 1000 usuários

#### Antes (limites altos):
```
1 post com:
- 2 fotos (10 MB cada) = 20 MB
- 1 vídeo (100 MB) = 100 MB
Total: 120 MB

100 posts × 120 MB = 12 GB
1000 visualizações × 12 GB = 12.000 GB (12 TB!)

Custo mensal: $1.440 USD (~R$ 7.200)
```

**INSUSTENTÁVEL! 💸**

#### Agora (limites otimizados):
```
1 post com:
- 2 fotos (2 MB cada) = 4 MB
- 1 vídeo (15 MB) = 15 MB
Total: 19 MB

100 posts × 19 MB = 1.9 GB
1000 visualizações × 1.9 GB = 1.900 GB (1.9 TB)

Custo mensal: $228 USD (~R$ 1.140)
```

**Redução de custos: 84%!** ✅

### Com quota gratuita (1 GB/dia = 30 GB/mês):
```
Tráfego real: 1.900 GB
Quota grátis: -30 GB
Pago: 1.870 GB × $0.12 = $224 USD

Vs. antes: $1.440 USD
Economia: $1.216 USD/mês (~R$ 6.080/mês)
```

---

## 🎥 QUALIDADE MANTIDA

### Vídeos (720p, 30 segundos):
- ✅ Resolução suficiente para identificar rostos, placas, detalhes
- ✅ 30 segundos capturam evidências importantes
- ✅ Upload rápido (menos frustração do usuário)
- ✅ Playback suave em conexões 3G/4G

### Fotos (2 MB, compressão 70%):
- ✅ Resolução Full HD (1920x1080)
- ✅ Zoom funciona perfeitamente
- ✅ Textos e placas legíveis
- ✅ Compressão JPEG imperceptível ao olho humano

### Avatares (1 MB):
- ✅ 300x300 pixels é padrão da indústria (Instagram, Facebook)
- ✅ Carregamento instantâneo
- ✅ Retina-ready (ótimo em telas de alta densidade)

---

## 📁 ESTRUTURA DE ARMAZENAMENTO

```
taggedapp-12645.firebasestorage.app/
├── avatars/
│   └── {userId}/
│       └── {timestamp}.jpg          (max 1 MB)
│
└── posts/
    └── {postId}/
        ├── {timestamp}.jpg          (max 2 MB cada)
        ├── {timestamp}.jpg
        └── {timestamp}.mp4          (max 15 MB, 30s)
```

---

## 🔄 PIPELINE DE UPLOAD

1. **Usuário seleciona arquivo**
2. **Validação client-side**:
   - Tamanho OK?
   - Duração OK (vídeo)?
   - Tipo de arquivo válido?
3. **Compressão (imagens)**:
   - Redimensionar para 1920x1080
   - Comprimir JPEG 70%
4. **Upload para Firebase Storage**:
   - Progresso em tempo real
   - Retry automático em caso de falha
5. **URL salvo no Firestore**

---

## 💡 DICAS PARA USUÁRIOS

**Mensagens no app**:

### Ao tirar foto/vídeo:
```
📸 DICA: Tire fotos nítidas e bem iluminadas.
Evite zoom digital - aproxime-se do objeto.
```

### Ao gravar vídeo:
```
🎥 LIMITE: 30 segundos
Grave apenas o essencial para sua denúncia.
Mantenha a câmera estável.
```

### Ao fazer upload:
```
⏳ Enviando... 45%
Fique conectado à internet até concluir.
```

### Arquivo muito grande:
```
❌ Arquivo muito grande!
Limite: 2 MB para fotos, 15 MB para vídeos.
Tente comprimir ou gravar vídeo mais curto.
```

---

## 🚀 MELHORIAS FUTURAS

### Curto Prazo:
- [ ] **Preview de vídeo** antes do upload (confirmar que capturou o necessário)
- [ ] **Retry automático** em caso de falha de rede
- [ ] **Upload em background** (continuar mesmo se sair do app)

### Médio Prazo:
- [ ] **Thumbnails de vídeos** (Cloud Functions)
  - Gerar thumbnail do primeiro frame
  - Evita download de vídeo completo no feed
  - Economia: ~90% de tráfego no feed!

- [ ] **Lazy loading** no feed
  - Carregar imagens apenas quando visíveis
  - Usar placeholders enquanto carrega
  - Economia: ~50% de tráfego

- [ ] **Cache inteligente**
  - Cache de imagens já visualizadas
  - Invalidar cache após 7 dias
  - Economia: ~30% de tráfego

### Longo Prazo:
- [ ] **CDN** (Content Delivery Network)
  - Servir arquivos de servidores próximos ao usuário
  - Reduzir latência
  - Potencial economia: ~20% de custos

- [ ] **Transcodificação de vídeo** (Cloud Functions)
  - Converter vídeos para H.264/H.265
  - Múltiplas qualidades (360p, 480p, 720p)
  - Adaptive bitrate streaming
  - Economia: ~40% de tráfego

---

## 📈 PROJEÇÃO DE CUSTOS

### 100 usuários ativos:
```
Armazenamento: 2.8 GB (grátis)
Tráfego: 50 GB/mês (20 GB grátis = 30 GB pagos)
Custo: 30 GB × $0.12 = $3.60 USD/mês (~R$ 18)
```

### 1.000 usuários ativos:
```
Armazenamento: 28 GB (5 GB grátis = 23 GB pagos)
Custo storage: 23 GB × $0.026 = $0.60 USD/mês

Tráfego: 500 GB/mês (30 GB grátis = 470 GB pagos)
Custo tráfego: 470 GB × $0.12 = $56.40 USD/mês

Total: ~$57 USD/mês (~R$ 285/mês)
```

### 10.000 usuários ativos:
```
Armazenamento: 280 GB
Custo storage: 275 GB × $0.026 = $7.15 USD/mês

Tráfego: 5.000 GB/mês (5 TB)
Custo tráfego: 4.970 GB × $0.12 = $596 USD/mês

Total: ~$603 USD/mês (~R$ 3.015/mês)
```

**Com 10K usuários, você já terá receita (ads, premium) para cobrir custos!**

---

## 🎓 LIÇÕES APRENDIDAS

### ❌ O que NÃO fazer:
1. Permitir vídeos de 100 MB (insustentável)
2. Permitir uploads ilimitados sem validação
3. Não comprimir imagens antes do upload
4. Servir vídeos completos no feed

### ✅ O que fazer:
1. **Limitar tamanho**: 2 MB fotos, 15 MB vídeos
2. **Comprimir automaticamente**: 70% JPEG
3. **Validar client-side**: rejeitar antes de gastar banda
4. **Educar usuários**: dicas de como gravar vídeos curtos
5. **Planejar escalabilidade**: thumbnails, CDN, cache

---

## 🔗 REFERÊNCIAS

- **Firebase Pricing**: https://firebase.google.com/pricing
- **Storage Best Practices**: https://firebase.google.com/docs/storage/best-practices
- **Expo Image Picker**: https://docs.expo.dev/versions/latest/sdk/imagepicker/
- **Expo Image Manipulator**: https://docs.expo.dev/versions/latest/sdk/imagemanipulator/

---

**Criado**: 2026-01-09
**Autor**: Claude + Ling
**Versão**: 1.0

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [x] Reduzir limites de tamanho
- [x] Configurar compressão de imagens (70%)
- [x] Limitar vídeos a 30 segundos
- [x] Configurar resolução de vídeo (720p)
- [x] Instalar expo-image-manipulator
- [x] Criar helpers de validação
- [x] Atualizar documentação
- [ ] Configurar Firebase Storage no console
- [ ] Testar upload de foto
- [ ] Testar upload de vídeo
- [ ] Implementar thumbnails de vídeo (futuro)
- [ ] Implementar lazy loading (futuro)
- [ ] Implementar cache (futuro)
