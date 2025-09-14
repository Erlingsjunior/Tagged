import { BoxTextProps } from "./boxText.types";

export const boxTextMocks: Record<string, BoxTextProps> = {
    info: {
        children:
            "Sua denúncia será analisada pela equipe Tagged em até 24 horas.",
        variant: "info",
        size: "medium",
        title: "Informação",
    },

    warning: {
        children:
            "Certifique-se de que todos os campos obrigatórios estão preenchidos antes de continuar.",
        variant: "warning",
        size: "medium",
        title: "Atenção",
    },

    error: {
        children:
            "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "error",
        size: "medium",
        title: "Erro",
        dismissible: true,
        onDismiss: () => console.log("Error dismissed"),
    },

    success: {
        children:
            "Denúncia enviada com sucesso! Você receberá atualizações sobre o andamento.",
        variant: "success",
        size: "medium",
        title: "Sucesso",
    },

    neutral: {
        children:
            "As informações fornecidas serão mantidas em sigilo conforme nossa política de privacidade.",
        variant: "neutral",
        size: "medium",
    },

    anonymousInfo: {
        children:
            "Modo anônimo ativado. Sua identidade não será revelada durante o processo.",
        variant: "info",
        size: "small",
        title: "Denúncia Anônima",
        borderless: true,
    },

    fileUploadTip: {
        children:
            "Você pode anexar até 5 arquivos como evidência. Formatos aceitos: JPG, PNG, PDF, MP4.",
        variant: "neutral",
        size: "small",
        title: "Dica",
    },

    urgentWarning: {
        children:
            "Esta denúncia será marcada como urgente e terá prioridade na análise.",
        variant: "warning",
        size: "medium",
        title: "Denúncia Urgente",
    },
};
