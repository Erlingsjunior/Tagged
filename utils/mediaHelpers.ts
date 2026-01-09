/**
 * 🖼️ Media Helpers
 *
 * Utilitários para processamento de mídia (imagens e vídeos).
 * Inclui validação, compressão e otimização.
 */

import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Comprimir imagem para reduzir tamanho
 *
 * - Redimensiona imagens grandes para 1920x1080 (Full HD)
 * - Comprime com qualidade 70%
 * - Mantém aspect ratio
 */
export const compressImage = async (uri: string): Promise<string> => {
    try {
        console.log('🖼️ Comprimindo imagem:', uri);

        const manipulatedImage = await ImageManipulator.manipulateAsync(
            uri,
            [
                // Redimensionar se maior que Full HD
                { resize: { width: 1920 } }, // Mantém aspect ratio
            ],
            {
                compress: 0.7, // 70% de qualidade
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );

        console.log('✅ Imagem comprimida:', manipulatedImage.uri);
        return manipulatedImage.uri;
    } catch (error) {
        console.error('❌ Erro ao comprimir imagem:', error);
        return uri; // Retorna original se falhar
    }
};

/**
 * Validar duração de vídeo
 */
export const validateVideoDuration = (durationSeconds: number): boolean => {
    const MAX_DURATION = 30; // 30 segundos
    return durationSeconds <= MAX_DURATION;
};

/**
 * Validar tamanho de arquivo
 */
export const validateFileSize = (sizeBytes: number, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return sizeBytes <= maxSizeBytes;
};

/**
 * Formatar bytes para string legível
 */
export const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Validar tipo de mídia
 */
export const isValidMediaType = (mimeType: string): boolean => {
    const validTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'video/mp4',
        'video/quicktime', // MOV
        'video/x-msvideo', // AVI
    ];

    return validTypes.includes(mimeType.toLowerCase());
};

/**
 * Obter tipo de mídia a partir do MIME type
 */
export const getMediaType = (mimeType: string): 'image' | 'video' | 'unknown' => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'unknown';
};

/**
 * Calcular tempo estimado de upload
 *
 * Baseado em velocidade média de upload de 5 Mbps (rede móvel 4G)
 */
export const estimateUploadTime = (sizeBytes: number): number => {
    const UPLOAD_SPEED_BYTES_PER_SECOND = (5 * 1024 * 1024) / 8; // 5 Mbps
    return Math.ceil(sizeBytes / UPLOAD_SPEED_BYTES_PER_SECOND);
};

/**
 * Formatar segundos para string legível
 */
export const formatSeconds = (seconds: number): string => {
    if (seconds < 60) {
        return `${seconds} segundo${seconds !== 1 ? 's' : ''}`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (remainingSeconds === 0) {
        return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    }

    return `${minutes}m ${remainingSeconds}s`;
};
