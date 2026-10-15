import assert from "node:assert/strict";
import { test } from "node:test";
import { rankPassages, searchTerms } from "./text-search";

test("ignores prompt words and deduplicates keywords", () => {
  assert.deepEqual(searchTerms("Please explain the CPU and CPU scheduling"), ["cpu", "scheduling"]);
});
test("filter terms contain no PostgREST punctuation or wildcards", () => {
  assert.deepEqual(searchTerms("%CPU%,content.ilike.* memory_(allocation)"), ["cpu", "content", "ilike", "memory", "allocation"]);
});
test("ranks passages with more matching query terms first", () => {
  const chunks = [{ id: "a", content: "Memory management" }, { id: "b", content: "CPU scheduling controls CPU time" }, { id: "c", content: "CPU operations" }];
  assert.deepEqual(rankPassages(chunks, ["cpu", "scheduling"], 2).map(row => row.id), ["b", "c"]);
});
test("generic questions preserve context order without invalid scores", () => {
  const chunks = [{ id: "a", content: "Introduction" }, { id: "b", content: "Overview" }];
  assert.deepEqual(searchTerms("Can you give me a summary please?"), []);
  assert.deepEqual(rankPassages(chunks, [], 1), [{ ...chunks[0], similarity: 0 }]);
  assert.deepEqual(rankPassages([], [], 8), []);
});
