import { useAuthStore } from "@/features/auth/auth";
import { supabase } from "@/utils/supabase";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type ChunkMatch = { id: string; content: string; similarity: number };

async function apiPost<T>(path: string, body: unknown = {}): Promise<T> {
  if (!API_URL) throw new Error("EXPO_PUBLIC_API_URL is not set");

  const { data } = await supabase.auth.getSession();
  const token =
    data.session?.access_token ||
    useAuthStore.getState().session?.access_token;

  if (!token) throw new Error("Not authenticated");

  let res: Response;
  try {
    res = await fetch(`${API_URL.replace(/\/+$/, "")}${path}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Access-Token": token,
    },
    body: JSON.stringify(body),
    });
  } catch {
    const address = new URL(API_URL).origin;
    throw new Error(`Cannot reach the study server at ${address}. Check that the backend is running and your phone can reach this address.`);
  }

  if (!res.ok) {
    const body = await res.text();
    let message = res.status === 404
      ? "API endpoint not found. Check the API URL and restart the backend."
      : `Request failed (${res.status}). Please try again.`;
    try {
      const parsed: unknown = JSON.parse(body);
      if (parsed && typeof parsed === "object" && "error" in parsed && typeof parsed.error === "string") {
        message = parsed.error;
      }
    } catch {
      // Proxies and missing routes may return HTML instead of an API error.
    }
    throw new Error(message);
  }

  return res.json();
}

export function processSource(sourceId: string) {
  return apiPost<{ status: string; chunkCount: number }>(
    `/sources/${sourceId}/process`,
  );
}

export function generateSummary(studySetId: string) {
  return apiPost<{ id: string; content: string }>(
    `/study-sets/${studySetId}/summary`,
  );
}

export function generateFlashcards(studySetId: string, count?: number) {
  return apiPost<{
    deckId: string;
    cards: { front: string; back: string }[];
    isPro: boolean;
    limit: number;
  }>(`/study-sets/${studySetId}/flashcards`, { count });
}

export function sendChatMessage(conversationId: string, message: string) {
  return apiPost<{ reply: string; sources: ChunkMatch[] }>(
    `/conversations/${conversationId}/chat`,
    { message },
  );
}