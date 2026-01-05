import { z } from "zod";

export const PostCategorySchema = z.enum([
    "corruption",
    "police_violence",
    "discrimination",
    "environment",
    "health",
    "education",
    "transport",
    "other",
]);

export const PostStatusSchema = z.enum([
    "active",
    "investigating",
    "resolved",
    "archived",
]);

export const PostMediaSchema = z.object({
    type: z.enum(["image", "video"]),
    url: z.string(),
    thumbnail: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    caption: z.string().optional(),
});

export const EvidenceFileSchema = z.object({
    id: z.string(),
    type: z.enum(["image", "video", "document", "audio"]),
    name: z.string(),
    url: z.string(),
    size: z.number(),
    uploadedAt: z.string(),
    thumbnail: z.string().optional(),
});

export const MilestoneSchema = z.object({
    id: z.string(),
    target: z.number(),
    label: z.string(),
    achieved: z.boolean(),
    achievedAt: z.string().optional(),
    icon: z.string(),
    color: z.string(),
});

export const ReportUpdateSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    createdAt: z.string(),
    author: z.object({
        name: z.string(),
        role: z.string(),
    }),
});

export const ActionStatusSchema = z.object({
    investigating: z.boolean().default(false),
    legalAction: z.boolean().default(false),
    governmentAction: z.boolean().default(false),
    executing: z.boolean().default(false),
    hasLawyers: z.boolean().default(false),
    hasNGO: z.boolean().default(false),
});

export const PostSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    category: PostCategorySchema,
    status: PostStatusSchema,
    author: z.object({
        id: z.string(),
        name: z.string(),
        avatar: z.string().optional(),
        verified: z.boolean().default(false),
    }),
    location: z.object({
        city: z.string(),
        state: z.string(),
    }),
    stats: z.object({
        likes: z.number().default(0),
        shares: z.number().default(0),
        comments: z.number().default(0),
        supports: z.number().default(0),
    }),
    media: z.array(PostMediaSchema).default([]),
    tags: z.array(z.string()).default([]),
    createdAt: z.string(),
    updatedAt: z.string(),
    isLiked: z.boolean().default(false),
    isSaved: z.boolean().default(false),
    evidenceFiles: z.array(EvidenceFileSchema).default([]),
    milestones: z.array(MilestoneSchema).default([]),
    updates: z.array(ReportUpdateSchema).default([]),
    actionStatus: ActionStatusSchema.default({
        investigating: false,
        legalAction: false,
        governmentAction: false,
        executing: false,
        hasLawyers: false,
        hasNGO: false,
    }),
    chatUnlocked: z.boolean().default(false),
});

export type Post = z.infer<typeof PostSchema>;
export type PostCategory = z.infer<typeof PostCategorySchema>;
export type PostStatus = z.infer<typeof PostStatusSchema>;
export type PostMedia = z.infer<typeof PostMediaSchema>;
export type EvidenceFile = z.infer<typeof EvidenceFileSchema>;
export type Milestone = z.infer<typeof MilestoneSchema>;
export type ReportUpdate = z.infer<typeof ReportUpdateSchema>;
export type ActionStatus = z.infer<typeof ActionStatusSchema>;

// User Schema
export const UserSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    avatar: z.string().optional(),
    verified: z.boolean().default(false),
    createdAt: z.string(),
    bio: z.string().optional(),
    location: z.object({
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
    }).optional(),
    stats: z.object({
        reportsCreated: z.number().default(0),
        reportsSigned: z.number().default(0),
        impactScore: z.number().default(0),
    }).default({
        reportsCreated: 0,
        reportsSigned: 0,
        impactScore: 0,
    }),
});

export type User = z.infer<typeof UserSchema>;

// Signature (Assinatura de petição)
export const SignatureSchema = z.object({
    userId: z.string(),
    userName: z.string(),
    userAvatar: z.string().optional(),
    signedAt: z.string(),
});

export type Signature = z.infer<typeof SignatureSchema>;

// Comment
export const CommentSchema = z.object({
    id: z.string(),
    postId: z.string(),
    author: z.object({
        id: z.string(),
        name: z.string(),
        avatar: z.string().optional(),
        verified: z.boolean().default(false),
    }),
    content: z.string(),
    createdAt: z.string(),
    likes: z.number().default(0),
    replies: z.number().default(0),
});

export type Comment = z.infer<typeof CommentSchema>;
