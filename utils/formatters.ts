import { PostCategory } from "../types";

/**
 * Formata números grandes para formato legível (1K, 1M, etc)
 */
export const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

/**
 * Calcula tempo relativo (há X minutos/horas/dias)
 */
export const getTimeAgo = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `há ${diffMins} minutos`;
    if (diffHours < 24) return `há ${diffHours} horas`;
    return `há ${diffDays} dias`;
};

/**
 * Retorna a cor da categoria
 */
export const getCategoryColor = (category: PostCategory | string): string => {
    switch (category) {
        case "corruption":
            return "#DC2626";
        case "police_violence":
            return "#7C3AED";
        case "discrimination":
            return "#DB2777";
        case "environment":
            return "#059669";
        case "health":
            return "#2563EB";
        case "education":
            return "#F59E0B";
        case "transport":
            return "#6366F1";
        default:
            return "#64748B";
    }
};

/**
 * Retorna o label traduzido da categoria
 */
export const getCategoryLabel = (category: PostCategory | string): string => {
    const labels: Record<string, string> = {
        corruption: "Corrupção",
        police_violence: "Violência Policial",
        discrimination: "Discriminação",
        environment: "Meio Ambiente",
        health: "Saúde",
        education: "Educação",
        transport: "Transporte",
        other: "Outros",
    };
    return labels[category] || "Outros";
};

/**
 * Retorna o ícone apropriado para tipo de arquivo
 */
export const getFileIcon = (type: string): string => {
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

/**
 * Trunca texto para número máximo de caracteres
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

/**
 * Formata tamanho de arquivo para formato legível (KB, MB, GB)
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${bytes} B`;
};
