import React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { ProgressBarProps } from "./progressBar.types";
import { theme } from "../../../constants/Theme";

const Container = styled(View)<{ height: number; backgroundColor: string }>`
    height: ${(props: { height: number; backgroundColor: string }) => props.height}px;
    background-color: ${(props: { height: number; backgroundColor: string }) => props.backgroundColor};
    border-radius: ${(props: { height: number; backgroundColor: string }) => props.height / 2}px;
    overflow: hidden;
`;

const Fill = styled(View)<{ width: number; color: string }>`
    height: 100%;
    width: ${(props: { width: number; color: string }) => props.width}%;
    background-color: ${(props: { width: number; color: string }) => props.color};
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({
    percentage,
    color = theme.colors.primary,
    backgroundColor = theme.colors.border,
    height = 12,
}) => {
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

    return (
        <Container height={height} backgroundColor={backgroundColor}>
            <Fill width={clampedPercentage} color={color} />
        </Container>
    );
};
