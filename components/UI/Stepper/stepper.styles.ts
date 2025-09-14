import styled from "styled-components/native";
import { theme } from "../../../constants/Theme";

interface StepperContainerProps {
    orientation: "horizontal" | "vertical";
}

interface StepCircleProps {
    isActive: boolean;
    isCompleted: boolean;
    activeColor: string;
    inactiveColor: string;
    completedColor: string;
    allowClickable: boolean;
}

interface StepLineProps {
    orientation: "horizontal" | "vertical";
    lineColor: string;
}

export const StepperContainer = styled.View<StepperContainerProps>`
    flex-direction: ${({ orientation }: any) =>
        orientation === "horizontal" ? "row" : "column"};
    align-items: ${({ orientation }: any) =>
        orientation === "horizontal" ? "center" : "flex-start"};
    padding: ${theme.spacing.md}px;
`;

export const StepContainer = styled.View<StepperContainerProps>`
    flex-direction: ${({ orientation }: any) =>
        orientation === "horizontal" ? "column" : "row"};
    align-items: center;
    flex: ${({ orientation }: any) => (orientation === "horizontal" ? 1 : 0)};
    margin-bottom: ${({ orientation }: any) =>
        orientation === "vertical" ? `${theme.spacing.lg}px` : "0px"};
`;

export const StepCircleContainer = styled.View<StepperContainerProps>`
    flex-direction: ${({ orientation }: any) =>
        orientation === "horizontal" ? "column" : "row"};
    align-items: center;
    position: relative;
`;

export const StepCircle = styled.TouchableOpacity<StepCircleProps>`
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background-color: ${({
        isActive,
        isCompleted,
        activeColor,
        inactiveColor,
        completedColor,
    }: any) => {
        if (isCompleted) return completedColor;
        if (isActive) return activeColor;
        return inactiveColor;
    }};
    border-width: 2px;
    border-color: ${({
        isActive,
        isCompleted,
        activeColor,
        inactiveColor,
        completedColor,
    }: any) => {
        if (isCompleted) return completedColor;
        if (isActive) return activeColor;
        return inactiveColor;
    }};
    justify-content: center;
    align-items: center;
    elevation: ${({ isActive, isCompleted }: any) =>
        isActive || isCompleted ? 2 : 0};
    shadow-color: #000;
    shadow-offset: 0px 1px;
    shadow-opacity: ${({ isActive, isCompleted }: any) =>
        isActive || isCompleted ? 0.2 : 0};
    shadow-radius: 2px;
`;

export const StepNumber = styled.Text<StepCircleProps>`
    font-size: 16px;
    font-weight: 600;
    color: ${({ isActive, isCompleted, activeColor, inactiveColor }: any) => {
        if (isCompleted || isActive) return theme.colors.text.light;
        return theme.colors.text.secondary;
    }};
`;

export const StepLine = styled.View<StepLineProps>`
    background-color: ${({ lineColor }: any) => lineColor};
    width: ${({ orientation }: any) =>
        orientation === "horizontal" ? "100%" : "2px"};
    height: ${({ orientation }: any) =>
        orientation === "horizontal" ? "2px" : "30px"};
    position: absolute;
    top: ${({ orientation }: any) =>
        orientation === "horizontal" ? "19px" : "40px"};
    left: ${({ orientation }: any) =>
        orientation === "horizontal" ? "60px" : "19px"};
    right: ${({ orientation }: any) =>
        orientation === "horizontal" ? "-20px" : "auto"};
    z-index: -1;
`;

export const StepContent = styled.View<StepperContainerProps>`
    align-items: center;
    margin-top: ${({ orientation }: any) =>
        orientation === "horizontal" ? `${theme.spacing.sm}px` : "0px"};
    margin-left: ${({ orientation }: any) =>
        orientation === "vertical" ? `${theme.spacing.md}px` : "0px"};
    flex: ${({ orientation }: any) => (orientation === "vertical" ? 1 : 0)};
`;

export const StepLabel = styled.Text<{
    isActive: boolean;
    isCompleted: boolean;
}>`
    font-size: 14px;
    font-weight: ${({ isActive, isCompleted }: any) =>
        isActive || isCompleted ? "600" : "400"};
    color: ${({ isActive, isCompleted }: any) => {
        if (isCompleted || isActive) return theme.colors.text.primary;
        return theme.colors.text.secondary;
    }};
    text-align: center;
    margin-top: ${theme.spacing.xs}px;
`;

export const StepDescription = styled.Text<{
    isActive: boolean;
    isCompleted: boolean;
}>`
    font-size: 12px;
    color: ${({ isActive, isCompleted }: any) => {
        if (isCompleted || isActive) return theme.colors.text.secondary;
        return theme.colors.text.secondary;
    }};
    text-align: center;
    margin-top: ${theme.spacing.xs}px;
    opacity: ${({ isActive, isCompleted }: any) =>
        isActive || isCompleted ? 1 : 0.7};
`;
