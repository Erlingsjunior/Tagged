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
