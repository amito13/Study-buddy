import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { EmptyState } from "@/components/empty-state";
import { ActionButton, QueryFeedback } from "@/components/study-ui";
import { studySetKeys, useLatestFlashcardDeck, useSources } from "@/features/study-sets/query";
import { generateFlashcards } from "@/lib/api-client";

export default function FlashcardsScreen() {
  const { studySetId } = useLocalSearchParams<{ studySetId: string }>();
  const client = useQueryClient();
  const deck = useLatestFlashcardDeck(studySetId);
  const sources = useSources(studySetId);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [count, setCount] = useState(12);
  const [finished, setFinished] = useState(false);
  const cards = deck.data?.cards ?? [];
  const card = cards[Math.min(index, cards.length - 1)];
  const generate = useMutation({ mutationFn: () => generateFlashcards(studySetId, count), onSuccess: async () => { setIndex(0); setFlipped(false); setFinished(false); await client.invalidateQueries({ queryKey: studySetKeys.flashcards(studySetId) }); } });
  function move(next: number) { setIndex(next); setFlipped(false); }
  return <><Stack.Screen options={{ title: "Flashcards" }} /><ScrollView className="flex-1 bg-background" contentContainerClassName="gap-5 p-6 pb-12" contentInsetAdjustmentBehavior="automatic">
    <View className="gap-2"><Text className="text-2xl font-bold text-foreground">A little practice. A lot remembered.</Text><Text className="text-base text-muted">Think of the answer, then tap the card to reveal it.</Text></View>
    <QueryFeedback loading={deck.isLoading} error={deck.error || sources.error} onRetry={() => { void deck.refetch(); void sources.refetch(); }} />
    {card && !finished ? <><Text className="text-center text-sm text-muted">Card {index + 1} of {cards.length}</Text><Pressable accessibilityRole="button" accessibilityLabel={flipped ? "Answer. Tap to show question" : "Question. Tap to reveal answer"} onPress={() => setFlipped(!flipped)} className="min-h-72 justify-center gap-6 rounded-3xl border border-border bg-card p-7"><Text className="text-center text-xs font-semibold uppercase tracking-widest text-primary">{flipped ? "Answer" : "Question"}</Text><Text selectable className="text-center text-2xl leading-9 text-foreground">{flipped ? card.back : card.front}</Text><Text className="text-center text-sm text-muted">Tap to {flipped ? "see question" : "reveal answer"}</Text></Pressable><View className="flex-row items-center justify-between gap-3"><ActionButton title="Previous" disabled={index === 0} onPress={() => move(index - 1)} /><ActionButton title={index === cards.length - 1 ? "Finish review" : "Next card"} onPress={() => index === cards.length - 1 ? setFinished(true) : move(index + 1)} /></View></> : finished ? <><EmptyState title="Review complete" description={`You reviewed ${cards.length} cards. Come back for another round to keep the ideas fresh.`} /><ActionButton title="Review again" onPress={() => { move(0); setFinished(false); }} /></> : !deck.isLoading && !deck.error ? <EmptyState title="Make it stick" description="Generate flashcards from your processed sources to start practicing." /> : null}
    <View className="gap-3 rounded-2xl border border-border p-4"><Text className="font-medium text-foreground">Cards to generate</Text><View className="flex-row gap-3">{[6, 12, 20].map(value => <Pressable key={value} accessibilityRole="button" accessibilityState={{ selected: count === value }} onPress={() => setCount(value)} className={`flex-1 items-center rounded-xl border p-3 ${count === value ? "border-primary bg-primary" : "border-border bg-card"}`}><Text className={count === value ? "font-semibold text-primary-foreground" : "text-foreground"}>{value}</Text></Pressable>)}</View><QueryFeedback error={generate.error} /><ActionButton title={cards.length ? "Generate a new deck" : "Generate flashcards"} loading={generate.isPending} disabled={!sources.data?.some(source => source.status === "ready") || deck.isLoading} onPress={() => generate.mutate()} /><Text className="text-sm text-muted">Requires at least one processed source. Your latest deck appears here.</Text></View>
  </ScrollView></>;
}
