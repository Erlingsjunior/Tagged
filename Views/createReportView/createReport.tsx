// Views/CreateReportView/index.tsx

export { CreateReportView } from "./createReportView";

// Re-exportando tipos se necessário para uso externo
export type { CreateReportFormData } from "./createReportView.types";

// Se quiser exportar também os componentes individuais (opcional)
export { Button } from "../../components/UI/Button/button";
export { BoxText } from "../../components/UI/BoxText/boxText";
export { Stepper } from "../../components/UI/Stepper/stepper";
export { TextInputField } from "../../components/UI/TextInputField/textInputFiled";
export { CategorySelector } from "../../components/UI/CategorySelector/categorySelector";
export { FilePicker } from "../../components/UI/FilePicker/filePicker";
export { AnonymousToggle } from "../../components/UI/AnonymousToggle/anonymousToggle";
export { HeaderBar } from "../../components/UI/HeaderBar/headerBar";
