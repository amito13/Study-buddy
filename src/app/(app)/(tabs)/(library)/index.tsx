import { ScreenHeading } from "@/components/screen-heading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";


import { QueryFeedback } from "@/components/study-ui";
import { EmptyState } from "@/components/empty-state";
import { StudySetCard } from "@/components/study-set-card";
import { createStudySet } from "@/features/study-sets/actions";
import { studySetKeys, useStudySets } from "@/features/study-sets/query";


export default function LibraryScreen() {
  const queryClient = useQueryClient();
  const { data: studySets, isLoading, error, refetch, isRefetching } = useStudySets();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const createMutation = useMutation({
    mutationFn:()=>createStudySet(title , description),
    onSuccess:()=>{
      queryClient.invalidateQueries({ queryKey: studySetKeys.all });
      setTitle("");
      setDescription("");
      setShowForm(false); 
    }
  })


  const listHeader = (
    <View className="gap-4 pb-4">
      <ScreenHeading eyebrow="YOUR PERSONAL STUDY SPACE" title={"Small steps.\nBig breakthroughs."} description="Gather your materials. Find the key ideas. Make what you learn stay with you." />
      <View className="flex-row items-center justify-between pt-3">
        <Text className="text-xl font-semibold text-foreground">Your collections</Text>
        <Text className="text-sm text-muted">{studySets?.length ?? 0} study sets</Text>
      </View>

      {showForm ? (
        <View className="gap-3 rounded-3xl border border-border bg-card p-5">
          <Text className="text-base font-medium text-foreground">＋  New study set</Text>
          <TextInput
            placeholder="Title"
            placeholderTextColor="#B3A58E"
            value={title}
            onChangeText={setTitle}
            className="rounded-2xl border border-border bg-input px-4 py-4 text-foreground"
          />
          <TextInput
            placeholder="Description (optional)"
            placeholderTextColor="#B3A58E"
            value={description}
            onChangeText={setDescription}
            multiline
            className="min-h-20 rounded-2xl border border-border bg-input px-4 py-4 text-foreground"
          />
          {createMutation.error ? (
            <Text selectable className="text-sm text-danger">
              {createMutation.error.message}
            </Text>
          ) : null}
          <View className="flex-row gap-2">
            <Pressable
              disabled={!title.trim() || createMutation.isPending}
              onPress={() => createMutation.mutate()}
              className="flex-1 items-center rounded-2xl bg-primary px-5 py-4 disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text className="font-semibold text-primary-foreground">Create</Text>
              )}
            </Pressable>
            <Pressable
              onPress={() => setShowForm(false)}
              className="items-center rounded-2xl border border-border px-4 py-3"
            >
              <Text className="text-foreground">Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={() => setShowForm(true)}
          className="items-center rounded-2xl bg-primary px-5 py-4"
        >
          <Text className="font-semibold text-primary-foreground">＋  New study set</Text>
        </Pressable>
      )}
    </View>
  );

  
  return (
    <FlatList
      className="flex-1 bg-background"
      data={studySets ?? []}
      keyExtractor={(item) => item.id}
      contentContainerClassName="gap-4 px-5 py-6 pb-12"
      contentInsetAdjustmentBehavior="automatic"
      refreshing={isRefetching}
      onRefresh={refetch}
      ListHeaderComponent={listHeader}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={isLoading || error ? <QueryFeedback loading={isLoading} error={error} onRetry={() => { void refetch(); }} /> :
        <EmptyState
          title="No study sets yet"
          description="Create your first study set, then add a PDF or note to get started."
        />
      }
      renderItem={({ item }) => <StudySetCard studySet={item} />}
    />
  );
}