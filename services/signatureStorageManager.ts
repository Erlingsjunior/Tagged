/**
 * 🚀 Signature Storage Manager - Sistema Robusto de Armazenamento Particionado
 *
 * PROBLEMA:
 * AsyncStorage do React Native tem limite de ~196.607 propriedades por chave.
 * Com milhões de assinaturas em milhares de posts, uma única chave não suporta.
 *
 * SOLUÇÃO:
 * Sistema de sharding/particionamento inteligente que:
 * 1. Calcula capacidade de cada partition (shard)
 * 2. Distribui assinaturas em múltiplas chaves dinâmicas
 * 3. Gerencia leitura/escrita automática
 * 4. Escala para milhões de assinaturas e posts
 *
 * ARQUITETURA:
 * - tagged_signatures_0: { "post-1": [...], "post-2": [...] }  // até 180K props
 * - tagged_signatures_1: { "post-2": [...], "post-3": [...] }  // até 180K props
 * - tagged_signatures_2: { "post-3": [...], "post-4": [...] }  // até 180K props
 * - ... dinâmico conforme necessário
 *
 * @author clanChief (Erlings Junior)
 * @version 1.0.0
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// CONFIGURAÇÕES E CONSTANTES
// ============================================================================

/**
 * Limite máximo de propriedades por chave no AsyncStorage
 * Valor real: ~196.607
 * Usamos margem de segurança de 10% para evitar edge cases
 *
 * IMPORTANTE: Este valor refere-se ao número de PROPRIEDADES JavaScript,
 * não ao número de assinaturas. Cada assinatura tem ~3 propriedades
 * (userId, userName, signedAt), então:
 * 180.000 propriedades ÷ 3 = ~60.000 assinaturas por partição
 */
const ASYNCSTORAGE_MAX_PROPERTIES = 180000;

/**
 * Número estimado de propriedades por assinatura
 * (userId, userName, signedAt, userAvatar?)
 */
const PROPERTIES_PER_SIGNATURE = 3;

/**
 * Prefixo base para chaves de assinaturas particionadas
 */
const SIGNATURES_KEY_PREFIX = 'tagged_signatures';

/**
 * Chave para metadados de particionamento
 */
const SIGNATURES_METADATA_KEY = 'tagged_signatures_metadata';

// ============================================================================
// INTERFACES E TIPOS
// ============================================================================

/**
 * Estrutura de uma assinatura
 */
export interface Signature {
    userId: string;
    userName: string;
    signedAt: string;
    userAvatar?: string;
}

/**
 * Mapa de assinaturas por post
 * postId -> array de assinaturas
 */
export type SignaturesMap = Record<string, Signature[]>;

/**
 * Metadados de particionamento
 */
interface PartitionMetadata {
    totalPartitions: number;        // Total de partições criadas
    lastPartitionIndex: number;     // Índice da última partição
    totalSignatures: number;        // Total de assinaturas armazenadas
    postsDistribution: {            // Distribuição de posts por partição
        [partitionIndex: number]: string[];  // Partition -> [postIds]
    };
}

/**
 * Estatísticas de uma partição
 */
interface PartitionStats {
    partitionIndex: number;
    propertiesCount: number;        // Total de propriedades (assinaturas)
    postsCount: number;             // Quantidade de posts nesta partição
    remainingCapacity: number;      // Capacidade restante
    utilizationPercent: number;     // Percentual de utilização
}

// ============================================================================
// CLASSE PRINCIPAL: SignatureStorageManager
// ============================================================================

export class SignatureStorageManager {
    /**
     * Cache em memória de metadados para performance
     */
    private metadataCache: PartitionMetadata | null = null;

    /**
     * Cache em memória de assinaturas carregadas
     */
    private signaturesCache: Map<string, Signature[]> = new Map();

    // ========================================================================
    // MÉTODOS PÚBLICOS - API PRINCIPAL
    // ========================================================================

    /**
     * Salva assinaturas de forma particionada e inteligente
     *
     * @param signaturesMap - Mapa completo de assinaturas por post
     * @returns Promise<void>
     */
    async saveSignatures(signaturesMap: SignaturesMap): Promise<void> {
        console.log('📦 [SignatureStorageManager] Iniciando salvamento particionado...');

        // Calcular total de assinaturas
        const totalSignatures = Object.values(signaturesMap).reduce(
            (acc, sigs) => acc + sigs.length,
            0
        );

        console.log(`📊 Total de assinaturas a salvar: ${totalSignatures.toLocaleString()}`);

        // Limpar partições antigas
        await this.clearAllPartitions();

        // Particionar e salvar
        const partitions = this.partitionSignatures(signaturesMap);

        console.log(`🔀 Dados particionados em ${partitions.length} chave(s)`);

        // Salvar cada partição
        for (let i = 0; i < partitions.length; i++) {
            const key = this.getPartitionKey(i);

            // Contar total de assinaturas nesta partição
            const sigCount = Object.values(partitions[i]).reduce(
                (acc, sigs) => acc + sigs.length,
                0
            );

            console.log(`💾 Salvando partição ${i}: ${Object.keys(partitions[i]).length} posts, ${sigCount.toLocaleString()} assinaturas`);

            const data = JSON.stringify(partitions[i]);

            try {
                await AsyncStorage.setItem(key, data);
                console.log(`✅ Partição ${i} salva com sucesso!`);
            } catch (error) {
                console.error(`❌ Erro ao salvar partição ${i}:`, error);
                throw error;
            }
        }

        // Criar e salvar metadados
        const metadata = this.createMetadata(partitions, signaturesMap);
        await AsyncStorage.setItem(SIGNATURES_METADATA_KEY, JSON.stringify(metadata));

        this.metadataCache = metadata;

        console.log('✅ [SignatureStorageManager] Salvamento concluído com sucesso!');
        this.logStats(metadata);
    }

    /**
     * Carrega todas as assinaturas de todas as partições
     *
     * @returns Promise<Map<string, Signature[]>>
     */
    async loadSignatures(): Promise<Map<string, Signature[]>> {
        console.log('📥 [SignatureStorageManager] Carregando assinaturas...');

        // Carregar metadados
        const metadata = await this.loadMetadata();

        if (!metadata || metadata.totalPartitions === 0) {
            console.log('ℹ️ Nenhuma assinatura encontrada');
            return new Map();
        }

        console.log(`📊 Carregando ${metadata.totalPartitions} partição(ões)...`);

        // Carregar todas as partições
        const allSignatures: SignaturesMap = {};

        for (let i = 0; i < metadata.totalPartitions; i++) {
            const key = this.getPartitionKey(i);
            const data = await AsyncStorage.getItem(key);

            if (data) {
                const partition: SignaturesMap = JSON.parse(data);

                // Mesclar assinaturas da partição
                Object.entries(partition).forEach(([postId, signatures]) => {
                    if (!allSignatures[postId]) {
                        allSignatures[postId] = [];
                    }
                    allSignatures[postId].push(...signatures);
                });

                console.log(`✅ Partição ${i} carregada: ${Object.keys(partition).length} posts`);
            }
        }

        // Converter para Map
        const signaturesMap = new Map(Object.entries(allSignatures));

        console.log(`✅ Total de ${signaturesMap.size} posts com assinaturas carregados`);

        // Atualizar cache
        this.signaturesCache = signaturesMap;

        return signaturesMap;
    }

    /**
     * Carrega assinaturas de um post específico (otimizado)
     *
     * @param postId - ID do post
     * @returns Promise<Signature[]>
     */
    async loadSignaturesForPost(postId: string): Promise<Signature[]> {
        // Verificar cache
        if (this.signaturesCache.has(postId)) {
            return this.signaturesCache.get(postId)!;
        }

        // Carregar metadados
        const metadata = await this.loadMetadata();

        if (!metadata) {
            return [];
        }

        // Encontrar partições que contêm este post
        const partitionsToLoad: number[] = [];

        Object.entries(metadata.postsDistribution).forEach(([partitionIndex, postIds]) => {
            if (postIds.includes(postId)) {
                partitionsToLoad.push(Number(partitionIndex));
            }
        });

        if (partitionsToLoad.length === 0) {
            return [];
        }

        // Carregar apenas as partições necessárias
        let signatures: Signature[] = [];

        for (const partitionIndex of partitionsToLoad) {
            const key = this.getPartitionKey(partitionIndex);
            const data = await AsyncStorage.getItem(key);

            if (data) {
                const partition: SignaturesMap = JSON.parse(data);
                if (partition[postId]) {
                    signatures.push(...partition[postId]);
                }
            }
        }

        // Atualizar cache
        this.signaturesCache.set(postId, signatures);

        return signatures;
    }

    /**
     * Adiciona assinatura a um post existente
     *
     * @param postId - ID do post
     * @param signature - Nova assinatura
     */
    async addSignature(postId: string, signature: Signature): Promise<void> {
        // Carregar todas as assinaturas
        const signaturesMap = await this.loadSignatures();

        // Adicionar nova assinatura
        const postSignatures = signaturesMap.get(postId) || [];
        postSignatures.push(signature);
        signaturesMap.set(postId, postSignatures);

        // Salvar tudo novamente (otimização futura: salvar apenas partição afetada)
        await this.saveSignatures(Object.fromEntries(signaturesMap));
    }

    /**
     * Remove assinatura de um post
     *
     * @param postId - ID do post
     * @param userId - ID do usuário
     */
    async removeSignature(postId: string, userId: string): Promise<void> {
        const signaturesMap = await this.loadSignatures();

        const postSignatures = signaturesMap.get(postId) || [];
        const filtered = postSignatures.filter(sig => sig.userId !== userId);

        signaturesMap.set(postId, filtered);

        await this.saveSignatures(Object.fromEntries(signaturesMap));
    }

    /**
     * Limpa todas as partições de assinaturas
     */
    async clearAllPartitions(): Promise<void> {
        console.log('🗑️ Limpando partições antigas...');

        const metadata = await this.loadMetadata();

        if (metadata) {
            // Remover todas as partições conhecidas
            for (let i = 0; i < metadata.totalPartitions; i++) {
                const key = this.getPartitionKey(i);
                await AsyncStorage.removeItem(key);
            }
        }

        // Remover metadados
        await AsyncStorage.removeItem(SIGNATURES_METADATA_KEY);

        // Limpar cache
        this.metadataCache = null;
        this.signaturesCache.clear();

        console.log('✅ Partições limpas');
    }

    /**
     * Obtém estatísticas detalhadas do armazenamento
     */
    async getStats(): Promise<{
        totalPartitions: number;
        totalSignatures: number;
        totalPosts: number;
        partitions: PartitionStats[];
    }> {
        const metadata = await this.loadMetadata();

        if (!metadata) {
            return {
                totalPartitions: 0,
                totalSignatures: 0,
                totalPosts: 0,
                partitions: [],
            };
        }

        const partitions: PartitionStats[] = [];

        for (let i = 0; i < metadata.totalPartitions; i++) {
            const key = this.getPartitionKey(i);
            const data = await AsyncStorage.getItem(key);

            if (data) {
                const partition: SignaturesMap = JSON.parse(data);
                const propertiesCount = Object.values(partition).reduce(
                    (acc, sigs) => acc + sigs.length,
                    0
                );

                partitions.push({
                    partitionIndex: i,
                    propertiesCount,
                    postsCount: Object.keys(partition).length,
                    remainingCapacity: ASYNCSTORAGE_MAX_PROPERTIES - propertiesCount,
                    utilizationPercent: (propertiesCount / ASYNCSTORAGE_MAX_PROPERTIES) * 100,
                });
            }
        }

        return {
            totalPartitions: metadata.totalPartitions,
            totalSignatures: metadata.totalSignatures,
            totalPosts: Object.keys(metadata.postsDistribution).reduce(
                (acc, key) => acc + metadata.postsDistribution[Number(key)].length,
                0
            ),
            partitions,
        };
    }

    // ========================================================================
    // MÉTODOS PRIVADOS - LÓGICA INTERNA
    // ========================================================================

    /**
     * Particiona assinaturas de forma inteligente
     *
     * ALGORITMO:
     * 1. Itera sobre cada post
     * 2. Calcula quantas assinaturas cabem na partição atual
     * 3. Se não couber tudo, divide entre partições
     * 4. Cria nova partição quando necessário
     */
    private partitionSignatures(signaturesMap: SignaturesMap): SignaturesMap[] {
        console.log('🔀 [Particionamento] Iniciando particionamento inteligente...');
        console.log(`⚠️  IMPORTANTE: Contando PROPRIEDADES (não assinaturas). Cada assinatura = ~${PROPERTIES_PER_SIGNATURE} propriedades`);

        const partitions: SignaturesMap[] = [];
        let currentPartition: SignaturesMap = {};
        let currentPartitionSize = 0; // em PROPRIEDADES

        Object.entries(signaturesMap).forEach(([postId, signatures]) => {
            const signaturesCount = signatures.length;
            const propertiesCount = signaturesCount * PROPERTIES_PER_SIGNATURE; // Calcular propriedades!

            console.log(`   📝 Post ${postId}: ${signaturesCount.toLocaleString()} assinaturas = ${propertiesCount.toLocaleString()} propriedades`);

            // Se as propriedades deste post cabem inteiras na partição atual
            if (currentPartitionSize + propertiesCount <= ASYNCSTORAGE_MAX_PROPERTIES) {
                currentPartition[postId] = signatures;
                currentPartitionSize += propertiesCount;
                console.log(`      ✅ Adicionado à partição atual (total: ${currentPartitionSize.toLocaleString()}/${ASYNCSTORAGE_MAX_PROPERTIES.toLocaleString()} props)`);
            } else {
                // Calcular quanto cabe na partição atual (em propriedades)
                const remainingProperties = ASYNCSTORAGE_MAX_PROPERTIES - currentPartitionSize;
                const remainingSignatures = Math.floor(remainingProperties / PROPERTIES_PER_SIGNATURE);

                console.log(`      ⚠️ Não cabe tudo! Dividindo... (espaço: ${remainingProperties.toLocaleString()} props = ~${remainingSignatures.toLocaleString()} assinaturas)`);

                if (remainingSignatures > 0) {
                    // Dividir assinaturas entre partições
                    currentPartition[postId] = signatures.slice(0, remainingSignatures);
                    currentPartitionSize += (remainingSignatures * PROPERTIES_PER_SIGNATURE);

                    console.log(`      📦 Fechando partição ${partitions.length} (${currentPartitionSize.toLocaleString()} props)`);

                    // Fechar partição atual
                    partitions.push(currentPartition);

                    // Criar nova partição com o restante
                    const remainingSignaturesForNext = signatures.length - remainingSignatures;
                    currentPartition = {
                        [postId]: signatures.slice(remainingSignatures),
                    };
                    currentPartitionSize = remainingSignaturesForNext * PROPERTIES_PER_SIGNATURE;

                    console.log(`      🆕 Nova partição ${partitions.length} criada (${remainingSignaturesForNext.toLocaleString()} assinaturas = ${currentPartitionSize.toLocaleString()} props)`);
                } else {
                    // Partição atual está cheia, criar nova
                    console.log(`      📦 Fechando partição ${partitions.length} (CHEIA: ${currentPartitionSize.toLocaleString()} props)`);
                    partitions.push(currentPartition);

                    currentPartition = {
                        [postId]: signatures,
                    };
                    currentPartitionSize = propertiesCount;

                    console.log(`      🆕 Nova partição ${partitions.length} criada (${signaturesCount.toLocaleString()} assinaturas = ${propertiesCount.toLocaleString()} props)`);
                }
            }
        });

        // Adicionar última partição se não estiver vazia
        if (Object.keys(currentPartition).length > 0) {
            partitions.push(currentPartition);
            console.log(`   ✅ Partição final ${partitions.length - 1} adicionada (${currentPartitionSize.toLocaleString()} props)`);
        }

        console.log(`🎯 [Particionamento] Concluído: ${partitions.length} partição(ões) criada(s)`);

        return partitions;
    }

    /**
     * Cria metadados de particionamento
     */
    private createMetadata(
        partitions: SignaturesMap[],
        originalMap: SignaturesMap
    ): PartitionMetadata {
        const postsDistribution: { [partitionIndex: number]: string[] } = {};

        partitions.forEach((partition, index) => {
            postsDistribution[index] = Object.keys(partition);
        });

        const totalSignatures = Object.values(originalMap).reduce(
            (acc, sigs) => acc + sigs.length,
            0
        );

        return {
            totalPartitions: partitions.length,
            lastPartitionIndex: partitions.length - 1,
            totalSignatures,
            postsDistribution,
        };
    }

    /**
     * Carrega metadados do AsyncStorage
     */
    private async loadMetadata(): Promise<PartitionMetadata | null> {
        if (this.metadataCache) {
            return this.metadataCache;
        }

        const data = await AsyncStorage.getItem(SIGNATURES_METADATA_KEY);

        if (!data) {
            return null;
        }

        const metadata = JSON.parse(data) as PartitionMetadata;
        this.metadataCache = metadata;

        return metadata;
    }

    /**
     * Gera nome da chave para uma partição
     */
    private getPartitionKey(index: number): string {
        return `${SIGNATURES_KEY_PREFIX}_${index}`;
    }

    /**
     * Loga estatísticas de particionamento
     */
    private logStats(metadata: PartitionMetadata): void {
        console.log('📊 Estatísticas de Particionamento:');
        console.log(`   Total de partições: ${metadata.totalPartitions}`);
        console.log(`   Total de assinaturas: ${metadata.totalSignatures.toLocaleString()}`);
        console.log(`   Distribuição:`);

        Object.entries(metadata.postsDistribution).forEach(([partitionIndex, postIds]) => {
            console.log(`      Partição ${partitionIndex}: ${postIds.length} posts`);
        });
    }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

/**
 * Instância singleton do gerenciador
 */
export const signatureStorageManager = new SignatureStorageManager();
