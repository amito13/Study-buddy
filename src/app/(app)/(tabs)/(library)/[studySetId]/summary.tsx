import { ScreenHeading } from "@/components/screen-heading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { EmptyState } from "@/components/empty-state";
import { ActionButton, QueryFeedback, StudyText } from "@/components/study-ui";
import { studySetKeys, useLatestSummary, useSources } from "@/features/study-sets/query";
import { generateSummary } from "@/lib/api-client";

export default function SummaryScreen() {
  const { studySetId } = useLocalSearchParams<{ studySetId: string }>();
  const client = useQueryClient();
  const summary = useLatestSummary(studySetId);
  const sources = useSources(studySetId);
  const ready = sources.data?.some(source => source.status === "ready");
  const generate = useMutation({ mutationFn: () => generateSummary(studySetId), onSuccess: () => client.invalidateQueries({ queryKey: studySetKeys.summary(studySetId) }) });
  return <><Stack.Screen options={{ title: "Summary" }} /><ScrollView className="flex-1 bg-background" contentContainerClassName="gap-6 px-5 py-6 pb-12" contentInsetAdjustmentBehavior="automatic">
    <ScreenHeading eyebrow="READ & UNDERSTAND" title="The big picture" description="Turn your sources into a focused guide to the key ideas." />
    <QueryFeedback loading={summary.isLoading} error={summary.error || sources.error} onRetry={() => { void summary.refetch(); void sources.refetch(); }} />
    {!summary.isLoading && !summary.error && !summary.data ? <EmptyState title="Your summary starts here" description={ready ? "Generate a guide from your processed sources." : "Add and process a source in your study set first."} /> : null}
    {summary.data ? <View className="gap-4 rounded-2xl border border-border bg-card p-5"><Text className="text-xs text-muted">Generated {new Date(summary.data.created_at).toLocaleDateString()}</Text><StudyText content={summary.data.content} /></View> : null}
    <QueryFeedback error={generate.error} />
    <ActionButton title={generate.isPending ? "Creating summary…" : summary.data ? "Regenerate summary" : "Generate summary"} loading={generate.isPending} disabled={!ready || summary.isLoading} onPress={() => generate.mutate()} />
  </ScrollView></>;
}
