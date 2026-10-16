import { Text, View } from "react-native";

function StudyIllustration() {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" pointerEvents="none" className="h-44 items-center justify-center overflow-hidden">
      <View className="absolute h-36 w-36 rounded-full border border-primary/20" />
      <View className="absolute h-28 w-48 rounded-2xl border border-accent bg-highlight" style={{ transform: [{ rotate: "-12deg" }, { translateX: -12 }] }} />
      <View className="absolute h-28 w-48 gap-3 rounded-2xl bg-primary p-5" style={{ transform: [{ rotate: "7deg" }, { translateX: 10 }] }}>
        <View className="flex-row items-center justify-between"><Text className="text-xs font-bold tracking-widest text-primary-foreground">ONE GOOD IDEA</Text><Text className="text-lg text-primary-foreground">✦</Text></View>
        <View className="h-1.5 w-28 rounded-full bg-highlight" />
        <View className="h-1.5 w-20 rounded-full bg-highlight/40" />
      </View>
      <View className="absolute bottom-2 right-3 rounded-full border border-accent bg-background px-4 py-2" style={{ transform: [{ rotate: "-7deg" }] }}><Text className="text-xs font-semibold text-primary">A little clearer, every day.</Text></View>
      <Text className="absolute left-2 top-4 text-3xl text-primary">✦</Text>
    </View>
  );
}

export function ScreenHeading({ eyebrow, title, description, introduction = false }: { eyebrow: string; title: string; description: string; introduction?: boolean }) {
  return (
    <View className="overflow-hidden rounded-3xl border border-border bg-card">
      <View className="flex-row items-center justify-between border-b border-border px-6 py-4">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <View className="h-2 w-2 rounded-full bg-primary" />
          <Text className="flex-shrink text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</Text>
        </View>
        <Text className="ml-3 text-xl text-primary">✦</Text>
      </View>
      <View className="gap-4 px-6 pt-6 pb-5">
        <Text className={introduction ? "text-4xl font-bold leading-[46px] tracking-tight text-foreground" : "text-3xl font-semibold leading-10 tracking-tight text-foreground"}>{title}</Text>
        <Text className="text-sm leading-6 text-muted">{description}</Text>
      </View>
      {introduction ? <StudyIllustration /> : <View className="mx-6 mb-5 flex-row gap-1"><View className="h-1 w-10 rounded-full bg-primary" /><View className="h-1 w-3 rounded-full bg-accent" /><View className="h-1 w-3 rounded-full bg-highlight" /></View>}
      {introduction ? <View className="flex-row flex-wrap justify-between gap-3 bg-highlight px-6 py-4">{["01  Collect", "02  Understand", "03  Remember"].map(label => <Text key={label} className="text-xs font-medium text-primary">{label}</Text>)}</View> : null}
    </View>
  );
}
