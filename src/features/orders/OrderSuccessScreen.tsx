import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigationStore } from "@/store/navigationStore";
import { useToastStore } from "@/store/toastStore";
import { Button } from "@/components/Button";
import { colors } from "@/styles/theme";

// QR code finder pattern + timing + fake data modules (visual only — not scannable)
const QR_MATRIX: number[][] = (() => {
  const m: number[][] = Array.from({ length: 21 }, () => Array(21).fill(0));

  const finder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const outer = r === 0 || r === 6 || c === 0 || c === 6;
        const inner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        m[row + r][col + c] = outer || inner ? 1 : 0;
      }
    }
  };

  finder(0, 0);   // top-left
  finder(0, 14);  // top-right
  finder(14, 0);  // bottom-left

  // Timing patterns (row 6 and col 6 between the finders)
  for (let i = 8; i <= 12; i++) {
    m[6][i] = i % 2 === 0 ? 1 : 0;
    m[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // Fake data modules in the open data region
  const data = [
    [8,8],[8,10],[8,12],[8,14],[8,16],[8,18],[8,20],
    [9,9],[9,11],[9,13],[9,16],[9,19],
    [10,8],[10,10],[10,13],[10,14],[10,17],[10,20],
    [11,9],[11,12],[11,15],[11,18],
    [12,8],[12,11],[12,13],[12,16],[12,19],
    [13,9],[13,10],[13,14],[13,17],[13,20],
    [14,8],[14,11],[14,13],[14,16],[14,18],
    [15,9],[15,12],[15,14],[15,17],[15,20],
    [16,8],[16,10],[16,13],[16,15],[16,18],
    [17,9],[17,11],[17,14],[17,16],[17,19],
    [18,8],[18,10],[18,12],[18,15],[18,17],[18,20],
    [19,9],[19,11],[19,13],[19,16],[19,18],
    [20,8],[20,10],[20,12],[20,14],[20,16],[20,18],[20,20],
  ];
  data.forEach(([r, c]) => { m[r][c] = 1; });

  return m;
})();

// Placeholder PIX payload (EMV format structure — not a real payment)
const FAKE_PIX_PAYLOAD =
  "00020126580014BR.GOV.BCB.PIX0136pillow-princess@banco.com.br52040000530398" +
  "65802BR5925PILLOW PRINCESS MODAS SA6009SAO PAULO62070503***6304D3F1";

export function OrderSuccessScreen() {
  const navigate = useNavigationStore((s) => s.navigate);
  const order = useNavigationStore((s) => s.selectedOrder);
  const show = useToastStore((s) => s.show);

  const isPix = order?.payment?.type === "pix";

  function handleCopyPix() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(FAKE_PIX_PAYLOAD).catch(() => {});
    }
    show("Código PIX copiado! ✓");
  }

  if (!order) {
    navigate("home");
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroIcon}>🎉</Text>
        <Text style={styles.heroTitle}>Pedido confirmado!</Text>
        <Text style={styles.heroSub}>Obrigada pela sua compra, princesa 💕</Text>
        <View style={styles.orderBadge}>
          <Text style={styles.orderBadgeText}>Pedido #{order.id}</Text>
        </View>
      </View>

      {/* PIX QR Code */}
      {isPix && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💸 Pagamento via PIX</Text>
          <Text style={styles.cardSub}>
            Escaneie o QR code ou copie o código abaixo para pagar
          </Text>

          <View style={styles.qrWrapper}>
            <View style={styles.qrInner}>
              {QR_MATRIX.map((row, ri) => (
                <View key={ri} style={styles.qrRow}>
                  {row.map((cell, ci) => (
                    <View
                      key={ci}
                      style={[styles.qrCell, cell === 1 ? styles.qrDark : styles.qrLight]}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.copyBtn}
            onPress={handleCopyPix}
            activeOpacity={0.75}
          >
            <Text style={styles.copyBtnText}>📋  Copiar código PIX</Text>
          </TouchableOpacity>
          <Text style={styles.pixExpiry}>⏱ QR Code válido por 30 minutos</Text>
        </View>
      )}

      {/* Order summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumo do pedido</Text>
        {order.items.map((item) => (
          <View key={item.key} style={styles.itemRow}>
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>
                {item.size} · {item.color} · {item.qty}×
              </Text>
            </View>
            <Text style={styles.itemPrice}>
              R$ {(item.price * item.qty).toFixed(2).replace(".", ",")}
            </Text>
          </View>
        ))}
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total pago</Text>
          <Text style={styles.summaryTotal}>
            R$ {order.total.toFixed(2).replace(".", ",")}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Forma de pagamento</Text>
          <Text style={styles.summaryValue}>{order.payment.label}</Text>
        </View>
      </View>

      {/* Delivery */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Entrega</Text>
        <Text style={styles.addressLine}>
          {order.address.street}, {order.address.number}
          {order.address.complement ? ` — ${order.address.complement}` : ""}
        </Text>
        <Text style={styles.addressLine}>
          {order.address.neighborhood} · {order.address.city}/{order.address.state}
        </Text>
        <Text style={styles.addressLine}>CEP {order.address.cep}</Text>
        <Text style={styles.deliveryEta}>📦 Prazo estimado: 5–8 dias úteis</Text>
      </View>

      {/* Actions */}
      <Button
        label="Acompanhar pedido"
        onPress={() => navigate("order-tracking")}
        fullWidth
      />
      <TouchableOpacity
        onPress={() => navigate("home")}
        style={styles.ghostBtn}
      >
        <Text style={styles.ghostBtnText}>Voltar ao início</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const CELL = 9;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, gap: 12, paddingBottom: 40 },

  hero: {
    backgroundColor: colors.night,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    gap: 6,
  },
  heroIcon: { fontSize: 56 },
  heroTitle: { fontSize: 24, color: colors.white, fontWeight: "400", marginTop: 4 },
  heroSub: { fontSize: 13, color: colors.mutedLight, textAlign: "center" },
  orderBadge: {
    marginTop: 10,
    backgroundColor: colors.rose + "22",
    borderWidth: 1,
    borderColor: colors.rose,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  orderBadgeText: { color: colors.rose, fontSize: 12, fontWeight: "700" },

  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: colors.night },
  cardSub: { fontSize: 12, color: colors.muted },

  qrWrapper: { alignItems: "center", paddingVertical: 8 },
  qrInner: {
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  qrRow: { flexDirection: "row" },
  qrCell: { width: CELL, height: CELL },
  qrDark: { backgroundColor: colors.night },
  qrLight: { backgroundColor: colors.white },

  copyBtn: {
    backgroundColor: colors.cream,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  copyBtnText: { fontSize: 14, fontWeight: "700", color: colors.deepRose },
  pixExpiry: { fontSize: 11, color: colors.muted, textAlign: "center" },

  itemRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemEmoji: { fontSize: 24 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: "700", color: colors.night },
  itemMeta: { fontSize: 11, color: colors.muted },
  itemPrice: { fontSize: 13, fontWeight: "700", color: colors.deepRose },

  divider: { height: 1, backgroundColor: colors.border },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 13, color: colors.muted },
  summaryTotal: { fontSize: 16, fontWeight: "800", color: colors.night },
  summaryValue: { fontSize: 13, fontWeight: "600", color: colors.nightSoft },

  addressLine: { fontSize: 13, color: colors.nightSoft },
  deliveryEta: { fontSize: 12, color: colors.deepRose, fontWeight: "600", marginTop: 4 },

  ghostBtn: { alignItems: "center", paddingVertical: 16 },
  ghostBtnText: { fontSize: 14, color: colors.muted, fontWeight: "600" },
});
