import { Post } from '../../types';
import { usePetitionContent } from './usePetitionContent';
import { usePetitionSignatures } from './usePetitionSignatures';
import { usePetitionStats } from './usePetitionStats';
import { usePetitionUpdates } from './usePetitionUpdates';
import { usePetitionAchievements } from './usePetitionAchievements';
import { petitionService } from '../../services/petitionService';
import { useAuthStore } from '../../stores/authStore';

export const usePetition = (post: Post) => {
    const { user } = useAuthStore();

    usePetitionContent(post);
    usePetitionSignatures(post.id);
    usePetitionStats(post);
    usePetitionUpdates(post);
    usePetitionAchievements(post);

    const canViewPetition = () => {
        if (!user) return false;
        const isAdmin = (user as any).role === 'admin';
        return petitionService.canViewPetition(post.id, user.id, isAdmin);
    };

    const canDownloadPetition = () => {
        if (!user) return false;
        const isAdmin = (user as any).role === 'admin';
        return petitionService.canDownloadPetition(post.id, user.id, isAdmin);
    };

    const generatePetitionDocument = (page: number = 1, signaturesPerPage: number = 1000) => {
        return petitionService.generatePetitionDocument(post.id, page, signaturesPerPage);
    };

    const getPetition = () => {
        return petitionService.getPetition(post.id);
    };

    const getTotalPages = (signaturesPerPage: number = 1000) => {
        return petitionService.getTotalPages(post.id, signaturesPerPage);
    };

    const hasReachedSignatureThreshold = () => {
        const petition = petitionService.getPetition(post.id);
        return petition ? petition.stats.totalSignatures >= 1000 : false;
    };

    return {
        canViewPetition,
        canDownloadPetition,
        generatePetitionDocument,
        getPetition,
        getTotalPages,
        hasReachedSignatureThreshold,
    };
};
