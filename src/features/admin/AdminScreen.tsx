import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useNavigationStore } from "@/store/navigationStore";
import { useProductsStore } from "@/store/productsStore";
import { useOrdersStore } from "@/store/ordersStore";
import { useAuthStore } from "@/store/authStore";
import { ScreenHeader } from "@/components/ScreenHeader";
import { colors } from "@/styles/theme";

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

interface AdminActionProps {
  icon: string;
  label: string;
  sub: string;
  onPress: () => void;
}

function AdminAction({ icon, label, sub, onPress }: AdminActionProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.action} activeOpacity={0.85}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <View style={styles.actionInfo}>
        <Text style={styles.actionLabel}>{label}</Text>
        <Text style={styles.actionSub}>{sub}</Text>
      </View>
      <Text style={styles.actionChevron}>›</Text>
    </TouchableOpacity>
  );
}

export function AdminScreen() {
  const navigate = useNavigationStore((s) => s.navigate);
  const products = useProductsStore((s) => s.products);
  const orders = useOrdersStore((s) => s.orders);
  const users = useAuthStore((s) => s.users);
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Painel Admin 👑" subtitle="Pillow Princess" showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <StatCard icon="💰" label="Receita Total" value={`R$ ${revenue.toFixed(2).replace(".", ",")}`} />
          <StatCard icon="📦" label="Pedidos" value={orders.length} />
          <StatCard icon="🛍️" label="Produtos" value={products.length} />
          <StatCard icon="👥" label="Clientes" value={users.length} />
        </View>

        <View style={styles.actions}>
          <AdminAction
            icon="🛍️"
            label="Gerenciar produtos"
            sub={`${products.length} cadastrados`}
            onPress={() => navigate("admin-product")}
          />
          <AdminAction
            icon="📦"
            label="Todos os pedidos"
            sub={`${orders.length} no total`}
            onPress={() => navigate("orders")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: { fontSize: 24 },
  statValue: { fontSize: 22, fontWeight: "800", color: colors.night, marginTop: 8 },
  statLabel: { fontSize: 12, color: colors.muted },
  actions: { gap: 10 },
  action: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionIcon: { fontSize: 28 },
  actionInfo: { flex: 1 },
  actionLabel: { fontSize: 15, fontWeight: "700", color: colors.night },
  actionSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  actionChevron: { fontSize: 18, color: colors.muted },
});
