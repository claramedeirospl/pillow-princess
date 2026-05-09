import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigationStore } from "@/store/navigationStore";
import { useCheckout } from "@/hooks/useCheckout";
import { Button } from "@/components/Button";
import { colors } from "@/styles/theme";
import type { Address, Payment } from "@/@types";

const STEPS = ["Endereço", "Pagamento", "Revisão"] as const;

function StepIndicator({ current }: { current: number }) {
  return (
    <View style={styles.steps}>
      {STEPS.map((label, i) => (
        <View key={label} style={styles.step}>
          <View style={[styles.stepDot, i <= current && styles.stepDotActive]}>
            <Text style={styles.stepDotText}>{i < current ? "✓" : String(i + 1)}</Text>
          </View>
          <Text style={[styles.stepLabel, i === current && styles.stepLabelActive]}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

function AddressCard({ address, selected, onSelect }: { address: Address; selected: boolean; onSelect: () => void }) {
  return (
    <TouchableOpacity onPress={onSelect} style={[styles.selectable, selected && styles.selectableActive]}>
      <Text style={styles.cardIcon}>📍</Text>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{address.label}</Text>
        <Text style={styles.cardSub}>{address.street}, {address.number} · {address.city}/{address.state}</Text>
        <Text style={styles.cardSub}>CEP {address.cep}</Text>
      </View>
    </TouchableOpacity>
  );
}

function PaymentCard({ payment, selected, onSelect }: { payment: Payment; selected: boolean; onSelect: () => void }) {
  const icon = payment.type === "pix" ? "💚" : payment.type === "boleto" ? "📄" : "💳";
  return (
    <TouchableOpacity onPress={onSelect} style={[styles.selectable, selected && styles.selectableActive]}>
      <Text style={styles.cardIcon}>{icon}</Text>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>{payment.label}</Text>
        {payment.last4 && <Text style={styles.cardSub}>•••• •••• •••• {payment.last4}</Text>}
      </View>
    </TouchableOpacity>
  );
}

export function CheckoutScreen() {
  const navigate = useNavigationStore((s) => s.navigate);
  const goBack = useNavigationStore((s) => s.goBack);
  const {
    step, nextStep, goToStep,
    placeOrder,
    selectedAddress, setSelectedAddress,
    selectedPayment, setSelectedPayment,
    addresses, payments,
    subtotal, shippingCost, grandTotal, items,
  } = useCheckout();

  const canProceed = step === 0
    ? true
    : step === 1
    ? true
    : !!selectedAddress && !!selectedPayment;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
        </View>
        <StepIndicator current={step} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 0: Address */}
        {step === 0 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Endereço de entrega</Text>
            {addresses.length === 0 ? (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>Nenhum endereço cadastrado.</Text>
                <Button label="+ Adicionar endereço" onPress={() => navigate("add-address")} variant="secondary" />
              </View>
            ) : (
              <>
                {addresses.map((a, i) => (
                  <AddressCard key={i} address={a} selected={selectedAddress === a} onSelect={() => setSelectedAddress(a)} />
                ))}
                <Button label="+ Novo endereço" onPress={() => navigate("add-address")} variant="ghost" fullWidth />
              </>
            )}
          </View>
        )}

        {/* Step 1: Payment */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Meio de pagamento</Text>
            {payments.length === 0 ? (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>Nenhum pagamento cadastrado.</Text>
                <Button label="+ Adicionar pagamento" onPress={() => navigate("add-payment")} variant="secondary" />
              </View>
            ) : (
              <>
                {payments.map((p, i) => (
                  <PaymentCard key={i} payment={p} selected={selectedPayment === p} onSelect={() => setSelectedPayment(p)} />
                ))}
                <Button label="+ Novo pagamento" onPress={() => navigate("add-payment")} variant="ghost" fullWidth />
              </>
            )}
          </View>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.sectionTitle}>Revisão do pedido</Text>
            {items.map((item) => (
              <View key={item.key} style={styles.reviewItem}>
                <Text style={styles.reviewEmoji}>{item.emoji}</Text>
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewName}>{item.name}</Text>
                  <Text style={styles.reviewMeta}>{item.size} · {item.color} · {item.qty}x</Text>
                </View>
                <Text style={styles.reviewPrice}>R$ {(item.price * item.qty).toFixed(2).replace(".", ",")}</Text>
              </View>
            ))}

            <View style={styles.totals}>
              <Row label="Produtos" value={`R$ ${subtotal.toFixed(2).replace(".", ",")}`} />
              <Row label="Frete" value={shippingCost === 0 ? "Grátis" : `R$ ${shippingCost.toFixed(2).replace(".", ",")}`} highlight={shippingCost === 0} />
              <View style={styles.totalDivider} />
              <Row label="Total" value={`R$ ${grandTotal.toFixed(2).replace(".", ",")}`} bold />
            </View>

            {selectedAddress && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoIcon}>📍</Text>
                <View>
                  <Text style={styles.infoTitle}>{selectedAddress.label}</Text>
                  <Text style={styles.infoSub}>{selectedAddress.street}, {selectedAddress.number} · {selectedAddress.city}/{selectedAddress.state}</Text>
                </View>
              </View>
            )}
            {selectedPayment && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoIcon}>{selectedPayment.type === "pix" ? "💚" : selectedPayment.type === "boleto" ? "📄" : "💳"}</Text>
                <View>
                  <Text style={styles.infoTitle}>{selectedPayment.label}</Text>
                  {selectedPayment.last4 && <Text style={styles.infoSub}>•••• {selectedPayment.last4}</Text>}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <View style={styles.cta}>
        {step < 2 ? (
          <Button
            label={step === 0 ? "Continuar para pagamento →" : "Revisar pedido →"}
            onPress={nextStep}
            fullWidth
            size="lg"
          />
        ) : (
          <Button
            label="Confirmar pedido 🌸"
            onPress={placeOrder}
            disabled={!canProceed}
            fullWidth
            size="lg"
          />
        )}
      </View>
    </View>
  );
}

function Row({ label, value, highlight, bold }: { label: string; value: string; highlight?: boolean; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowHighlight, bold && styles.rowBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { backgroundColor: colors.night, padding: 20, paddingTop: 48, gap: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  backIcon: { fontSize: 20, color: colors.blush },
  headerTitle: { fontSize: 22, color: colors.white, fontWeight: "400" },
  steps: { flexDirection: "row", justifyContent: "space-around" },
  step: { alignItems: "center", gap: 4 },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.nightSoft, alignItems: "center", justifyContent: "center" },
  stepDotActive: { backgroundColor: colors.rose },
  stepDotText: { fontSize: 12, fontWeight: "800", color: colors.white },
  stepLabel: { fontSize: 10, color: colors.muted },
  stepLabelActive: { color: colors.blush, fontWeight: "700" },
  content: { padding: 20, paddingBottom: 100 },
  stepContent: { gap: 12 },
  sectionTitle: { fontSize: 18, color: colors.night, fontWeight: "400", marginBottom: 4 },
  emptySection: { backgroundColor: colors.surface, borderRadius: 16, padding: 24, alignItems: "center", gap: 12, borderWidth: 1, borderColor: colors.border, borderStyle: "dashed" },
  emptyText: { color: colors.muted, fontSize: 14 },
  selectable: { backgroundColor: colors.white, borderRadius: 14, padding: 14, borderWidth: 2, borderColor: colors.border, flexDirection: "row", gap: 12 },
  selectableActive: { borderColor: colors.deepRose },
  cardIcon: { fontSize: 24 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: colors.night },
  cardSub: { fontSize: 13, color: colors.muted, marginTop: 3 },
  reviewItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  reviewEmoji: { fontSize: 28 },
  reviewInfo: { flex: 1 },
  reviewName: { fontSize: 13, fontWeight: "700", color: colors.night },
  reviewMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  reviewPrice: { fontWeight: "700", color: colors.deepRose, fontSize: 14 },
  totals: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginTop: 8, gap: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  rowLabel: { fontSize: 13, color: colors.muted },
  rowValue: { fontSize: 13, fontWeight: "600", color: colors.nightSoft },
  rowHighlight: { color: colors.deepRose },
  rowBold: { fontSize: 16, fontWeight: "800", color: colors.night },
  totalDivider: { height: 1, backgroundColor: colors.border },
  infoBlock: { flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: colors.white, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.border },
  infoIcon: { fontSize: 24 },
  infoTitle: { fontSize: 13, fontWeight: "700", color: colors.night },
  infoSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  cta: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.white, padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
});
