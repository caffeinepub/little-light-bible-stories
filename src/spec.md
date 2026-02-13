# Specification

## Summary
**Goal:** Build the “Little Light Bible Stories” kids ebook experience with 20 Bible stories (starting from Creation), in-app reading, automatic audio narration, illustrations + coloring pages, and a single combined PDF download.

**Planned changes:**
- Implement an in-app ebook reader with a Table of Contents for exactly 20 ordered stories and a story view with next/previous navigation.
- Store and serve story metadata/content from a single Motoko backend actor, including stable story identifiers and query methods (list + fetch by id/slug/index).
- Add per-story audio narration playable in the story view with play/pause, restart, and progress display, with a clear fallback message if unsupported.
- Display one illustration image and one printable black-and-white coloring page image per story, shipped as static frontend assets.
- Add client-side “Download PDF” to generate one combined PDF (cover + all stories in order), including each story’s illustration and a clearly separated coloring page section; show an English error and allow retry on failure.
- Apply a cohesive, kid-friendly visual theme across the app (readable typography, high contrast, playful styling) that is not blue/purple-dominant.

**User-visible outcome:** Users can browse a table of contents, read any of the 20 stories in-app with illustrations, play automatic narration with basic controls, view/print coloring pages, and download a single combined PDF ebook containing the full set (cover + all stories with illustrations and coloring pages).
