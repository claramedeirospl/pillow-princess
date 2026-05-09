import React from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigationStore } from "@/store/navigationStore";
import { useAuthStore } from "@/store/authStore";
import { useProductsByCategory } from "@/hooks/useProducts";
import { useAds } from "@/services/queries/useAdsQuery";
import { ProductCard } from "@/features/products/components/ProductCard";
import { colors } from "@/styles/theme";
import type { Banner } from "@/@types/ads";

function CategoryCard({
  label, sub, emoji, bg, onPress,
}: { label: string; sub: string; emoji: string; bg: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.catCard, { backgroundColor: bg }]} activeOpacity={0.85}>
      <Text style={styles.catEmoji}>{emoji}</Text>
      <Text style={styles.catSub}>{sub}</Text>
      <Text style={styles.catLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function Section({ title, onSeeAll, children }: { title: string; onSeeAll: () => void; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>Ver todas →</Text>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
}

function BannerCard({ banner }: { banner: Banner }) {
  return (
    <LinearGradient
      colors={[banner.bgColor, banner.bgColor + "CC"]}
      style={styles.bannerCard}
    >
      <View>
        <Text style={styles.bannerTag}>{banner.subtitle}</Text>
        <Text style={styles.bannerTitle}>{banner.title}</Text>
        <Text style={styles.bannerCta}>{banner.cta} →</Text>
      </View>
      <Text style={styles.bannerIcon}>{banner.icon}</Text>
    </LinearGradient>
  );
}

export function HomeScreen() {
  const navigate = useNavigationStore((s) => s.navigate);
  const user = useAuthStore((s) => s.user);
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const { pijamas, lingerie, featured } = useProductsByCategory();
  const { data: ads, isLoading: adsLoading } = useAds();
  const firstName = user?.name?.split(" ")[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <LinearGradient colors={[colors.night, colors.nightSoft]} style={styles.hero}>
        <Text style={styles.greeting}>olá, {firstName} 🌸</Text>
        <Text style={styles.brand}>Pillow{"\n"}<Text style={styles.brandAccent}>Princess</Text></Text>
        <Text style={styles.heroSub}>Pijamas & Lingerie com amor 💕</Text>
        {isAdmin && (
          <TouchableOpacity onPress={() => navigate("admin")} style={styles.adminBtn}>
            <Text style={styles.adminBtnText}>⚙️ Painel Admin</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* Categories */}
      <View style={styles.cats}>
        <CategoryCard label="Pijamas" sub={`${pijamas.length} peças`} emoji="🌙" bg={colors.night} onPress={() => navigate("products")} />
        <CategoryCard label="Lingerie" sub={`${lingerie.length} peças`} emoji="💕" bg={colors.deepRose} onPress={() => navigate("products")} />
      </View>

      {/* Featured */}
      <Section title="Em destaque ✨" onSeeAll={() => navigate("products")}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </ScrollView>
      </Section>

      {/* Banners via useAds */}
      {adsLoading ? (
        <ActivityIndicator color={colors.rose} style={styles.loader} />
      ) : (
        ads?.banners.map((banner) => (
          <View key={banner.id} style={styles.bannerWrap}>
            <BannerCard banner={banner} />
          </View>
        ))
      )}

      {/* Pijamas */}
      <Section title="Pijamas 🌙" onSeeAll={() => navigate("products")}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {pijamas.map((p) => <ProductCard key={p.id} product={p} />)}
        </ScrollView>
      </Section>

      {/* Lingerie */}
      <Section title="Lingerie 🖤" onSeeAll={() => navigate("products")}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {lingerie.map((p) => <ProductCard key={p.id} product={p} />)}
        </ScrollView>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { paddingBottom: 96 },
  hero: { padding: 24, paddingTop: 48, overflow: "hidden" },
  greeting: { color: colors.mutedLight, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 },
  brand: { color: colors.white, fontSize: 32, fontWeight: "400", lineHeight: 38 },
  brandAccent: { color: colors.rose, fontStyle: "italic" },
  heroSub: { color: colors.mutedLight, fontSize: 13, marginTop: 8 },
  adminBtn: { marginTop: 14, paddingVertical: 8, paddingHorizontal: 18, backgroundColor: colors.gold + "22", borderWidth: 1, borderColor: colors.gold, borderRadius: 20, alignSelf: "flex-start" },
  adminBtnText: { color: colors.gold, fontSize: 12, fontWeight: "700" },
  cats: { flexDirection: "row", gap: 12, padding: 20, paddingBottom: 0 },
  catCard: { flex: 1, borderRadius: 18, padding: 20, minHeight: 110, overflow: "hidden" },
  catEmoji: { fontSize: 36, opacity: 0.3, position: "absolute", bottom: -8, right: -8 },
  catSub: { color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" },
  catLabel: { color: colors.white, fontSize: 22, fontWeight: "400", marginTop: 4 },
  section: { marginTop: 28 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 20, color: colors.night, fontWeight: "400" },
  seeAll: { fontSize: 12, color: colors.deepRose, fontWeight: "700" },
  row: { gap: 12, paddingHorizontal: 20, paddingBottom: 4 },
  loader: { marginVertical: 20 },
  bannerWrap: { marginHorizontal: 20, marginTop: 20 },
  bannerCard: { borderRadius: 20, padding: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  bannerTag: { color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" },
  bannerTitle: { color: colors.white, fontSize: 20, fontWeight: "400", marginVertical: 4 },
  bannerCta: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "700" },
  bannerIcon: { fontSize: 48 },
});
