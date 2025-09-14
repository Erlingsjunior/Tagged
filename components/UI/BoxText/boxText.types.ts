import { TextProps, ViewProps } from "react-native";

export type BoxTextVariant =
    | "info"
    | "warning"
    | "error"
    | "success"
    | "neutral";
export type BoxTextSize = "small" | "medium" | "large";

export interface BoxTextProps extends ViewProps {
    children: React.ReactNode;
    variant?: BoxTextVariant;
    size?: BoxTextSize;
    title?: string;
    icon?: React.ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
    borderless?: boolean;
}

export interface BoxTextTextProps extends TextProps {
    variant: BoxTextVariant;
    size: BoxTextSize;
    isTitle?: boolean;
}
