import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, type ViewProps } from "react-native";
import { colors } from "@/styles/theme";

// ─── Card.Root ────────────────────────────────────────────────────────────────

interface CardRootProps extends ViewProps {
  children: React.ReactNode;
  onPress?: () => void;
  noPad?: boolean;
}

function Root({ children, onPress, noPad, style, ...props }: CardRootProps) {
  const content = (
    <View style={[styles.root, noPad && styles.noPad, style as object]} {...props}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

// ─── Card.Header ─────────────────────────────────────────────────────────────

interface CardHeaderProps {
  title: string;
  action?: React.ReactNode;
}

function Header({ title, action }: CardHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {action}
    </View>
  );
}

// ─── Card.Section ─────────────────────────────────────────────────────────────

interface CardSectionProps {
  children: React.ReactNode;
  bordered?: boolean;
}

function Section({ children, bordered }: CardSectionProps) {
  return (
    <View style={[styles.section, bordered && styles.sectionBordered]}>
      {children}
    </View>
  );
}

// ─── Namespace export ─────────────────────────────────────────────────────────

export const Card = { Root, Header, Section };

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  noPad: { padding: 0 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    color: colors.night,
    fontWeight: "400",
  },
  section: { paddingVertical: 8 },
  sectionBordered: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 4,
    paddingTop: 12,
  },
});
