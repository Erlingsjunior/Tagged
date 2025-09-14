export interface FileItem {
    id: string;
    name: string;
    type: "image" | "video" | "document" | "audio";
    size: string;
    uri?: string;
    mimeType?: string;
}

export interface FilePickerProps {
    files: FileItem[];
    onFilesChange: (files: FileItem[]) => void;
    maxFiles?: number;
    allowedTypes?: ("image" | "video" | "document" | "audio")[];
    title?: string;
    subtitle?: string;
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
    maxFiles?: number;
    allowedTypes?: FileItem["type"][];
    maxFileSize?: number; // em MB
    onFilesChange: (Files: FileItem[]) => void;
    initialFiles?: FilePickerFile[];
    disabled?: boolean;
    errorMessage?: string;
    placeholder?: string;
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
