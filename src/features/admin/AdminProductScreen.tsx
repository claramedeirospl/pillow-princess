import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, ScrollView } from "react-native";
import { useNavigationStore } from "@/store/navigationStore";
import { useProductsStore } from "@/store/productsStore";
import { useToastStore } from "@/store/toastStore";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors } from "@/styles/theme";
import type { Product } from "@/@types";

const EMOJIS = ["🌸","🌙","💕","🖤","💋","☁️","⭐","🍷","🌿","💎","✨","🔥"];

interface ProductFormData {
  name: string;
  category: "pijamas" | "lingerie";
  price: string;
  originalPrice: string;
  description: string;
  emoji: string;
  tag: string;
  stock: string;
  sizes: string;
  colors: string;
}

interface ProductFormModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
}

function ProductFormModal({ product, onClose, onSave }: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>({
    name: product?.name ?? "",
    category: product?.category ?? "pijamas",
    price: product?.price ? String(product.price) : "",
    originalPrice: product?.originalPrice ? String(product.originalPrice) : "",
    description: product?.description ?? "",
    emoji: product?.emoji ?? "🌸",
    tag: product?.tag ?? "",
    stock: product?.stock ? String(product.stock) : "10",
    sizes: (product?.sizes ?? ["P","M","G"]).join(", "),
    colors: (product?.colors ?? ["Rosa"]).join(", "),
  });
  const [error, setError] = useState("");

  function set<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    if (!form.name || !form.price) { setError("Nome e preço são obrigatórios."); return; }
    onSave(form);
  }

  return (
    <Modal visible animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{product ? "Editar produto" : "Novo produto"}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Text style={styles.fieldLabel}>Emoji</Text>
            <View style={styles.emojiGrid}>
              {EMOJIS.map((e) => (
                <TouchableOpacity
                  key={e}
                  onPress={() => set("emoji", e)}
                  style={[styles.emojiBtn, form.emoji === e && styles.emojiBtnActive]}
                >
                  <Text style={styles.emojiText}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input label="Nome *" value={form.name} onChange={(v) => set("name", v)} placeholder="Nome do produto" />

            <View>
              <Text style={styles.fieldLabel}>Categoria</Text>
              <View style={styles.categoryRow}>
                {(["pijamas", "lingerie"] as const).map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => set("category", c)}
                    style={[styles.catChip, form.category === c && styles.catChipActive]}
                  >
                    <Text style={[styles.catChipText, form.category === c && styles.catChipTextActive]}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.twoCol}>
              <View style={styles.flex1}>
                <Input label="Preço *" value={form.price} onChange={(v) => set("price", v)} placeholder="0.00" keyboardType="decimal-pad" />
              </View>
              <View style={styles.flex1}>
                <Input label="Preço original" value={form.originalPrice} onChange={(v) => set("originalPrice", v)} placeholder="0.00" keyboardType="decimal-pad" />
              </View>
            </View>

            <View style={styles.twoCol}>
              <View style={styles.flex1}>
                <Input label="Estoque" value={form.stock} onChange={(v) => set("stock", v)} placeholder="0" keyboardType="numeric" />
              </View>
              <View style={styles.flex1}>
                <Input label="Tag" value={form.tag} onChange={(v) => set("tag", v)} placeholder="Novo, Exclusivo..." />
              </View>
            </View>

            <Input label="Tamanhos (vírgula)" value={form.sizes} onChange={(v) => set("sizes", v)} placeholder="P, M, G, GG" />
            <Input label="Cores (vírgula)" value={form.colors} onChange={(v) => set("colors", v)} placeholder="Rosa, Preto, Nude" />
            <Input label="Descrição" value={form.description} onChange={(v) => set("description", v)} placeholder="Descreva o produto..." multiline numberOfLines={3} />

            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            )}

            <View style={styles.modalActions}>
              <Button label="Cancelar" onPress={onClose} variant="secondary" style={{ flex: 1 }} />
              <Button label={product ? "Salvar" : "Criar produto"} onPress={handleSave} style={{ flex: 2 }} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function AdminProductScreen() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductsStore();
  const show = useToastStore((s) => s.show);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  function handleDelete(id: string) {
    Alert.alert("Remover produto", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => { deleteProduct(id); show("Produto removido."); },
      },
    ]);
  }

  function handleSave(data: ProductFormData) {
    const parsed = {
      ...data,
      price: parseFloat(data.price) || 0,
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
      stock: parseInt(data.stock) || 0,
      sizes: data.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: data.colors.split(",").map((c) => c.trim()).filter(Boolean),
      tag: data.tag || null,
      images: [data.emoji],
    };

    if (editing) {
      updateProduct(editing.id, parsed);
      show("Produto atualizado! ✅");
    } else {
      addProduct({ id: "p" + Date.now(), ...parsed });
      show("Produto criado! 🌸");
    }
    setShowForm(false);
    setEditing(null);
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Produtos"
        showBack
        right={
          <Button label="+ Novo" onPress={() => { setEditing(null); setShowForm(true); }} size="sm" />
        }
      />

      <FlatList
        data={products}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        renderItem={({ item: p }) => (
          <View style={styles.row}>
            <Text style={styles.rowEmoji}>{p.emoji}</Text>
            <View style={styles.rowInfo}>
              <Text style={styles.rowName}>{p.name}</Text>
              <Text style={styles.rowMeta}>{p.category} · R$ {p.price.toFixed(2).replace(".", ",")} · {p.stock} em estoque</Text>
            </View>
            <View style={styles.rowActions}>
              <TouchableOpacity onPress={() => { setEditing(p); setShowForm(true); }} style={styles.editBtn}>
                <Text>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(p.id)} style={styles.deleteBtn}>
                <Text>🗑</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      {showForm && (
        <ProductFormModal
          product={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  list: { padding: 16, gap: 10, paddingBottom: 32 },
  row: { backgroundColor: colors.white, borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: colors.border },
  rowEmoji: { fontSize: 36 },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 14, fontWeight: "700", color: colors.night },
  rowMeta: { fontSize: 12, color: colors.muted, marginTop: 3 },
  rowActions: { flexDirection: "row", gap: 6 },
  editBtn: { padding: 7, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: "#e8f4fd" },
  deleteBtn: { padding: 7, borderRadius: 10, borderWidth: 1, borderColor: "#fcc", backgroundColor: "#fff5f5" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalSheet: { backgroundColor: colors.white, borderRadius: 24, maxHeight: "90%", overflow: "hidden" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, paddingBottom: 0 },
  modalTitle: { fontSize: 20, fontWeight: "400", color: colors.night },
  modalClose: { fontSize: 22, color: colors.muted },
  modalContent: { padding: 20, gap: 12 },
  fieldLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase", color: colors.muted, marginBottom: 6 },
  emojiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  emojiBtn: { padding: 6, paddingHorizontal: 10, borderRadius: 10, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.white },
  emojiBtnActive: { borderColor: colors.deepRose, backgroundColor: colors.blush + "40" },
  emojiText: { fontSize: 24 },
  categoryRow: { flexDirection: "row", gap: 8 },
  catChip: { flex: 1, padding: 10, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white, alignItems: "center" },
  catChipActive: { borderColor: colors.deepRose, backgroundColor: colors.deepRose },
  catChipText: { fontSize: 13, fontWeight: "700", color: colors.muted },
  catChipTextActive: { color: colors.white },
  twoCol: { flexDirection: "row", gap: 10 },
  flex1: { flex: 1 },
  errorBox: { backgroundColor: colors.errorBg, borderRadius: 10, padding: 12 },
  errorText: { color: colors.error, fontSize: 13 },
  modalActions: { flexDirection: "row", gap: 10, marginTop: 4 },
});
