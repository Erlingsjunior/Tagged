export interface Category {
    id: string | number;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    color?: string;
    disabled?: boolean;
}

export interface CategorySelectorProps {
    categories: Category[];
    selectedCategories: (string | number)[];
    onCategorySelect: (categoryId: string | number) => void;
    onCategoryDeselect: (categoryId: string | number) => void;
    multiSelect?: boolean;
    maxSelections?: number;
    layout?: "grid" | "list" | "chips";
    columns?: number;
    showIcons?: boolean;
    showDescriptions?: boolean;
    title?: string;
    helperText?: string;
    errorMessage?: string;
    required?: boolean;
    disabled?: boolean;
}

export interface CategoryItemProps {
    category: Category;
    isSelected: boolean;
    onPress: () => void;
    layout: "grid" | "list" | "chips";
    showIcons: boolean;
    showDescriptions: boolean;
    disabled: boolean;
}
