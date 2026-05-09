import React from "react";
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet } from "react-native";
import { useNavigationStore } from "@/store/navigationStore";
import { useFilteredProducts } from "@/hooks/useProducts";
import { colors } from "@/styles/theme";
import type { Product, ProductCategory } from "@/@types";

const CATEGORIES: Array<{ key: ProductCategory | "todos"; label: string }> = [
  { key: "todos", label: "Todos" },
  { key: "pijamas", label: "Pijamas" },
  { key: "lingerie", label: "Lingerie" },
];

const SORT_OPTIONS = [
  { value: "default", label: "Ordenar" },
  { value: "asc", label: "Menor preço" },
  { value: "desc", label: "Maior preço" },
] as const;

function ProductGridItem({ product: p }: { product: Product }) {
  const navigate = useNavigationStore((s) => s.navigate);
  const discount = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;

  return (
    <TouchableOpacity
      onPress={() => navigate("product-detail", { product: p })}
      style={styles.gridItem}
      activeOpacity={0.85}
    >
      <View style={styles.gridImage}>
        <Text style={styles.gridEmoji}>{p.emoji}</Text>
        {p.tag && (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{p.tag}</Text>
          </View>
        )}
      </View>
      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={2}>{p.name}</Text>
        <Text style={styles.gridPrice}>R$ {p.price.toFixed(2).replace(".", ",")}</Text>
        {p.originalPrice && (
          <Text style={styles.gridOriginal}>R$ {p.originalPrice.toFixed(2).replace(".", ",")}</Text>
        )}
        <Text style={styles.gridStock}>
          {p.stock > 0 ? `${p.stock} em estoque` : "Esgotado"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function ProductsScreen() {
  const { filtered, category, setCategory, search, setSearch, sort, setSort } = useFilteredProducts();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Produtos</Text>
        <Text style={styles.subtitle}>{filtered.length} peças encontradas</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar peças..."
            placeholderTextColor={colors.mutedLight}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.key}
            onPress={() => setCategory(c.key)}
            style={[styles.catChip, category === c.key && styles.catChipActive]}
          >
            <Text style={[styles.catChipText, category === c.key && styles.catChipTextActive]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Products grid */}
      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => <ProductGridItem product={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: { backgroundColor: colors.night, padding: 20, paddingTop: 48, gap: 4 },
  title: { fontSize: 26, color: colors.white, fontWeight: "400" },
  subtitle: { fontSize: 12, color: colors.mutedLight },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.nightSoft,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: colors.white, fontSize: 14, paddingVertical: 10 },
  filters: { flexDirection: "row", gap: 8, padding: 16, paddingBottom: 8 },
  catChip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  catChipActive: { backgroundColor: colors.deepRose, borderColor: colors.deepRose },
  catChipText: { fontSize: 12, fontWeight: "700", color: colors.muted, textTransform: "capitalize" },
  catChipTextActive: { color: colors.white },
  grid: { paddingHorizontal: 16, paddingBottom: 96 },
  gridRow: { gap: 14, marginBottom: 14 },
  gridItem: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridImage: {
    backgroundColor: colors.blush + "50",
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  gridEmoji: { fontSize: 64 },
  tagBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: colors.deepRose,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  tagText: { color: colors.white, fontSize: 9, fontWeight: "800", textTransform: "uppercase" },
  gridInfo: { padding: 12, paddingBottom: 14 },
  gridName: { fontSize: 13, fontWeight: "700", color: colors.night, lineHeight: 18 },
  gridPrice: { fontSize: 15, fontWeight: "800", color: colors.deepRose, marginTop: 6 },
  gridOriginal: { fontSize: 11, color: colors.muted, textDecorationLine: "line-through", marginTop: 2 },
  gridStock: { fontSize: 11, color: colors.muted, marginTop: 4 },
});
