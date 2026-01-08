import {
    Petition,
    Signature,
    PetitionStats,
    PetitionUpdate,
    PetitionAchievement,
    PetitionContent,
    MediaFile,
    EvidenceFile,
    PetitionRequester
} from '../types/petition';
import { Post } from '../types';

class PetitionService {
    private petitions: Map<string, Petition> = new Map();

    createPetition(post: Post, requester: PetitionRequester): Petition {
        const petition: Petition = {
            id: `petition-${post.id}`,
            postId: post.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            requester,
            content: {
                title: post.title,
                description: post.content,
                category: post.category,
                location: post.location,
                tags: post.tags,
                createdAt: post.createdAt,
            },
            media: post.media,
            evidenceFiles: post.evidenceFiles || [],
            stats: {
                totalSignatures: post.stats.supports,
                totalViews: post.stats.views || 0,
                totalComments: post.stats.comments,
                totalShares: post.stats.shares,
            },
            achievements: [],
            updates: post.updates || [],
            signatures: [],
            permissions: {
                canView: requester.isAnonymous ? ['admin'] : [requester.userId],
                canDownload: requester.isAnonymous ? ['admin'] : [requester.userId, 'admin'],
            },
        };

        this.petitions.set(post.id, petition);
        return petition;
    }

    getPetition(postId: string): Petition | undefined {
        return this.petitions.get(postId);
    }

    addSignature(postId: string, signature: Signature): void {
        const petition = this.petitions.get(postId);
        if (!petition) return;

        const existingSignatureIndex = petition.signatures.findIndex(
            s => s.cpf === signature.cpf
        );

        if (existingSignatureIndex === -1) {
            petition.signatures.push(signature);
            petition.stats.totalSignatures = petition.signatures.length;
            petition.updatedAt = new Date();
            this.petitions.set(postId, petition);
        }
    }

    removeSignature(postId: string, cpf: string): void {
        const petition = this.petitions.get(postId);
        if (!petition) return;

        petition.signatures = petition.signatures.filter(s => s.cpf !== cpf);
        petition.stats.totalSignatures = petition.signatures.length;
        petition.updatedAt = new Date();
        this.petitions.set(postId, petition);
    }

    updateStats(postId: string, stats: Partial<PetitionStats>): void {
        const petition = this.petitions.get(postId);
        if (!petition) return;

        petition.stats = { ...petition.stats, ...stats };
        petition.updatedAt = new Date();
        this.petitions.set(postId, petition);
    }

    addUpdate(postId: string, update: PetitionUpdate): void {
        const petition = this.petitions.get(postId);
        if (!petition) return;

        petition.updates.push(update);
        petition.updatedAt = new Date();
        this.petitions.set(postId, petition);
    }

    addAchievement(postId: string, achievement: PetitionAchievement): void {
        const petition = this.petitions.get(postId);
        if (!petition) return;

        const existingIndex = petition.achievements.findIndex(
            a => a.id === achievement.id
        );

        if (existingIndex === -1) {
            petition.achievements.push(achievement);
        } else {
            petition.achievements[existingIndex] = achievement;
        }

        petition.updatedAt = new Date();
        this.petitions.set(postId, petition);
    }

    canViewPetition(postId: string, userId: string, isAdmin: boolean): boolean {
        const petition = this.petitions.get(postId);
        if (!petition) return false;

        if (isAdmin) return true;

        if (petition.stats.totalSignatures < 1000) {
            return petition.permissions.canView.includes(userId);
        }

        const hasSignedIndex = petition.signatures.findIndex(
            s => s.userId === userId
        );
        return hasSignedIndex !== -1 || petition.permissions.canView.includes(userId);
    }

    canDownloadPetition(postId: string, userId: string, isAdmin: boolean): boolean {
        const petition = this.petitions.get(postId);
        if (!petition) return false;

        if (isAdmin) return true;

        return petition.permissions.canDownload.includes(userId);
    }

    generateDocumentHash(petition: Petition): string {
        const dataToHash = JSON.stringify({
            id: petition.id,
            postId: petition.postId,
            signatures: petition.signatures.map(s => s.cpf).sort(),
            stats: petition.stats,
            updatedAt: petition.updatedAt,
        });

        let hash = 0;
        for (let i = 0; i < dataToHash.length; i++) {
            const char = dataToHash.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }

        return Math.abs(hash).toString(16).toUpperCase();
    }

    getTotalPages(postId: string, signaturesPerPage: number = 1000): number {
        const petition = this.petitions.get(postId);
        if (!petition) return 0;
        return Math.ceil(petition.signatures.length / signaturesPerPage);
    }

    generatePetitionDocument(postId: string, page: number = 1, signaturesPerPage: number = 1000): string {
        const petition = this.petitions.get(postId);
        if (!petition) throw new Error('Petition not found');

        petition.documentHash = this.generateDocumentHash(petition);

        const totalPages = Math.ceil(petition.signatures.length / signaturesPerPage);
        const startIndex = (page - 1) * signaturesPerPage;
        const endIndex = Math.min(startIndex + signaturesPerPage, petition.signatures.length);
        const pageSignatures = petition.signatures.slice(startIndex, endIndex);

        const doc = `
═══════════════════════════════════════════════════
           PETIÇÃO PÚBLICA - TAGGED APP
═══════════════════════════════════════════════════

DOCUMENTO Nº: ${petition.id}
DATA DE CRIAÇÃO: ${petition.createdAt.toLocaleString('pt-BR')}
ÚLTIMA ATUALIZAÇÃO: ${petition.updatedAt.toLocaleString('pt-BR')}

───────────────────────────────────────────────────
1. DADOS DO SOLICITANTE
───────────────────────────────────────────────────
${petition.requester.isAnonymous
    ? 'DENÚNCIA ANÔNIMA\nDados disponíveis apenas para administração Tagged'
    : `Nome: ${petition.requester.name}
CPF: ${petition.requester.cpf}
Email: ${petition.requester.email}`
}

───────────────────────────────────────────────────
2. DESCRIÇÃO DA DENÚNCIA
───────────────────────────────────────────────────
Título: ${petition.content.title}
Categoria: ${petition.content.category}
Localização: ${petition.content.location.city}, ${petition.content.location.state}
Data: ${new Date(petition.content.createdAt).toLocaleString('pt-BR')}

Descrição Completa:
${petition.content.description}

Tags: ${petition.content.tags.join(', ')}

───────────────────────────────────────────────────
3. EVIDÊNCIAS ANEXADAS
───────────────────────────────────────────────────
Total de Arquivos: ${petition.evidenceFiles.length}

${petition.evidenceFiles.map((file, index) => `
${index + 1}. Nome: ${file.name}
   Tipo: ${file.type}
   Tamanho: ${(file.size / 1024).toFixed(2)} KB
   Data Upload: ${new Date(file.uploadedAt).toLocaleString('pt-BR')}
   URL: ${file.url}
`).join('\n')}

───────────────────────────────────────────────────
4. ESTATÍSTICAS DE ENGAJAMENTO
───────────────────────────────────────────────────
Total de Assinaturas: ${petition.stats.totalSignatures.toLocaleString('pt-BR')}
Total de Visualizações: ${petition.stats.totalViews.toLocaleString('pt-BR')}
Total de Comentários: ${petition.stats.totalComments.toLocaleString('pt-BR')}
Total de Compartilhamentos: ${petition.stats.totalShares.toLocaleString('pt-BR')}

───────────────────────────────────────────────────
5. CONQUISTAS ALCANÇADAS
───────────────────────────────────────────────────
${petition.achievements.filter(a => a.achieved).map(m => `
✓ ${m.badgeName} - ${m.target.toLocaleString('pt-BR')} assinaturas
  ${m.badgeDescription}
  Alcançado em: ${m.achievedAt ? new Date(m.achievedAt).toLocaleString('pt-BR') : 'N/A'}
`).join('\n')}

───────────────────────────────────────────────────
6. ATUALIZAÇÕES DO CASO
───────────────────────────────────────────────────
Total de Atualizações: ${petition.updates.length}

${petition.updates.map((update, index) => `
${index + 1}. ${update.title}
   Autor: ${update.author.name} (${update.author.role})
   Data: ${new Date(update.createdAt).toLocaleString('pt-BR')}

   ${update.content}
`).join('\n───────────────────────────────────────────────────\n')}

───────────────────────────────────────────────────
7. LISTA DE ASSINANTES
───────────────────────────────────────────────────
Total: ${petition.signatures.length.toLocaleString('pt-BR')} assinaturas autênticas

PÁGINA ${page} DE ${totalPages}
Exibindo assinaturas ${(startIndex + 1).toLocaleString('pt-BR')} a ${endIndex.toLocaleString('pt-BR')}

${pageSignatures.map((sig, index) =>
`${String(startIndex + index + 1).padStart(8, '0')}. Nome: ${sig.name} | CPF: ${sig.cpf} | Email: ${sig.email} | Data: ${new Date(sig.signedAt).toLocaleString('pt-BR')}`
).join('\n')}

───────────────────────────────────────────────────
NAVEGAÇÃO
───────────────────────────────────────────────────
${page > 1 ? '← Página Anterior disponível' : ''}
${page < totalPages ? '→ Próxima Página disponível' : ''}
${totalPages > 1 ? `\n\nTotal de ${totalPages} páginas • ${signaturesPerPage.toLocaleString('pt-BR')} assinaturas por página` : ''}

───────────────────────────────────────────────────
AUTENTICIDADE
───────────────────────────────────────────────────
Este documento foi gerado automaticamente pelo sistema Tagged.
Todas as assinaturas podem ser verificadas em nosso banco de dados.

Hash de Verificação: ${petition.documentHash}
Data de Geração: ${new Date().toLocaleString('pt-BR')}
Página: ${page}/${totalPages}

═══════════════════════════════════════════════════
        Documento gerado pelo Tagged App
        Plataforma de Mobilização Social
═══════════════════════════════════════════════════
        `.trim();

        return doc;
    }
}

export const petitionService = new PetitionService();
