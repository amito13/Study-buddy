import { Text, View } from "react-native";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View className="items-center gap-3 rounded-3xl border border-border bg-highlight px-6 py-10">
      <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-card"><Text className="text-2xl text-primary">＋</Text></View>
      <Text className="text-center text-base font-medium text-foreground">{title}</Text>
      <Text className="text-center text-sm leading-6 text-muted">{description}</Text>
    </View>
  );
}
