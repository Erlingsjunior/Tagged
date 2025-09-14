import React from "react";
import { ButtonProps } from "./button.types";
import {
    StyledButton,
    ButtonText,
    IconContainer,
    LoadingIndicator,
} from "./button.styles";
import { theme } from "../../../constants/Theme";

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = "primary",
    size = "medium",
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    onPress,
    ...props
}) => {
    const isDisabled = disabled || loading;

    return (
        <StyledButton
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            disabled={isDisabled}
            onPress={isDisabled ? undefined : onPress}
            activeOpacity={isDisabled ? 1 : 0.7}
            {...props}
        >
            {loading && (
                <LoadingIndicator
                    color={
                        variant === "outlined" || variant === "ghost"
                            ? theme.colors.primary
                            : theme.colors.text.light
                    }
                    size='small'
                />
            )}

            {leftIcon && !loading && (
                <IconContainer position='left'>{leftIcon}</IconContainer>
            )}

            <ButtonText
                variant={variant}
                size={size}
                fullWidth={fullWidth}
                disabled={isDisabled}
            >
                {title}
            </ButtonText>

            {rightIcon && !loading && (
                <IconContainer position='right'>{rightIcon}</IconContainer>
            )}
        </StyledButton>
    );
};
