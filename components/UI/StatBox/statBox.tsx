import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StatBoxProps } from "./statBox.types";
import { Container, Number, Label } from "./statBox.styles";
import { theme } from "../../../constants/Theme";
import { formatNumber } from "../../../utils/formatters";

export const StatBox: React.FC<StatBoxProps> = ({
    value,
    label,
    icon,
    size = "medium"
}) => {
    const displayValue = typeof value === "number" ? formatNumber(value) : value;

    return (
        <Container>
            {icon && (
                <Ionicons
                    name={icon as any}
                    size={size === "small" ? 20 : size === "large" ? 28 : 24}
                    color={theme.colors.primary}
                    style={{ marginBottom: 4 }}
                />
            )}
            <Number size={size}>{displayValue}</Number>
            <Label size={size}>{label}</Label>
        </Container>
    );
};
