// services/mockData.ts - DADOS MOCK COMPLETOS COM IMAGENS
import { Post } from "../types";

export const mockPosts: Post[] = [
    {
        id: "1",
        title: "Corrupção na Prefeitura: Obras Superfaturadas",
        content:
            "Documentos vazados revelam esquema de superfaturamento em obras públicas. Contratos inflacionados em mais de 300% do valor de mercado, prejudicando investimentos essenciais em saúde e educação da cidade.",
        category: "corruption",
        status: "investigating",
        author: {
            id: "user1",
            name: "Ana Silva",
            avatar: "https://i.pravatar.cc/150?img=1",
            verified: true,
        },
        location: {
            city: "Araras",
            state: "SP",
        },
        stats: {
            likes: 234,
            shares: 45,
            comments: 67,
            supports: 189,
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=600&h=400&fit=crop&auto=format",
                caption:
                    "Documentos revelam irregularidades em contratos públicos",
                width: 600,
                height: 400,
            },
        ],
        tags: ["prefeitura", "obras", "investigação", "transparência"],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isLiked: false,
        isSaved: false,
    },
    {
        id: "2",
        title: "Abuso Policial: Ação Desproporcional no Centro",
        content:
            "Vídeo registra ação desproporcional durante abordagem policial. Cidadão foi agredido sem resistência, violando direitos humanos básicos. Caso está sendo investigado pela Corregedoria da PM.",
        category: "police_violence",
        status: "active",
        author: {
            id: "user2",
            name: "Carlos Oliveira",
            avatar: "https://i.pravatar.cc/150?img=2",
            verified: false,
        },
        location: {
            city: "Araras",
            state: "SP",
        },
        stats: {
            likes: 567,
            shares: 123,
            comments: 89,
            supports: 445,
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1569683995104-6b5be4f7e728?w=600&h=400&fit=crop&auto=format",
                caption: "Manifestação pacífica por justiça e direitos humanos",
                width: 600,
                height: 400,
            },
        ],
        tags: ["polícia", "direitos humanos", "justiça", "abuso"],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        isLiked: false,
        isSaved: false,
    },
    {
        id: "3",
        title: "Discriminação Racial em Hospital Público",
        content:
            "Paciente relata tratamento diferenciado e negativa de atendimento por questões raciais. Caso expõe racismo estrutural no sistema de saúde público, gerando revolta na comunidade.",
        category: "discrimination",
        status: "resolved",
        author: {
            id: "user3",
            name: "Maria Santos",
            avatar: "https://i.pravatar.cc/150?img=3",
            verified: true,
        },
        location: {
            city: "Araras",
            state: "SP",
        },
        stats: {
            likes: 123,
            shares: 34,
            comments: 45,
            supports: 78,
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop&auto=format",
                caption:
                    "Hospital público onde ocorreu o caso de discriminação",
                width: 600,
                height: 400,
            },
        ],
        tags: ["saúde", "racismo", "sus", "discriminação"],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isLiked: false,
        isSaved: false,
    },
    {
        id: "4",
        title: "Crime Ambiental: Poluição do Rio da Cidade",
        content:
            "Empresa despeja dejetos químicos no principal rio da região. Análises laboratoriais confirmam contaminação grave da água, afetando vida aquática e comunidades ribeirinhas.",
        category: "environment",
        status: "investigating",
        author: {
            id: "user4",
            name: "Pedro Mendes",
            avatar: "https://i.pravatar.cc/150?img=4",
            verified: true,
        },
        location: {
            city: "Araras",
            state: "SP",
        },
        stats: {
            likes: 389,
            shares: 76,
            comments: 102,
            supports: 267,
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=600&h=400&fit=crop&auto=format",
                caption: "Rio contaminado por dejetos industriais não tratados",
                width: 600,
                height: 400,
            },
        ],
        tags: ["meio ambiente", "poluição", "crime ambiental", "água"],
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        isLiked: false,
        isSaved: false,
    },
    {
        id: "5",
        title: "Escola Pública em Condições Precárias",
        content:
            "Teto de sala de aula desabou durante período letivo, colocando dezenas de estudantes em risco. Falta de manutenção e investimento compromete educação e segurança.",
        category: "education",
        status: "active",
        author: {
            id: "user5",
            name: "Julia Costa",
            avatar: "https://i.pravatar.cc/150?img=5",
            verified: false,
        },
        location: {
            city: "Araras",
            state: "SP",
        },
        stats: {
            likes: 445,
            shares: 89,
            comments: 156,
            supports: 334,
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop&auto=format",
                caption: "Sala de aula danificada após desabamento do teto",
                width: 600,
                height: 400,
            },
        ],
        tags: ["educação", "escola pública", "infraestrutura", "segurança"],
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        isLiked: false,
        isSaved: false,
    },
    {
        id: "6",
        title: "Transporte Público: Ônibus em Péssimo Estado",
        content:
            "Frota de ônibus urbanos apresenta problemas graves de manutenção. Passageiros relatam quebras constantes, superlotação e riscos à segurança durante trajetos.",
        category: "transport",
        status: "active",
        author: {
            id: "user6",
            name: "Roberto Lima",
            avatar: "https://i.pravatar.cc/150?img=6",
            verified: false,
        },
        location: {
            city: "Araras",
            state: "SP",
        },
        stats: {
            likes: 278,
            shares: 52,
            comments: 73,
            supports: 156,
        },
        media: [
            {
                type: "image",
                url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&auto=format",
                caption: "Ônibus urbano em condições precárias de manutenção",
                width: 600,
                height: 400,
            },
        ],
        tags: ["transporte", "ônibus", "manutenção", "mobilidade urbana"],
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        isLiked: false,
        isSaved: false,
    },
];

// EXEMPLO DE USO NO COMPONENTE:
/*
import { usePostsStore } from '../stores/postsStore';

const FeedScreen = () => {
    const { 
        posts, 
        loading, 
        error, 
        loadPosts, 
        toggleLike, 
        toggleSave 
    } = usePostsStore();

    useEffect(() => {
        loadPosts();
    }, []);

    const handleShare = (postId: string) => {
        // Implementar lógica de compartilhamento
        console.log('Compartilhar post:', postId);
    };

    // ... resto do componente
};
*/
