import { Link, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { StudySet } from "../features/study-sets/query";

type StudySetCardProps = {
  studySet: StudySet;
  index?: number;
};

export function StudySetCard({ studySet, index = 0 }: StudySetCardProps) {
  return (
    <Link href={`/(app)/(tabs)/(library)/${studySet.id}` as Href} asChild>
      <Pressable accessibilityRole="button" className="overflow-hidden rounded-3xl border border-border bg-card active:opacity-80">
        <View className="flex-row">
          <View className="w-2 bg-highlight" />
          <View className="flex-1 gap-4 p-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="h-12 w-10 items-center justify-center rounded-lg border border-accent bg-highlight" style={{ transform: [{ rotate: index % 2 ? "6deg" : "-6deg" }] }}><Text className="text-xl font-bold text-primary">{studySet.title.slice(0, 1).toUpperCase()}</Text></View>
                <Text className="text-xs font-semibold tracking-widest text-muted">COLLECTION {String(index + 1).padStart(2, "0")}</Text>
              </View>
              <View className="h-9 w-9 items-center justify-center rounded-full bg-primary"><Text className="text-lg text-primary-foreground">↗</Text></View>
            </View>
            <Text className="text-2xl font-semibold tracking-tight text-foreground">{studySet.title}</Text>
            {studySet.description ? <Text className="text-sm leading-6 text-muted" numberOfLines={2}>{studySet.description}</Text> : null}
            <View className="flex-row flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
              <Text className="text-xs text-muted">Updated {new Date(studySet.updated_at).toLocaleDateString()}</Text>
              <Text className="text-xs font-semibold text-primary">Open collection →</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
