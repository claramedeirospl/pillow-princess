import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { colors } from "@/styles/theme";

// Internal documentation screen — not reachable from the app navigation.
// Run it directly to preview all design system components and their states.

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function DesignSystemScreen() {
  const [inputValue, setInputValue] = useState("");
  const [darkInputValue, setDarkInputValue] = useState("");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Design System</Text>
      <Text style={styles.pageSubtitle}>Pillow Princess · Component Library</Text>

      {/* ── Buttons ── */}
      <Section title="Button">
        <Text style={styles.subsection}>Variants</Text>
        <View style={styles.row}>
          <Button label="Primary" onPress={() => {}} />
          <Button label="Secondary" variant="secondary" onPress={() => {}} />
        </View>
        <View style={styles.row}>
          <Button label="Ghost" variant="ghost" onPress={() => {}} />
          <Button label="Danger" variant="danger" onPress={() => {}} />
        </View>

        <Text style={styles.subsection}>Sizes</Text>
        <View style={styles.col}>
          <Button label="Small" size="sm" onPress={() => {}} />
          <Button label="Medium" size="md" onPress={() => {}} />
          <Button label="Large" size="lg" onPress={() => {}} />
        </View>

        <Text style={styles.subsection}>States</Text>
        <View style={styles.col}>
          <Button label="Loading..." loading onPress={() => {}} fullWidth />
          <Button label="Disabled" disabled onPress={() => {}} fullWidth />
        </View>
      </Section>

      {/* ── Inputs ── */}
      <Section title="Input">
        <View style={styles.col}>
          <Input label="Default" value={inputValue} onChange={setInputValue} placeholder="Placeholder..." />
          <Input label="With error" value="" onChange={() => {}} placeholder="Trigger error" error="This field is required." />
        </View>
        <View style={[styles.darkBox]}>
          <Input label="Dark mode" value={darkInputValue} onChange={setDarkInputValue} placeholder="Dark input..." dark />
        </View>
      </Section>

      {/* ── Badges ── */}
      <Section title="Badge">
        <View style={styles.row}>
          <Badge label="Primary" variant="primary" />
          <Badge label="Success" variant="success" />
          <Badge label="Gold" variant="gold" />
          <Badge label="Muted" variant="muted" />
        </View>
        <View style={styles.row}>
          <Badge label="Small Primary" variant="primary" small />
          <Badge label="Small Gold" variant="gold" small />
        </View>
      </Section>

      {/* ── Cards ── */}
      <Section title="Card">
        <Card.Root>
          <Card.Header title="Card title" />
          <Text style={styles.cardBodyText}>Card body content goes here. Compose freely with any child components.</Text>
        </Card.Root>

        <Card.Root>
          <Card.Header
            title="Card with action"
            action={<Button label="+ Add" size="sm" onPress={() => {}} />}
          />
          <Card.Section>
            <Text style={styles.cardBodyText}>Section content.</Text>
          </Card.Section>
          <Card.Section bordered>
            <Text style={styles.cardBodyText}>Bordered section (acts as a divider).</Text>
          </Card.Section>
        </Card.Root>

        <Card.Root onPress={() => {}}>
          <Text style={styles.cardBodyText}>Pressable card — tap me!</Text>
        </Card.Root>
      </Section>

      {/* ── Color Palette ── */}
      <Section title="Color Palette">
        <View style={styles.palette}>
          {(Object.entries(colors) as Array<[string, string]>).map(([name, hex]) => (
            <View key={name} style={styles.colorChip}>
              <View style={[styles.colorSwatch, { backgroundColor: hex }]} />
              <Text style={styles.colorName}>{name}</Text>
              <Text style={styles.colorHex}>{hex}</Text>
            </View>
          ))}
        </View>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 20, paddingBottom: 60 },
  pageTitle: { fontSize: 28, fontWeight: "400", color: colors.night, marginBottom: 4 },
  pageSubtitle: { fontSize: 13, color: colors.muted, marginBottom: 32 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.night, borderLeftWidth: 3, borderLeftColor: colors.deepRose, paddingLeft: 10, marginBottom: 16 },
  subsection: { fontSize: 12, fontWeight: "700", color: colors.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, marginTop: 12 },
  row: { flexDirection: "row", gap: 10, flexWrap: "wrap", marginBottom: 8 },
  col: { gap: 8, marginBottom: 8 },
  darkBox: { backgroundColor: colors.night, borderRadius: 16, padding: 16 },
  cardBodyText: { fontSize: 14, color: colors.muted, lineHeight: 20 },
  palette: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  colorChip: { alignItems: "center", gap: 4 },
  colorSwatch: { width: 48, height: 48, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  colorName: { fontSize: 10, color: colors.night, fontWeight: "600" },
  colorHex: { fontSize: 9, color: colors.muted },
});
