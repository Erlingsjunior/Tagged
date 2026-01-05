export interface FileItem {
    id: string;
    name: string;
    type: "image" | "video" | "document" | "audio";
    size: string;
    uri?: string;
    mimeType?: string;
}

export interface FilePickerFile {
    id: string;
    name: string;
    uri: string;
    type: string;
    size: number;
    mimeType?: string;
}

export interface FilePickerProps {
    files: FileItem[];
    onFilesChange: (files: FileItem[]) => void;
    maxFiles?: number;
    allowedTypes?: ("image" | "video" | "document" | "audio")[];
    maxFileSize?: number; // em MB
    initialFiles?: FilePickerFile[];
    disabled?: boolean;
    errorMessage?: string;
    placeholder?: string;
    title?: string;
    subtitle?: string;
}

export interface FilePickerState {
    files: FilePickerFile[];
    isLoading: boolean;
    error: string | null;
}

export type FilePickerRef = {
    openPicker: () => void;
    clearFiles: () => void;
    removeFile: (fileId: string) => void;
};
