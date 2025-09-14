import { TouchableOpacityProps } from "react-native";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "outlined"
    | "ghost"
    | "danger";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onPress: () => void;
}
