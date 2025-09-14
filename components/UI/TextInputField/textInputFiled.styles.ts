import styled from "styled-components/native";
import { theme } from "../../../constants/Theme";
import {
    TextInputFieldVariant,
    TextInputFieldSize,
} from "./textInputField.types";

interface StyledInputContainerProps {
    variant: TextInputFieldVariant;
    size: TextInputFieldSize;
    hasError: boolean;
    isFocused: boolean;
    disabled: boolean;
}

interface StyledInputProps {
    variant: TextInputFieldVariant;
    size: TextInputFieldSize;
    hasLeftIcon: boolean;
    hasRightIcon: boolean;
    multiline: boolean;
}

const getInputHeight = (
    size: TextInputFieldSize,
    multiline: boolean,
    numberOfLines: number = 1
) => {
    if (multiline) {
        const lineHeight = size === "small" ? 18 : size === "medium" ? 20 : 22;
        return `${lineHeight * numberOfLines + 24}px`;
    }

    switch (size) {
        case "small":
            return "40px";
        case "medium":
            return "48px";
        case "large":
            return "56px";
        default:
            return "48px";
    }
};

const getInputPadding = (
    size: TextInputFieldSize,
    hasLeftIcon: boolean,
    hasRightIcon: boolean
) => {
    const verticalPadding =
        size === "small" ? theme.spacing.sm : theme.spacing.md;
    const leftPadding = hasLeftIcon
        ? theme.spacing.xl + theme.spacing.sm
        : theme.spacing.md;
    const rightPadding = hasRightIcon
        ? theme.spacing.xl + theme.spacing.sm
        : theme.spacing.md;

    return `${verticalPadding}px ${rightPadding}px ${verticalPadding}px ${leftPadding}px`;
};

const getInputFontSize = (size: TextInputFieldSize) => {
    switch (size) {
        case "small":
            return "14px";
        case "medium":
            return "16px";
        case "large":
            return "18px";
        default:
            return "16px";
    }
};

const getBorderColor = (
    variant: TextInputFieldVariant,
    hasError: boolean,
    isFocused: boolean,
    disabled: boolean
) => {
    if (disabled) return theme.colors.border;
    if (hasError) return theme.colors.error;
    if (isFocused) return theme.colors.primary;

    switch (variant) {
        case "outlined":
            return theme.colors.border;
        case "underlined":
            return theme.colors.border;
        default:
            return theme.colors.border;
    }
};

const getBackgroundColor = (
    variant: TextInputFieldVariant,
    disabled: boolean
) => {
    if (disabled) return theme.colors.card;

    switch (variant) {
        case "outlined":
            return theme.colors.surface;
        case "underlined":
            return "transparent";
        default:
            return theme.colors.surface;
    }
};

export const Container = styled.View`
    margin-bottom: ${theme.spacing.md}px;
`;

export const Label = styled.Text<{ required: boolean }>`
    font-size: 14px;
    font-weight: 500;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.xs}px;

    ${({ required }: any) =>
        required &&
        `
    &:after {
      content: ' *';
      color: ${theme.colors.error};
    }
  `}
`;

export const InputContainer = styled.View<StyledInputContainerProps>`
    position: relative;
    border-width: ${({ variant }: any) =>
        variant === "underlined" ? "0px 0px 1px 0px" : "1px"};
    border-color: ${({ variant, hasError, isFocused, disabled }: any) =>
        getBorderColor(variant, hasError, isFocused, disabled)};
    border-radius: ${({ variant }: any) =>
        variant === "underlined" ? "0px" : `${theme.borderRadius.md}px`};
    background-color: ${({ variant, disabled }: any) =>
        getBackgroundColor(variant, disabled)};
`;

export const StyledTextInput = styled.TextInput<StyledInputProps>`
    font-size: ${({ size }: any) => getInputFontSize(size)};
    color: ${theme.colors.text.primary};
    padding: ${({ size, hasLeftIcon, hasRightIcon }: any) =>
        getInputPadding(size, hasLeftIcon, hasRightIcon)};
    height: ${({ size, multiline, numberOfLines }: any) =>
        getInputHeight(size, multiline, numberOfLines)};
    text-align-vertical: ${({ multiline }: any) => (multiline ? "top" : "center")};
`;

export const IconContainer = styled.TouchableOpacity<{
    position: "left" | "right";
    size: TextInputFieldSize;
}>`
    position: absolute;
    top: 50%;
    ${({ position }: any) => position}: ${theme.spacing.md}px;
    transform: translateY(-12px);
    width: 24px;
    height: 24px;
    justify-content: center;
    align-items: center;
`;

export const HelperTextContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${theme.spacing.xs}px;
`;

export const HelperText = styled.Text<{ isError: boolean }>`
    font-size: 12px;
    color: ${({ isError }: any) =>
        isError ? theme.colors.error : theme.colors.text.secondary};
    flex: 1;
`;

export const CharacterCount = styled.Text<{ isOverLimit: boolean }>`
    font-size: 12px;
    color: ${({ isOverLimit }: any) =>
        isOverLimit ? theme.colors.error : theme.colors.text.secondary};
    margin-left: ${theme.spacing.sm}px;
`;
