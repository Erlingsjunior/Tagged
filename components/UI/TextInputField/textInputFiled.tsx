import React, { useState } from "react";
import { TextInputFieldProps } from "./textInputField.types";
import {
    Container,
    Label,
    InputContainer,
    StyledTextInput,
    IconContainer,
    HelperTextContainer,
    HelperText,
    CharacterCount,
} from "./textInputFiled.styles";

export const TextInputField: React.FC<TextInputFieldProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    variant = "default",
    size = "medium",
    multiline = false,
    numberOfLines = 1,
    maxLength,
    showCharacterCount = false,
    errorMessage,
    helperText,
    disabled = false,
    required = false,
    leftIcon,
    rightIcon,
    onLeftIconPress,
    onRightIconPress,
    autoFocus = false,
    secureTextEntry = false,
    keyboardType = "default",
    returnKeyType = "done",
    onSubmitEditing,
    onFocus,
    onBlur,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const hasError = !!errorMessage;
    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon;
    const isOverLimit = maxLength ? value.length > maxLength : false;

    const displayHelperText = errorMessage || helperText;
    const displayCharacterCount = showCharacterCount || maxLength;

    const handleFocus = () => {
        setIsFocused(true);
        onFocus?.();
    };

    const handleBlur = () => {
        setIsFocused(false);
        onBlur?.();
    };

    const handleChangeText = (text: string) => {
        if (maxLength && text.length > maxLength) {
            return; // Não permite digitar além do limite
        }
        onChangeText(text);
    };

    return (
        <Container>
            {label && <Label required={required}>{label}</Label>}

            <InputContainer
                variant={variant}
                size={size}
                hasError={hasError}
                isFocused={isFocused}
                disabled={disabled}
            >
                {hasLeftIcon && (
                    <IconContainer
                        position='left'
                        size={size}
                        onPress={onLeftIconPress}
                        disabled={!onLeftIconPress}
                    >
                        {leftIcon}
                    </IconContainer>
                )}

                <StyledTextInput
                    value={value}
                    onChangeText={handleChangeText}
                    placeholder={placeholder}
                    variant={variant}
                    size={size}
                    hasLeftIcon={hasLeftIcon}
                    hasRightIcon={hasRightIcon}
                    multiline={multiline}
                    numberOfLines={multiline ? numberOfLines : 1}
                    editable={!disabled}
                    autoFocus={autoFocus}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholderTextColor='#999'
                    {...props}
                />

                {hasRightIcon && (
                    <IconContainer
                        position='right'
                        size={size}
                        onPress={onRightIconPress}
                        disabled={!onRightIconPress}
                    >
                        {rightIcon}
                    </IconContainer>
                )}
            </InputContainer>

            {(displayHelperText || displayCharacterCount) && (
                <HelperTextContainer>
                    {displayHelperText && (
                        <HelperText isError={hasError}>
                            {errorMessage || helperText}
                        </HelperText>
                    )}

                    {displayCharacterCount && (
                        <CharacterCount isOverLimit={isOverLimit}>
                            {value.length}
                            {maxLength ? `/${maxLength}` : ""}
                        </CharacterCount>
                    )}
                </HelperTextContainer>
            )}
        </Container>
    );
};
