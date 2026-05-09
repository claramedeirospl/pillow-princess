import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useToastStore } from "@/store/toastStore";
import { colors } from "@/styles/theme";

export function Toast() {
  const { message, type } = useToastStore();
  if (!message) return null;

  return (
    <View style={[styles.container, type === "error" ? styles.error : styles.success]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  success: { backgroundColor: colors.night },
  error: { backgroundColor: colors.error },
  text: { color: colors.white, fontSize: 13, fontWeight: "700" },
});
