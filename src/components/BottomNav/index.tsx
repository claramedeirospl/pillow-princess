import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigationStore } from "@/store/navigationStore";
import { useAuthStore } from "@/store/authStore";
import { useCart } from "@/hooks/useCart";
import { colors } from "@/styles/theme";
import type { Screen } from "@/@types";

interface Tab {
  id: Screen;
  icon: string;
  label: string;
  badge?: number;
}

const NAV_SCREENS: Screen[] = ["home", "products", "profile", "orders", "cart"];

export function BottomNav() {
  const navigate = useNavigationStore((s) => s.navigate);
  const screen = useNavigationStore((s) => s.screen);
  const { count } = useCart();
  const insets = useSafeAreaInsets();

  if (!NAV_SCREENS.includes(screen)) return null;

  const tabs: Tab[] = [
    { id: "home", icon: "🏠", label: "Início" },
    { id: "products", icon: "🛍️", label: "Produtos" },
    { id: "cart", icon: "🛒", label: "Carrinho", badge: count },
    { id: "orders", icon: "📦", label: "Pedidos" },
    { id: "profile", icon: "👤", label: "Perfil" },
  ];

  return (
    <View style={[styles.nav, { paddingBottom: insets.bottom || 8 }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          onPress={() => navigate(tab.id)}
          style={styles.tab}
          activeOpacity={0.7}
        >
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>{tab.icon}</Text>
            {tab.badge !== undefined && tab.badge > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{tab.badge}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.label, screen === tab.id && styles.labelActive]}>
            {tab.label}
          </Text>
          {screen === tab.id && <View style={styles.indicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    zIndex: 100,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 6,
    position: "relative",
  },
  iconWrap: { position: "relative" },
  icon: { fontSize: 22 },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: colors.deepRose,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: "800" },
  label: { fontSize: 9, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase", color: colors.muted, marginTop: 2 },
  labelActive: { color: colors.deepRose },
  indicator: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -10,
    width: 20,
    height: 2,
    backgroundColor: colors.deepRose,
    borderRadius: 2,
  },
});
