import styled from "styled-components/native";
import { theme } from "../../../constants/Theme";
import { BoxTextVariant, BoxTextSize } from "./boxText.types";

interface StyledBoxProps {
    variant: BoxTextVariant;
    size: BoxTextSize;
    borderless: boolean;
}

const getBoxBackgroundColor = (variant: BoxTextVariant) => {
    switch (variant) {
        case "info":
            return theme.colors.secondary + "15"; // 15% opacity
        case "warning":
            return theme.colors.warning + "15";
        case "error":
            return theme.colors.error + "15";
        case "success":
            return theme.colors.success + "15";
        case "neutral":
        default:
            return theme.colors.card;
    }
};

const getBoxBorderColor = (variant: BoxTextVariant) => {
    switch (variant) {
        case "info":
            return theme.colors.secondary;
        case "warning":
            return theme.colors.warning;
        case "error":
            return theme.colors.error;
        case "success":
            return theme.colors.success;
        case "neutral":
        default:
            return theme.colors.border;
    }
};

const getBoxTextColor = (variant: BoxTextVariant) => {
    switch (variant) {
        case "info":
            return theme.colors.secondary;
        case "warning":
            return theme.colors.warning;
        case "error":
            return theme.colors.error;
        case "success":
            return theme.colors.success;
        case "neutral":
        default:
            return theme.colors.text.primary;
    }
};

const getBoxPadding = (size: BoxTextSize) => {
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

const getBoxFontSize = (size: BoxTextSize, isTitle: boolean = false) => {
    const baseSizes = {
        small: isTitle ? "14px" : "12px",
        medium: isTitle ? "16px" : "14px",
        large: isTitle ? "18px" : "16px",
    };

    return baseSizes[size] || baseSizes.medium;
};

export const StyledBox = styled.View<StyledBoxProps>`
    background-color: ${({ variant }) => getBoxBackgroundColor(variant)};
    border-color: ${({ variant, borderless }) =>
        borderless ? "transparent" : getBoxBorderColor(variant)};
    border-width: ${({ borderless }) => (borderless ? "0px" : "1px")};
    border-radius: ${theme.borderRadius.md}px;
    padding: ${({ size }) => getBoxPadding(size)};
    margin-bottom: ${theme.spacing.sm}px;
`;

export const BoxHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${theme.spacing.xs}px;
`;

export const BoxHeaderLeft = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1;
`;

export const BoxTitle = styled.Text<{
    variant: BoxTextVariant;
    size: BoxTextSize;
}>`
    color: ${({ variant }) => getBoxTextColor(variant)};
    font-size: ${({ size }) => getBoxFontSize(size, true)};
    font-weight: 600;
    margin-left: ${theme.spacing.xs}px;
`;

export const BoxContent = styled.Text<{
    variant: BoxTextVariant;
    size: BoxTextSize;
}>`
    color: ${({ variant }) => getBoxTextColor(variant)};
    font-size: ${({ size }) => getBoxFontSize(size, false)};
    line-height: ${({ size }) => {
        const fontSize = parseInt(getBoxFontSize(size, false));
        return `${fontSize * 1.4}px`;
    }};
`;

export const DismissButton = styled.TouchableOpacity`
    padding: ${theme.spacing.xs}px;
    margin-left: ${theme.spacing.sm}px;
`;

export const IconContainer = styled.View`
    margin-right: ${theme.spacing.xs}px;
`;
