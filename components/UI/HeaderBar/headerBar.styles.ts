import styled from "styled-components/native";
import { theme } from "../../../constants/Theme";

interface HeaderContainerProps {
    variant: "default" | "transparent" | "bordered";
    height: number;
    backgroundColor?: string;
}

interface ProgressBarProps {
    progress: number;
    maxProgress: number;
}

export const HeaderContainer = styled.View<HeaderContainerProps>`
    height: ${({ height }: HeaderContainerProps) => height}px;
    background-color: ${({
        variant,
        backgroundColor,
    }: HeaderContainerProps) => {
        if (backgroundColor) return backgroundColor;
        switch (variant) {
            case "transparent":
                return "transparent";
            case "bordered":
            case "default":
            default:
                return theme.colors.surface;
        }
    }};
    border-bottom-width: ${({ variant }: HeaderContainerProps) =>
        variant === "bordered" ? "1px" : "0px"};
    border-bottom-color: ${theme.colors.border};
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-horizontal: ${theme.spacing.md}px;
    elevation: ${({ variant }: HeaderContainerProps) =>
        variant === "default" ? 2 : 0};
    shadow-color: #000;
    shadow-offset: 0px 1px;
    shadow-opacity: ${({ variant }: HeaderContainerProps) =>
        variant === "default" ? 0.1 : 0};
    shadow-radius: 2px;
`;

export const LeftSection = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1;
`;

export const CenterSection = styled.View`
    flex: 2;
    align-items: center;
    justify-content: center;
`;

export const RightSection = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
`;

export const ActionButton = styled.TouchableOpacity<{ disabled: boolean }>`
    padding: ${theme.spacing.sm}px;
    margin-horizontal: ${theme.spacing.xs}px;
    border-radius: ${theme.borderRadius.sm}px;
    opacity: ${({ disabled }: { disabled: boolean }) => (disabled ? 0.5 : 1)};
    background-color: transparent;
`;

export const ActionButtonWithBackground = styled(ActionButton)`
    background-color: ${theme.colors.primary};
    padding-horizontal: ${theme.spacing.md}px;
`;

export const TitleContainer = styled.View`
    align-items: center;
    justify-content: center;
    flex: 1;
`;

export const Title = styled.Text<{ textColor?: string }>`
    font-size: 18px;
    font-weight: 600;
    color: ${({ textColor }: any) => textColor || theme.colors.text.primary};
    text-align: center;
`;

export const Subtitle = styled.Text<{ textColor?: string }>`
    font-size: 12px;
    color: ${({ textColor }: any) => textColor || theme.colors.text.secondary};
    text-align: center;
    margin-top: 2px;
`;

export const ActionText = styled.Text<{
    isBackground: boolean;
    disabled: boolean;
}>`
    font-size: 14px;
    font-weight: 500;
    color: ${({ isBackground, disabled }: any) => {
        if (disabled) return theme.colors.text.secondary;
        return isBackground ? theme.colors.text.light : theme.colors.primary;
    }};
    margin-left: ${theme.spacing.xs}px;
`;

export const ProgressContainer = styled.View`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background-color: ${theme.colors.border};
`;

export const ProgressBar = styled.View<ProgressBarProps>`
    height: 100%;
    background-color: ${theme.colors.primary};
    width: ${({ progress, maxProgress }: ProgressBarProps) =>
        (progress / maxProgress) * 100}%;
`;

export const IconContainer = styled.View`
    margin-right: ${theme.spacing.xs}px;
`;
