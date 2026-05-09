import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigationStore } from "@/store/navigationStore";
import { colors } from "@/styles/theme";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, showBack = false, right }: ScreenHeaderProps) {
  const goBack = useNavigationStore((s) => s.goBack);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {showBack && (
          <TouchableOpacity onPress={goBack} style={styles.backBtn} hitSlop={8}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
        {right && <View style={styles.right}>{right}</View>}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.night, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 20, color: colors.blush },
  title: { fontSize: 22, color: colors.white, fontWeight: "400", flex: 1 },
  right: { marginLeft: "auto" },
  subtitle: { fontSize: 12, color: colors.mutedLight, marginTop: 4, marginLeft: 0 },
});
