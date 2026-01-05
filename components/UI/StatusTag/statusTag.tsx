import React from "react";
import { View, Text } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { StatusTagProps } from "./statusTag.types";
import { theme } from "../../../constants/Theme";

const Tag = styled(View)<{ active: boolean; color: string }>`
    flex-direction: row;
    align-items: center;
    padding: ${theme.spacing.xs}px ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.md}px;
    background-color: ${(props: { active: boolean; color: string }) =>
        props.active ? `${props.color}20` : `${theme.colors.border}20`};
    border-width: 1px;
    border-color: ${(props: { active: boolean; color: string }) =>
        props.active ? props.color : theme.colors.border};
`;

const TagText = styled(Text)<{ active: boolean; color: string }>`
    font-size: 13px;
    font-weight: 600;
    color: ${(props: { active: boolean; color: string }) =>
        props.active ? props.color : theme.colors.text.secondary};
    margin-left: 6px;
`;

export const StatusTag: React.FC<StatusTagProps> = ({
    label,
    icon,
    active,
    color = theme.colors.primary,
}) => {
    return (
        <Tag active={active} color={color}>
            <Ionicons
                name={icon as any}
                size={16}
                color={active ? color : theme.colors.text.secondary}
            />
            <TagText active={active} color={color}>
                {label}
            </TagText>
        </Tag>
    );
};
