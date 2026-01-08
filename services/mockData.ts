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

// Helper para gerar imagens relevantes baseadas na categoria usando Unsplash
const getCategoryImageKeywords = (category: string): string[] => {
    const keywords: Record<string, string[]> = {
        corruption: [
            "government",
            "justice",
            "law",
            "court",
            "money",
            "city-hall",
        ],
        police_violence: [
            "police",
            "protest",
            "justice",
            "law-enforcement",
            "demonstration",
        ],
        discrimination: [
            "diversity",
            "equality",
            "people",
            "community",
            "unity",
            "human-rights",
        ],
        environment: [
            "nature",
            "pollution",
            "forest",
            "river",
            "environmental",
            "sustainability",
        ],
        health: [
            "hospital",
            "medical",
            "healthcare",
            "doctor",
            "medicine",
            "health",
        ],
        education: [
            "school",
            "education",
            "students",
            "classroom",
            "university",
            "learning",
        ],
        transport: [
            "traffic",
            "public-transport",
            "bus",
            "subway",
            "transportation",
            "road",
        ],
    };
    return keywords[category] || ["city", "community"];
};

const getRelevantImageUrl = (
    category: string,
    seed: string | number,
    width: number = 600,
    height: number = 400
): string => {
    // Mapear categorias para IDs de imagens específicas do Picsum
    // Isso garante imagens consistentes e apropriadas para cada categoria
    const categoryImageIds: Record<string, number[]> = {
        corruption: [10, 15, 28, 33, 42, 48, 52, 58, 63, 69],
        police_violence: [16, 22, 31, 37, 43, 49, 55, 61, 67, 73],
        discrimination: [18, 24, 32, 38, 44, 50, 56, 62, 68, 74],
        environment: [11, 17, 25, 34, 45, 51, 57, 64, 70, 76],
        health: [12, 19, 26, 35, 41, 47, 53, 59, 65, 71],
        education: [14, 21, 29, 36, 46, 54, 60, 66, 72, 78],
        transport: [13, 20, 27, 39, 40, 30, 23, 75, 77, 79],
    };

    const imageIds = categoryImageIds[category] || [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const imageId = faker.helpers.arrayElement(imageIds);

    // Usando Picsum com IDs específicos para cada categoria
    return `https://picsum.photos/id/${imageId}/${width}/${height}`;
};

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
    const title = titleTemplate
        .replace("{city}", city)
        .replace("{neighborhood}", neighborhood);

    const content = faker.lorem.paragraphs(2);

    // Gerar supports com distribuição mais realista e variada
    // 20% - Denúncias pequenas (50 a 500)
    // 30% - Denúncias médias (500 a 5.000)
    // 25% - Denúncias grandes (5.000 a 50.000)
    // 15% - Denúncias virais (50.000 a 500.000)
    // 10% - Denúncias massivas (500.000 a 50.000.000)
    const rand = Math.random();
    let supports: number;

    if (rand < 0.20) {
        // 20% - Pequenas (50 a 500)
        supports = faker.number.int({ min: 50, max: 500 });
    } else if (rand < 0.50) {
        // 30% - Médias (500 a 5.000)
        supports = faker.number.int({ min: 500, max: 5000 });
    } else if (rand < 0.75) {
        // 25% - Grandes (5.000 a 50.000)
        supports = faker.number.int({ min: 5000, max: 50000 });
    } else if (rand < 0.90) {
        // 15% - Virais (50.000 a 500.000)
        supports = faker.number.int({ min: 50000, max: 500000 });
    } else {
        // 10% - Massivas (500.000 a 50.000.000)
        supports = faker.number.int({ min: 500000, max: 50000000 });
    }

    // Sistema completo de achievements até 50M+ com selos temáticos
    const achievementTiers = [
        {
            target: 100,
            label: "100",
            badgeName: "Primeira Voz",
            description: "Primeiras 100 pessoas se manifestaram",
            icon: "megaphone",
            color: "#10B981",
        },
        {
            target: 500,
            label: "500",
            badgeName: "Ecos da Comunidade",
            description: "A comunidade começou a ouvir",
            icon: "people",
            color: "#3B82F6",
        },
        {
            target: 1000,
            label: "1K",
            badgeName: "Causa em Alta",
            description: "1 mil vozes unidas pela justiça",
            icon: "trending-up",
            color: "#8B5CF6",
        },
        {
            target: 5000,
            label: "5K",
            badgeName: "Denunciador Profissional",
            description: "Impacto significativo na região",
            icon: "shield-checkmark",
            color: "#EC4899",
        },
        {
            target: 10000,
            label: "10K",
            badgeName: "Voz da Cidade",
            description: "Toda a cidade está atenta",
            icon: "business",
            color: "#F59E0B",
        },
        {
            target: 50000,
            label: "50K",
            badgeName: "Movimento Regional",
            description: "Mobilização em todo o estado",
            icon: "flame",
            color: "#EF4444",
        },
        {
            target: 100000,
            label: "100K",
            badgeName: "Impacto Nacional",
            description: "O país inteiro está discutindo",
            icon: "flag",
            color: "#DC2626",
        },
        {
            target: 500000,
            label: "500K",
            badgeName: "Engajando pela Paz",
            description: "Meio milhão por um futuro melhor",
            icon: "heart",
            color: "#DB2777",
        },
        {
            target: 1000000,
            label: "1M",
            badgeName: "Mudando o Mundo",
            description: "1 milhão de pessoas querem mudança",
            icon: "globe",
            color: "#7C3AED",
        },
        {
            target: 5000000,
            label: "5M",
            badgeName: "Revolução Social",
            description: "Transformação em escala massiva",
            icon: "flash",
            color: "#2563EB",
        },
        {
            target: 10000000,
            label: "10M",
            badgeName: "Fenômeno Viral",
            description: "Impossível de ser ignorado",
            icon: "rocket",
            color: "#0891B2",
        },
        {
            target: 25000000,
            label: "25M",
            badgeName: "Clamor Popular",
            description: "A voz do povo não se cala",
            icon: "thunderstorm",
            color: "#059669",
        },
        {
            target: 50000000,
            label: "50M+",
            badgeName: "Engajamento Mundial",
            description: "O mundo inteiro se uniu por essa causa",
            icon: "earth",
            color: "#D97706",
        },
    ];

    const milestones: Milestone[] = achievementTiers.map((tier, index) => ({
        id: `milestone_${id}_${index}`,
        target: tier.target,
        label: tier.label,
        badgeName: tier.badgeName,
        badgeDescription: tier.description,
        achieved: supports >= tier.target,
        achievedAt:
            supports >= tier.target
                ? faker.date.recent({ days: 20 }).toISOString()
                : undefined,
        icon: tier.icon,
        color: supports >= tier.target ? tier.color : "#94A3B8",
    }));

    // Generate evidence files - More diverse and realistic
    const evidenceFiles: EvidenceFile[] = Array.from(
        { length: faker.number.int({ min: 3, max: 12 }) },
        (_, i) => {
            // Weighted distribution: more images, some videos, fewer documents/audio
            const fileTypes: Array<"image" | "video" | "document" | "audio"> = [
                "image",
                "image",
                "image",
                "image", // 40% images
                "video",
                "video", // 20% videos
                "document",
                "document", // 20% documents
                "audio",
                "audio", // 20% audio
            ];
            const fileType = faker.helpers.arrayElement(fileTypes);

            const imageNames = [
                "foto_evidencia",
                "prova_visual",
                "flagrante",
                "registro_fotografico",
                "imagem_local",
            ];
            const videoNames = [
                "video_prova",
                "gravacao_testemunha",
                "filmagem_flagrante",
                "registro_video",
            ];
            const documentNames = [
                "documento_oficial",
                "oficio",
                "ata_reuniao",
                "contrato",
                "recibo",
                "denuncia_formal",
            ];
            const audioNames = [
                "audio_testemunha",
                "gravacao_telefonica",
                "depoimento",
                "entrevista",
            ];

            const getName = () => {
                switch (fileType) {
                    case "image":
                        return `${faker.helpers.arrayElement(imageNames)}_${
                            i + 1
                        }.jpg`;
                    case "video":
                        return `${faker.helpers.arrayElement(videoNames)}_${
                            i + 1
                        }.mp4`;
                    case "document":
                        return `${faker.helpers.arrayElement(documentNames)}_${
                            i + 1
                        }.pdf`;
                    case "audio":
                        return `${faker.helpers.arrayElement(audioNames)}_${
                            i + 1
                        }.mp3`;
                }
            };

            return {
                id: `evidence_${id}_${i}`,
                type: fileType,
                name: getName(),
                url:
                    fileType === "image"
                        ? getRelevantImageUrl(
                              category,
                              `evidence_${id}_${i}`,
                              800,
                              600
                          )
                        : fileType === "video"
                        ? `https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4`
                        : `https://example.com/file_${id}_${i}`,
                size:
                    fileType === "image"
                        ? faker.number.int({ min: 500000, max: 5000000 })
                        : fileType === "video"
                        ? faker.number.int({ min: 5000000, max: 100000000 })
                        : fileType === "document"
                        ? faker.number.int({ min: 100000, max: 5000000 })
                        : faker.number.int({ min: 500000, max: 10000000 }),
                uploadedAt: faker.date.recent({ days: 25 }).toISOString(),
                thumbnail:
                    fileType === "image" || fileType === "video"
                        ? getRelevantImageUrl(
                              category,
                              `thumb_${id}_${i}`,
                              200,
                              200
                          )
                        : undefined,
            };
        }
    );

    // Generate updates/news
    const updates: ReportUpdate[] = Array.from(
        { length: faker.number.int({ min: 2, max: 8 }) },
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
                name: faker.helpers.arrayElement([
                    "Equipe Tagged",
                    faker.person.fullName(),
                    "Imprensa",
                    "MPF",
                ]),
                role: faker.helpers.arrayElement([
                    "Moderador",
                    "Denunciante",
                    "Jornalista",
                    "Promotor",
                    "Advogado",
                ]),
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
        isAnonymous,
        author: isAnonymous
            ? {
                  id: "tagged_platform",
                  name: "Tagged Platform",
                  verified: true,
              }
            : {
                  id: faker.string.uuid(),
                  name: faker.person.fullName(),
                  avatar: `https://i.pravatar.cc/150?img=${faker.number.int({
                      min: 1,
                      max: 70,
                  })}`,
                  verified: faker.datatype.boolean(),
              },
        location: {
            city,
            state: faker.location.state({ abbreviated: true }),
        },
        stats: {
            // Likes proporcionais aos supports (aproximadamente 5-10% dos supports)
            likes: faker.number.int({ min: Math.floor(supports * 0.05), max: Math.floor(supports * 0.10) }),
            // Shares proporcionais (aproximadamente 1-3% dos supports)
            shares: faker.number.int({ min: Math.floor(supports * 0.01), max: Math.floor(supports * 0.03) }),
            // Comments proporcionais (aproximadamente 2-5% dos supports)
            comments: faker.number.int({ min: Math.floor(supports * 0.02), max: Math.floor(supports * 0.05) }),
            supports,
        },
        media: Array.from(
            { length: faker.number.int({ min: 1, max: 5 }) },
            (_, i) => ({
                type: "image" as const,
                url: getRelevantImageUrl(category, `${id}_${i}`, 600, 400),
                width: 600,
                height: 400,
                caption: faker.lorem.sentence(),
            })
        ),
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
        chatUnlocked: supports >= 1000, // Chat desbloqueado com 1.000 assinaturas
    };
};

// Gera 15 posts mockados
export const mockPosts: Post[] = Array.from({ length: 15 }, (_, i) =>
    generateMockPost(i + 1)
);

// Gera usuários mockados baseados nos posts
export const generateMockUsers = () => {
    const users: Record<string, any> = {};

    // Extrair todos os autores únicos dos posts (exceto anônimos)
    const uniqueAuthors = mockPosts
        .filter(post => !post.isAnonymous)
        .map(post => post.author)
        .reduce((acc: any[], author) => {
            if (!acc.some(a => a.id === author.id)) {
                acc.push(author);
            }
            return acc;
        }, []);

    // Criar usuário completo para cada autor
    uniqueAuthors.forEach((author, index) => {
        const email = `user${index + 1}@tagged.com`;
        const cpf = faker.string.numeric(11);

        // Contar quantas denúncias este autor criou
        const reportsCreated = mockPosts.filter(
            p => !p.isAnonymous && p.author.id === author.id
        ).length;

        // Contar quantas denúncias este autor assinou (aleatório)
        const reportsSigned = faker.number.int({ min: 5, max: 50 });

        users[email] = {
            id: author.id,
            email: email,
            name: author.name,
            cpf: cpf,
            avatar: author.avatar,
            phone: faker.phone.number(),
            verified: author.verified || false,
            role: 'user',
            createdAt: faker.date.past({ years: 2 }).toISOString(),
            bio: faker.lorem.sentence(),
            location: {
                city: faker.location.city(),
                state: faker.location.state({ abbreviated: true }),
                country: 'Brasil',
            },
            stats: {
                reportsCreated: reportsCreated,
                reportsSigned: reportsSigned,
                impactScore: (reportsCreated * 10) + (reportsSigned * 2),
            },
            following: [],
            followers: [],
            password: 'password123', // Senha padrão para testes
        };
    });

    return users;
};

// Gera assinaturas mockadas para posts com alto número de supports
export const generateMockSignatures = (postId: string, totalSupports: number, allUsers: any[]) => {
    const signatures: any[] = [];

    // Gera 80% do total de supports como assinaturas mockadas
    // Sistema de particionamento robusto suporta milhões de assinaturas!
    const mockSignaturesCount = Math.floor(totalSupports * 0.8);

    console.log(`📝 Gerando ${mockSignaturesCount.toLocaleString()} assinaturas mockadas para post ${postId} (de ${totalSupports.toLocaleString()} supports)`);

    for (let i = 0; i < mockSignaturesCount; i++) {
        // Escolher um usuário aleatório ou criar um novo
        let user;
        if (i < allUsers.length && faker.datatype.boolean()) {
            user = allUsers[i % allUsers.length];
        } else {
            // Criar usuário temporário para assinatura
            const tempCpf = faker.string.numeric(11);
            user = {
                id: `temp_user_${postId}_${i}`,
                name: faker.person.fullName(),
                cpf: tempCpf,
                email: `supporter${i}@tagged.com`,
            };
        }

        signatures.push({
            userId: user.id,
            userName: user.name,
            signedAt: faker.date.recent({ days: 30 }),
        });
    }

    console.log(`✅ ${mockSignaturesCount.toLocaleString()} assinaturas geradas com sucesso!`);

    return signatures;
};

// Generate mock comments for posts - with varied and realistic content
export const generateMockComments = (
    postId: string,
    count: number = 5
): Comment[] => {
    const commentTemplates = [
        // Apoio e solidariedade
        "Isso é inadmissível! Precisamos de mais transparência!",
        "Assinei e compartilhei. Força na luta!",
        "Parabéns pela coragem de denunciar!",
        "Estou com vocês! Vamos conseguir justiça!",
        "Que situação revoltante! Meu total apoio!",

        // Informações adicionais
        "Tenho informações que podem ajudar nesse caso.",
        "Isso também aconteceu na minha região.",
        "Presenciei algo parecido no mês passado.",
        "Conheço outras vítimas dessa mesma situação.",
        "Tenho documentos que comprovam isso.",

        // Ações práticas
        "Precisamos divulgar mais esse caso.",
        "Já entrei em contato com a imprensa local.",
        "Sou advogado e posso ajudar com isso.",
        "Conheço alguém que trabalha no MP e pode investigar.",
        "Vou levar isso para a câmara de vereadores.",
        "Marquei uma reunião com o deputado da região.",

        // Indignação
        "Que absurdo! Vamos lutar por justiça!",
        "Até quando vamos tolerar isso?",
        "Isso não pode continuar acontecendo!",
        "É um absurdo que nada seja feito!",
        "Revoltante! Precisamos de mudanças urgentes!",

        // Perguntas e dúvidas
        "Alguém sabe se já tem investigação em andamento?",
        "Tem alguma petição oficial que podemos assinar?",
        "Onde posso obter mais informações sobre o caso?",
        "Já foi registrado um BO sobre isso?",
        "O MP já foi notificado?",

        // Relatos pessoais
        "Minha família também foi afetada por isso.",
        "Infelizmente isso é comum na região.",
        "Já sofri com isso há anos.",
        "Meu vizinho passou pela mesma situação.",
        "Trabalhei lá e posso confirmar tudo isso.",

        // Engajamento
        "Compartilhado em todos os meus grupos!",
        "Vou fazer um post sobre isso nas redes.",
        "Mandei para todos os meus contatos.",
        "Precisamos viralizar isso!",
        "Todo mundo precisa ver isso!",
    ];

    return Array.from({ length: count }, (_, i) => {
        // Criar comentários mais variados
        const useTemplate = faker.datatype.boolean({ probability: 0.7 }); // 70% usa template, 30% usa faker
        const content = useTemplate
            ? faker.helpers.arrayElement(commentTemplates)
            : faker.lorem.sentences(faker.number.int({ min: 1, max: 3 }));

        return {
            id: `comment_${postId}_${i}`,
            postId,
            author: {
                id: faker.string.uuid(),
                name: faker.person.fullName(),
                avatar: `https://i.pravatar.cc/150?img=${faker.number.int({
                    min: 1,
                    max: 70,
                })}`,
                verified: faker.datatype.boolean({ probability: 0.1 }), // 10% verificados
            },
            content,
            createdAt: faker.date.recent({ days: 15 }).toISOString(),
            likes: faker.number.int({ min: 0, max: 150 }),
            replies: faker.number.int({ min: 0, max: 20 }),
        };
    });
};

// Gera comentários baseado no count REAL de cada post (stats.comments)
export const mockComments: Map<string, Comment[]> = new Map(
    mockPosts.map((post) => [
        post.id,
        generateMockComments(post.id, post.stats.comments),
    ])
);
