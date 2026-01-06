import styled from "styled-components/native";
import { View, Text } from "react-native";
import { theme } from "../../../constants/Theme";

export const Badge = styled(View)<{ category: string; size: string }>`
    background-color: ${(props: { category: string; size: string }) => props.category};
    padding: ${(props: { category: string; size: string }) => {
        switch (props.size) {
            case "small":
                return `${theme.spacing.xs}px ${theme.spacing.sm}px`;
            case "large":
                return `${theme.spacing.sm}px ${theme.spacing.lg}px`;
            default:
                return `${theme.spacing.xs}px ${theme.spacing.md}px`;
        }
    }};
    border-radius: ${theme.borderRadius.md}px;
`;

export const BadgeText = styled(Text)<{ size: string }>`
    color: ${theme.colors.surface};
    font-size: ${(props: { size: string }) => {
        switch (props.size) {
            case "small":
                return "10px";
            case "large":
                return "14px";
            default:
                return "12px";
        }
    }};
    font-weight: bold;
    text-transform: uppercase;
`;
