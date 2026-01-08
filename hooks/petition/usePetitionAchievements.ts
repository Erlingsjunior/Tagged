import { useEffect, useCallback } from 'react';
import { petitionService } from '../../services/petitionService';
import { PetitionAchievement } from '../../types/petition';
import { Post } from '../../types';

export const usePetitionAchievements = (post: Post) => {
    const syncAchievementsToPetition = useCallback(() => {
        if (!post.milestones || post.milestones.length === 0) return;

        post.milestones.forEach((milestone) => {
            const achievement: PetitionAchievement = {
                id: milestone.id,
                badgeName: milestone.badgeName,
                badgeDescription: milestone.badgeDescription,
                target: milestone.target,
                achieved: milestone.achieved,
                achievedAt: milestone.achieved ? new Date() : undefined,
                icon: milestone.icon,
                color: milestone.color,
            };

            petitionService.addAchievement(post.id, achievement);
        });
    }, [post]);

    useEffect(() => {
        syncAchievementsToPetition();
    }, [syncAchievementsToPetition]);

    useEffect(() => {
        const interval = setInterval(() => {
            syncAchievementsToPetition();
        }, 10000);

        return () => clearInterval(interval);
    }, [syncAchievementsToPetition]);

    const handleNewAchievement = useCallback((achievement: PetitionAchievement) => {
        petitionService.addAchievement(post.id, achievement);
    }, [post.id]);

    return {
        syncAchievementsToPetition,
        handleNewAchievement,
    };
};
