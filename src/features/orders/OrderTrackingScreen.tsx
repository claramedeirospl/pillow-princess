import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigationStore } from "@/store/navigationStore";
import { colors } from "@/styles/theme";
import type { OrderStatus } from "@/@types";

const STATUSES: Array<{ key: OrderStatus; label: string; icon: string; desc: string }> = [
  { key: "confirmado", label: "Pedido confirmado", icon: "✅", desc: "Recebemos seu pedido!" },
  { key: "pagamento", label: "Pagamento aprovado", icon: "💳", desc: "Pagamento processado." },
  { key: "preparando", label: "Preparando", icon: "📦", desc: "Sua encomenda está sendo embalada." },
  { key: "enviado", label: "Enviado", icon: "🚚", desc: "A caminho!" },
  { key: "entregue", label: "Entregue", icon: "🎉", desc: "Aproveite suas peças! 💕" },
];

export function OrderTrackingScreen() {
  const navigate = useNavigationStore((s) => s.navigate);
  const order = useNavigationStore((s) => s.selectedOrder);

  if (!order) { navigate("orders"); return null; }

  const confirmedKeys = order.timeline.map((t) => t.status);
  const lastConfirmedIdx = STATUSES.findLastIndex((s) => confirmedKeys.includes(s.key));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigate("orders")}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Pedido #{order.id}</Text>
        </View>
        <Text style={styles.date}>
          {new Date(order.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        </Text>
        <Text style={styles.total}>R$ {order.total.toFixed(2).replace(".", ",")}</Text>
      </View>

      {/* Timeline */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Rastreamento</Text>
        {STATUSES.map((s, i) => {
          const done = confirmedKeys.includes(s.key);
          const active = i === lastConfirmedIdx + 1 && !done;
          const timelineEntry = order.timeline.find((t) => t.status === s.key);
          return (
            <View key={s.key} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>
                  <Text style={styles.dotText}>{done ? "✓" : s.icon}</Text>
                </View>
                {i < STATUSES.length - 1 && (
                  <View style={[styles.line, done && styles.lineDone]} />
                )}
              </View>
              <View style={styles.timelineRight}>
                <Text style={[styles.timelineLabel, done ? styles.labelDone : active ? styles.labelActive : styles.labelPending]}>
                  {s.label}
                </Text>
                <Text style={styles.timelineDesc}>{s.desc}</Text>
                {done && timelineEntry && (
                  <Text style={styles.timelineTime}>
                    {new Date(timelineEntry.time).toLocaleString("pt-BR")}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Items */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Itens do pedido</Text>
        {order.items.map((item, i) => (
          <View key={i} style={[styles.itemRow, i < order.items.length - 1 && styles.itemBorder]}>
            <Text style={styles.itemEmoji}>{item.emoji}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>{item.size} · {item.color} · {item.qty}x</Text>
            </View>
            <Text style={styles.itemPrice}>R$ {(item.price * item.qty).toFixed(2).replace(".", ",")}</Text>
          </View>
        ))}
      </View>

      {/* Delivery */}
      {order.address && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Entrega</Text>
          <Text style={styles.addrLine}>{order.address.street}, {order.address.number}</Text>
          <Text style={styles.addrSub}>{order.address.city}/{order.address.state} · CEP {order.address.cep}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { paddingBottom: 32 },
  header: { backgroundColor: colors.night, padding: 20, paddingTop: 48 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  backIcon: { fontSize: 20, color: colors.blush },
  title: { fontSize: 22, color: colors.white, fontWeight: "400" },
  date: { fontSize: 12, color: colors.mutedLight },
  total: { fontSize: 18, fontWeight: "800", color: colors.rose, marginTop: 4 },
  card: { backgroundColor: colors.white, borderRadius: 20, padding: 20, margin: 16, marginBottom: 0, borderWidth: 1, borderColor: colors.border },
  cardTitle: { fontSize: 16, color: colors.night, fontWeight: "400", marginBottom: 20 },
  timelineItem: { flexDirection: "row", gap: 14, marginBottom: 0 },
  timelineLeft: { alignItems: "center" },
  dot: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  dotDone: { backgroundColor: colors.deepRose, borderColor: colors.deepRose },
  dotActive: { backgroundColor: colors.rose + "30", borderColor: colors.rose },
  dotText: { fontSize: 14 },
  line: { width: 2, flex: 1, minHeight: 24, backgroundColor: colors.border, marginVertical: 4 },
  lineDone: { backgroundColor: colors.deepRose },
  timelineRight: { flex: 1, paddingBottom: 20 },
  timelineLabel: { fontSize: 14, fontWeight: "700" },
  labelDone: { color: colors.night },
  labelActive: { color: colors.deepRose },
  labelPending: { color: colors.muted },
  timelineDesc: { fontSize: 12, color: colors.muted, marginTop: 2 },
  timelineTime: { fontSize: 11, color: colors.rose, marginTop: 2 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  itemEmoji: { fontSize: 28 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: "700", color: colors.night },
  itemMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  itemPrice: { fontSize: 13, fontWeight: "700", color: colors.deepRose },
  addrLine: { fontSize: 13, color: colors.night },
  addrSub: { fontSize: 13, color: colors.muted, marginTop: 2 },
});
