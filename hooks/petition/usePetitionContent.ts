import { useEffect, useCallback } from 'react';
import { petitionService } from '../../services/petitionService';
import { Post } from '../../types';
import { PetitionRequester } from '../../types/petition';

export const usePetitionContent = (post: Post) => {
    const initializePetition = useCallback(() => {
        const existingPetition = petitionService.getPetition(post.id);
        if (existingPetition) return;

        const requester: PetitionRequester = {
            userId: post.author.id,
            name: post.author.name,
            cpf: (post.author as any).cpf || 'CPF_AUTOR_PENDENTE',
            email: (post.author as any).email || 'email_autor@pendente.com',
            isAnonymous: post.isAnonymous,
        };

        petitionService.createPetition(post, requester);
    }, [post]);

    useEffect(() => {
        initializePetition();
    }, [initializePetition]);

    return {
        initializePetition,
    };
};
