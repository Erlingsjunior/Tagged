import React, { useState } from "react";
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

// Importando todos os componentes criados
import { HeaderBar } from "../../components/UI/HeaderBar/headerBar";
import { Stepper } from "../../components/UI/Stepper/stepper";
import { TextInputField } from "../../components/UI/TextInputField/textInputFiled";
import { CategorySelector } from "../../components/UI/CategorySelector/categorySelector";
import { FilePicker } from "../../components/UI/FilePicker/filePicker";
import { AnonymousToggle } from "../../components/UI/AnonymousToggle/anonymousToggle";
import { BoxText } from "../../components/UI/BoxText/boxText";
import { Button } from "../../components/UI/Button/button";

// Importando constants
import { theme } from "../../constants/Theme";

// Importando tipos e mocks
import { StepperStep } from "../../components/UI/Stepper/stepper.types";
import { Category } from "../../components/UI/CategorySelector/categorySelector.types";
import { FilePickerFile } from "../../components/UI/FilePicker/filePicker.types";

// Styled Components
const Container = styled(SafeAreaView)`
    flex: 1;
    background-color: ${theme.colors.background};
`;

const Content = styled(ScrollView)`
    flex: 1;
    background-color: ${theme.colors.surface};
`;

const StepContainer = styled(View)`
    padding: ${theme.spacing.lg}px;
    min-height: 400px;
`;

const ButtonContainer = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    padding: ${theme.spacing.lg}px;
    background-color: ${theme.colors.surface};
    border-top-width: 1px;
    border-top-color: ${theme.colors.border};
`;

const ButtonWrapper = styled(View)`
    flex: 1;
    margin-horizontal: ${theme.spacing.sm}px;
`;

// Interface para o estado do formulário
interface CreateReportFormData {
    title: string;
    description: string;
    location: string;
    category: string;
    evidenceFiles: FilePickerFile[];
    isAnonymous: boolean;
}

// Dados mockados das categorias
const reportCategories: Category[] = [
    {
        id: "corruption",
        label: "Corrupção",
        description: "Corrupção pública ou privada",
        color: theme.colors.error,
    },
    {
        id: "environmental",
        label: "Ambiental",
        description: "Crimes ambientais",
        color: theme.colors.success,
    },
    {
        id: "human-rights",
        label: "Direitos Humanos",
        description: "Violação de direitos",
        color: theme.colors.secondary,
    },
    {
        id: "workplace",
        label: "Trabalho",
        description: "Assédio, condições inadequadas",
        color: theme.colors.warning,
    },
    {
        id: "health",
        label: "Saúde Pública",
        description: "Problemas no sistema de saúde",
        color: theme.colors.primary,
    },
    {
        id: "other",
        label: "Outros",
        description: "Outras categorias",
        color: theme.colors.text.secondary,
    },
];

// Steps do formulário
const formSteps: StepperStep[] = [
    { id: 0, label: "Informações", description: "Título e descrição" },
    { id: 1, label: "Evidências", description: "Anexar arquivos" },
    { id: 2, label: "Categoria", description: "Tipo da denúncia" },
    { id: 3, label: "Revisar", description: "Confirmar dados" },
];

export const CreateReportView: React.FC = () => {
    // Estados do componente
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<CreateReportFormData>({
        title: "",
        description: "",
        location: "",
        category: "",
        evidenceFiles: [],
        isAnonymous: false,
    });

    // Função para atualizar campos do formulário
    const updateField = (field: keyof CreateReportFormData, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Validação de cada step
    const validateCurrentStep = (): boolean => {
        switch (currentStep) {
            case 0: // Informações
                return (
                    formData.title.length >= 5 &&
                    formData.description.length >= 20
                );
            case 1: // Evidências (opcional)
                return true;
            case 2: // Categoria
                return formData.category !== "";
            case 3: // Revisar
                return true;
            default:
                return false;
        }
    };

    // Navegação entre steps
    const nextStep = () => {
        if (validateCurrentStep() && currentStep < formSteps.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const previousStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const goToStep = (step: number) => {
        if (step >= 0 && step < formSteps.length) {
            setCurrentStep(step);
        }
    };

    // Submissão do formulário
    const submitReport = async () => {
        try {
            // Aqui você faria a chamada para a API
            console.log("Submetendo denúncia:", formData);

            Alert.alert(
                "Sucesso!",
                "Sua denúncia foi enviada com sucesso. Você receberá atualizações sobre o andamento.",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            /* Navegar para tela de sucesso */
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert(
                "Erro",
                "Ocorreu um erro ao enviar sua denúncia. Tente novamente."
            );
        }
    };

    // Renderização de cada step
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <View>
                        <BoxText
                            variant='info'
                            title='Informações da Denúncia'
                            size='medium'
                        >
                            Forneça detalhes claros e específicos sobre o
                            ocorrido. Quanto mais informações, melhor poderemos
                            ajudar.
                        </BoxText>

                        <TextInputField
                            label='Título da Denúncia'
                            placeholder='Digite um título claro e objetivo...'
                            value={formData.title}
                            onChangeText={(text) => updateField("title", text)}
                            maxLength={100}
                            showCharacterCount
                            required
                            helperText='Seja específico no título para facilitar a categorização'
                        />

                        <TextInputField
                            label='Descrição Detalhada'
                            placeholder='Descreva o que aconteceu com o máximo de detalhes...'
                            value={formData.description}
                            onChangeText={(text) =>
                                updateField("description", text)
                            }
                            multiline
                            numberOfLines={6}
                            maxLength={1000}
                            showCharacterCount
                            required
                            helperText='Inclua datas, locais, pessoas envolvidas e qualquer informação relevante'
                        />

                        <TextInputField
                            label='Local do Ocorrido'
                            placeholder='Endereço, bairro, cidade, estado...'
                            value={formData.location}
                            onChangeText={(text) =>
                                updateField("location", text)
                            }
                            maxLength={200}
                            helperText='Informe onde o fato aconteceu (opcional)'
                        />
                    </View>
                );

            case 1:
                return (
                    <View>
                        <BoxText
                            variant='warning'
                            title='Evidências'
                            size='medium'
                        >
                            Anexe fotos, vídeos, documentos ou áudios que
                            comprovem sua denúncia. Todos os arquivos são
                            criptografados.
                        </BoxText>

                        <FilePicker
                            maxFiles={5}
                            allowedTypes={["image", "video", "document"]}
                            maxFileSize={10}
                            onFilesChange={(files) =>
                                updateField("evidenceFiles", files)
                            }
                            initialFiles={formData.evidenceFiles}
                            placeholder='Toque para adicionar evidências'
                        />

                        <BoxText variant='neutral' size='small' borderless>
                            💡 Dica: Arquivos de alta qualidade ajudam na
                            análise. Formatos aceitos: JPG, PNG, PDF, MP4, DOC.
                        </BoxText>
                    </View>
                );

            case 2:
                return (
                    <View>
                        <BoxText
                            variant='info'
                            title='Categoria da Denúncia'
                            size='medium'
                        >
                            Selecione a categoria que melhor descreve sua
                            denúncia para direcionamento adequado.
                        </BoxText>

                        <CategorySelector
                            categories={reportCategories}
                            selectedCategories={
                                formData.category ? [formData.category] : []
                            }
                            onCategorySelect={(categoryId) =>
                                updateField("category", categoryId)
                            }
                            onCategoryDeselect={() =>
                                updateField("category", "")
                            }
                            multiSelect={false}
                            layout='grid'
                            columns={2}
                            showIcons={false}
                            showDescriptions={true}
                            title='Tipo de Denúncia'
                            required
                        />

                        <AnonymousToggle
                            value={formData.isAnonymous}
                            onValueChange={(value) =>
                                updateField("isAnonymous", value)
                            }
                            title='Denúncia Anônima'
                            description='Sua identidade será protegida durante todo o processo'
                            helperText={
                                formData.isAnonymous
                                    ? "Modo anônimo: apenas a equipe Tagged terá acesso aos seus dados"
                                    : "Modo identificado: você acompanhará diretamente o processo"
                            }
                            variant='card'
                        />
                    </View>
                );

            case 3:
                return (
                    <View>
                        <BoxText
                            variant='success'
                            title='Revisar Denúncia'
                            size='medium'
                        >
                            Revise todas as informações antes de enviar. Após o
                            envio, você receberá um número de protocolo.
                        </BoxText>

                        <TextInputField
                            label='Título'
                            value={formData.title}
                            onChangeText={() => {}}
                            disabled
                        />

                        <TextInputField
                            label='Descrição'
                            value={formData.description}
                            onChangeText={() => {}}
                            multiline
                            numberOfLines={3}
                            disabled
                        />

                        {formData.location && (
                            <TextInputField
                                label='Local'
                                value={formData.location}
                                onChangeText={() => {}}
                                disabled
                            />
                        )}

                        <BoxText variant='neutral' size='small'>
                            📁 {formData.evidenceFiles.length} arquivo(s)
                            anexado(s)
                        </BoxText>

                        <BoxText variant='neutral' size='small'>
                            🏷️ Categoria:{" "}
                            {
                                reportCategories.find(
                                    (c) => c.id === formData.category
                                )?.label
                            }
                        </BoxText>

                        <BoxText
                            variant={formData.isAnonymous ? "warning" : "info"}
                            size='small'
                        >
                            {formData.isAnonymous
                                ? "🕶️ Denúncia Anônima"
                                : "👤 Denúncia Identificada"}
                        </BoxText>
                    </View>
                );

            default:
                return null;
        }
    };

    const getHeaderSubtitle = () => {
        return `Passo ${currentStep + 1} de ${formSteps.length}`;
    };

    const getProgressPercentage = () => {
        return ((currentStep + 1) / formSteps.length) * 100;
    };

    return (
        <Container>
            <HeaderBar
                title='Nova Denúncia'
                subtitle={getHeaderSubtitle()}
                showBackButton={currentStep > 0}
                showCloseButton
                onBackPress={previousStep}
                onClosePress={() => {
                    Alert.alert(
                        "Cancelar Denúncia",
                        "Tem certeza que deseja cancelar? Todos os dados serão perdidos.",
                        [
                            { text: "Continuar Editando", style: "cancel" },
                            {
                                text: "Cancelar Denúncia",
                                style: "destructive",
                                onPress: () => {
                                    /* Navegar de volta */
                                },
                            },
                        ]
                    );
                }}
                variant='default'
                showProgress
                progress={getProgressPercentage()}
                maxProgress={100}
            />

            <Stepper
                steps={formSteps}
                currentStep={currentStep}
                onStepPress={goToStep}
                orientation='horizontal'
                showLabels={true}
                showDescriptions={false}
                allowClickableSteps={true}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <Content showsVerticalScrollIndicator={false}>
                    <StepContainer>{renderStepContent()}</StepContainer>
                </Content>

                <ButtonContainer>
                    {currentStep > 0 && (
                        <ButtonWrapper>
                            <Button
                                title='Voltar'
                                variant='outlined'
                                onPress={previousStep}
                                fullWidth
                            />
                        </ButtonWrapper>
                    )}

                    <ButtonWrapper>
                        <Button
                            title={
                                currentStep === formSteps.length - 1
                                    ? "Enviar Denúncia"
                                    : "Próximo"
                            }
                            variant='primary'
                            onPress={
                                currentStep === formSteps.length - 1
                                    ? submitReport
                                    : nextStep
                            }
                            disabled={!validateCurrentStep()}
                            fullWidth
                        />
                    </ButtonWrapper>
                </ButtonContainer>
            </KeyboardAvoidingView>
        </Container>
    );
};
