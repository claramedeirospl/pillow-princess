import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/styles/theme";

type BadgeVariant = "primary" | "success" | "warning" | "gold" | "muted";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  small?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string }> = {
  primary: { bg: colors.deepRose + "20", text: colors.deepRose },
  success: { bg: "#e8f8f0", text: "#155724" },
  warning: { bg: colors.gold + "30", text: colors.gold },
  gold: { bg: colors.gold + "30", text: colors.gold },
  muted: { bg: colors.muted + "20", text: colors.muted },
};

export function Badge({ label, variant = "primary", small = false }: BadgeProps) {
  const v = variantStyles[variant];
  return (
    <View style={[styles.base, { backgroundColor: v.bg }, small && styles.small]}>
      <Text style={[styles.text, { color: v.text }, small && styles.textSmall]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  small: { paddingVertical: 2, paddingHorizontal: 7 },
  text: { fontSize: 11, fontWeight: "800", letterSpacing: 0.3 },
  textSmall: { fontSize: 9 },
});
