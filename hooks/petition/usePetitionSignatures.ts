import { useEffect, useCallback } from 'react';
import { petitionService } from '../../services/petitionService';
import { Signature } from '../../types/petition';
import { useAuthStore } from '../../stores/authStore';
import { usePostsStore } from '../../stores/postsStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    USERS_DB: 'tagged_users_db',
};

export const usePetitionSignatures = (postId: string) => {
    const { user } = useAuthStore();
    const { getSignatures, hasUserSigned } = usePostsStore();

    const syncSignaturesToPetition = useCallback(async () => {
        const signatures = getSignatures(postId);

        const usersDbJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
        const usersDb = usersDbJson ? JSON.parse(usersDbJson) : {};

        signatures.forEach((sig) => {
            const signerData = Object.values(usersDb).find((u: any) => u.id === sig.userId) as any;

            const signature: Signature = {
                id: `sig-${postId}-${sig.userId}`,
                userId: sig.userId,
                name: sig.userName,
                cpf: signerData?.cpf || 'CPF_NAO_DISPONIVEL',
                email: signerData?.email || 'email_nao_disponivel@tagged.com',
                signedAt: sig.signedAt,
            };

            petitionService.addSignature(postId, signature);
        });
    }, [postId, getSignatures]);

    useEffect(() => {
        syncSignaturesToPetition();
    }, [syncSignaturesToPetition]);

    const handleNewSignature = useCallback((userId: string, userName: string, userCpf?: string, userEmail?: string) => {
        const signature: Signature = {
            id: `sig-${postId}-${userId}`,
            userId,
            name: userName,
            cpf: userCpf || 'CPF_PENDENTE',
            email: userEmail || 'email@pendente.com',
            signedAt: new Date(),
        };

        petitionService.addSignature(postId, signature);
    }, [postId]);

    const handleRemoveSignature = useCallback((userId: string, userCpf?: string) => {
        if (userCpf) {
            petitionService.removeSignature(postId, userCpf);
        }
    }, [postId]);

    return {
        syncSignaturesToPetition,
        handleNewSignature,
        handleRemoveSignature,
    };
};
