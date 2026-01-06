import React, { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Modal,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { theme } from "../../../constants/Theme";

interface SearchBarProps {
    onSearch: (query: string, filters: SearchFilters) => void;
    placeholder?: string;
}

export interface SearchFilters {
    sortBy: "relevance" | "recent" | "popular" | "nearby";
    location: "all" | "neighborhood" | "city" | "state";
    tags: string[];
}

const Container = styled(View)`
    background-color: ${theme.colors.surface};
    padding: ${theme.spacing.md}px;
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.border};
`;

const SearchContainer = styled(View)`
    flex-direction: row;
    align-items: center;
    background-color: ${theme.colors.background};
    border-radius: ${theme.borderRadius.lg}px;
    padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
`;

const SearchInput = styled(TextInput)`
    flex: 1;
    font-size: 14px;
    color: ${theme.colors.text.primary};
    margin-left: ${theme.spacing.sm}px;
    padding: 0;
`;

const FilterButton = styled(TouchableOpacity)`
    flex-direction: row;
    align-items: center;
    padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
    background-color: ${theme.colors.background};
    border-radius: ${theme.borderRadius.md}px;
    margin-left: ${theme.spacing.xs}px;
`;

const FilterBadge = styled(View)`
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: ${theme.colors.primary};
    position: absolute;
    top: 4px;
    right: 4px;
`;

const FiltersRow = styled(View)`
    flex-direction: row;
    margin-top: ${theme.spacing.sm}px;
    gap: ${theme.spacing.xs}px;
`;

const FilterChip = styled(TouchableOpacity)<{ active: boolean }>`
    padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
    background-color: ${(props: { active: boolean }) =>
        props.active ? theme.colors.primary : theme.colors.background};
    border-radius: ${theme.borderRadius.full}px;
    flex-direction: row;
    align-items: center;
`;

const FilterChipText = styled(Text)<{ active: boolean }>`
    font-size: 12px;
    font-weight: 600;
    color: ${(props: { active: boolean }) =>
        props.active ? theme.colors.surface : theme.colors.text.secondary};
    margin-left: 4px;
`;

const ModalOverlay = styled(View)`
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: flex-end;
`;

const ModalContent = styled(View)`
    background-color: ${theme.colors.surface};
    border-top-left-radius: ${theme.borderRadius.xl}px;
    border-top-right-radius: ${theme.borderRadius.xl}px;
    padding: ${theme.spacing.lg}px;
    max-height: 70%;
`;

const ModalHeader = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.lg}px;
`;

const ModalTitle = styled(Text)`
    font-size: 18px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
`;

const FilterSection = styled(View)`
    margin-bottom: ${theme.spacing.lg}px;
`;

const FilterSectionTitle = styled(Text)`
    font-size: 14px;
    font-weight: 600;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.sm}px;
`;

const FilterOptionsRow = styled(View)`
    flex-direction: row;
    flex-wrap: wrap;
    gap: ${theme.spacing.sm}px;
`;

export const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    placeholder = "Buscar denúncias...",
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({
        sortBy: "relevance",
        location: "all",
        tags: [],
    });

    const hasActiveFilters =
        filters.sortBy !== "relevance" ||
        filters.location !== "all" ||
        filters.tags.length > 0;

    const handleSearch = () => {
        onSearch(searchQuery, filters);
    };

    const updateFilter = <K extends keyof SearchFilters>(
        key: K,
        value: SearchFilters[K]
    ) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onSearch(searchQuery, newFilters);
    };

    const toggleTag = (tag: string) => {
        const newTags = filters.tags.includes(tag)
            ? filters.tags.filter((t) => t !== tag)
            : [...filters.tags, tag];
        updateFilter("tags", newTags);
    };

    const sortOptions = [
        { value: "relevance", label: "Relevância", icon: "star" },
        { value: "recent", label: "Recentes", icon: "time" },
        { value: "popular", label: "Mais votadas", icon: "trending-up" },
        { value: "nearby", label: "Próximos", icon: "location" },
    ] as const;

    const locationOptions = [
        { value: "all", label: "Todas", icon: "globe" },
        { value: "neighborhood", label: "Meu bairro", icon: "home" },
        { value: "city", label: "Minha cidade", icon: "business" },
        { value: "state", label: "Meu estado", icon: "map" },
    ] as const;

    const availableTags = [
        "urgente",
        "investigação",
        "transparência",
        "justiça",
        "direitos",
        "denúncia",
        "comunidade",
        "ação",
    ];

    return (
        <Container>
            <SearchContainer>
                <Ionicons
                    name='search'
                    size={20}
                    color={theme.colors.text.secondary}
                />
                <SearchInput
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.text.secondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType='search'
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons
                            name='close-circle'
                            size={20}
                            color={theme.colors.text.secondary}
                        />
                    </TouchableOpacity>
                )}
                <FilterButton onPress={() => setShowFilters(true)}>
                    <Ionicons
                        name='options'
                        size={20}
                        color={theme.colors.text.primary}
                    />
                    {hasActiveFilters && <FilterBadge />}
                </FilterButton>
            </SearchContainer>

            <FiltersRow>
                {sortOptions.map((option) => (
                    <FilterChip
                        key={option.value}
                        active={filters.sortBy === option.value}
                        onPress={() => updateFilter("sortBy", option.value)}
                    >
                        <Ionicons
                            name={option.icon as any}
                            size={14}
                            color={
                                filters.sortBy === option.value
                                    ? theme.colors.surface
                                    : theme.colors.text.secondary
                            }
                        />
                        <FilterChipText
                            active={filters.sortBy === option.value}
                        >
                            {option.label}
                        </FilterChipText>
                    </FilterChip>
                ))}
            </FiltersRow>

            <Modal
                visible={showFilters}
                transparent
                animationType='slide'
                onRequestClose={() => setShowFilters(false)}
            >
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>Filtros de Busca</ModalTitle>
                            <TouchableOpacity
                                onPress={() => setShowFilters(false)}
                            >
                                <Ionicons
                                    name='close'
                                    size={24}
                                    color={theme.colors.text.primary}
                                />
                            </TouchableOpacity>
                        </ModalHeader>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <FilterSection>
                                <FilterSectionTitle>
                                    Ordenar por
                                </FilterSectionTitle>
                                <FilterOptionsRow>
                                    {sortOptions.map((option) => (
                                        <FilterChip
                                            key={option.value}
                                            active={
                                                filters.sortBy === option.value
                                            }
                                            onPress={() =>
                                                updateFilter(
                                                    "sortBy",
                                                    option.value
                                                )
                                            }
                                        >
                                            <Ionicons
                                                name={option.icon as any}
                                                size={16}
                                                color={
                                                    filters.sortBy ===
                                                    option.value
                                                        ? theme.colors.surface
                                                        : theme.colors.text
                                                              .secondary
                                                }
                                            />
                                            <FilterChipText
                                                active={
                                                    filters.sortBy ===
                                                    option.value
                                                }
                                            >
                                                {option.label}
                                            </FilterChipText>
                                        </FilterChip>
                                    ))}
                                </FilterOptionsRow>
                            </FilterSection>

                            <FilterSection>
                                <FilterSectionTitle>
                                    Localização
                                </FilterSectionTitle>
                                <FilterOptionsRow>
                                    {locationOptions.map((option) => (
                                        <FilterChip
                                            key={option.value}
                                            active={
                                                filters.location ===
                                                option.value
                                            }
                                            onPress={() =>
                                                updateFilter(
                                                    "location",
                                                    option.value
                                                )
                                            }
                                        >
                                            <Ionicons
                                                name={option.icon as any}
                                                size={16}
                                                color={
                                                    filters.location ===
                                                    option.value
                                                        ? theme.colors.surface
                                                        : theme.colors.text
                                                              .secondary
                                                }
                                            />
                                            <FilterChipText
                                                active={
                                                    filters.location ===
                                                    option.value
                                                }
                                            >
                                                {option.label}
                                            </FilterChipText>
                                        </FilterChip>
                                    ))}
                                </FilterOptionsRow>
                            </FilterSection>

                            <FilterSection>
                                <FilterSectionTitle>Tags</FilterSectionTitle>
                                <FilterOptionsRow>
                                    {availableTags.map((tag) => (
                                        <FilterChip
                                            key={tag}
                                            active={filters.tags.includes(tag)}
                                            onPress={() => toggleTag(tag)}
                                        >
                                            <FilterChipText
                                                active={filters.tags.includes(
                                                    tag
                                                )}
                                            >
                                                {tag}
                                            </FilterChipText>
                                        </FilterChip>
                                    ))}
                                </FilterOptionsRow>
                            </FilterSection>

                            {hasActiveFilters && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setFilters({
                                            sortBy: "relevance",
                                            location: "all",
                                            tags: [],
                                        });
                                        onSearch(searchQuery, {
                                            sortBy: "relevance",
                                            location: "all",
                                            tags: [],
                                        });
                                    }}
                                    style={{
                                        backgroundColor:
                                            theme.colors.background,
                                        padding: theme.spacing.md,
                                        borderRadius: theme.borderRadius.md,
                                        alignItems: "center",
                                        marginTop: theme.spacing.md,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: theme.colors.text.primary,
                                            fontWeight: "600",
                                        }}
                                    >
                                        Limpar Filtros
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </Container>
    );
};
