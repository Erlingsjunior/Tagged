import React from "react";
import { View, Text, Image } from "react-native";
import styled from "styled-components/native";
import { theme } from "../../../constants/Theme";

interface AvatarProps {
    name: string;
    avatar?: string;
    size?: "small" | "medium" | "large";
}

const sizeMap = {
    small: 32,
    medium: 40,
    large: 50,
};

const fontSizeMap = {
    small: 14,
    medium: 16,
    large: 20,
};

const AvatarContainer = styled(View)<{ size: number }>`
    width: ${(props: { size: any; }) => props.size}px;
    height: ${(props: { size: any; }) => props.size}px;
    border-radius: ${(props: { size: number; }) => props.size / 2}px;
    background-color: ${theme.colors.primary};
    align-items: center;
    justify-content: center;
    overflow: hidden;
`;

const AvatarImage = styled(Image)`
    width: 100%;
    height: 100%;
`;

const AvatarText = styled(Text)<{ fontSize: number }>`
    color: ${theme.colors.surface};
    font-weight: bold;
    font-size: ${(props: { fontSize: any; }) => props.fontSize}px;
`;

export const Avatar: React.FC<AvatarProps> = ({ name, avatar, size = "medium" }) => {
    const avatarSize = sizeMap[size];
    const fontSize = fontSizeMap[size];

    return (
        <AvatarContainer size={avatarSize}>
            {avatar ? (
                <AvatarImage source={{ uri: avatar }} />
            ) : (
                <AvatarText fontSize={fontSize}>{name.charAt(0).toUpperCase()}</AvatarText>
            )}
        </AvatarContainer>
    );
};
