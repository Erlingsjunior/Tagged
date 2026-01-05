import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, Animated, PanResponder, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { useRouter } from "expo-router";
import { useChatStore } from "../stores/chatStore";
import { theme } from "../constants/Theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUBBLE_SIZE = 56;
const EDGE_MARGIN = 16;

const BubbleContainer = styled(Animated.View)`
    position: absolute;
    width: ${BUBBLE_SIZE}px;
    height: ${BUBBLE_SIZE}px;
    border-radius: ${BUBBLE_SIZE / 2}px;
    background-color: ${theme.colors.primary};
    align-items: center;
    justify-content: center;
    elevation: 8;
    shadow-color: #000;
    shadow-offset: 0px 4px;
    shadow-opacity: 0.3;
    shadow-radius: 4px;
    z-index: 9999;
`;

const UnreadBadge = styled(Animated.View)`
    position: absolute;
    top: -4px;
    right: -4px;
    background-color: ${theme.colors.error};
    border-radius: 12px;
    min-width: 24px;
    height: 24px;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
    border-width: 2px;
    border-color: ${theme.colors.surface};
`;

const BadgeText = styled(Text)`
    color: ${theme.colors.surface};
    font-size: 12px;
    font-weight: bold;
`;

interface FloatingChatBubbleProps {
    visible?: boolean;
}

export const FloatingChatBubble: React.FC<FloatingChatBubbleProps> = ({ visible = true }) => {
    const router = useRouter();
    const { getTotalUnreadCount } = useChatStore();
    const [unreadCount, setUnreadCount] = useState(0);

    // Position state
    const pan = useState(
        () =>
            new Animated.ValueXY({
                x: SCREEN_WIDTH - BUBBLE_SIZE - EDGE_MARGIN,
                y: SCREEN_HEIGHT - BUBBLE_SIZE - 200, // Start above bottom navigation
            })
    )[0];

    // Scale animation for badge
    const badgeScale = useState(() => new Animated.Value(1))[0];

    useEffect(() => {
        // Update unread count
        const updateCount = () => {
            const count = getTotalUnreadCount();
            if (count !== unreadCount) {
                setUnreadCount(count);
                // Animate badge when count changes
                if (count > unreadCount) {
                    Animated.sequence([
                        Animated.timing(badgeScale, {
                            toValue: 1.3,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        Animated.timing(badgeScale, {
                            toValue: 1,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                    ]).start();
                }
            }
        };

        updateCount();
        const interval = setInterval(updateCount, 2000); // Check every 2 seconds

        return () => clearInterval(interval);
    }, [unreadCount]);

    const panResponder = useState(() =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                pan.setOffset({
                    x: (pan.x as any)._value,
                    y: (pan.y as any)._value,
                });
                pan.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: (_, gesture) => {
                pan.flattenOffset();

                // Get current position
                const currentX = (pan.x as any)._value;
                const currentY = (pan.y as any)._value;

                // Snap to nearest edge (left or right)
                const snapToRight = currentX > SCREEN_WIDTH / 2 - BUBBLE_SIZE / 2;
                const targetX = snapToRight
                    ? SCREEN_WIDTH - BUBBLE_SIZE - EDGE_MARGIN
                    : EDGE_MARGIN;

                // Constrain Y position
                const minY = EDGE_MARGIN;
                const maxY = SCREEN_HEIGHT - BUBBLE_SIZE - 100; // Leave space for bottom nav
                const targetY = Math.max(minY, Math.min(maxY, currentY));

                // Animate to snap position
                Animated.spring(pan, {
                    toValue: { x: targetX, y: targetY },
                    useNativeDriver: false,
                    tension: 100,
                    friction: 8,
                }).start();

                // If it was a tap (small movement), navigate to chat
                const wasTap = Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5;
                if (wasTap) {
                    router.push("/chat");
                }
            },
        })
    )[0];

    if (!visible) return null;

    return (
        <BubbleContainer
            style={{
                transform: [{ translateX: pan.x }, { translateY: pan.y }],
            }}
            {...panResponder.panHandlers}
        >
            <Ionicons name="chatbubbles" size={28} color={theme.colors.surface} />
            {unreadCount > 0 && (
                <UnreadBadge style={{ transform: [{ scale: badgeScale }] }}>
                    <BadgeText>{unreadCount > 99 ? "99+" : unreadCount}</BadgeText>
                </UnreadBadge>
            )}
        </BubbleContainer>
    );
};
