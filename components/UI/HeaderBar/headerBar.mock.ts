import { HeaderBarProps } from "./headerBar.types";

export const headerBarMocks: Record<string, Partial<HeaderBarProps>> = {
    createReport: {
        title: "Nova Denúncia",
        subtitle: "Passo 1 de 4",
        showBackButton: true,
        showCloseButton: true,
        onBackPress: () => console.log("Back pressed"),
        onClosePress: () => console.log("Close pressed"),
        variant: "default",
        showProgress: true,
        progress: 25,
        maxProgress: 100,
    },

    withSave: {
        title: "Editar Denúncia",
        showBackButton: true,
        showSaveButton: true,
        onBackPress: () => console.log("Back pressed"),
        onSavePress: () => console.log("Save pressed"),
        variant: "bordered",
    },

    simple: {
        title: "Configurações",
        showBackButton: true,
        onBackPress: () => console.log("Back pressed"),
        variant: "default",
    },

    transparent: {
        title: "Denúncias",
        variant: "transparent",
        textColor: "#FFFFFF",
        backgroundColor: "transparent",
    },

    withProgress: {
        title: "Enviando...",
        subtitle: "Fazendo upload dos arquivos",
        variant: "default",
        showProgress: true,
        progress: 75,
        maxProgress: 100,
    },

    reviewStep: {
        title: "Revisar Denúncia",
        subtitle: "Última etapa",
        showBackButton: true,
        showCloseButton: true,
        onBackPress: () => console.log("Back to previous step"),
        onClosePress: () => console.log("Cancel report"),
        variant: "default",
        showProgress: true,
        progress: 100,
        maxProgress: 100,
    },

    homeHeader: {
        title: "Tagged",
        subtitle: "Sua voz, sua força, sua mudança",
        variant: "default",
        // rightIcon seria um ícone de perfil ou menu
    },

    searchHeader: {
        title: "Buscar Denúncias",
        showBackButton: true,
        onBackPress: () => console.log("Back to home"),
        variant: "bordered",
        // rightIcon seria um ícone de filtro
    },

    profileHeader: {
        title: "Meu Perfil",
        showBackButton: true,
        showSaveButton: true,
        onBackPress: () => console.log("Back pressed"),
        onSavePress: () => console.log("Save profile"),
        variant: "default",
    },
};
