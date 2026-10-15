# Study Buddy backend

From `server/`, install dependencies with `bun install` and start with `bun run dev`.
The health endpoint is `GET /health`. Study routes require a Supabase bearer token.

## Anthropic-only AI setup

Set `ANTHROPIC_API_KEY` and `ANTHROPIC_CHAT_MODEL` in `server/.env`.
Claude generates summaries, flashcards, and chat responses using this key.
No Voyage or OpenAI key is required. Existing `VOYAGE_*` environment variables
are ignored and may be removed.

PDFs and notes are extracted and split into text chunks without generating
embeddings. Chat searches processed chunks by keywords, ranks matching passages,
and sends up to eight passages to Claude. This basic text search can miss
synonyms and paraphrases. Broad questions without matching terms fall back to
introductory passages. Summaries and flashcards use up to 24,000 characters of
source text, so large study sets may not be covered in full.

No additional search migration is required. The earlier Voyage migration is
optional legacy schema; existing vector columns can remain unused. Tap Retry on
sources that failed under the old Voyage setup to extract and save their text.

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and
`FIRECRAWL_API_KEY` are also read by the backend. Firecrawl is used for web URL
sources, not PDFs, notes, or Claude generation.

Set `EXPO_PUBLIC_API_URL` in the app's `.env` to an address reachable from your
device, for example `http://YOUR_COMPUTER_LAN_IP:3001`. Restart Expo after changing
that variable. The backend listens on all network interfaces.

Run `bunx tsc --noEmit -p tsconfig.json` to typecheck the backend and
`node --import tsx src/lib/text-search.test.ts` to test text retrieval ranking.
