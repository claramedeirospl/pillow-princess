import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigationStore } from "@/store/navigationStore";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/Button";
import { colors } from "@/styles/theme";

const TABS = ["Descrição", "Tamanhos", "Cores"] as const;
type Tab = (typeof TABS)[number];

export function ProductDetailScreen() {
  const product = useNavigationStore((s) => s.selectedProduct);
  const goBack = useNavigationStore((s) => s.goBack);
  const { addAndGoToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] ?? "");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<Tab>("Descrição");

  if (!product) { goBack(); return null; }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const total = (product.price * qty).toFixed(2).replace(".", ",");

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Hero image */}
        <LinearGradient colors={[colors.blush + "60", colors.rose + "30"]} style={styles.hero}>
          <Text style={styles.heroEmoji}>{product.emoji}</Text>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          {product.tag && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{product.tag}</Text>
            </View>
          )}
        </LinearGradient>

        {/* Content */}
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Text style={styles.category}>{product.category}</Text>
              <Text style={styles.name}>{product.name}</Text>
            </View>
            <View style={styles.priceWrap}>
              <Text style={styles.price}>R$ {product.price.toFixed(2).replace(".", ",")}</Text>
              {product.originalPrice && (
                <Text style={styles.originalPrice}>R$ {product.originalPrice.toFixed(2).replace(".", ",")}</Text>
              )}
              {discount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{discount}%</Text>
                </View>
              )}
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {TABS.map((t) => (
              <TouchableOpacity key={t} onPress={() => setTab(t)} style={styles.tabBtn}>
                <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
                {tab === t && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tabContent}>
            {tab === "Descrição" && (
              <Text style={styles.description}>{product.description}</Text>
            )}
            {tab === "Tamanhos" && (
              <View>
                <Text style={styles.selectLabel}>Selecione o tamanho:</Text>
                <View style={styles.optionsRow}>
                  {product.sizes.map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => setSelectedSize(s)}
                      style={[styles.option, selectedSize === s && styles.optionActive]}
                    >
                      <Text style={[styles.optionText, selectedSize === s && styles.optionTextActive]}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            {tab === "Cores" && (
              <View>
                <Text style={styles.selectLabel}>Selecione a cor:</Text>
                <View style={styles.optionsRow}>
                  {product.colors.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setSelectedColor(c)}
                      style={[styles.option, selectedColor === c && styles.optionActive]}
                    >
                      <Text style={[styles.optionText, selectedColor === c && styles.optionTextActive]}>{c}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Selection summary */}
          <View style={styles.summary}>
            <SummaryChip label="Tamanho" value={selectedSize} />
            <SummaryChip label="Cor" value={selectedColor} />
            <SummaryChip label="Estoque" value={`${product.stock} unid.`} />
          </View>

          {/* Quantity */}
          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Quantidade:</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity onPress={() => setQty((q) => Math.max(1, q - 1))} style={styles.qtyBtn}>
                <Text style={styles.qtyIcon}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{qty}</Text>
              <TouchableOpacity onPress={() => setQty((q) => Math.min(product.stock, q + 1))} style={styles.qtyBtn}>
                <Text style={styles.qtyIcon}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={styles.cta}>
        <Button
          label={product.stock === 0 ? "Esgotado" : `Adicionar ao carrinho · R$ ${total}`}
          onPress={() => addAndGoToCart(product, selectedSize, selectedColor, qty)}
          disabled={product.stock === 0}
          fullWidth
          size="lg"
        />
      </View>
    </View>
  );
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text style={styles.chipLabel}>{label}</Text>
      <Text style={styles.chipValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { paddingBottom: 120 },
  hero: { height: 280, alignItems: "center", justifyContent: "center", position: "relative" },
  heroEmoji: { fontSize: 110 },
  backBtn: { position: "absolute", top: 16, left: 16, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 12, width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  backIcon: { fontSize: 18 },
  tagBadge: { position: "absolute", top: 16, right: 16, backgroundColor: colors.deepRose, borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12 },
  tagText: { color: colors.white, fontSize: 11, fontWeight: "800" },
  card: { backgroundColor: colors.white, borderRadius: 24, marginTop: -20, padding: 20 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  titleLeft: { flex: 1 },
  category: { fontSize: 11, color: colors.muted, textTransform: "uppercase", letterSpacing: 1 },
  name: { fontSize: 24, color: colors.night, fontWeight: "400", marginTop: 4 },
  priceWrap: { alignItems: "flex-end" },
  price: { fontSize: 22, fontWeight: "800", color: colors.deepRose },
  originalPrice: { fontSize: 12, color: colors.muted, textDecorationLine: "line-through" },
  discountBadge: { backgroundColor: colors.gold, borderRadius: 10, paddingVertical: 2, paddingHorizontal: 8, marginTop: 4 },
  discountText: { color: colors.night, fontSize: 10, fontWeight: "800" },
  tabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: 20 },
  tabBtn: { flex: 1, alignItems: "center", paddingBottom: 10, position: "relative" },
  tabText: { fontSize: 13, fontWeight: "700", color: colors.muted },
  tabTextActive: { color: colors.deepRose },
  tabIndicator: { position: "absolute", bottom: -1, left: 0, right: 0, height: 2, backgroundColor: colors.deepRose },
  tabContent: { paddingVertical: 16, minHeight: 80 },
  description: { fontSize: 14, color: colors.nightSoft, lineHeight: 24 },
  selectLabel: { fontSize: 12, color: colors.muted, marginBottom: 10 },
  optionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  option: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.white },
  optionActive: { borderColor: colors.deepRose, backgroundColor: colors.deepRose },
  optionText: { fontWeight: "700", fontSize: 13, color: colors.night },
  optionTextActive: { color: colors.white },
  summary: { flexDirection: "row", gap: 20, backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 16 },
  chipLabel: { fontSize: 10, color: colors.muted, textTransform: "uppercase", letterSpacing: 0.5 },
  chipValue: { fontSize: 13, fontWeight: "700", color: colors.night, marginTop: 2 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  qtyLabel: { fontSize: 13, fontWeight: "700", color: colors.night },
  qtyControl: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  qtyBtn: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  qtyIcon: { fontSize: 18, color: colors.deepRose, fontWeight: "700" },
  qtyValue: { minWidth: 28, textAlign: "center", fontWeight: "800", color: colors.night },
  cta: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: colors.white, padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
});
