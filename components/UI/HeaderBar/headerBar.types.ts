export interface HeaderBarProps {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    showCloseButton?: boolean;
    showSaveButton?: boolean;
    onBackPress?: () => void;
    onClosePress?: () => void;
    onSavePress?: () => void;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onLeftIconPress?: () => void;
    onRightIconPress?: () => void;
    variant?: "default" | "transparent" | "bordered";
    height?: number;
    backgroundColor?: string;
    textColor?: string;
    showProgress?: boolean;
    progress?: number;
    maxProgress?: number;
}

export interface HeaderBarActionProps {
    icon?: React.ReactNode;
    text?: string;
    onPress?: () => void;
    disabled?: boolean;
}
