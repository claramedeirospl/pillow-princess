import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigationStore } from "@/store/navigationStore";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors } from "@/styles/theme";
import type { Address } from "@/@types";

const LABEL_OPTIONS = ["Casa", "Trabalho", "Outro"] as const;
const BR_STATES = ["AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"];

type LabelOption = (typeof LABEL_OPTIONS)[number];

export function AddAddressScreen() {
  const goBack = useNavigationStore((s) => s.goBack);
  const user = useAuthStore((s) => s.user);
  const updateUserData = useAuthStore((s) => s.updateUserData);
  const show = useToastStore((s) => s.show);

  const [label, setLabel] = useState<LabelOption>("Casa");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("PB");
  const [cep, setCep] = useState("");
  const [error, setError] = useState("");

  function save() {
    if (!street || !number || !city || !cep) {
      setError("Preencha os campos obrigatórios.");
      return;
    }
    const address: Address = { label, street, number, complement, neighborhood, city, state, cep };
    const addresses = [...(user?.addresses ?? []), address];
    updateUserData({ addresses });
    show("Endereço salvo! 📍");
    goBack();
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Novo endereço" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Label picker */}
        <View>
          <Text style={styles.fieldLabel}>Apelido</Text>
          <View style={styles.optionRow}>
            {LABEL_OPTIONS.map((l) => (
              <TouchableOpacity
                key={l}
                onPress={() => setLabel(l)}
                style={[styles.optionChip, label === l && styles.optionChipActive]}
              >
                <Text style={[styles.optionChipText, label === l && styles.optionChipTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Input label="CEP *" value={cep} onChange={setCep} placeholder="00000-000" keyboardType="numeric" />
        <Input label="Rua / Avenida *" value={street} onChange={setStreet} placeholder="Nome da rua" />

        <View style={styles.twoColumns}>
          <View style={styles.flex1}>
            <Input label="Número *" value={number} onChange={setNumber} placeholder="123" keyboardType="numeric" />
          </View>
          <View style={styles.flex1}>
            <Input label="Complemento" value={complement} onChange={setComplement} placeholder="Apto, casa..." />
          </View>
        </View>

        <Input label="Bairro" value={neighborhood} onChange={setNeighborhood} placeholder="Seu bairro" />

        <View style={styles.twoColumns}>
          <View style={styles.flex2}>
            <Input label="Cidade *" value={city} onChange={setCity} placeholder="Sua cidade" />
          </View>
          <View style={styles.stateWrap}>
            <Text style={styles.fieldLabel}>UF</Text>
            <View style={styles.stateBox}>
              <Text style={styles.stateText}>{state}</Text>
            </View>
          </View>
        </View>

        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.cta}>
        <Button label="Salvar endereço 📍" onPress={save} fullWidth size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 12, paddingBottom: 100 },
  fieldLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", color: colors.muted, marginBottom: 6 },
  optionRow: { flexDirection: "row", gap: 8 },
  optionChip: { flex: 1, padding: 10, borderRadius: 12, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.white, alignItems: "center" },
  optionChipActive: { borderColor: colors.deepRose, backgroundColor: colors.blush + "40" },
  optionChipText: { fontSize: 13, fontWeight: "700", color: colors.muted },
  optionChipTextActive: { color: colors.deepRose },
  twoColumns: { flexDirection: "row", gap: 10 },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  stateWrap: { width: 64 },
  stateBox: { borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, padding: 11, alignItems: "center" },
  stateText: { fontSize: 14, color: colors.night, fontWeight: "700" },
  errorBox: { backgroundColor: colors.errorBg, borderRadius: 10, padding: 12 },
  errorText: { color: colors.error, fontSize: 13 },
  cta: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.white, padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
});
