/**
 * 📷 Media Picker Component
 *
 * Componente para selecionar fotos/vídeos da galeria ou tirar foto/vídeo com a câmera.
 */

import React, { useState } from 'react';
import { View, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styled from 'styled-components/native';
import { theme } from '../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { uploadPostMedia, UploadResult, formatFileSize } from '../services/firebaseStorageService';

// ========== STYLED COMPONENTS ==========

const Container = styled(View)`
    width: 100%;
`;

const PickerButtonsContainer = styled(View)`
    flex-direction: row;
    gap: ${theme.spacing.md}px;
    margin-bottom: ${theme.spacing.md}px;
`;

const PickerButton = styled.TouchableOpacity<{ variant?: 'primary' | 'secondary' }>`
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing.sm}px;
    padding: ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.md}px;
    background-color: ${props =>
        props.variant === 'primary' ? theme.colors.primary : theme.colors.surface};
    border: 1px solid ${props =>
        props.variant === 'primary' ? theme.colors.primary : theme.colors.border};
`;

const ButtonText = styled.Text<{ variant?: 'primary' | 'secondary' }>`
    font-size: 14px;
    font-weight: 600;
    color: ${props =>
        props.variant === 'primary' ? '#fff' : theme.colors.text};
`;

const MediaPreviewContainer = styled(ScrollView)`
    max-height: 200px;
`;

const MediaPreviewGrid = styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${theme.spacing.sm}px;
`;

const MediaPreviewItem = styled(View)`
    width: 100px;
    height: 100px;
    border-radius: ${theme.borderRadius.md}px;
    overflow: hidden;
    position: relative;
    background-color: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
`;

const MediaImage = styled.Image`
    width: 100%;
    height: 100%;
`;

const MediaTypeLabel = styled(View)<{ type: string }>`
    position: absolute;
    bottom: 4px;
    left: 4px;
    background-color: ${props =>
        props.type === 'video' ? theme.colors.primary : theme.colors.success};
    padding: 2px 6px;
    border-radius: 4px;
`;

const MediaTypeLabelText = styled.Text`
    color: #fff;
    font-size: 10px;
    font-weight: 600;
`;

const RemoveButton = styled.TouchableOpacity`
    position: absolute;
    top: 4px;
    right: 4px;
    background-color: ${theme.colors.error};
    width: 24px;
    height: 24px;
    border-radius: 12px;
    align-items: center;
    justify-content: center;
`;

const UploadingOverlay = styled(View)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    align-items: center;
    justify-content: center;
`;

const UploadProgressText = styled.Text`
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    margin-top: 4px;
`;

// ========== TYPES ==========

export interface MediaFile {
    uri: string;
    type: 'image' | 'video';
    uploadResult?: UploadResult;
}

interface MediaPickerProps {
    postId?: string; // Se fornecido, faz upload automaticamente
    maxFiles?: number;
    allowImages?: boolean;
    allowVideos?: boolean;
    onMediaChange?: (media: MediaFile[]) => void;
    onUploadComplete?: (results: UploadResult[]) => void;
}

// ========== COMPONENT ==========

export default function MediaPicker({
    postId,
    maxFiles = 5,
    allowImages = true,
    allowVideos = true,
    onMediaChange,
    onUploadComplete,
}: MediaPickerProps) {
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});

    // ========== PERMISSIONS ==========

    const requestCameraPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permissão Necessária',
                'Precisamos de permissão para acessar a câmera.'
            );
            return false;
        }
        return true;
    };

    const requestGalleryPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permissão Necessária',
                'Precisamos de permissão para acessar a galeria.'
            );
            return false;
        }
        return true;
    };

    // ========== PICK FROM GALLERY ==========

    const pickFromGallery = async () => {
        const hasPermission = await requestGalleryPermission();
        if (!hasPermission) return;

        if (mediaFiles.length >= maxFiles) {
            Alert.alert('Limite atingido', `Você pode adicionar no máximo ${maxFiles} arquivos.`);
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: allowImages && allowVideos
                    ? 'mixed'
                    : allowImages
                    ? 'images'
                    : 'videos',
                allowsMultipleSelection: true,
                quality: 0.7, // Compressão maior para reduzir tamanho
                videoMaxDuration: 30, // 30 segundos máximo
                videoQuality: 1, // 720p (0=low, 1=medium/720p, 2=high/1080p)
            });

            if (!result.canceled && result.assets) {
                const newFiles: MediaFile[] = result.assets.map(asset => ({
                    uri: asset.uri,
                    type: asset.type === 'video' ? 'video' : 'image',
                }));

                const totalFiles = mediaFiles.length + newFiles.length;
                if (totalFiles > maxFiles) {
                    Alert.alert(
                        'Limite atingido',
                        `Você pode adicionar no máximo ${maxFiles} arquivos. Selecionando apenas os primeiros ${maxFiles - mediaFiles.length}.`
                    );
                    newFiles.splice(maxFiles - mediaFiles.length);
                }

                const updatedMedia = [...mediaFiles, ...newFiles];
                setMediaFiles(updatedMedia);
                onMediaChange?.(updatedMedia);

                // Upload automático se postId fornecido
                if (postId) {
                    await uploadMedia(newFiles);
                }
            }
        } catch (error) {
            console.error('Erro ao selecionar da galeria:', error);
            Alert.alert('Erro', 'Não foi possível selecionar o arquivo.');
        }
    };

    // ========== TAKE PHOTO/VIDEO ==========

    const takePhoto = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;

        if (mediaFiles.length >= maxFiles) {
            Alert.alert('Limite atingido', `Você pode adicionar no máximo ${maxFiles} arquivos.`);
            return;
        }

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: allowVideos ? 'mixed' : 'images',
                quality: 0.7, // Compressão maior para reduzir tamanho
                videoMaxDuration: 30, // 30 segundos máximo
                videoQuality: 1, // 720p (0=low, 1=medium/720p, 2=high/1080p)
            });

            if (!result.canceled && result.assets?.[0]) {
                const asset = result.assets[0];
                const newFile: MediaFile = {
                    uri: asset.uri,
                    type: asset.type === 'video' ? 'video' : 'image',
                };

                const updatedMedia = [...mediaFiles, newFile];
                setMediaFiles(updatedMedia);
                onMediaChange?.(updatedMedia);

                // Upload automático se postId fornecido
                if (postId) {
                    await uploadMedia([newFile]);
                }
            }
        } catch (error) {
            console.error('Erro ao tirar foto/vídeo:', error);
            Alert.alert('Erro', 'Não foi possível capturar a mídia.');
        }
    };

    // ========== UPLOAD ==========

    const uploadMedia = async (files: MediaFile[]) => {
        if (!postId) return;

        try {
            setUploading(true);

            const filesToUpload = files.map(f => ({
                uri: f.uri,
                type: f.type,
            }));

            const results = await uploadPostMedia(
                filesToUpload,
                postId,
                (fileIndex, progress) => {
                    setUploadProgress(prev => ({
                        ...prev,
                        [fileIndex]: progress.progress,
                    }));
                }
            );

            // Atualizar mediaFiles com resultados do upload
            setMediaFiles(prev =>
                prev.map((file, index) => {
                    const uploadResult = results.find((_, i) => i === index);
                    return uploadResult ? { ...file, uploadResult } : file;
                })
            );

            onUploadComplete?.(results);
            setUploadProgress({});
            setUploading(false);

            console.log('✅ Upload concluído!', results);
        } catch (error) {
            console.error('❌ Erro no upload:', error);
            setUploading(false);
            Alert.alert('Erro', 'Falha ao fazer upload das mídias.');
        }
    };

    // ========== REMOVE ==========

    const removeMedia = (index: number) => {
        const updatedMedia = mediaFiles.filter((_, i) => i !== index);
        setMediaFiles(updatedMedia);
        onMediaChange?.(updatedMedia);
    };

    // ========== RENDER ==========

    return (
        <Container>
            <PickerButtonsContainer>
                <PickerButton variant="primary" onPress={pickFromGallery}>
                    <Ionicons name="images-outline" size={20} color="#fff" />
                    <ButtonText variant="primary">Galeria</ButtonText>
                </PickerButton>

                <PickerButton variant="secondary" onPress={takePhoto}>
                    <Ionicons name="camera-outline" size={20} color={theme.colors.text} />
                    <ButtonText variant="secondary">Câmera</ButtonText>
                </PickerButton>
            </PickerButtonsContainer>

            {mediaFiles.length > 0 && (
                <MediaPreviewContainer horizontal={false}>
                    <MediaPreviewGrid>
                        {mediaFiles.map((file, index) => (
                            <MediaPreviewItem key={index}>
                                <MediaImage source={{ uri: file.uri }} resizeMode="cover" />

                                <MediaTypeLabel type={file.type}>
                                    <MediaTypeLabelText>
                                        {file.type === 'video' ? 'VÍDEO' : 'FOTO'}
                                    </MediaTypeLabelText>
                                </MediaTypeLabel>

                                <RemoveButton onPress={() => removeMedia(index)}>
                                    <Ionicons name="close" size={16} color="#fff" />
                                </RemoveButton>

                                {uploading && uploadProgress[index] !== undefined && (
                                    <UploadingOverlay>
                                        <ActivityIndicator color="#fff" />
                                        <UploadProgressText>
                                            {uploadProgress[index]}%
                                        </UploadProgressText>
                                    </UploadingOverlay>
                                )}
                            </MediaPreviewItem>
                        ))}
                    </MediaPreviewGrid>
                </MediaPreviewContainer>
            )}
        </Container>
    );
}
