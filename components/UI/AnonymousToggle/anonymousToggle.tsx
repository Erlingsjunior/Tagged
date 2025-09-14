import React from "react";
import { AnonymousToggleProps } from "./anonymousToggle.types";
import {
    Container,
    ContentContainer,
    TitleContainer,
    IconContainer,
    Title,
    Description,
    HelperText,
    ToggleContainer,
    ToggleCircle,
    StatusBadge,
    StatusText,
} from "./anonymousToggle.styles";

export const AnonymousToggle: React.FC<AnonymousToggleProps> = ({
    value,
    onValueChange,
    title = "Denúncia Anônima",
    description = "Sua identidade será mantida em sigilo durante todo o processo",
    helperText,
    disabled = false,
    showIcon = true,
    layout = "horizontal",
    variant = "default",
}) => {
    const handleToggle = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };

    const getStatusText = () => {
        return value ? "Anônimo" : "Identificado";
    };

    const getIcon = () => {
        if (!showIcon) return null;

        // Aqui você pode usar ícones de bibliotecas como react-native-vector-icons
        // Por enquanto, vou usar emojis simples
        return value ? "🕶️" : "👤";
    };

    return (
        <Container
            variant={variant}
            layout={layout}
            disabled={disabled}
            onPress={handleToggle}
            activeOpacity={disabled ? 1 : 0.7}
        >
            <ContentContainer layout={layout}>
                <TitleContainer>
                    {showIcon && (
                        <IconContainer>
                            <Title isActive={value}>{getIcon()}</Title>
                        </IconContainer>
                    )}

                    <Title isActive={value}>{title}</Title>
                </TitleContainer>

                {description && (
                    <Description isActive={value}>{description}</Description>
                )}

                {helperText && <HelperText>{helperText}</HelperText>}

                <StatusBadge isActive={value}>
                    <StatusText isActive={value}>{getStatusText()}</StatusText>
                </StatusBadge>
            </ContentContainer>

            <ToggleContainer isActive={value} disabled={disabled}>
                <ToggleCircle isActive={value} disabled={disabled} />
            </ToggleContainer>
        </Container>
    );
};
