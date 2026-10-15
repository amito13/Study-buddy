import {createAnthropic} from '@ai-sdk/anthropic';

import { env } from "../env";

const anthropicai = createAnthropic({
    apiKey: env.anthropicApiKey,
});

export const chatmodel = anthropicai.chat(env.chatModel)
export const embeddingModel = anthropicai.embeddingModel(env.embeddingModel);

export const chatModelId = env.chatModel