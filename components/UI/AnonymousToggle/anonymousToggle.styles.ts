import styled from "styled-components/native";
import { theme } from "../../../constants/Theme";

interface ContainerProps {
    variant: "default" | "card" | "minimal";
    layout: "horizontal" | "vertical";
    disabled: boolean;
}

interface ToggleContainerProps {
    isActive: boolean;
    disabled: boolean;
}

interface ToggleCircleProps {
    isActive: boolean;
    disabled: boolean;
}

export const Container = styled.TouchableOpacity<ContainerProps>`
    ${({ variant, layout, disabled }: ContainerProps) => {
        let baseStyles = `
      opacity: ${disabled ? 0.5 : 1};
      margin-bottom: ${theme.spacing.md}px;
    `;

        switch (variant) {
            case "card":
                return (
                    baseStyles +
                    `
          background-color: ${theme.colors.surface};
          border-radius: ${theme.borderRadius.md}px;
          border-width: 1px;
          border-color: ${theme.colors.border};
          padding: ${theme.spacing.lg}px;
          elevation: 1;
          shadow-color: #000;
          shadow-offset: 0px 1px;
          shadow-opacity: 0.1;
          shadow-radius: 2px;
        `
                );
            case "minimal":
                return (
                    baseStyles +
                    `
          padding: ${theme.spacing.sm}px 0px;
        `
                );
            default:
                return (
                    baseStyles +
                    `
          background-color: ${theme.colors.surface};
          border-radius: ${theme.borderRadius.md}px;
          padding: ${theme.spacing.md}px;
        `
                );
        }
    }}

    flex-direction: ${({ layout }: ContainerProps) =>
        layout === "vertical" ? "column" : "row"};
    align-items: ${({ layout }: ContainerProps) =>
        layout === "vertical" ? "flex-start" : "center"};
    justify-content: space-between;
`;

export const ContentContainer = styled.View<{
    layout: "horizontal" | "vertical";
}>`
    flex: 1;
    margin-right: ${({ layout }: { layout: "horizontal" | "vertical" }) =>
        layout === "horizontal" ? `${theme.spacing.md}px` : "0px"};
    margin-bottom: ${({ layout }: { layout: "horizontal" | "vertical" }) =>
        layout === "vertical" ? `${theme.spacing.md}px` : "0px"};
`;

export const TitleContainer = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${theme.spacing.xs}px;
`;

export const IconContainer = styled.View`
    margin-right: ${theme.spacing.sm}px;
`;

export const Title = styled.Text<{ isActive: boolean }>`
    font-size: 16px;
    font-weight: 600;
    color: ${({ isActive }: { isActive: boolean }) =>
        isActive ? theme.colors.primary : theme.colors.text.primary};
`;

export const Description = styled.Text<{ isActive: boolean }>`
    font-size: 14px;
    color: ${({ isActive }: { isActive: boolean }) =>
        isActive ? theme.colors.primary : theme.colors.text.secondary};
    line-height: 20px;
    margin-bottom: ${theme.spacing.xs}px;
`;

export const HelperText = styled.Text`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    line-height: 16px;
`;

export const ToggleContainer = styled.View<ToggleContainerProps>`
    width: 50px;
    height: 30px;
    border-radius: 15px;
    background-color: ${({ isActive, disabled }: ToggleContainerProps) => {
        if (disabled) return theme.colors.border;
        return isActive ? theme.colors.primary : theme.colors.border;
    }};
    justify-content: center;
    padding: 2px;
    elevation: ${({ isActive }: ToggleContainerProps) => (isActive ? 2 : 0)};
    shadow-color: ${theme.colors.primary};
    shadow-offset: 0px 1px;
    shadow-opacity: ${({ isActive }: ToggleContainerProps) =>
        isActive ? 0.3 : 0};
    shadow-radius: 2px;
`;

export const ToggleCircle = styled.View<ToggleCircleProps>`
    width: 26px;
    height: 26px;
    border-radius: 13px;
    background-color: ${theme.colors.surface};
    position: absolute;
    top: 2px;
    left: ${({ isActive }: ToggleCircleProps) => (isActive ? "22px" : "2px")};
    elevation: 2;
    shadow-color: #000;
    shadow-offset: 0px 1px;
    shadow-opacity: 0.2;
    shadow-radius: 2px;
`;

export const StatusBadge = styled.View<{ isActive: boolean }>`
    background-color: ${({ isActive }: { isActive: boolean }) =>
        isActive ? theme.colors.primary + "15" : theme.colors.card};
    border-radius: ${theme.borderRadius.sm}px;
    padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
    margin-top: ${theme.spacing.sm}px;
    align-self: flex-start;
`;

export const StatusText = styled.Text<{ isActive: boolean }>`
    font-size: 12px;
    font-weight: 500;
    color: ${({ isActive }: { isActive: boolean }) =>
        isActive ? theme.colors.primary : theme.colors.text.secondary};
`;
