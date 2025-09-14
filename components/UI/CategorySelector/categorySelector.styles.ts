import styled from "styled-components/native";
import { theme } from "../../../constants/Theme";

interface CategoryItemContainerProps {
    isSelected: boolean;
    layout: "grid" | "list" | "chips";
    disabled: boolean;
    columns?: number;
}

export const Container = styled.View`
    margin-bottom: ${theme.spacing.md}px;
`;

export const Title = styled.Text<{ required: boolean }>`
    font-size: 16px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.sm}px;

    ${({ required }) =>
        required &&
        `
    &:after {
      content: ' *';
      color: ${theme.colors.error};
    }
  `}
`;

export const CategoriesContainer = styled.View<{
    layout: "grid" | "list" | "chips";
    columns: number;
}>`
    ${({ layout, columns }) => {
        switch (layout) {
            case "grid":
                return `
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
        `;
            case "list":
                return `
          flex-direction: column;
        `;
            case "chips":
                return `
          flex-direction: row;
          flex-wrap: wrap;
        `;
            default:
                return `
          flex-direction: row;
          flex-wrap: wrap;
        `;
        }
    }}
`;

export const CategoryItemContainer = styled.TouchableOpacity<CategoryItemContainerProps>`
    ${({ layout, columns, isSelected, disabled }) => {
        let baseStyles = `
      border-radius: ${theme.borderRadius.md}px;
      border-width: 1px;
      border-color: ${isSelected ? theme.colors.primary : theme.colors.border};
      background-color: ${
          isSelected ? theme.colors.primary + "15" : theme.colors.surface
      };
      margin-bottom: ${theme.spacing.sm}px;
      opacity: ${disabled ? 0.5 : 1};
    `;

        switch (layout) {
            case "grid":
                const width =
                    columns === 2 ? "48%" : columns === 3 ? "32%" : "100%";
                return (
                    baseStyles +
                    `
          width: ${width};
          padding: ${theme.spacing.md}px;
          min-height: 80px;
          justify-content: center;
          align-items: center;
        `
                );
            case "list":
                return (
                    baseStyles +
                    `
          width: 100%;
          padding: ${theme.spacing.md}px;
          flex-direction: row;
          align-items: center;
        `
                );
            case "chips":
                return (
                    baseStyles +
                    `
          padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
          margin-right: ${theme.spacing.sm}px;
          border-radius: ${theme.borderRadius.xl}px;
          flex-direction: row;
          align-items: center;
        `
                );
            default:
                return baseStyles;
        }
    }}
`;

export const CategoryIcon = styled.View<{ layout: "grid" | "list" | "chips" }>`
    ${({ layout }) => {
        switch (layout) {
            case "grid":
                return `
          margin-bottom: ${theme.spacing.xs}px;
        `;
            case "list":
                return `
          margin-right: ${theme.spacing.md}px;
        `;
            case "chips":
                return `
          margin-right: ${theme.spacing.xs}px;
        `;
            default:
                return "";
        }
    }}
`;

export const CategoryContent = styled.View<{
    layout: "grid" | "list" | "chips";
}>`
    ${({ layout }) => {
        switch (layout) {
            case "grid":
                return `
          align-items: center;
          text-align: center;
        `;
            case "list":
                return `
          flex: 1;
        `;
            case "chips":
                return `
          flex-direction: row;
          align-items: center;
        `;
            default:
                return "";
        }
    }}
`;

export const CategoryLabel = styled.Text<{
    isSelected: boolean;
    layout: "grid" | "list" | "chips";
}>`
    font-size: ${({ layout }) => (layout === "chips" ? "14px" : "16px")};
    font-weight: ${({ isSelected }) => (isSelected ? "600" : "500")};
    color: ${({ isSelected }) =>
        isSelected ? theme.colors.primary : theme.colors.text.primary};
    text-align: ${({ layout }) => (layout === "grid" ? "center" : "left")};
`;

export const CategoryDescription = styled.Text<{ isSelected: boolean }>`
    font-size: 12px;
    color: ${({ isSelected }) =>
        isSelected ? theme.colors.primary : theme.colors.text.secondary};
    margin-top: ${theme.spacing.xs}px;
    text-align: center;
`;

export const HelperTextContainer = styled.View`
    margin-top: ${theme.spacing.sm}px;
`;

export const HelperText = styled.Text<{ isError: boolean }>`
    font-size: 12px;
    color: ${({ isError }) =>
        isError ? theme.colors.error : theme.colors.text.secondary};
`;

export const SelectionCounter = styled.Text`
    font-size: 12px;
    color: ${theme.colors.text.secondary};
    margin-top: ${theme.spacing.xs}px;
    text-align: right;
`;
