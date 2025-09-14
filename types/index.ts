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
});

export type Post = z.infer<typeof PostSchema>;
export type PostCategory = z.infer<typeof PostCategorySchema>;
export type PostStatus = z.infer<typeof PostStatusSchema>;
export type PostMedia = z.infer<typeof PostMediaSchema>;
