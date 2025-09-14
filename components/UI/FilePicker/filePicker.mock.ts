import { FileItem } from "./filePicker.types";

export const generateMockFile = (index: number): FileItem => {
    const types: FileItem["type"][] = ["image", "video", "document", "audio"];
    const type = types[Math.floor(Math.random() * types.length)];

    const extensions = {
        image: "jpg",
        video: "mp4",
        document: "pdf",
        audio: "mp3",
    };

    return {
        id: Date.now().toString() + index,
        name: `evidence_${index + 1}`,
        type,
        size: `${(Math.random() * 5 + 1).toFixed(1)}MB`,
        uri: `mock://file_${index}.${extensions[type]}`,
        mimeType: `${type}/${extensions[type]}`,
    };
};
