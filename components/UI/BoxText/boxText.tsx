import React from "react";
import { BoxTextProps } from "./boxText.types";
import {
    StyledBox,
    BoxHeader,
    BoxHeaderLeft,
    BoxTitle,
    BoxContent,
    DismissButton,
    IconContainer,
} from "./boxText.styles";

export const BoxText: React.FC<BoxTextProps> = ({
    children,
    variant = "neutral",
    size = "medium",
    title,
    icon,
    dismissible = false,
    onDismiss,
    borderless = false,
    ...props
}) => {
    const hasHeader = title || icon || dismissible;

    return (
        <StyledBox
            variant={variant}
            size={size}
            borderless={borderless}
            {...props}
        >
            {hasHeader && (
                <BoxHeader>
                    <BoxHeaderLeft>
                        {icon && <IconContainer>{icon}</IconContainer>}
                        {title && (
                            <BoxTitle variant={variant} size={size}>
                                {title}
                            </BoxTitle>
                        )}
                    </BoxHeaderLeft>

                    {dismissible && onDismiss && (
                        <DismissButton onPress={onDismiss}>
                            
                            <BoxContent variant={variant} size={size}>
                                ✕
                            </BoxContent>
                        </DismissButton>
                    )}
                </BoxHeader>
            )}

            {typeof children === "string" ? (
                <BoxContent variant={variant} size={size}>
                    {children}
                </BoxContent>
            ) : (
                children
            )}
        </StyledBox>
    );
};
