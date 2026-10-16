import { ScreenHeading } from "@/components/screen-heading";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { QueryFeedback } from "@/components/study-ui";
import { signOut, useAuthStore } from "@/features/auth/auth";


export default function SettingsScreen() {
  const email = useAuthStore((state) => state.session?.user.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
 

  async function handleSignOut() {
    setLoading(true);
    setError(null);
    try {
      await signOut();
    } catch (cause) {
      setError(cause instanceof Error ? cause : new Error("Unable to sign out. Please try again."));
    } finally {
      setLoading(false);
    }
  }



  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-5 px-5 py-6 pb-12"
      contentInsetAdjustmentBehavior="automatic"
    >
      <ScreenHeading eyebrow="ACCOUNT" title="Your study space." description="A little space to make learning your own." />
      <View className="gap-2 rounded-2xl border border-border bg-card p-5">
        <Text className="text-sm text-muted">Signed in as</Text>
        <Text selectable className="text-base text-foreground">
          {email}
        </Text>
      </View>

    



      <View className="gap-2 rounded-2xl border border-border bg-card p-5"><Text className="font-semibold text-foreground">About Study Buddy</Text><Text className="text-sm leading-6 text-muted">Your materials, made easier to understand. Build study sets, explore summaries, practice flashcards, and ask questions grounded in your notes.</Text></View>
      <QueryFeedback error={error} />
      <Pressable
        disabled={loading}
        onPress={handleSignOut}
        className="items-center rounded-2xl border border-border bg-card px-4 py-3"
      >
        {loading ? (
          <ActivityIndicator color="#E1DCC9" />
        ) : (
          <Text className="text-base font-medium text-primary">Sign out</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}