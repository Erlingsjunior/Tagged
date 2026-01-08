export interface Signature {
    id: string;
    userId: string;
    name: string;
    cpf: string;
    email: string;
    signedAt: Date;
    ipAddress?: string;
    userAgent?: string;
}

export interface PetitionRequester {
    userId: string;
    name: string;
    cpf: string;
    email: string;
    isAnonymous: boolean;
}

export interface PetitionContent {
    title: string;
    description: string;
    category: string;
    location: {
        city: string;
        state: string;
        country: string;
    };
    tags: string[];
    createdAt: Date;
}

export interface PetitionStats {
    totalSignatures: number;
    totalViews: number;
    totalComments: number;
    totalShares: number;
}

export interface PetitionUpdate {
    id: string;
    title: string;
    content: string;
    author: {
        id: string;
        name: string;
        role: string;
    };
    createdAt: Date;
}

export interface PetitionAchievement {
    id: string;
    badgeName: string;
    badgeDescription: string;
    target: number;
    achieved: boolean;
    achievedAt?: Date;
    icon: string;
    color: string;
}

export interface MediaFile {
    id: string;
    url: string;
    type: 'image' | 'video';
    thumbnail?: string;
    name: string;
    size: number;
    uploadedAt: Date;
}

export interface EvidenceFile {
    id: string;
    url: string;
    type: string;
    name: string;
    size: number;
    uploadedAt: Date;
    thumbnail?: string;
}

export interface Petition {
    id: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;

    requester: PetitionRequester;
    content: PetitionContent;

    media: MediaFile[];
    evidenceFiles: EvidenceFile[];

    stats: PetitionStats;
    achievements: PetitionAchievement[];
    updates: PetitionUpdate[];

    signatures: Signature[];

    permissions: {
        canView: string[];
        canDownload: string[];
    };

    documentHash?: string;
}

export interface PetitionGenerationOptions {
    includeSignatures: boolean;
    includeMedia: boolean;
    includeUpdates: boolean;
    watermarkUserId?: string;
}
