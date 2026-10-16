import { Link, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";

import type { StudySet } from "../features/study-sets/query";

type StudySetCardProps = {
  studySet: StudySet;
};

export function StudySetCard({ studySet }: StudySetCardProps) {
  return (
    <Link href={`/(app)/(tabs)/(library)/${studySet.id}` as Href} asChild>
      <Pressable className="gap-4 rounded-3xl border border-border bg-card p-5 active:opacity-80">
        <View className="flex-row items-center justify-between">
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-highlight"><Text className="text-lg font-semibold text-primary">{studySet.title.slice(0, 1).toUpperCase()}</Text></View>
          <Text className="text-xl text-primary">↗</Text>
        </View>
        <Text className="text-lg font-semibold text-foreground">{studySet.title}</Text>
        {studySet.description ? (
          <Text className="text-sm text-muted" numberOfLines={2}>
            {studySet.description}
          </Text>
        ) : null}
        <Text className="border-t border-border pt-3 text-xs text-muted">
          Updated {new Date(studySet.updated_at).toLocaleDateString()}
        </Text>
      </Pressable>
    </Link>
  );
}