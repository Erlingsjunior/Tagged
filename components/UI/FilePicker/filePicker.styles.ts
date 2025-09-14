import styled from "styled-components/native";
import { theme } from "../../../constants/Theme";

export const Container = styled.View`
    margin-bottom: ${theme.spacing.lg}px;
`;

export const Label = styled.Text`
    font-size: 16px;
    font-weight: 700;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.sm}px;
`;

export const Subtitle = styled.Text`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.md}px;
    line-height: 20px;
`;

export const DropZone = styled.TouchableOpacity<{ hasFiles: boolean }>`
    border: 2px dashed
        ${({ hasFiles }: any) =>
            hasFiles ? theme.colors.primary : theme.colors.border};
    border-radius: ${theme.borderRadius.md}px;
    padding: ${theme.spacing.lg}px;
    align-items: center;
    margin-bottom: ${theme.spacing.md}px;
    background-color: ${({ hasFiles }: { hasFiles: any }) =>
        hasFiles ? `${theme.colors.primary}0D` : theme.colors.surface};
`;

export const DropZoneIcon = styled.View`
    width: 48px;
    height: 48px;
    justify-content: center;
    align-items: center;
    margin-bottom: ${theme.spacing.md}px;
`;

export const DropZoneTitle = styled.Text`
    font-size: 16px;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.xs}px;
    font-weight: 600;
`;

export const DropZoneSubtitle = styled.Text`
    font-size: 14px;
    color: ${theme.colors.text.secondary};
    text-align: center;
`;

export const FilesContainer = styled.View``;

export const FileItem = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing.md}px;
    background-color: ${theme.colors.surface};
    border-radius: ${theme.borderRadius.md}px;
    margin-bottom: ${theme.spacing.sm}px;
    border: 1px solid ${theme.colors.border};
`;

export const FileInfo = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1;
`;

export const FileIconContainer = styled.View`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: ${theme.colors.card};
    justify-content: center;
    align-items: center;
    margin-right: ${theme.spacing.md}px;
`;

export const FileDetails = styled.View`
    flex: 1;
`;

export const FileName = styled.Text`
    font-size: 14px;
    color: ${theme.colors.text.primary};
    font-weight: 500;
    margin-bottom: 2px;
`;

export const FileSize = styled.Text`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
`;

export const RemoveButton = styled.TouchableOpacity`
    width: 32px;
    height: 32px;
    border-radius: 16px;
    justify-content: center;
    align-items: center;
    background-color: rgba(244, 67, 54, 0.1);
`;

export const MaxFilesWarning = styled.View`
    padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
    background-color: rgba(255, 152, 0, 0.1);
    border-radius: ${theme.borderRadius.sm}px;
    border: 1px solid rgba(255, 152, 0, 0.3);
    margin-bottom: ${theme.spacing.md}px;
`;

export const WarningText = styled.Text`
    font-size: 12px;
    color: ${theme.colors.warning};
    font-weight: 500;
    text-align: center;
`;
