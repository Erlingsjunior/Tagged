import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StepIndicator } from "../../components/UI/StepIndicator";
import { TextInputField } from "../../components/UI/TextInputField";
import { CategorySelector } from "../../components/UI/CategorySelector";
import { FilePicker } from "../../components/UI/FilePicker/filePicker";
import { AnonymousToggle } from "../../components/UI/AnonymousToggle";
import { ReportSummary } from "../../components/UI/ReportSummary";
import { NavigationButtons } from "../../components/UI/NavigationButtons";
import { HeaderBar } from "../../components/UI/HeaderBar";
import { useCreateReportStore } from "../../stores/createReportStore";
import { theme } from "../../constants/Theme";
import styled from "styled-components/native";

const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${theme.colors.background};
`;

const ContentArea = styled(ScrollView)`
    flex: 1;
    background-color: ${theme.colors.surface};
`;

const FormSection = styled(View)`
    padding: ${theme.spacing.lg}px;
`;

const steps = [
    { id: 0, label: "Title", required: true },
    { id: 1, label: "Description", required: true },
    { id: 2, label: "Category", required: true },
    { id: 3, label: "Submit", required: false },
];

export const CreateReportView: React.FC = () => {
    const {
        currentStep,
        formData,
        isValid,
        goToStep,
        nextStep,
        previousStep,
        updateField,
        submitReport,
        reset,
    } = useCreateReportStore();

    const [showSuccess, setShowSuccess] = useState(false);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            nextStep();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            previousStep();
        }
    };

    const handleSubmit = async () => {
        try {
            const reportId = await submitReport();
            setShowSuccess(true);
            // Navigate to success screen or show modal
        } catch (error) {
            console.error("Erro ao submeter relatório:", error);
        }
    };

    const handleStepClick = (stepIndex: number) => {
        // Only allow navigation to completed steps or current step
        if (stepIndex <= currentStep) {
            goToStep(stepIndex);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <TextInputField
                        label='Report Title'
                        subtitle="Be specific and clear about the issue you're reporting"
                        placeholder='E.g., School lunch contract irregularities in São Paulo Municipal School'
                        value={formData.title}
                        onChangeText={(text) => updateField("title", text)}
                        maxLength={200}
                        required
                        multiline
                    />
                );

            case 1:
                return (
                    <TextInputField
                        label='Report Description'
                        subtitle='Include dates, locations, people involved, and any evidence you have'
                        placeholder='Provide a detailed description of the issue with all relevant information...'
                        value={formData.description}
                        onChangeText={(text) =>
                            updateField("description", text)
                        }
                        maxLength={5000}
                        required
                        multiline
                        height={160}
                    />
                );

            case 2:
                return (
                    <CategorySelector
                        selectedCategory={formData.category}
                        onSelectCategory={(category) =>
                            updateField("category", category)
                        }
                    />
                );

            case 3:
                return (
                    <View>
                        <ReportSummary
                            title={formData.title}
                            description={formData.description}
                            category={formData.category}
                        />

                        <TextInputField
                            label='Location (Optional)'
                            placeholder='E.g., São Paulo, Municipal Hospital'
                            value={formData.location}
                            onChangeText={(text) =>
                                updateField("location", text)
                            }
                        />

                        <FilePicker
                            files={formData.evidenceFiles}
                            onFilesChange={(files) =>
                                updateField("evidenceFiles", files)
                            }
                        />

                        <AnonymousToggle
                            isAnonymous={formData.isAnonymous}
                            onToggle={(isAnonymous) =>
                                updateField("isAnonymous", isAnonymous)
                            }
                        />
                    </View>
                );

            default:
                return null;
        }
    };

    if (showSuccess) {
        return (
            <Container>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: theme.spacing.lg,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: theme.colors.surface,
                            padding: theme.spacing.xl,
                            borderRadius: theme.borderRadius.lg,
                            alignItems: "center",
                            maxWidth: 400,
                            borderWidth: 2,
                            borderColor: theme.colors.success,
                        }}
                    >
                        <View
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                backgroundColor: theme.colors.success,
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: theme.spacing.lg,
                            }}
                        >
                            <Text style={{ color: "white", fontSize: 40 }}>
                                ✓
                            </Text>
                        </View>

                        <Text
                            style={{
                                fontSize: 28,
                                fontWeight: "700",
                                color: theme.colors.text.primary,
                                marginBottom: theme.spacing.md,
                                textAlign: "center",
                            }}
                        >
                            Report Published!
                        </Text>

                        <Text
                            style={{
                                fontSize: 16,
                                color: theme.colors.text.secondary,
                                textAlign: "center",
                                lineHeight: 24,
                                marginBottom: theme.spacing.lg,
                            }}
                        >
                            Your report has been successfully submitted to the
                            community network. Thank you for your contribution!
                        </Text>

                        <View
                            style={{
                                padding: theme.spacing.md,
                                backgroundColor: "rgba(76, 175, 80, 0.1)",
                                borderRadius: theme.borderRadius.md,
                                borderWidth: 1,
                                borderColor: "rgba(76, 175, 80, 0.3)",
                                marginBottom: theme.spacing.lg,
                                width: "100%",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "600",
                                    marginBottom: 8,
                                }}
                            >
                                Report Status:
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: theme.colors.text.secondary,
                                }}
                            >
                                • Published successfully
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: theme.colors.text.secondary,
                                }}
                            >
                                • Report ID: #
                                {Math.random()
                                    .toString(16)
                                    .substr(2, 8)
                                    .toUpperCase()}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: theme.colors.text.secondary,
                                }}
                            >
                                • Community review in progress
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={{
                                backgroundColor: theme.colors.primary,
                                paddingVertical: theme.spacing.md,
                                paddingHorizontal: theme.spacing.lg,
                                borderRadius: theme.borderRadius.md,
                                width: "100%",
                            }}
                            onPress={() => {
                                reset();
                                setShowSuccess(false);
                                // Navigate back to feed
                            }}
                        >
                            <Text
                                style={{
                                    color: "white",
                                    fontSize: 16,
                                    fontWeight: "600",
                                    textAlign: "center",
                                }}
                            >
                                Return to Home
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Container>
        );
    }

    return (
        <Container>
            <HeaderBar
                title='Create Report'
                showBack
                onBackPress={() => {
                    if (currentStep > 0) {
                        previousStep();
                    } else {
                        // Navigate back to previous screen
                    }
                }}
            />

            <StepIndicator
                steps={steps}
                currentStep={currentStep}
                onStepPress={handleStepClick}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ContentArea
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'
                >
                    <FormSection>{renderStepContent()}</FormSection>
                </ContentArea>

                <NavigationButtons
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    canGoNext={isValid(currentStep)}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onSubmit={handleSubmit}
                />
            </KeyboardAvoidingView>
        </Container>
    );
};
