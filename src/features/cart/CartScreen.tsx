import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigationStore } from "@/store/navigationStore";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/Button";
import { colors } from "@/styles/theme";

export function CartScreen() {
  const navigate = useNavigationStore((s) => s.navigate);
  const { items, total, shippingCost, grandTotal, removeItem, updateQty } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Carrinho vazio</Text>
        <Text style={styles.emptySub}>Que tal adicionar algumas peças lindas?</Text>
        <Button label="Ver produtos" onPress={() => navigate("products")} />
      </View>
    );
  }

  const freeShippingRemaining = 199 - total;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Carrinho 🛒</Text>
        <Text style={styles.subtitle}>{items.length} {items.length === 1 ? "item" : "itens"}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Items */}
        {items.map((item) => (
          <View key={item.key} style={styles.item}>
            <View style={styles.itemEmoji}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>{item.size} · {item.color}</Text>
              <Text style={styles.itemPrice}>R$ {item.price.toFixed(2).replace(".", ",")}</Text>
              <View style={styles.qtyControl}>
                <TouchableOpacity onPress={() => updateQty(item.key, item.qty - 1)} style={styles.qtyBtn}>
                  <Text style={styles.qtyIcon}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.qty}</Text>
                <TouchableOpacity onPress={() => updateQty(item.key, item.qty + 1)} style={styles.qtyBtn}>
                  <Text style={styles.qtyIcon}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.key)} hitSlop={8}>
              <Text style={styles.removeIcon}>🗑</Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* Summary */}
        <View style={styles.summary}>
          <SummaryRow label="Subtotal" value={`R$ ${total.toFixed(2).replace(".", ",")}`} />
          <SummaryRow
            label="Frete"
            value={shippingCost === 0 ? "Grátis 🎉" : `R$ ${shippingCost.toFixed(2).replace(".", ",")}`}
            highlight={shippingCost === 0}
          />
          {freeShippingRemaining > 0 && (
            <Text style={styles.freeShippingHint}>
              Falta R$ {freeShippingRemaining.toFixed(2).replace(".", ",")} para frete grátis!
            </Text>
          )}
          <View style={styles.divider} />
          <SummaryRow label="Total" value={`R$ ${grandTotal.toFixed(2).replace(".", ",")}`} bold />
        </View>

        {/* CTA inside scroll — avoids z-index conflict with BottomNav */}
        <Button
          label="Finalizar compra →"
          onPress={() => navigate("checkout")}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </View>
  );
}

function SummaryRow({ label, value, highlight, bold }: { label: string; value: string; highlight?: boolean; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowHighlight, bold && styles.rowBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { backgroundColor: colors.night, padding: 20, paddingTop: 48 },
  title: { fontSize: 26, color: colors.white, fontWeight: "400" },
  subtitle: { fontSize: 12, color: colors.mutedLight, marginTop: 4 },
  // paddingBottom accounts for BottomNav height (~72px) + extra breathing room
  content: { padding: 16, gap: 12, paddingBottom: 96 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 32 },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { fontSize: 20, color: colors.night, fontWeight: "400" },
  emptySub: { fontSize: 14, color: colors.muted, textAlign: "center" },
  item: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemEmoji: {
    width: 72,
    height: 72,
    backgroundColor: colors.blush + "50",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 36 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: "700", color: colors.night },
  itemMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  itemPrice: { fontSize: 15, fontWeight: "800", color: colors.deepRose, marginTop: 2 },
  qtyControl: { flexDirection: "row", alignItems: "center", marginTop: 8, backgroundColor: colors.surface, borderRadius: 10, borderWidth: 1, borderColor: colors.border, alignSelf: "flex-start" },
  qtyBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  qtyIcon: { fontSize: 16, color: colors.deepRose, fontWeight: "700" },
  qtyValue: { minWidth: 24, textAlign: "center", fontSize: 13, fontWeight: "700" },
  removeIcon: { fontSize: 18, color: colors.muted },
  summary: { backgroundColor: colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  rowLabel: { fontSize: 13, color: colors.muted },
  rowValue: { fontSize: 13, fontWeight: "600", color: colors.nightSoft },
  rowHighlight: { color: colors.deepRose },
  rowBold: { fontSize: 16, fontWeight: "800", color: colors.night },
  freeShippingHint: { fontSize: 11, color: colors.muted },
  divider: { height: 1, backgroundColor: colors.border },
});
