import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigationStore } from "@/store/navigationStore";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/hooks/useAuth";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { colors } from "@/styles/theme";
import type { Address, Payment } from "@/@types";

export function ProfileScreen() {
  const navigate = useNavigationStore((s) => s.navigate);
  const user = useAuthStore((s) => s.user);
  const updateUserData = useAuthStore((s) => s.updateUserData);
  const logout = useLogout();
  const isAdmin = useAuthStore((s) => s.isAdmin());

  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);
  const addresses: Address[] = user?.addresses ?? [];
  const payments: Payment[] = user?.payments ?? [];

  function handleSave() {
    updateUserData({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function removeAddress(index: number) {
    const updated = addresses.filter((_, i) => i !== index);
    updateUserData({ addresses: updated });
  }

  function removePayment(index: number) {
    const updated = payments.filter((_, i) => i !== index);
    updateUserData({ payments: updated });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={[colors.night, colors.nightSoft]} style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>{isAdmin ? "👑" : "👤"}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        {isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Administradora 👑</Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.cards}>
        {/* Edit profile */}
        <Card.Root>
          <Card.Header title="Editar perfil" />
          <Input label="Nome" value={name} onChange={setName} placeholder="Seu nome" />
          {saved && <Text style={styles.savedText}>✓ Salvo!</Text>}
          <Button label="Salvar" onPress={handleSave} fullWidth style={{ marginTop: 10 }} />
        </Card.Root>

        {/* Addresses */}
        <Card.Root>
          <Card.Header
            title="Endereços de entrega"
            action={
              <Button label="+ Adicionar" onPress={() => navigate("add-address")} size="sm" />
            }
          />
          {addresses.length === 0 && (
            <Text style={styles.emptyText}>Nenhum endereço cadastrado.</Text>
          )}
          {addresses.map((a, i) => (
            <View key={i} style={[styles.listItem, i < addresses.length - 1 && styles.listItemBorder]}>
              <Text style={styles.listIcon}>📍</Text>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>{a.label}</Text>
                <Text style={styles.listSub}>{a.street}, {a.number} · {a.city}/{a.state}</Text>
              </View>
              <TouchableOpacity onPress={() => removeAddress(i)} hitSlop={8}>
                <Text style={styles.removeIcon}>🗑</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card.Root>

        {/* Payments */}
        <Card.Root>
          <Card.Header
            title="Meios de pagamento"
            action={
              <Button label="+ Adicionar" onPress={() => navigate("add-payment")} size="sm" />
            }
          />
          {payments.length === 0 && (
            <Text style={styles.emptyText}>Nenhum pagamento cadastrado.</Text>
          )}
          {payments.map((p, i) => (
            <View key={i} style={[styles.listItem, i < payments.length - 1 && styles.listItemBorder]}>
              <Text style={styles.listIcon}>
                {p.type === "pix" ? "💚" : p.type === "boleto" ? "📄" : "💳"}
              </Text>
              <View style={styles.listInfo}>
                <Text style={styles.listTitle}>{p.label}</Text>
                {p.last4 && <Text style={styles.listSub}>•••• {p.last4}</Text>}
              </View>
              <TouchableOpacity onPress={() => removePayment(i)} hitSlop={8}>
                <Text style={styles.removeIcon}>🗑</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card.Root>

        {isAdmin && (
          <Button
            label="⚙️ Painel Administrativo"
            onPress={() => navigate("admin")}
            variant="secondary"
            fullWidth
          />
        )}

        <Button label="Sair da conta" onPress={logout} variant="danger" fullWidth />

        <Text style={styles.footer}>
          Pillow Princess 🌸 · Conta criada em{" "}
          {user ? new Date(user.createdAt).toLocaleDateString("pt-BR") : ""}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { paddingBottom: 96 },
  hero: { padding: 24, paddingTop: 40, paddingBottom: 48, alignItems: "center", gap: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.rose + "30", borderWidth: 3, borderColor: colors.rose + "50", alignItems: "center", justifyContent: "center" },
  avatarIcon: { fontSize: 36 },
  userName: { fontSize: 22, color: colors.white, fontWeight: "400" },
  userEmail: { fontSize: 13, color: colors.mutedLight },
  adminBadge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20, backgroundColor: colors.gold + "30", borderWidth: 1, borderColor: colors.gold },
  adminBadgeText: { color: colors.gold, fontSize: 11, fontWeight: "700" },
  cards: { padding: 16, marginTop: -24, gap: 0 },
  emptyText: { fontSize: 13, color: colors.muted },
  savedText: { fontSize: 12, color: colors.success, marginTop: 6 },
  listItem: { flexDirection: "row", gap: 10, paddingVertical: 10, alignItems: "center" },
  listItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  listIcon: { fontSize: 20 },
  listInfo: { flex: 1 },
  listTitle: { fontSize: 13, fontWeight: "700", color: colors.night },
  listSub: { fontSize: 12, color: colors.muted, marginTop: 2 },
  removeIcon: { fontSize: 16, color: colors.muted },
  footer: { textAlign: "center", color: colors.mutedLight, fontSize: 11, marginTop: 8 },
});
