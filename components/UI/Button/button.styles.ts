import styled from "styled-components/native";
import { theme } from "../../../constants/Theme";
import { ButtonVariant, ButtonSize } from "./button.types";

interface StyledButtonProps {
    variant: ButtonVariant;
    size: ButtonSize;
    fullWidth: boolean;
    disabled: boolean;
}

const getButtonBackgroundColor = (
    variant: ButtonVariant,
    disabled: boolean
) => {
    if (disabled) return theme.colors.border;

    switch (variant) {
        case "primary":
            return theme.colors.primary;
        case "secondary":
            return theme.colors.secondary;
        case "outlined":
            return "transparent";
        case "ghost":
            return "transparent";
        case "danger":
            return theme.colors.error;
        default:
            return theme.colors.primary;
    }
};

const getButtonBorderColor = (variant: ButtonVariant, disabled: boolean) => {
    if (disabled) return theme.colors.border;

    switch (variant) {
        case "outlined":
            return theme.colors.primary;
        case "ghost":
            return "transparent";
        default:
            return "transparent";
    }
};

const getButtonTextColor = (variant: ButtonVariant, disabled: boolean) => {
    if (disabled) return theme.colors.text.secondary;

    switch (variant) {
        case "primary":
        case "secondary":
        case "danger":
            return theme.colors.text.light;
        case "outlined":
        case "ghost":
            return theme.colors.primary;
        default:
            return theme.colors.text.light;
    }
};

const getButtonPadding = (size: ButtonSize) => {
    switch (size) {
        case "small":
            return `${theme.spacing.sm}px ${theme.spacing.md}px`;
        case "medium":
            return `${theme.spacing.md}px ${theme.spacing.lg}px`;
        case "large":
            return `${theme.spacing.lg}px ${theme.spacing.xl}px`;
        default:
            return `${theme.spacing.md}px ${theme.spacing.lg}px`;
    }
};

const getButtonFontSize = (size: ButtonSize) => {
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

export const StyledButton = styled.TouchableOpacity<StyledButtonProps>`
    background-color: ${({ variant, disabled }: any) =>
        getButtonBackgroundColor(variant, disabled)};
    border-color: ${({ variant, disabled }: any) =>
        getButtonBorderColor(variant, disabled)};
    border-width: ${({ variant }: any) =>
        variant === "outlined" ? "1px" : "0px"};
    border-radius: ${theme.borderRadius.md}px;
    padding: ${({ size }: any) => getButtonPadding(size)};
    flex-direction: row;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    width: ${({ fullWidth }: any) => (fullWidth ? "100%" : "auto")};
    opacity: ${({ disabled }: any) => (disabled ? 0.6 : 1)};
`;

export const ButtonText = styled.Text<StyledButtonProps>`
    color: ${({ variant, disabled }: any) =>
        getButtonTextColor(variant, disabled)};
    font-size: ${({ size }: any) => getButtonFontSize(size)};
    font-weight: 600;
    text-align: center;
`;

export const IconContainer = styled.View<{ position: "left" | "right" }>`
    margin-left: ${({ position }: any) =>
        position === "right" ? `${theme.spacing.sm}px` : "0px"};
    margin-right: ${({ position }: any) =>
        position === "left" ? `${theme.spacing.sm}px` : "0px"};
`;

export const LoadingIndicator = styled.ActivityIndicator`
    margin-right: ${theme.spacing.sm}px;
`;
