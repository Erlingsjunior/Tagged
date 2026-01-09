/**
 * 🔥 Firebase Storage Service
 *
 * Serviço responsável por upload e gerenciamento de arquivos no Firebase Storage.
 * Suporta: imagens, vídeos, documentos e áudios.
 */

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Tipo de arquivo suportado
 */
export type FileType = 'image' | 'video' | 'document' | 'audio' | 'avatar';

/**
 * Resultado do upload
 */
export interface UploadResult {
    url: string;
    path: string;
    type: FileType;
    size: number;
    name: string;
}

/**
 * Progresso do upload
 */
export interface UploadProgress {
    bytesTransferred: number;
    totalBytes: number;
    progress: number; // 0-100
}

/**
 * Upload de arquivo para Firebase Storage
 *
 * @param uri - URI local do arquivo (file://, content://, etc)
 * @param type - Tipo do arquivo (image, video, document, audio, avatar)
 * @param folder - Pasta de destino (posts/{postId}, avatars/{userId}, etc)
 * @param onProgress - Callback de progresso (opcional)
 * @returns Promise com URL e metadados do arquivo
 */
export const uploadFile = async (
    uri: string,
    type: FileType,
    folder: string,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    try {
        console.log('📤 Iniciando upload:', { uri, type, folder });

        // Converter URI para Blob
        const response = await fetch(uri);
        const blob = await response.blob();

        // Gerar nome único
        const timestamp = Date.now();
        const extension = getFileExtension(uri, type);
        const fileName = `${timestamp}.${extension}`;
        const fullPath = `${folder}/${fileName}`;

        // Criar referência no Storage
        const storageRef = ref(storage, fullPath);

        // Upload com progresso
        const uploadTask = uploadBytesResumable(storageRef, blob, {
            contentType: blob.type || getMimeType(type),
        });

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Progresso
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`📊 Upload ${progress.toFixed(0)}%`);

                    if (onProgress) {
                        onProgress({
                            bytesTransferred: snapshot.bytesTransferred,
                            totalBytes: snapshot.totalBytes,
                            progress: Math.round(progress),
                        });
                    }
                },
                (error) => {
                    // Erro
                    console.error('❌ Erro no upload:', error);
                    reject(error);
                },
                async () => {
                    // Sucesso - obter URL de download
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    const result: UploadResult = {
                        url: downloadURL,
                        path: fullPath,
                        type,
                        size: blob.size,
                        name: fileName,
                    };

                    console.log('✅ Upload concluído:', result);
                    resolve(result);
                }
            );
        });
    } catch (error: any) {
        console.error('❌ Erro ao fazer upload:', error.message);
        throw error;
    }
};

/**
 * Upload de múltiplos arquivos
 */
export const uploadMultipleFiles = async (
    files: Array<{ uri: string; type: FileType }>,
    folder: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadResult[]> => {
    try {
        console.log(`📤 Uploading ${files.length} arquivos...`);

        const results: UploadResult[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const result = await uploadFile(
                file.uri,
                file.type,
                folder,
                onProgress ? (progress) => onProgress(i, progress) : undefined
            );
            results.push(result);
        }

        console.log(`✅ ${results.length} arquivos enviados!`);
        return results;
    } catch (error: any) {
        console.error('❌ Erro ao fazer upload múltiplo:', error.message);
        throw error;
    }
};

/**
 * Deletar arquivo do Storage
 */
export const deleteFile = async (path: string): Promise<void> => {
    try {
        console.log('🗑️ Deletando arquivo:', path);
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
        console.log('✅ Arquivo deletado!');
    } catch (error: any) {
        console.error('❌ Erro ao deletar arquivo:', error.message);
        throw error;
    }
};

/**
 * Deletar múltiplos arquivos
 */
export const deleteMultipleFiles = async (paths: string[]): Promise<void> => {
    try {
        console.log(`🗑️ Deletando ${paths.length} arquivos...`);
        await Promise.all(paths.map(path => deleteFile(path)));
        console.log(`✅ ${paths.length} arquivos deletados!`);
    } catch (error: any) {
        console.error('❌ Erro ao deletar múltiplos arquivos:', error.message);
        throw error;
    }
};

/**
 * Upload de avatar do usuário
 */
export const uploadAvatar = async (
    uri: string,
    userId: string,
    onProgress?: (progress: UploadProgress) => void
): Promise<string> => {
    const result = await uploadFile(uri, 'avatar', `avatars/${userId}`, onProgress);
    return result.url;
};

/**
 * Upload de mídia para post
 */
export const uploadPostMedia = async (
    files: Array<{ uri: string; type: FileType }>,
    postId: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadResult[]> => {
    return uploadMultipleFiles(files, `posts/${postId}`, onProgress);
};

// ========== HELPERS ==========

/**
 * Obter extensão do arquivo
 */
function getFileExtension(uri: string, type: FileType): string {
    // Tentar extrair da URI
    const match = uri.match(/\.(\w+)(?:\?|$)/);
    if (match) {
        return match[1];
    }

    // Fallback baseado no tipo
    const extensions: Record<FileType, string> = {
        image: 'jpg',
        video: 'mp4',
        document: 'pdf',
        audio: 'mp3',
        avatar: 'jpg',
    };

    return extensions[type];
}

/**
 * Obter MIME type
 */
function getMimeType(type: FileType): string {
    const mimeTypes: Record<FileType, string> = {
        image: 'image/jpeg',
        video: 'video/mp4',
        document: 'application/pdf',
        audio: 'audio/mpeg',
        avatar: 'image/jpeg',
    };

    return mimeTypes[type];
}

/**
 * Validar tamanho do arquivo
 *
 * Limites otimizados para reduzir custos de tráfego:
 * - Imagens: 2 MB (suficiente para fotos de celular comprimidas)
 * - Vídeos: 15 MB (30 segundos em 720p com boa compressão)
 * - Documentos: 5 MB (PDFs com várias páginas)
 * - Áudios: 10 MB (áudio de boa qualidade)
 * - Avatares: 1 MB (fotos de perfil pequenas)
 */
export const validateFileSize = (sizeInBytes: number, type: FileType): boolean => {
    const limits: Record<FileType, number> = {
        image: 2 * 1024 * 1024,   // 2 MB
        avatar: 1 * 1024 * 1024,  // 1 MB
        video: 15 * 1024 * 1024,  // 15 MB (30 segundos máx)
        document: 5 * 1024 * 1024,  // 5 MB
        audio: 10 * 1024 * 1024,    // 10 MB
    };

    return sizeInBytes <= limits[type];
};

/**
 * Formatar tamanho de arquivo para exibição
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
