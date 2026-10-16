import { Text, View } from "react-native";

export function ScreenHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <View className="gap-5 rounded-3xl bg-highlight p-6">
      <View className="flex-row items-center gap-2">
        <View className="h-2 w-2 rounded-full bg-primary" />
        <Text className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</Text>
      </View>
      <Text className="text-3xl font-semibold leading-10 tracking-tight text-foreground">{title}</Text>
      <Text className="text-sm leading-6 text-muted">{description}</Text>
      <View className="h-px w-12 bg-accent" />
    </View>
  );
}
