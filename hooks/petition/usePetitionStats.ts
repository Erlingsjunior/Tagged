import { useEffect, useCallback } from 'react';
import { petitionService } from '../../services/petitionService';
import { PetitionStats } from '../../types/petition';
import { Post } from '../../types';

export const usePetitionStats = (post: Post) => {
    const syncStatsToPetition = useCallback(() => {
        const stats: PetitionStats = {
            totalSignatures: post.stats.supports,
            totalViews: post.stats.views || 0,
            totalComments: post.stats.comments,
            totalShares: post.stats.shares,
        };

        petitionService.updateStats(post.id, stats);
    }, [post]);

    useEffect(() => {
        syncStatsToPetition();
    }, [syncStatsToPetition]);

    useEffect(() => {
        const interval = setInterval(() => {
            syncStatsToPetition();
        }, 5000);

        return () => clearInterval(interval);
    }, [syncStatsToPetition]);

    return {
        syncStatsToPetition,
    };
};
