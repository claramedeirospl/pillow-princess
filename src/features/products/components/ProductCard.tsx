import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigationStore } from "@/store/navigationStore";
import { colors } from "@/styles/theme";
import type { Product } from "@/@types";

interface Props {
  product: Product;
  width?: number;
}

function formatPrice(price: number) {
  return `R$ ${price.toFixed(2).replace(".", ",")}`;
}

function calcDiscount(price: number, original: number) {
  return Math.round((1 - price / original) * 100);
}

export function ProductCard({ product: p, width = 160 }: Props) {
  const navigate = useNavigationStore((s) => s.navigate);
  const discount = p.originalPrice ? calcDiscount(p.price, p.originalPrice) : 0;

  return (
    <TouchableOpacity
      onPress={() => navigate("product-detail", { product: p })}
      style={[styles.card, { width }]}
      activeOpacity={0.85}
    >
      <View style={styles.imageArea}>
        <Text style={styles.emoji}>{p.emoji}</Text>
        {p.tag && (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{p.tag}</Text>
          </View>
        )}
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{p.name}</Text>
        <Text style={styles.price}>{formatPrice(p.price)}</Text>
        {p.originalPrice && (
          <Text style={styles.originalPrice}>{formatPrice(p.originalPrice)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageArea: {
    backgroundColor: colors.blush + "40",
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  emoji: { fontSize: 56 },
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
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.gold,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 7,
  },
  discountText: { color: colors.night, fontSize: 9, fontWeight: "800" },
  info: { padding: 12, paddingBottom: 14 },
  name: { fontSize: 13, fontWeight: "700", color: colors.night, lineHeight: 18 },
  price: { fontSize: 15, fontWeight: "800", color: colors.deepRose, marginTop: 6 },
  originalPrice: { fontSize: 11, color: colors.muted, textDecorationLine: "line-through", marginTop: 2 },
});
