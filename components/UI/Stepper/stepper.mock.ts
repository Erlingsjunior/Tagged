import { StepperProps } from "./stepper.types";

export const stepperMocks: Record<string, StepperProps> = {
    createReportSteps: {
        steps: [
            {
                id: 0,
                label: "Informações",
                description: "Título e descrição",
            },
            {
                id: 1,
                label: "Evidências",
                description: "Anexar arquivos",
            },
            {
                id: 2,
                label: "Categoria",
                description: "Selecionar tipo",
            },
            {
                id: 3,
                label: "Revisão",
                description: "Confirmar dados",
            },
        ],
        currentStep: 0,
        onStepPress: (step) => console.log(`Step ${step} pressed`),
        orientation: "horizontal",
        showLabels: true,
        showDescriptions: true,
        allowClickableSteps: true,
    },

    simpleHorizontal: {
        steps: [
            { id: 0, label: "Início" },
            { id: 1, label: "Dados" },
            { id: 2, label: "Confirmar" },
        ],
        currentStep: 1,
        orientation: "horizontal",
        showLabels: true,
        allowClickableSteps: false,
    },

    verticalWithDescriptions: {
        steps: [
            {
                id: 0,
                label: "Criar conta",
                description: "Digite suas informações pessoais",
                completed: true,
            },
            {
                id: 1,
                label: "Verificar email",
                description: "Confirme seu endereço de email",
                completed: true,
            },
            {
                id: 2,
                label: "Completar perfil",
                description: "Adicione foto e preferências",
            },
            {
                id: 3,
                label: "Finalizar",
                description: "Revisar e confirmar",
                disabled: true,
            },
        ],
        currentStep: 2,
        orientation: "vertical",
        showLabels: true,
        showDescriptions: true,
        allowClickableSteps: true,
    },

    completedSteps: {
        steps: [
            { id: 0, label: "Passo 1", completed: true },
            { id: 1, label: "Passo 2", completed: true },
            { id: 2, label: "Passo 3", completed: true },
            { id: 3, label: "Finalizado", completed: true },
        ],
        currentStep: 3,
        orientation: "horizontal",
        showLabels: true,
    },
};
