import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useLogin } from "@/hooks/useAuth";
import { colors } from "@/styles/theme";

interface Props {
  onGoRegister: () => void;
}

export function LoginScreen({ onGoRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, submit } = useLogin();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient colors={[colors.night, colors.nightSoft]} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Text style={styles.tagline}>bem-vinda à</Text>
            <Text style={styles.brand}>Pillow{"\n"}<Text style={styles.brandAccent}>Princess</Text></Text>
            <Text style={styles.sub}>pijamas & lingerie</Text>
          </View>

          <View style={styles.form}>
            <Input
              label="E-mail"
              value={email}
              onChange={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              dark
            />
            <Input
              label="Senha"
              value={password}
              onChange={setPassword}
              placeholder="••••••"
              secureTextEntry={!showPassword}
              dark
              suffix={
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                  <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁"}</Text>
                </TouchableOpacity>
              }
            />

            {!!error && <Text style={styles.error}>{error}</Text>}

            <Button
              label={loading ? "Entrando..." : "Entrar"}
              onPress={() => submit(email, password)}
              loading={loading}
              fullWidth
              size="lg"
            />
          </View>

          <TouchableOpacity onPress={onGoRegister} style={styles.linkRow}>
            <Text style={styles.linkText}>
              Não tem conta?{" "}
              <Text style={styles.link}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.hint}>Admin: admin@pillowprincess.com / admin123</Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  inner: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 0 },
  hero: { alignItems: "center", marginBottom: 40 },
  tagline: { color: colors.mutedLight, fontSize: 11, letterSpacing: 4, textTransform: "uppercase", marginBottom: 8 },
  brand: { color: colors.blush, fontSize: 38, fontWeight: "400", textAlign: "center", lineHeight: 44 },
  brandAccent: { color: colors.rose, fontStyle: "italic" },
  sub: { color: colors.mutedLight, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", marginTop: 8 },
  form: { width: "100%", gap: 14, marginBottom: 24 },
  eyeIcon: { fontSize: 16, color: colors.mutedLight },
  error: { color: colors.blush, fontSize: 12, textAlign: "center" },
  linkRow: { marginTop: 8 },
  linkText: { color: colors.mutedLight, fontSize: 13 },
  link: { color: colors.blush, fontWeight: "700" },
  hint: { color: colors.muted, fontSize: 11, marginTop: 16, textAlign: "center" },
});
