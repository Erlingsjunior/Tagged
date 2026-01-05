import { faker } from "@faker-js/faker/locale/pt_BR";
import { Post, EvidenceFile, Milestone, ReportUpdate, Comment } from "../types";

// Categorias de denúncias
const categories = [
    "corruption",
    "police_violence",
    "discrimination",
    "environment",
    "health",
    "education",
    "transport",
] as const;

const statuses = ["active", "investigating", "resolved"] as const;

// Gera posts mockados realistas
const generateMockPost = (id: number): Post => {
    const category = faker.helpers.arrayElement(categories);
    const status = faker.helpers.arrayElement(statuses);
    const isAnonymous = faker.datatype.boolean();

    const titles: Record<string, string[]> = {
        corruption: [
            "Desvio de recursos na prefeitura de {city}",
            "Superfaturamento em obras públicas em {city}",
            "Nepotismo na administração de {city}",
            "Licitações fraudulentas na câmara de {city}",
        ],
        police_violence: [
            "Abuso de autoridade no bairro {neighborhood}",
            "Violência policial durante manifestação em {city}",
            "Agressão injustificada no centro de {city}",
            "Uso desproporcional de força em {city}",
        ],
        discrimination: [
            "Discriminação racial em hospital de {city}",
            "Preconceito em processo seletivo em {city}",
            "Tratamento diferenciado em estabelecimento de {city}",
            "Exclusão por orientação sexual em {city}",
        ],
        environment: [
            "Despejo ilegal de resíduos em {city}",
            "Poluição do rio principal de {city}",
            "Desmatamento irregular em área protegida de {city}",
            "Queimadas criminosas próximo a {city}",
        ],
        health: [
            "Falta de medicamentos no posto de saúde de {city}",
            "Negligência médica em hospital de {city}",
            "Condições insalubres em UBS de {city}",
            "Filas intermináveis no SUS de {city}",
        ],
        education: [
            "Escola em ruínas no bairro {neighborhood}",
            "Falta de professores em escola de {city}",
            "Merenda escolar de péssima qualidade em {city}",
            "Infraestrutura precária em creche de {city}",
        ],
        transport: [
            "Ônibus em estado crítico em {city}",
            "Falta de acessibilidade no transporte de {city}",
            "Superlotação constante em linhas de {city}",
            "Pontos de ônibus destruídos em {city}",
        ],
    };

    const city = faker.location.city();
    const neighborhood = faker.location.street();

    const titleTemplate = faker.helpers.arrayElement(titles[category]);
    const title = titleTemplate.replace("{city}", city).replace("{neighborhood}", neighborhood);

    const content = faker.lorem.paragraphs(2);
    const supports = faker.number.int({ min: 50, max: 5000000 });

    // Generate milestones based on signature goals
    const milestoneTargets = [100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000];
    const milestones: Milestone[] = milestoneTargets.map((target, index) => ({
        id: `milestone_${id}_${index}`,
        target,
        label: target >= 1000000 ? `${target / 1000000}M` : target >= 1000 ? `${target / 1000}K` : `${target}`,
        achieved: supports >= target,
        achievedAt: supports >= target ? faker.date.recent({ days: 20 }).toISOString() : undefined,
        icon: index === 0 ? "trophy" : index === 3 ? "star" : index === 6 ? "flame" : index === 9 ? "diamond" : "ribbon",
        color: supports >= target ? "#22C55E" : "#94A3B8",
    }));

    // Generate evidence files
    const evidenceFiles: EvidenceFile[] = Array.from(
        { length: faker.number.int({ min: 2, max: 8 }) },
        (_, i) => {
            const fileTypes = ["image", "video", "document", "audio"] as const;
            const fileType = faker.helpers.arrayElement(fileTypes);
            return {
                id: `evidence_${id}_${i}`,
                type: fileType,
                name: fileType === "image" ? `foto_evidencia_${i + 1}.jpg` :
                      fileType === "video" ? `video_prova_${i + 1}.mp4` :
                      fileType === "document" ? `documento_${i + 1}.pdf` :
                      `audio_${i + 1}.mp3`,
                url: fileType === "image" ? `https://picsum.photos/seed/${id}_${i}/600/400` :
                     fileType === "video" ? `https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4` :
                     `https://example.com/file_${id}_${i}`,
                size: faker.number.int({ min: 500000, max: 50000000 }),
                uploadedAt: faker.date.recent({ days: 25 }).toISOString(),
                thumbnail: fileType === "image" || fileType === "video"
                    ? `https://picsum.photos/seed/${id}_${i}_thumb/150/150`
                    : undefined,
            };
        }
    );

    // Generate updates/news
    const updates: ReportUpdate[] = Array.from(
        { length: faker.number.int({ min: 0, max: 5 }) },
        (_, i) => ({
            id: `update_${id}_${i}`,
            title: faker.helpers.arrayElement([
                "Nova evidência descoberta",
                "Investigação iniciada pelo MP",
                "Imprensa repercutiu o caso",
                "Audiência pública marcada",
                "Testemunhas se apresentaram",
                "Documento oficial obtido",
            ]),
            content: faker.lorem.paragraph(),
            createdAt: faker.date.recent({ days: 20 }).toISOString(),
            author: {
                name: faker.helpers.arrayElement(["Equipe Tagged", faker.person.fullName(), "Imprensa", "MPF"]),
                role: faker.helpers.arrayElement(["Moderador", "Denunciante", "Jornalista", "Promotor", "Advogado"]),
            },
        })
    );

    // Determine action status based on supports
    const actionStatus = {
        investigating: supports > 1000,
        legalAction: supports > 10000,
        governmentAction: supports > 50000,
        executing: supports > 100000,
        hasLawyers: supports > 5000 && faker.datatype.boolean(),
        hasNGO: supports > 2000 && faker.datatype.boolean(),
    };

    return {
        id: id.toString(),
        title,
        content,
        category: category as any,
        status: status as any,
        author: isAnonymous
            ? {
                  id: "tagged_platform",
                  name: "Tagged Platform",
                  verified: true,
              }
            : {
                  id: faker.string.uuid(),
                  name: faker.person.fullName(),
                  avatar: `https://i.pravatar.cc/150?img=${faker.number.int({ min: 1, max: 70 })}`,
                  verified: faker.datatype.boolean(),
              },
        location: {
            city,
            state: faker.location.state({ abbreviated: true }),
        },
        stats: {
            likes: faker.number.int({ min: 0, max: 500 }),
            shares: faker.number.int({ min: 0, max: 100 }),
            comments: faker.number.int({ min: 0, max: 150 }),
            supports,
        },
        media: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, (_, i) => ({
            type: "image" as const,
            url: `https://picsum.photos/seed/${id}_media_${i}/600/400`,
            width: 600,
            height: 400,
            caption: faker.lorem.sentence(),
        })),
        tags: faker.helpers.arrayElements(
            [
                "urgente",
                "investigação",
                "transparência",
                "justiça",
                "direitos",
                "denúncia",
                "comunidade",
                "ação",
            ],
            { min: 2, max: 5 }
        ),
        createdAt: faker.date.recent({ days: 30 }).toISOString(),
        updatedAt: faker.date.recent({ days: 10 }).toISOString(),
        isLiked: false,
        isSaved: false,
        evidenceFiles,
        milestones,
        updates,
        actionStatus,
        chatUnlocked: supports >= 100000,
    };
};

// Gera 15 posts mockados
export const mockPosts: Post[] = Array.from({ length: 15 }, (_, i) => generateMockPost(i + 1));

// Generate mock comments for posts
export const generateMockComments = (postId: string, count: number = 5): Comment[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `comment_${postId}_${i}`,
        postId,
        author: {
            id: faker.string.uuid(),
            name: faker.person.fullName(),
            avatar: `https://i.pravatar.cc/150?img=${faker.number.int({ min: 1, max: 70 })}`,
            verified: faker.datatype.boolean(),
        },
        content: faker.helpers.arrayElement([
            "Isso é inadmissível! Precisamos de mais transparência!",
            "Assinei e compartilhei. Força na luta!",
            "Tenho informações que podem ajudar nesse caso.",
            "Isso também aconteceu na minha região.",
            "Parabéns pela coragem de denunciar!",
            "Precisamos divulgar mais esse caso.",
            "Já entrei em contato com a imprensa local.",
            "Sou advogado e posso ajudar com isso.",
            "Conheço alguém que trabalha no MP e pode investigar.",
            "Que absurdo! Vamos lutar por justiça!",
        ]),
        createdAt: faker.date.recent({ days: 15 }).toISOString(),
        likes: faker.number.int({ min: 0, max: 50 }),
        replies: faker.number.int({ min: 0, max: 10 }),
    }));
};

export const mockComments: Map<string, Comment[]> = new Map(
    mockPosts.map((post) => [post.id, generateMockComments(post.id, faker.number.int({ min: 3, max: 10 }))])
);
