import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigationStore } from "@/store/navigationStore";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors } from "@/styles/theme";
import type { Payment, PaymentType } from "@/@types";

const PAYMENT_TYPES: Array<{ key: PaymentType; icon: string; label: string }> = [
  { key: "credit", icon: "💳", label: "Crédito" },
  { key: "debit", icon: "💳", label: "Débito" },
  { key: "pix", icon: "💚", label: "PIX" },
  { key: "boleto", icon: "📄", label: "Boleto" },
];

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export function AddPaymentScreen() {
  const goBack = useNavigationStore((s) => s.goBack);
  const user = useAuthStore((s) => s.user);
  const updateUserData = useAuthStore((s) => s.updateUserData);
  const show = useToastStore((s) => s.show);

  const [type, setType] = useState<PaymentType>("credit");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  function save() {
    setError("");
    let payment: Payment;

    if (type === "pix") {
      payment = { type: "pix", label: "PIX" };
    } else if (type === "boleto") {
      payment = { type: "boleto", label: "Boleto Bancário" };
    } else {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        setError("Preencha todos os campos do cartão.");
        return;
      }
      if (cardNumber.replace(/\s/g, "").length < 16) {
        setError("Número de cartão inválido.");
        return;
      }
      payment = {
        type,
        label: type === "credit" ? "Cartão de Crédito" : "Cartão de Débito",
        last4: cardNumber.replace(/\s/g, "").slice(-4),
      };
    }

    const payments = [...(user?.payments ?? []), payment];
    updateUserData({ payments });
    show("Pagamento salvo! 💳");
    goBack();
  }

  const isCard = type === "credit" || type === "debit";

  return (
    <View style={styles.container}>
      <ScreenHeader title="Meio de pagamento" showBack />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Type selector */}
        <View style={styles.typeGrid}>
          {PAYMENT_TYPES.map((t) => (
            <TouchableOpacity
              key={t.key}
              onPress={() => setType(t.key)}
              style={[styles.typeChip, type === t.key && styles.typeChipActive]}
            >
              <Text style={styles.typeIcon}>{t.icon}</Text>
              <Text style={[styles.typeLabel, type === t.key && styles.typeLabelActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Card form */}
        {isCard && (
          <View style={styles.cardSection}>
            <LinearGradient colors={[colors.night, colors.nightSoft]} style={styles.cardPreview}>
              <Text style={styles.cardPreviewType}>{type === "credit" ? "Crédito" : "Débito"}</Text>
              <Text style={styles.cardPreviewNumber}>{cardNumber || "•••• •••• •••• ••••"}</Text>
              <View style={styles.cardPreviewBottom}>
                <Text style={styles.cardPreviewMeta}>{cardName || "NOME NO CARTÃO"}</Text>
                <Text style={styles.cardPreviewMeta}>{expiry || "MM/AA"}</Text>
              </View>
            </LinearGradient>

            <Input label="Número do cartão" value={cardNumber} onChange={(v) => setCardNumber(formatCardNumber(v))} placeholder="0000 0000 0000 0000" keyboardType="numeric" />
            <Input label="Nome no cartão" value={cardName} onChange={(v) => setCardName(v.toUpperCase())} placeholder="NOME COMO NO CARTÃO" autoCapitalize="characters" />

            <View style={styles.twoColumns}>
              <View style={styles.flex1}>
                <Input label="Validade" value={expiry} onChange={(v) => setExpiry(formatExpiry(v))} placeholder="MM/AA" keyboardType="numeric" />
              </View>
              <View style={styles.flex1}>
                <Input label="CVV" value={cvv} onChange={(v) => setCvv(v.replace(/\D/g, "").slice(0, 4))} placeholder="•••" keyboardType="numeric" secureTextEntry />
              </View>
            </View>
          </View>
        )}

        {type === "pix" && (
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>💚</Text>
            <Text style={styles.infoTitle}>PIX</Text>
            <Text style={styles.infoText}>O QR Code será gerado na confirmação do pedido. Rápido e sem taxas!</Text>
          </View>
        )}

        {type === "boleto" && (
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>📄</Text>
            <Text style={styles.infoTitle}>Boleto Bancário</Text>
            <Text style={styles.infoText}>O boleto será enviado por e-mail. Prazo de compensação: 1-3 dias úteis.</Text>
          </View>
        )}

        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.cta}>
        <Button label="Salvar pagamento 💳" onPress={save} fullWidth size="lg" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, gap: 12, paddingBottom: 100 },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeChip: { flex: 1, minWidth: "40%", padding: 12, borderRadius: 14, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.white, alignItems: "center", gap: 4 },
  typeChipActive: { borderColor: colors.deepRose, backgroundColor: colors.blush + "30" },
  typeIcon: { fontSize: 22 },
  typeLabel: { fontSize: 11, fontWeight: "700", color: colors.muted },
  typeLabelActive: { color: colors.deepRose },
  cardSection: { gap: 12 },
  cardPreview: { borderRadius: 20, padding: 24, overflow: "hidden" },
  cardPreviewType: { fontSize: 10, letterSpacing: 2, opacity: 0.6, textTransform: "uppercase", color: colors.white },
  cardPreviewNumber: { fontFamily: "monospace", fontSize: 18, letterSpacing: 3, marginVertical: 16, minHeight: 26, color: colors.white },
  cardPreviewBottom: { flexDirection: "row", justifyContent: "space-between" },
  cardPreviewMeta: { opacity: 0.7, fontSize: 13, color: colors.white },
  twoColumns: { flexDirection: "row", gap: 10 },
  flex1: { flex: 1 },
  infoCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 24, alignItems: "center", gap: 8 },
  infoIcon: { fontSize: 48 },
  infoTitle: { fontSize: 16, fontWeight: "700", color: colors.night },
  infoText: { fontSize: 13, color: colors.muted, textAlign: "center", lineHeight: 20 },
  errorBox: { backgroundColor: colors.errorBg, borderRadius: 10, padding: 12 },
  errorText: { color: colors.error, fontSize: 13 },
  cta: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.white, padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
});
