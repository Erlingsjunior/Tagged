import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, View } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { FloatingChatBubble } from "@/components/FloatingChatBubble";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name='feed'
                    options={{
                        title: "Feed",
                        tabBarIcon: ({ color }) => (
                            <TabBarIcon name='home' color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name='createReport'
                    options={{
                        title: "Denunciar",
                        tabBarIcon: ({ color }) => (
                            <TabBarIcon name='plus-circle' color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name='profile'
                    options={{
                        title: "Perfil",
                        tabBarIcon: ({ color }) => (
                            <TabBarIcon name='user' color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name='index'
                    options={{
                        href: null,
                    }}
                />
            </Tabs>
            <FloatingChatBubble />
        </View>
    );
}
