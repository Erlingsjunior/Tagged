import { FilePickerFile } from "../../components/UI/FilePicker/filePicker.types";

export interface CreateReportFormData {
    title: string;
    description: string;
    location: string;
    category: string;
    evidenceFiles: FilePickerFile[];
    isAnonymous: boolean;
}

export interface CreateReportViewProps {
    // Props que podem vir de navegação ou estado global
    initialData?: Partial<CreateReportFormData>;
    onSubmitSuccess?: (reportId: string) => void;
    onCancel?: () => void;
}

export interface CreateReportState {
    currentStep: number;
    formData: CreateReportFormData;
    isSubmitting: boolean;
    errors: Record<string, string>;
}

export type CreateReportStep = "info" | "evidence" | "category" | "review";

export interface ReportSubmissionResponse {
    reportId: string;
    protocolNumber: string;
    estimatedProcessingTime: string;
    status: "submitted" | "processing" | "under_review";
}
