import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useRegister } from "@/hooks/useAuth";
import { colors } from "@/styles/theme";

interface Props {
  onGoLogin: () => void;
}

export function RegisterScreen({ onGoLogin }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { loading, error, submit } = useRegister();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient colors={[colors.night, colors.nightSoft]} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.sub}>Pillow Princess 🌸</Text>
          </View>

          <View style={styles.form}>
            <Input label="Nome" value={name} onChange={setName} placeholder="Seu nome" dark />
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
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              dark
            />
            <Input
              label="Confirmar senha"
              value={confirm}
              onChange={setConfirm}
              placeholder="Repita a senha"
              secureTextEntry
              dark
            />

            {!!error && <Text style={styles.error}>{error}</Text>}

            <Button
              label={loading ? "Criando..." : "Criar conta"}
              onPress={() => submit(name, email, password, confirm)}
              loading={loading}
              fullWidth
              size="lg"
            />
          </View>

          <TouchableOpacity onPress={onGoLogin}>
            <Text style={styles.linkText}>
              Já tem conta?{" "}
              <Text style={styles.link}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  inner: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  hero: { alignItems: "center", marginBottom: 32 },
  title: { color: colors.blush, fontSize: 30, fontWeight: "400" },
  sub: { color: colors.mutedLight, fontSize: 13, marginTop: 6 },
  form: { width: "100%", gap: 12, marginBottom: 24 },
  error: { color: colors.blush, fontSize: 12, textAlign: "center" },
  linkText: { color: colors.mutedLight, fontSize: 13 },
  link: { color: colors.blush, fontWeight: "700" },
});
