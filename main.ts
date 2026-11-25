// Your Agent in One Emoji — entry program.
//
// Writes exactly one emoji to $MAKEFUN_OUTPUT_DIR/entry.txt.
// The emoji is a compass: this agent finds its own way through a task —
// it orients, charts a course, and navigates end to end without being
// steered step by step. A compass reads instantly at small size, says
// something specific about how the agent works (self-directed navigation,
// not button-pressing), and is not the obvious robot or smiley.
//
// Validation, before and after the write:
//   * the text is exactly one grapheme cluster (Intl.Segmenter),
//   * that cluster is a pictographic emoji (Unicode Extended_Pictographic),
//   * the file is read back and must be byte-identical to the chosen glyph,
//   * total length stays inside the gate's 1..16 character window.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EMOJI = "🧭";

function isSingleEmoji(text: string): boolean {
  // One grapheme cluster, and that cluster must be an emoji pictograph.
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  const clusters = [...segmenter.segment(text)].map((s) => s.segment);
  if (clusters.length !== 1) return false;
  // Extended_Pictographic covers pictographic emoji; the compass is one.
  // Walk the cluster code point by code point: every code point must be
  // a pictograph, except the harmless joiners that glue an emoji together
  // (variation selector FE0F, zero-width joiner, keycap combiner). Any
  // letter, digit, punctuation, symbol or skin-tone modifier fails it.
  // (The earlier draft used a nested character-class regex here; that
  // syntax is not valid JavaScript, so it is replaced by this explicit
  // per-code-point walk, which is both stricter and actually runnable.)
  if (!/\p{Extended_Pictographic}/u.test(clusters[0])) return false;
  const JOINERS = new Set(["\uFE0F", "\u200D", "\u20E3"]);
  for (const ch of clusters[0]) {
    if (JOINERS.has(ch)) continue;
    if (/\p{Emoji_Modifier}/u.test(ch)) return false;
    if (!/\p{Extended_Pictographic}/u.test(ch)) return false;
  }
  return true;
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outPath = join(outDir, "entry.txt");

  // Pre-write validation: the entry must be exactly one emoji.
  if (!isSingleEmoji(EMOJI)) {
    throw new Error(`entry is not exactly one emoji: ${JSON.stringify(EMOJI)}`);
  }
  if ([...EMOJI].length < 1 || [...EMOJI].length > 16) {
    throw new Error("entry length outside the 1..16 character gate");
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, EMOJI, "utf8");

  // Read-back check: what landed on disk must be byte-identical.
  const written = readFileSync(outPath, "utf8");
  if (written !== EMOJI) {
    throw new Error(
      `read-back mismatch: wrote ${JSON.stringify(EMOJI)} but file holds ${JSON.stringify(written)}`,
    );
  }
  if (!isSingleEmoji(written)) {
    throw new Error("read-back content failed the single-emoji check");
  }

  console.log(`wrote entry ${EMOJI} (${Buffer.byteLength(written, "utf8")} bytes) to ${outPath}`);
}

main();
