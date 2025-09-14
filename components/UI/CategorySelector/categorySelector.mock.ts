import { CategorySelectorProps, Category } from "./categorySelector.types";

export const mockCategories: Category[] = [
    {
        id: "corruption",
        label: "Corrupção",
        description: "Denúncias relacionadas a corrupção pública ou privada",
        color: "#F44336",
    },
    {
        id: "environmental",
        label: "Ambiental",
        description: "Crimes ambientais, poluição, desmatamento",
        color: "#4CAF50",
    },
    {
        id: "human-rights",
        label: "Direitos Humanos",
        description: "Violação de direitos humanos e discriminação",
        color: "#2196F3",
    },
    {
        id: "workplace",
        label: "Trabalho",
        description: "Assédio, condições inadequadas, trabalho escravo",
        color: "#FF9800",
    },
    {
        id: "health",
        label: "Saúde Pública",
        description: "Problemas no sistema de saúde",
        color: "#9C27B0",
    },
    {
        id: "education",
        label: "Educação",
        description: "Problemas no sistema educacional",
        color: "#607D8B",
    },
    {
        id: "consumer",
        label: "Consumidor",
        description: "Direitos do consumidor, propaganda enganosa",
        color: "#795548",
    },
    {
        id: "other",
        label: "Outros",
        description: "Outras categorias não especificadas",
        color: "#9E9E9E",
    },
];

export const categorySelectorMocks: Record<
    string,
    Partial<CategorySelectorProps>
> = {
    reportCategories: {
        categories: mockCategories,
        selectedCategories: [],
        onCategorySelect: (id) => console.log("Selected category:", id),
        onCategoryDeselect: (id) => console.log("Deselected category:", id),
        multiSelect: false,
        layout: "grid",
        columns: 2,
        showIcons: true,
        showDescriptions: true,
        title: "Selecione a Categoria da Denúncia",
        helperText: "Escolha a categoria que melhor descreve sua denúncia",
        required: true,
    },

    multiSelectChips: {
        categories: mockCategories.slice(0, 6),
        selectedCategories: ["corruption", "environmental"],
        onCategorySelect: (id) => console.log("Selected category:", id),
        onCategoryDeselect: (id) => console.log("Deselected category:", id),
        multiSelect: true,
        maxSelections: 3,
        layout: "chips",
        showIcons: false,
        showDescriptions: false,
        title: "Tags Relacionadas",
        helperText: "Selecione até 3 categorias relacionadas",
    },

    listLayout: {
        categories: mockCategories.slice(0, 4),
        selectedCategories: ["human-rights"],
        onCategorySelect: (id) => console.log("Selected category:", id),
        onCategoryDeselect: (id) => console.log("Deselected category:", id),
        multiSelect: false,
        layout: "list",
        showIcons: true,
        showDescriptions: true,
        title: "Tipo de Denúncia",
    },

    withError: {
        categories: mockCategories.slice(0, 4),
        selectedCategories: [],
        onCategorySelect: (id) => console.log("Selected category:", id),
        onCategoryDeselect: (id) => console.log("Deselected category:", id),
        multiSelect: false,
        layout: "grid",
        columns: 2,
        title: "Categoria Obrigatória",
        errorMessage: "Você deve selecionar pelo menos uma categoria",
        required: true,
    },

    disabled: {
        categories: mockCategories.slice(0, 3),
        selectedCategories: ["corruption"],
        onCategorySelect: (id) => console.log("Selected category:", id),
        onCategoryDeselect: (id) => console.log("Deselected category:", id),
        multiSelect: false,
        layout: "chips",
        title: "Categoria Bloqueada",
        helperText: "Esta seleção não pode ser alterada",
        disabled: true,
    },

    urgencyLevels: {
        categories: [
            {
                id: "low",
                label: "Baixa",
                description: "Situação não urgente",
                color: "#4CAF50",
            },
            {
                id: "medium",
                label: "Média",
                description: "Situação requer atenção",
                color: "#FF9800",
            },
            {
                id: "high",
                label: "Alta",
                description: "Situação urgente",
                color: "#F44336",
            },
            {
                id: "critical",
                label: "Crítica",
                description: "Situação de emergência",
                color: "#9C27B0",
            },
        ],
        selectedCategories: [],
        onCategorySelect: (id) => console.log("Selected urgency:", id),
        onCategoryDeselect: (id) => console.log("Deselected urgency:", id),
        multiSelect: false,
        layout: "grid",
        columns: 2,
        showIcons: false,
        showDescriptions: true,
        title: "Nível de Urgência",
        helperText: "Indique o nível de urgência da sua denúncia",
        required: true,
    },
};
