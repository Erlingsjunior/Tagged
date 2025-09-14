import React from "react";
import { StepperProps, StepperItemProps } from "./stepper.types";
import {
    StepperContainer,
    StepContainer,
    StepCircleContainer,
    StepCircle,
    StepNumber,
    StepLine,
    StepContent,
    StepLabel,
    StepDescription,
} from "./stepper.styles";
import { theme } from "../../../constants/Theme";

const StepperItem: React.FC<StepperItemProps> = ({
    step,
    index,
    isActive,
    isCompleted,
    isLast,
    onPress,
    orientation,
    showLabels,
    showDescriptions,
    activeColor,
    inactiveColor,
    completedColor,
    lineColor,
    allowClickable,
}) => {
    const handlePress = () => {
        if (allowClickable && onPress && !step.disabled) {
            onPress();
        }
    };

    return (
        <StepContainer orientation={orientation}>
            <StepCircleContainer orientation={orientation}>
                <StepCircle
                    isActive={isActive}
                    isCompleted={isCompleted}
                    activeColor={activeColor}
                    inactiveColor={inactiveColor}
                    completedColor={completedColor}
                    allowClickable={allowClickable && !step.disabled}
                    onPress={handlePress}
                    activeOpacity={allowClickable && !step.disabled ? 0.7 : 1}
                >
                    {step.icon ? (
                        step.icon
                    ) : isCompleted ? (
                        <StepNumber
                            isActive={isActive}
                            isCompleted={isCompleted}
                            activeColor={activeColor}
                            inactiveColor={inactiveColor}
                            completedColor={completedColor}
                            allowClickable={allowClickable}
                        >
                            ✓
                        </StepNumber>
                    ) : (
                        <StepNumber
                            isActive={isActive}
                            isCompleted={isCompleted}
                            activeColor={activeColor}
                            inactiveColor={inactiveColor}
                            completedColor={completedColor}
                            allowClickable={allowClickable}
                        >
                            {index + 1}
                        </StepNumber>
                    )}
                </StepCircle>

                {!isLast && (
                    <StepLine orientation={orientation} lineColor={lineColor} />
                )}
            </StepCircleContainer>

            {(showLabels || showDescriptions) && (
                <StepContent orientation={orientation}>
                    {showLabels && (
                        <StepLabel
                            isActive={isActive}
                            isCompleted={isCompleted}
                        >
                            {step.label}
                        </StepLabel>
                    )}

                    {showDescriptions && step.description && (
                        <StepDescription
                            isActive={isActive}
                            isCompleted={isCompleted}
                        >
                            {step.description}
                        </StepDescription>
                    )}
                </StepContent>
            )}
        </StepContainer>
    );
};

export const Stepper: React.FC<StepperProps> = ({
    steps,
    currentStep,
    onStepPress,
    orientation = "horizontal",
    showLabels = true,
    showDescriptions = false,
    activeColor = theme.colors.primary,
    inactiveColor = theme.colors.border,
    completedColor = theme.colors.success,
    lineColor = theme.colors.border,
    allowClickableSteps = false,
}) => {
    return (
        <StepperContainer orientation={orientation}>
            {steps.map((step, index) => (
                <StepperItem
                    key={step.id}
                    step={step}
                    index={index}
                    isActive={currentStep === index}
                    isCompleted={currentStep > index || step.completed === true}
                    isLast={index === steps.length - 1}
                    onPress={() => onStepPress?.(index)}
                    orientation={orientation}
                    showLabels={showLabels}
                    showDescriptions={showDescriptions}
                    activeColor={activeColor}
                    inactiveColor={inactiveColor}
                    completedColor={completedColor}
                    lineColor={lineColor}
                    allowClickable={allowClickableSteps}
                />
            ))}
        </StepperContainer>
    );
};
