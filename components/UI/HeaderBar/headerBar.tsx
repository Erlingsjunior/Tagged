import React from "react";
import { HeaderBarProps, HeaderBarActionProps } from "./headerBar.types";
import {
    HeaderContainer,
    LeftSection,
    CenterSection,
    RightSection,
    ActionButton,
    ActionButtonWithBackground,
    TitleContainer,
    Title,
    Subtitle,
    ActionText,
    ProgressContainer,
    ProgressBar,
    IconContainer,
} from "./headerBar.styles";

const HeaderAction: React.FC<
    HeaderBarActionProps & { hasBackground?: boolean }
> = ({ icon, text, onPress, disabled = false, hasBackground = false }) => {
    const ButtonComponent = hasBackground
        ? ActionButtonWithBackground
        : ActionButton;

    return (
        <ButtonComponent
            onPress={onPress}
            disabled={disabled || !onPress}
            activeOpacity={0.7}
        >
            {icon && <IconContainer>{icon}</IconContainer>}
            {text && (
                <ActionText isBackground={hasBackground} disabled={disabled}>
                    {text}
                </ActionText>
            )}
        </ButtonComponent>
    );
};

export const HeaderBar: React.FC<HeaderBarProps> = ({
    title,
    subtitle,
    showBackButton = false,
    showCloseButton = false,
    showSaveButton = false,
    onBackPress,
    onClosePress,
    onSavePress,
    leftIcon,
    rightIcon,
    onLeftIconPress,
    onRightIconPress,
    variant = "default",
    height = 60,
    backgroundColor,
    textColor,
    showProgress = false,
    progress = 0,
    maxProgress = 100,
}) => {
    const renderLeftSection = () => {
        if (showBackButton) {
            return (
                <HeaderAction
                    icon={<Title textColor={textColor}>←</Title>}
                    onPress={onBackPress}
                />
            );
        }

        if (leftIcon) {
            return <HeaderAction icon={leftIcon} onPress={onLeftIconPress} />;
        }

        return <ActionButton disabled={true} />;
    };

    const renderRightSection = () => {
        const actions = [];

        if (showSaveButton) {
            actions.push(
                <HeaderAction
                    key='save'
                    text='Salvar'
                    onPress={onSavePress}
                    hasBackground={true}
                />
            );
        }

        if (showCloseButton) {
            actions.push(
                <HeaderAction
                    key='close'
                    icon={<Title textColor={textColor}>✕</Title>}
                    onPress={onClosePress}
                />
            );
        }

        if (rightIcon) {
            actions.push(
                <HeaderAction
                    key='right'
                    icon={rightIcon}
                    onPress={onRightIconPress}
                />
            );
        }

        if (actions.length === 0) {
            actions.push(<ActionButton key='empty' disabled={true} />);
        }

        return actions;
    };

    return (
        <HeaderContainer
            variant={variant}
            height={height}
            backgroundColor={backgroundColor}
        >
            <LeftSection>{renderLeftSection()}</LeftSection>

            <CenterSection>
                <TitleContainer>
                    <Title textColor={textColor}>{title}</Title>
                    {subtitle && (
                        <Subtitle textColor={textColor}>{subtitle}</Subtitle>
                    )}
                </TitleContainer>
            </CenterSection>

            <RightSection>{renderRightSection()}</RightSection>

            {showProgress && (
                <ProgressContainer>
                    <ProgressBar
                        progress={progress}
                        maxProgress={maxProgress}
                    />
                </ProgressContainer>
            )}
        </HeaderContainer>
    );
};
