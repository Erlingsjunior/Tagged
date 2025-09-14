import React from "react";
import {
    CategorySelectorProps,
    CategoryItemProps,
} from "./categorySelector.types";
import {
    Container,
    Title,
    CategoriesContainer,
    CategoryItemContainer,
    CategoryIcon,
    CategoryContent,
    CategoryLabel,
    CategoryDescription,
    HelperTextContainer,
    HelperText,
    SelectionCounter,
} from "./categorySelector.styles";

const CategoryItem: React.FC<CategoryItemProps> = ({
    category,
    isSelected,
    onPress,
    layout,
    showIcons,
    showDescriptions,
    disabled,
}) => {
    return (
        <CategoryItemContainer
            isSelected={isSelected}
            layout={layout}
            disabled={disabled || category.disabled}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {showIcons && category.icon && (
                <CategoryIcon layout={layout}>{category.icon}</CategoryIcon>
            )}

            <CategoryContent layout={layout}>
                <CategoryLabel isSelected={isSelected} layout={layout}>
                    {category.label}
                </CategoryLabel>

                {showDescriptions &&
                    category.description &&
                    layout !== "chips" && (
                        <CategoryDescription isSelected={isSelected}>
                            {category.description}
                        </CategoryDescription>
                    )}
            </CategoryContent>
        </CategoryItemContainer>
    );
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
    categories,
    selectedCategories,
    onCategorySelect,
    onCategoryDeselect,
    multiSelect = false,
    maxSelections,
    layout = "chips",
    columns = 2,
    showIcons = true,
    showDescriptions = false,
    title,
    helperText,
    errorMessage,
    required = false,
    disabled = false,
}) => {
    const handleCategoryPress = (categoryId: string | number) => {
        if (disabled) return;

        const isSelected = selectedCategories.includes(categoryId);

        if (isSelected) {
            onCategoryDeselect(categoryId);
        } else {
            if (multiSelect) {
                if (
                    maxSelections &&
                    selectedCategories.length >= maxSelections
                ) {
                    return; // Não permite selecionar mais categorias
                }
                onCategorySelect(categoryId);
            } else {
                // Single select: deseleciona outros e seleciona o atual
                selectedCategories.forEach((id) => {
                    if (id !== categoryId) {
                        onCategoryDeselect(id);
                    }
                });
                onCategorySelect(categoryId);
            }
        }
    };

    const displayHelperText = errorMessage || helperText;
    const hasError = !!errorMessage;

    return (
        <Container>
            {title && <Title required={required}>{title}</Title>}

            <CategoriesContainer layout={layout} columns={columns}>
                {categories.map((category) => (
                    <CategoryItem
                        key={category.id}
                        category={category}
                        isSelected={selectedCategories.includes(category.id)}
                        onPress={() => handleCategoryPress(category.id)}
                        layout={layout}
                        showIcons={showIcons}
                        showDescriptions={showDescriptions}
                        disabled={disabled}
                    />
                ))}
            </CategoriesContainer>

            {(displayHelperText || (multiSelect && maxSelections)) && (
                <HelperTextContainer>
                    {displayHelperText && (
                        <HelperText isError={hasError}>
                            {displayHelperText}
                        </HelperText>
                    )}

                    {multiSelect && maxSelections && (
                        <SelectionCounter>
                            {selectedCategories.length}/{maxSelections}{" "}
                            selecionadas
                        </SelectionCounter>
                    )}
                </HelperTextContainer>
            )}
        </Container>
    );
};
