import { ActivityIndicator, Pressable, Text, View } from "react-native";

export function ActionButton({ title, onPress, disabled, loading }: { title: string; onPress: () => void; disabled?: boolean; loading?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled: disabled || loading, busy: loading }} disabled={disabled || loading} onPress={onPress} className="min-h-12 items-center justify-center rounded-2xl bg-primary px-5 py-4 disabled:opacity-40">{loading ? <ActivityIndicator color="#000000" /> : <Text className="font-semibold text-primary-foreground">{title}</Text>}</Pressable>;
}

export function QueryFeedback({ loading, error, onRetry }: { loading?: boolean; error?: Error | null; onRetry?: () => void }) {
  if (loading) return <View className="items-center gap-3 py-10"><ActivityIndicator color="#E1DCC9" /><Text className="text-muted">Loading your study material…</Text></View>;
  if (!error) return null;
  return <View accessibilityLiveRegion="polite" className="gap-3 rounded-3xl border border-border bg-card p-5"><Text selectable className="text-danger">{error.message}</Text>{onRetry ? <ActionButton title="Try again" onPress={onRetry} /> : null}</View>;
}

// Render the headings and lists used by the summary API without adding a native dependency.
export function StudyText({ content }: { content: string }) {
  return <View className="gap-3">{content.split("\n").filter(line => line.trim()).map((line, index) => {
    const heading = /^#{1,6}\s/.test(line);
    return <Text selectable key={index} className={heading ? "mt-3 text-xl font-semibold text-foreground" : "text-base leading-7 text-foreground"}>{line.replace(/^#{1,6}\s+/, "").replace(/^[-*]\s+/, "• ").replace(/\*\*(.*?)\*\*/g, "$1")}</Text>;
  })}</View>;
}
