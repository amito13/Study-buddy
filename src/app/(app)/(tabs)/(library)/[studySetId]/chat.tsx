import { ScreenHeading } from "@/components/screen-heading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from "react-native";
import { EmptyState } from "@/components/empty-state";
import { ActionButton, QueryFeedback, StudyText } from "@/components/study-ui";
import { createConversation } from "@/features/study-sets/actions";
import { pickConversation, studySetKeys, useConversations, useMessages, useSources } from "@/features/study-sets/query";
import { sendChatMessage } from "@/lib/api-client";

export default function ChatScreen() {
  const { studySetId } = useLocalSearchParams<{ studySetId: string }>();
  const client = useQueryClient();
  const conversations = useConversations(studySetId);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const conversationId = createdId || pickConversation(conversations.data)?.id || "";
  const messages = useMessages(conversationId);
  const sources = useSources(studySetId);
  const [draft, setDraft] = useState("");
  const scroll = useRef<ScrollView>(null);
  const send = useMutation({
    mutationFn: async (text: string) => {
      let id = conversationId;
      if (!id) { const conversation = await createConversation(studySetId); id = conversation.id; setCreatedId(id); }
      await sendChatMessage(id, text);
      return id;
    },
    onSuccess: () => setDraft(""),
    onSettled: async (_data, _error) => {
      await client.invalidateQueries({ queryKey: ["conversations"] });
      await client.invalidateQueries({ queryKey: studySetKeys.conversations(studySetId) });
    },
  });
  const loading = conversations.isLoading || (!!conversationId && messages.isLoading);
  const error = conversations.error || messages.error || sources.error;
  return <><Stack.Screen options={{ title: "Study chat" }} /><KeyboardAvoidingView className="flex-1 bg-background" behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
    <ScrollView ref={scroll} className="flex-1" contentContainerClassName="gap-4 p-6" keyboardShouldPersistTaps="handled" onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
      <ScreenHeading eyebrow="THINK IT THROUGH" title="A little clarity." description="Explore your materials, one question at a time." />
      <Text className="text-sm leading-6 text-muted">Ask questions, untangle a concept, or get a new perspective on your sources. AI can make mistakes; check important details.</Text>
      <QueryFeedback loading={loading} error={error} onRetry={() => { void conversations.refetch(); if (conversationId) void messages.refetch(); void sources.refetch(); }} />
      {!loading && !error && !messages.data?.length ? <EmptyState title="Let’s work through it" description="Try “Explain the main concepts” or “What should I focus on for my exam?”" /> : null}
      {messages.data?.filter(message => message.role !== "system").map(message => <View key={message.id} className={`max-w-[95%] gap-2 rounded-2xl border border-border p-4 ${message.role === "user" ? "self-end bg-highlight" : "self-start bg-card"}`}><Text className="text-xs font-semibold text-primary">{message.role === "user" ? "You" : "Study Buddy"}</Text><StudyText content={message.content} /></View>)}
      {send.isPending ? <Text accessibilityLiveRegion="polite" className="text-sm text-primary">Study Buddy is thinking…</Text> : null}
      <QueryFeedback error={send.error} />
    </ScrollView>
    <View className="gap-3 rounded-t-3xl border-t border-border bg-card p-4"><TextInput accessibilityLabel="Message Study Buddy" placeholder="Ask about your materials…" placeholderTextColor="#E1DCC9" value={draft} onChangeText={setDraft} editable={!send.isPending} multiline maxLength={6000} style={{ maxHeight: 140, textAlignVertical: "top" }} className="min-h-12 rounded-2xl border border-border bg-input px-4 py-4 text-foreground" /><ActionButton title="Send message" loading={send.isPending} disabled={!draft.trim() || loading || !!error || !sources.data?.some(source => source.status === "ready")} onPress={() => send.mutate(draft.trim())} />{!sources.isLoading && !sources.data?.some(source => source.status === "ready") ? <Text className="text-xs text-muted">Process a source in this study set to start chatting.</Text> : null}</View>
  </KeyboardAvoidingView></>;
}
