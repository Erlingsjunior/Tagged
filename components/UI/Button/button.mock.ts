import { ButtonProps } from "./button.types";

export const buttonMocks: Record<string, ButtonProps> = {
    primary: {
        title: "Enviar Denúncia",
        variant: "primary",
        size: "medium",
        onPress: () => console.log("Primary button pressed"),
    },

    secondary: {
        title: "Salvar Rascunho",
        variant: "secondary",
        size: "medium",
        onPress: () => console.log("Secondary button pressed"),
    },

    outlined: {
        title: "Cancelar",
        variant: "outlined",
        size: "medium",
        onPress: () => console.log("Outlined button pressed"),
    },

    loading: {
        title: "Enviando...",
        variant: "primary",
        size: "medium",
        loading: true,
        onPress: () => console.log("Loading button pressed"),
    },

    disabled: {
        title: "Não disponível",
        variant: "primary",
        size: "medium",
        disabled: true,
        onPress: () => console.log("Disabled button pressed"),
    },

    fullWidth: {
        title: "Próximo Passo",
        variant: "primary",
        size: "large",
        fullWidth: true,
        onPress: () => console.log("Full width button pressed"),
    },

    danger: {
        title: "Excluir Denúncia",
        variant: "danger",
        size: "medium",
        onPress: () => console.log("Danger button pressed"),
    },

    ghost: {
        title: "Pular",
        variant: "ghost",
        size: "small",
        onPress: () => console.log("Ghost button pressed"),
    },
};
