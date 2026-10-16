import { Text, View } from "react-native";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="items-center gap-3 rounded-3xl border border-border bg-card px-6 py-10">
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" className="mb-3 h-20 w-24 items-center justify-center">
        <View className="absolute h-16 w-14 rounded-xl border border-accent bg-highlight" style={{ transform: [{ rotate: "-14deg" }, { translateX: -8 }] }} />
        <View className="h-16 w-14 items-center justify-center rounded-xl bg-primary" style={{ transform: [{ rotate: "9deg" }, { translateX: 8 }] }}><Text className="text-2xl text-primary-foreground">✦</Text></View>
      </View>
      <Text className="text-center text-base font-medium text-foreground">{title}</Text>
      <Text className="text-center text-sm leading-6 text-muted">{description}</Text>
    </View>
  );
}
