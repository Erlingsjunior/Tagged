import { useEffect, useCallback } from 'react';
import { petitionService } from '../../services/petitionService';
import { PetitionUpdate } from '../../types/petition';
import { Post } from '../../types';

export const usePetitionUpdates = (post: Post) => {
    const syncUpdatesToPetition = useCallback(() => {
        if (!post.updates || post.updates.length === 0) return;

        post.updates.forEach((update) => {
            const petitionUpdate: PetitionUpdate = {
                id: update.id,
                title: update.title,
                content: update.content,
                author: {
                    id: update.author.id,
                    name: update.author.name,
                    role: update.author.role,
                },
                createdAt: update.createdAt,
            };

            petitionService.addUpdate(post.id, petitionUpdate);
        });
    }, [post]);

    useEffect(() => {
        syncUpdatesToPetition();
    }, [syncUpdatesToPetition]);

    const handleNewUpdate = useCallback((update: PetitionUpdate) => {
        petitionService.addUpdate(post.id, update);
    }, [post.id]);

    return {
        syncUpdatesToPetition,
        handleNewUpdate,
    };
};
