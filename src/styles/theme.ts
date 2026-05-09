export const colors = {
  blush: "#F2C4CE",
  rose: "#E8829A",
  deepRose: "#C45C75",
  night: "#1C1018",
  nightSoft: "#2E1E26",
  cream: "#FDF6F0",
  muted: "#9E7D88",
  mutedLight: "#D4B8C0",
  surface: "#FFF8F5",
  border: "#EDD8DF",
  gold: "#C9A96E",
  white: "#FFFFFF",
  error: "#c0392b",
  errorBg: "#fdf0ee",
  success: "#27ae60",
} as const;

export const gradients = {
  primary: [colors.rose, colors.deepRose] as const,
  night: [colors.night, colors.nightSoft] as const,
  hero: [colors.blush + "60", colors.rose + "30"] as const,
};

export const radius = {
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
  "2xl": 18,
  "3xl": 20,
  full: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
} as const;
