import { AnonymousToggleProps } from "./anonymousToggle.types";

export const anonymousToggleMocks: Record<
    string,
    Partial<AnonymousToggleProps>
> = {
    default: {
        value: false,
        onValueChange: (value) => console.log("Anonymous mode:", value),
        title: "Denúncia Anônima",
        description:
            "Sua identidade será mantida em sigilo durante todo o processo",
        showIcon: true,
        layout: "horizontal",
        variant: "default",
    },

    enabled: {
        value: true,
        onValueChange: (value) => console.log("Anonymous mode:", value),
        title: "Modo Anônimo Ativado",
        description:
            "Sua denúncia será processada pela equipe Tagged sem revelar sua identidade",
        helperText:
            "Você ainda receberá atualizações sobre o andamento da denúncia",
        showIcon: true,
        layout: "horizontal",
        variant: "card",
    },

    vertical: {
        value: false,
        onValueChange: (value) => console.log("Anonymous mode:", value),
        title: "Proteção de Identidade",
        description:
            "Escolha se deseja manter sua identidade protegida. Em modo anônimo, apenas a equipe Tagged terá acesso aos seus dados pessoais.",
        helperText:
            "Esta opção pode ser alterada posteriormente nas configurações",
        showIcon: true,
        layout: "vertical",
        variant: "card",
    },

    minimal: {
        value: true,
        onValueChange: (value) => console.log("Anonymous mode:", value),
        title: "Anônimo",
        showIcon: false,
        layout: "horizontal",
        variant: "minimal",
    },

    disabled: {
        value: true,
        onValueChange: (value) => console.log("Anonymous mode:", value),
        title: "Modo Anônimo (Obrigatório)",
        description: "Para sua segurança, esta denúncia deve ser anônima",
        helperText:
            "Esta configuração não pode ser alterada para este tipo de denúncia",
        disabled: true,
        showIcon: true,
        layout: "horizontal",
        variant: "card",
    },

    whistleblower: {
        value: true,
        onValueChange: (value) => console.log("Whistleblower mode:", value),
        title: "Proteção de Denunciante",
        description:
            "Ative para máxima proteção. Sua identidade será criptografada e apenas acessível em casos extremos com autorização judicial.",
        helperText:
            "Recomendado para denúncias sensíveis envolvendo corrupção ou crimes graves",
        showIcon: true,
        layout: "vertical",
        variant: "card",
    },
};
