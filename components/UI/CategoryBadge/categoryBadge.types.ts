import { PostCategory } from "../../../types";
import { ViewStyle } from "react-native";

export interface CategoryBadgeProps {
    category: PostCategory | string;
    size?: "small" | "medium" | "large";
    style?: ViewStyle;
}
