import React from "react";
import { CategoryBadgeProps } from "./categoryBadge.types";
import { Badge, BadgeText } from "./categoryBadge.styles";
import { getCategoryColor, getCategoryLabel } from "../../../utils/formatters";

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
    category,
    size = "medium",
    style
}) => {
    return (
        <Badge category={getCategoryColor(category)} size={size} style={style}>
            <BadgeText size={size}>{getCategoryLabel(category)}</BadgeText>
        </Badge>
    );
};
