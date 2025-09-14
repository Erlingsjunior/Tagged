import { TextInputProps } from "react-native";

export type TextInputFieldVariant = "default" | "outlined" | "underlined";
export type TextInputFieldSize = "small" | "medium" | "large";

export interface TextInputFieldProps extends Omit<TextInputProps, "style"> {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    variant?: TextInputFieldVariant;
    size?: TextInputFieldSize;
    multiline?: boolean;
    numberOfLines?: number;
    maxLength?: number;
    showCharacterCount?: boolean;
    errorMessage?: string;
    helperText?: string;
    disabled?: boolean;
    required?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftIconPress?: () => void;
    onRightIconPress?: () => void;
    autoFocus?: boolean;
    secureTextEntry?: boolean;
    keyboardType?: TextInputProps["keyboardType"];
    returnKeyType?: TextInputProps["returnKeyType"];
    onSubmitEditing?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
}
