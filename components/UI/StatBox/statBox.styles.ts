import styled from "styled-components/native";
import { View, Text } from "react-native";
import { theme } from "../../../constants/Theme";

export const Container = styled(View)`
    align-items: center;
`;

export const Number = styled(Text)<{ size: string }>`
    font-size: ${(props: { size: string }) => {
        switch (props.size) {
            case "small":
                return "18px";
            case "large":
                return "28px";
            default:
                return "24px";
        }
    }};
    font-weight: bold;
    color: ${theme.colors.primary};
`;

export const Label = styled(Text)<{ size: string }>`
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
    color: ${theme.colors.text.secondary};
    margin-top: 4px;
`;
