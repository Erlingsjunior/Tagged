export interface AnonymousToggleProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    title?: string;
    description?: string;
    helperText?: string;
    disabled?: boolean;
    showIcon?: boolean;
    layout?: "horizontal" | "vertical";
    variant?: "default" | "card" | "minimal";
}

export interface ToggleState {
    isAnimating: boolean;
}
