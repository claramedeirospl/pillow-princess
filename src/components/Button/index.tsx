import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  type TouchableOpacityProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/styles/theme";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: object;
}

const sizeStyles = {
  sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 },
  md: { paddingVertical: 12, paddingHorizontal: 20, fontSize: 14 },
  lg: { paddingVertical: 15, paddingHorizontal: 24, fontSize: 17 },
};

export function Button({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  if (variant === "primary") {
    return (
      <LinearGradient
        colors={[colors.rose, colors.deepRose]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.base, { borderRadius: 14, opacity: isDisabled ? 0.6 : 1 }, fullWidth && styles.fullWidth]}
      >
        <TouchableOpacity
          {...props}
          disabled={isDisabled}
          style={[styles.inner, { paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal }]}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <View style={styles.row}>
              {icon && <View style={styles.iconWrap}>{icon}</View>}
              <Text style={[styles.labelPrimary, { fontSize: s.fontSize }]}>{label}</Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const variantStyle = {
    secondary: styles.secondary,
    ghost: styles.ghost,
    danger: styles.danger,
  }[variant];

  const labelVariantStyle = {
    secondary: styles.labelSecondary,
    ghost: styles.labelGhost,
    danger: styles.labelDanger,
  }[variant];

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        variantStyle,
        { paddingVertical: s.paddingVertical, paddingHorizontal: s.paddingHorizontal, opacity: isDisabled ? 0.6 : 1 },
        fullWidth && styles.fullWidth,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.deepRose} size="small" />
      ) : (
        <View style={styles.row}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[labelVariantStyle, { fontSize: s.fontSize }]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 14, alignItems: "center", justifyContent: "center" },
  fullWidth: { width: "100%" },
  inner: { alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center" },
  iconWrap: { marginRight: 6 },
  labelPrimary: { color: colors.white, fontWeight: "800", letterSpacing: 0.3 },
  secondary: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.border },
  ghost: { backgroundColor: "transparent" },
  danger: { backgroundColor: "#fff5f5", borderWidth: 1.5, borderColor: "#fcc" },
  labelSecondary: { color: colors.deepRose, fontWeight: "700" },
  labelGhost: { color: colors.deepRose, fontWeight: "700" },
  labelDanger: { color: colors.error, fontWeight: "700" },
});
