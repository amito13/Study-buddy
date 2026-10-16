import { DarkTheme, type Theme } from "@react-navigation/native";

export const colors = {
  background: "#000000",
  foreground: "#E1DCC9",
  muted: "#B3A58E",
  border: "#412D15",
  card: "#1F150C",
  primary: "#E1DCC9",
  primaryForeground: "#000000",
  input: "#1F150C",
  danger: "#ffaaaa",
} as const;

export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.foreground,
    border: colors.border,
    notification: colors.primary,
  },
};