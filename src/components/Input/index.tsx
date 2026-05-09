import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  type TextInputProps,
} from "react-native";
import { colors } from "@/styles/theme";

interface InputProps extends Omit<TextInputProps, "onChangeText"> {
  label: string;
  value: string;
  onChange: (val: string) => void;
  dark?: boolean;
  suffix?: React.ReactNode;
  error?: string;
}

export function Input({ label, value, onChange, dark = false, suffix, error, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <Text style={[styles.label, dark ? styles.labelDark : styles.labelLight]}>{label}</Text>
      <View style={[
        styles.wrap,
        dark ? styles.wrapDark : styles.wrapLight,
        focused && styles.wrapFocused,
        !!error && styles.wrapError,
      ]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholderTextColor={dark ? colors.muted : colors.mutedLight}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.input, dark ? styles.inputDark : styles.inputLight]}
          {...props}
        />
        {suffix && <View style={styles.suffix}>{suffix}</View>}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 },
  labelLight: { color: colors.muted },
  labelDark: { color: colors.mutedLight },
  wrap: { borderRadius: 12, borderWidth: 1.5, flexDirection: "row", alignItems: "center" },
  wrapLight: { borderColor: colors.border, backgroundColor: colors.white },
  wrapDark: { borderColor: colors.nightSoft, backgroundColor: colors.nightSoft },
  wrapFocused: { borderColor: colors.deepRose },
  wrapError: { borderColor: colors.error },
  input: { flex: 1, paddingVertical: 11, paddingHorizontal: 14, fontSize: 14 },
  inputLight: { color: colors.night },
  inputDark: { color: colors.white },
  suffix: { paddingRight: 14 },
  error: { fontSize: 11, color: colors.error, marginTop: 4 },
});
