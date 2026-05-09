import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigationStore } from "@/store/navigationStore";
import { useAuthStore } from "@/store/authStore";
import { useOrdersStore } from "@/store/ordersStore";
import { Button } from "@/components/Button";
import { colors } from "@/styles/theme";
import type { Order, OrderStatus } from "@/@types";

const STATUS_COLORS: Record<OrderStatus, string> = {
  confirmado: colors.gold,
  pagamento: colors.rose,
  preparando: colors.rose,
  enviado: colors.deepRose,
  entregue: "#27ae60",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  confirmado: "Confirmado",
  pagamento: "Pag. aprovado",
  preparando: "Preparando",
  enviado: "Enviado",
  entregue: "Entregue",
};

function OrderCard({ order }: { order: Order }) {
  const navigate = useNavigationStore((s) => s.navigate);
  const setSelectedOrder = useNavigationStore((s) => s.setSelectedOrder);
  const lastStatus = (order.timeline?.[order.timeline.length - 1]?.status ?? "confirmado") as OrderStatus;
  const statusColor = STATUS_COLORS[lastStatus] ?? colors.muted;

  return (
    <TouchableOpacity
      onPress={() => { setSelectedOrder(order); navigate("order-tracking"); }}
      style={styles.card}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.orderId}>#{order.id}</Text>
          <Text style={styles.orderMeta}>
            {new Date(order.createdAt).toLocaleDateString("pt-BR")} · {order.items.length} {order.items.length === 1 ? "item" : "itens"}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{STATUS_LABELS[lastStatus]}</Text>
        </View>
      </View>
      <View style={styles.emojis}>
        {order.items.slice(0, 3).map((item, i) => (
          <Text key={i} style={styles.itemEmoji}>{item.emoji}</Text>
        ))}
        {order.items.length > 3 && (
          <Text style={styles.moreItems}>+{order.items.length - 3}</Text>
        )}
      </View>
      <Text style={styles.total}>R$ {order.total.toFixed(2).replace(".", ",")}</Text>
    </TouchableOpacity>
  );
}

export function OrdersListScreen() {
  const navigate = useNavigationStore((s) => s.navigate);
  const user = useAuthStore((s) => s.user);
  const getOrdersByUser = useOrdersStore((s) => s.getOrdersByUser);
  const userOrders = user ? getOrdersByUser(user.id) : [];

  if (userOrders.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>Sem pedidos ainda</Text>
        <Text style={styles.emptySub}>Que tal fazer seu primeiro pedido?</Text>
        <Button label="Ver produtos" onPress={() => navigate("products")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus pedidos 📦</Text>
        <Text style={styles.subtitle}>{userOrders.length} pedidos</Text>
      </View>
      <FlatList
        data={userOrders}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <OrderCard order={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { backgroundColor: colors.night, padding: 20, paddingTop: 48 },
  title: { fontSize: 26, color: colors.white, fontWeight: "400" },
  subtitle: { fontSize: 12, color: colors.mutedLight, marginTop: 4 },
  list: { padding: 16, gap: 12, paddingBottom: 96 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  orderId: { fontSize: 15, fontWeight: "800", color: colors.night },
  orderMeta: { fontSize: 12, color: colors.muted, marginTop: 3 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: "800" },
  emojis: { flexDirection: "row", gap: 8, marginTop: 10, alignItems: "center" },
  itemEmoji: { fontSize: 22 },
  moreItems: { fontSize: 12, color: colors.muted },
  total: { fontSize: 16, fontWeight: "800", color: colors.deepRose, marginTop: 8 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 32 },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { fontSize: 20, color: colors.night, fontWeight: "400" },
  emptySub: { fontSize: 14, color: colors.muted, textAlign: "center" },
});
