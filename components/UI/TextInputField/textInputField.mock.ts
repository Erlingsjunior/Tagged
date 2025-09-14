import { TextInputFieldProps } from "./textInputField.types";

export const textInputFieldMocks: Record<
    string,
    Partial<TextInputFieldProps>
> = {
    title: {
        label: "Título da Denúncia",
        placeholder: "Digite o título da sua denúncia...",
        value: "",
        maxLength: 100,
        showCharacterCount: true,
        required: true,
        helperText: "Seja claro e específico no título",
    },

    description: {
        label: "Descrição Detalhada",
        placeholder: "Descreva detalhadamente o ocorrido...",
        value: "",
        multiline: true,
        numberOfLines: 6,
        maxLength: 1000,
        showCharacterCount: true,
        required: true,
        helperText: "Forneça o máximo de detalhes possível",
    },

    location: {
        label: "Local do Ocorrido",
        placeholder: "Endereço, bairro, cidade...",
        value: "",
        maxLength: 200,
        required: true,
        helperText: "Informe onde o fato aconteceu",
    },

    email: {
        label: "Email para Contato",
        placeholder: "seu@email.com",
        value: "",
        keyboardType: "email-address",
        autoCapitalize: "none",
        required: true,
        helperText: "Usado para enviar atualizações sobre sua denúncia",
    },

    phone: {
        label: "Telefone (Opcional)",
        placeholder: "(11) 99999-9999",
        value: "",
        keyboardType: "phone-pad",
        maxLength: 15,
        helperText: "Apenas se quiser ser contatado por telefone",
    },

    password: {
        label: "Senha",
        placeholder: "Digite sua senha",
        value: "",
        secureTextEntry: true,
        required: true,
        helperText: "Mínimo 8 caracteres com letra, número e símbolo",
    },

    search: {
        placeholder: "Buscar denúncias...",
        value: "",
        variant: "outlined",
        size: "medium",
        // leftIcon seria um ícone de busca
    },

    withError: {
        label: "Campo com Erro",
        placeholder: "Digite algo...",
        value: "abc",
        required: true,
        errorMessage: "Este campo deve ter pelo menos 5 caracteres",
    },

    disabled: {
        label: "Campo Desabilitado",
        placeholder: "Não editável",
        value: "Valor fixo",
        disabled: true,
        helperText: "Este campo não pode ser editado",
    },

    underlined: {
        label: "Campo Sublinhado",
        placeholder: "Estilo underlined...",
        value: "",
        variant: "underlined",
        helperText: "Estilo minimalista",
    },

    large: {
        label: "Campo Grande",
        placeholder: "Tamanho large...",
        value: "",
        size: "large",
        variant: "outlined",
    },

    small: {
        label: "Campo Pequeno",
        placeholder: "Tamanho small...",
        value: "",
        size: "small",
        variant: "outlined",
    },
};
