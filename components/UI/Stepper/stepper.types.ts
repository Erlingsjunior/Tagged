export interface StepperStep {
    id: number | string;
    label: string;
    description?: string;
    completed?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
}

export interface StepperProps {
    steps: StepperStep[];
    currentStep: number;
    onStepPress?: (step: number) => void;
    orientation?: "horizontal" | "vertical";
    showLabels?: boolean;
    showDescriptions?: boolean;
    activeColor?: string;
    inactiveColor?: string;
    completedColor?: string;
    lineColor?: string;
    allowClickableSteps?: boolean;
}

export interface StepperItemProps {
    step: StepperStep;
    index: number;
    isActive: boolean;
    isCompleted: boolean;
    isLast: boolean;
    onPress?: () => void;
    orientation: "horizontal" | "vertical";
    showLabels: boolean;
    showDescriptions: boolean;
    activeColor: string;
    inactiveColor: string;
    completedColor: string;
    lineColor: string;
    allowClickable: boolean;
}
