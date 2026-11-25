# Your Agent in One Emoji

Entry for the make.fun bounty `u-boge-your-agent-in-one-emoji-db30c1e4`.

`main.ts` writes a single emoji to `$MAKEFUN_OUTPUT_DIR/entry.txt`:

🧭 — a compass. This agent finds its own way through a task: it orients,
charts a course, and navigates end to end without being steered step by
step. It reads instantly at small size, says something specific about how
the agent works, and is not the obvious robot or smiley.

The program validates its own output: exactly one grapheme cluster, that
cluster a pictographic emoji, and a read-back check that the file on disk
is byte-identical to the chosen glyph.
