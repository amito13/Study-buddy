import { createAnthropic } from "@ai-sdk/anthropic";
import { env } from "../env";

const anthropic = createAnthropic({ apiKey: env.anthropicApiKey });

export const chatModel = anthropic.chat(env.chatModel);
export const chatModelId = env.chatModel;
