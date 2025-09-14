import React from "react";
import { Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FilePickerProps } from "./filePicker.types";
import { generateMockFile } from "./filePicker.mock";
import * as S from "./filePicker.styles";
import { theme } from "../../../constants/Theme";

export const FilePicker: React.FC<FilePickerProps> = ({
    files,
    onFilesChange,
    maxFiles = 10,
    allowedTypes = ["image", "video", "document", "audio"],
    title = "Evidence Files (Optional)",
    subtitle = "Add photos, videos, documents, or audio recordings as evidence",
}) => {
    const getFileIcon = (type: string) => {
        switch (type) {
            case "image":
                return "image";
            case "video":
                return "videocam";
            case "document":
                return "document-text";
            case "audio":
                return "musical-notes";
            default:
                return "document";
        }
    };

    const getFileIconColor = (type: string) => {
        switch (type) {
            case "image":
                return "#4CAF50";
            case "video":
                return "#2196F3";
            case "document":
                return "#FF9800";
            case "audio":
                return "#9C27B0";
            default:
                return theme.colors.text.secondary;
        }
    };

    const handleAddFile = () => {
        if (files.length >= maxFiles) {
            Alert.alert(
                "Maximum files reached",
                `You can only add up to ${maxFiles} files.`,
                [{ text: "OK" }]
            );
            return;
        }

        // Em um app real, aqui seria usado expo-image-picker ou expo-document-picker
        // Para demonstração, vamos adicionar um arquivo mock
        const newFile = generateMockFile(files.length);
        onFilesChange([...files, newFile]);
    };

    const handleRemoveFile = (fileId: string) => {
        Alert.alert(
            "Remove File",
            "Are you sure you want to remove this file?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => {
                        onFilesChange(
                            files.filter((file) => file.id !== fileId)
                        );
                    },
                },
            ]
        );
    };

    const isMaxFilesReached = files.length >= maxFiles;

    return (
        <S.Container>
            <S.Label>{title}</S.Label>

            <S.Subtitle>{subtitle}</S.Subtitle>

            {isMaxFilesReached && (
                <S.MaxFilesWarning>
                    <S.WarningText>
                        Maximum of {maxFiles} files reached. Remove a file to
                        add another.
                    </S.WarningText>
                </S.MaxFilesWarning>
            )}

            <S.DropZone
                hasFiles={files.length > 0}
                onPress={handleAddFile}
                activeOpacity={0.8}
                disabled={isMaxFilesReached}
            >
                <S.DropZoneIcon>
                    <Ionicons
                        name='add'
                        size={48}
                        color={
                            files.length > 0
                                ? theme.colors.primary
                                : theme.colors.text.secondary
                        }
                    />
                </S.DropZoneIcon>

                <S.DropZoneTitle>
                    {files.length > 0 ? "Add More Files" : "Add Evidence Files"}
                </S.DropZoneTitle>

                <S.DropZoneSubtitle>
                    Tap to select from camera, gallery, or documents
                </S.DropZoneSubtitle>
            </S.DropZone>

            <S.FilesContainer>
                {files.map((file) => (
                    <S.FileItem key={file.id}>
                        <S.FileInfo>
                            <S.FileIconContainer>
                                <Ionicons
                                    name={getFileIcon(file.type) as any}
                                    size={20}
                                    color={getFileIconColor(file.type)}
                                />
                            </S.FileIconContainer>

                            <S.FileDetails>
                                <S.FileName>
                                    {file.name}.
                                    {file.type === "image"
                                        ? "jpg"
                                        : file.type === "video"
                                        ? "mp4"
                                        : file.type === "document"
                                        ? "pdf"
                                        : "mp3"}
                                </S.FileName>
                                <S.FileSize>{file.size}</S.FileSize>
                            </S.FileDetails>
                        </S.FileInfo>

                        <S.RemoveButton
                            onPress={() => handleRemoveFile(file.id)}
                        >
                            <Ionicons
                                name='close'
                                size={16}
                                color={theme.colors.error}
                            />
                        </S.RemoveButton>
                    </S.FileItem>
                ))}
            </S.FilesContainer>
        </S.Container>
    );
};
