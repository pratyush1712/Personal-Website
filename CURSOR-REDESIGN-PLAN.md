# Final Locked Implementation Plan
## Cursor-Inspired Portfolio Workspace

This is the final, reconciled plan after GPT-5.5 reviewed the draft against the original
spec (`CURSOR-MIGRATE-PROMPT.md`). No code written yet.

### Reversals from earlier locked decisions (flagged for veto)
- **Rename:** "Full rename incl. files/dirs" → **minimal rename** (symbol only). Full rename
  was overengineering; the spec says "do not rename files just for aesthetics."
- **LLM:** "Scaffold only" → **real call when `OPENAI_API_KEY` is set** (zero new
  dependencies, plain `fetch`). This is spec Phase 9 compliance, not scope creep;
  scaffold-only under-delivered.

---

## 1. Final architecture decision

- **Incremental refactor** of the existing Next.js App Router + Material UI + Emotion-SSR
  app. No framework swap, no Tailwind, no shadcn, no new state library.
- The renamed client shell (`WorkspaceLayout`) stays the **single `"use client"` boundary**,
  owning: Emotion cache (`createCache`/`useServerInsertedHTML`), MUI theme, dark-mode state,
  open-tab state machine, and panel visibility. Everything else stays a server component.
- **Content & routing unchanged:** markdown stays in `public/readmes/`, served by the
  existing static `[slug]` route (`dynamicParams = false` + `generateStaticParams`). No new
  routed content.
- **LLM is optional and server-only:** one route `POST /api/portfolio-agent` calls OpenAI via
  plain `fetch` (no SDK dependency), gated on `OPENAI_API_KEY`, **fail-closed** when absent.
  Provider call isolated in one function for easy later swap.
- **Chat state is client-only:** `sessionStorage`, hardened storage utility, **max 5 tabs**,
  no server persistence.
- **Theme:** dark-mode default preserved (key `"darkMode"`), but the `theme.palette.mode`
  mutation bug is removed; theme derives solely from state.

---

## 2. Final component plan

**Naming rule:** rename only the `VSCodeLayout` **symbol** -> `WorkspaceLayout`. Keep all
existing **filenames** to avoid churn (none are "VSCode"-branded). New components get clear
names. This resolves the review's ambiguity concern by not introducing an ambiguous
`ExplorerSidebar`.

| Component / file | Action | Role |
|---|---|---|
| `HomeLayout/Layout.tsx` | **Modify** | Shell; export renamed `WorkspaceLayout`; rebuild grid; preserve cache/theme/tab logic |
| `HomeLayout/Sidebar.tsx` | **Remove** | VS Code icon rail retired (spec Phase 4); contents relocated |
| `HomeLayout/AppTree.tsx` | **Modify** | Serves the **PortfolioFileTree** role; collapsible groups; path-mismatch fix |
| `HomeLayout/AppButtons.tsx` | **Modify** | Serves the **EditorTabs** role; restyle; keep close/select logic |
| `HomeLayout/Footer.tsx` | **Modify** | Serves the **StatusBar** role; tone down VS Code blue |
| `HomeLayout/TopCommandBar.tsx` | **New** | Workspace name, page, search affordance (visual), Resume, GitHub, theme toggle, panel/sidebar toggles |
| `HomeLayout/ExplorerPanel.tsx` | **New** | Left panel container: Open Editors + Portfolio Files groups; renders the file tree |
| `HomeLayout/AgentsPanel.tsx` | **New** | Right panel shell + tab strip + active chat |
| `HomeLayout/AgentTabs.tsx` | **New** | Local tab strip (new/close, 5-cap UI) |
| `HomeLayout/AgentChat.tsx` | **New** | Message list + suggested prompts + loading/error live region |
| `HomeLayout/AgentInput.tsx` | **New** | Textarea, Enter-to-send, Shift+Enter newline, disabled while pending |
| `HomeLayout/AgentPromptSuggestions.tsx` | **New** | Static starter prompts |
| `utils/portfolioContext.ts` | **New (server-only)** | Curated, size-capped context builder |
| `utils/agentStorage.ts` | **New** | Hardened sessionStorage util (versioned, validated, 5-cap) |
| `utils/useLocalAgentTabs.ts` | **New** | React hook over `agentStorage` |
| `app/api/portfolio-agent/route.ts` | **New** | Server-only LLM endpoint |

---

## 3. Final file modification plan

- **`src/app/layout.tsx`** - update the single import `VSCodeLayout` -> `WorkspaceLayout`. No
  other change.
- **`src/components/HomeLayout/Layout.tsx`** - rename export; replace 3-`Grid` body with the
  new shell (top bar / explorer / editor / agents / status bar) driven by responsive queries
  + panel-visibility state; **preserve verbatim** the
  `createCache`+`useServerInsertedHTML`+`CacheProvider`+`ThemeProvider`+`CssBaseline
  enableColorScheme` block and the tab state machine; **fix** `handleThemeChange` (remove
  `theme.palette.mode = ...` mutation; theme via `useMemo(() => createTheme(darkMode),
  [darkMode])`); add `agentsOpen`/`explorerOpen`/`mobileDrawer` state.
- **`src/components/HomeLayout/Sidebar.tsx`** - delete; relocate theme toggle + source link to
  `TopCommandBar`. Social/professional link icons remain reachable via the top bar
  (professional) and the unchanged home page (full set).
- **`src/components/HomeLayout/AppTree.tsx`** - fix selection with
  `pathname.replace(/^\//, "")`; recolor to muted tokens (no bright-blue selection); keep
  `next/link href={route}` + `setVisiblePageIndexs`/`setSelectedIndex` wiring.
- **`src/components/HomeLayout/AppButtons.tsx`** - restyle tabs (subdued bg, thin borders,
  clean active); horizontal scroll on overflow; keep logic.
- **`src/components/HomeLayout/Footer.tsx`** - muted status bar using theme tokens.
- **`src/ui/Theme.tsx`** - Cursor Dark+ palette as named tokens; replace hardcoded
  `#1e1e1e`/`#007acc`; keep light mode readable; keep breakpoints object intact.
- **`src/app/globals.css`** - align CSS vars/glows to the new palette; add
  `prefers-reduced-motion` guard.
- **No change** to `[slug]/page.tsx`, `Markdown/*`, `BrainLayout/*`, `github/`, `founders/`,
  `brain/`, `page.tsx`, `links.tsx`, `pages.ts`, `api/contact/route.ts` (functionally). Light
  spacing/typography polish only on content if needed.
- Scrub any literal "VS Code" comments/labels in touched files.

---

## 4. Final phase breakdown

Each UI phase carries the **A11y checklist** (below). Site is shippable after **F**; **G** is
additive.

- **Phase A - Theme tokens.** Define palette tokens in `Theme.tsx`; update `globals.css`;
  reduced-motion. No structural change.
- **Phase B - Shell + symbol rename.** Rename `VSCodeLayout` -> `WorkspaceLayout`; rebuild
  grid with responsive regions; fix dark-mode mutation; preserve Emotion/tab logic.
  Checkpoint for review (highest risk).
- **Phase C - Top bar + retire rail.** Add `TopCommandBar`; delete `Sidebar.tsx`; rewire
  theme toggle + explorer/agents/mobile toggles.
- **Phase D - Explorer.** Add `ExplorerPanel` (Open Editors + Portfolio Files); modify
  `AppTree`; fix path normalization. **Featured Projects** group links **only** to the
  existing `/projects` route (and in-page anchors if present) - no new content/routes.
- **Phase E - Tabs + status bar.** Restyle `AppButtons` + `Footer`.
- **Phase F - Agents panel (static, no LLM).** Add panel, tabs, chat view, suggestions,
  input; wire `useLocalAgentTabs` + `agentStorage`; full local tab CRUD. With no key, send
  shows "not configured." **Ships without LLM.**
- **Phase G - LLM (live when configured).** Add `portfolioContext.ts` +
  `api/portfolio-agent/route.ts`; wire `AgentInput` send -> fetch -> render. Satisfies
  configured chat behavior; fail-closed otherwise.

### A11y checklist (apply per UI phase)
- `aria-label` on every icon button (theme, explorer/agents/mobile toggles, tab close, send,
  new chat).
- Visible `:focus-visible` outline using an accent token; no focus removal.
- Interactive elements are semantic `<button>`/`<a>` (new code), not click-only `Box`.
- Mobile drawers (MUI `Drawer`/`SwipeableDrawer`): focus trap, Escape to close, focus returns
  to trigger.
- Chat input: associated label, Enter submits, Shift+Enter newline, disabled while pending.
- Loading/error in `aria-live="polite"`.
- Dark-mode contrast >= 4.5:1 for text; `prefers-reduced-motion` honored.

---

## 5. Final API route design

`src/app/api/portfolio-agent/route.ts` - **reuses only the server-only env pattern** from the
contact route; implements its own stricter JSON validation (the contact route is not the
security model).

- **Method:** `POST` only -> others `405`.
- **Body size:** reject if `content-length` or read text length > **32 KB** -> `413`.
- **Parse:** `try/catch` -> invalid JSON `400` `{code:"bad_request"}`.
- **Schema:** `{ messages: {role:"user"|"assistant", content:string}[], currentPage?:string,
  selectedSection?:string }`.
- **Caps (hard):** <= **10 messages**/request (else trim to last 10); each `content` trimmed,
  non-empty, <= **2000 chars** (reject empty/whitespace-only -> `400`).
- **Rate limit:** in-memory fixed-window per-IP (~**10 req/min**), best-effort (per-instance,
  resets on cold start); documented `TODO` for durable limiting - **no DB/KV** added. Over
  limit -> `429` `{code:"rate_limited"}`.
- **No key:** if `!process.env.OPENAI_API_KEY` -> `503` `{code:"not_configured"}` (fail-closed,
  never crashes).
- **Provider call:** plain `fetch` to OpenAI Chat Completions; model
  `process.env.OPENAI_MODEL ?? "gpt-4o-mini"`; `max_tokens: 512`; system prompt (spec
  Phase 12) + curated context + capped messages. Response **hard-truncated** to a char
  backstop (~4000).
- **Errors:** provider/unknown failures -> generic `500`/`502` `{code:"server_error"}`;
  **never echo env, keys, or provider error bodies** to the client (log server-side only).
- **Success:** `200 { reply: string }`. **No persistence.**
- **Env:** `OPENAI_API_KEY` (required for live), optional `OPENAI_MODEL`. **Never**
  `NEXT_PUBLIC_*`. Documented in README + `.env.local`.

---

## 6. Final local chat tab design

- **Storage:** `sessionStorage`, versioned key `pa_agent_tabs_v1`.
- **Tab schema:** `{ id: string, title: string, messages: {role, content}[], createdAt:
  number, updatedAt: number }`.
- **`agentStorage.ts` guarantees:** SSR guard (`typeof window !== "undefined"`); `JSON.parse`
  in `try/catch`; **schema validation** on read; **corrupt/invalid -> reset** to empty;
  **5-tab cap enforced in the utility** (writes beyond 5 rejected), not just UI.
- **Tab limit UX:** at 5, "New" disabled + message `Limit reached: 5 local agent tabs.`
- **Titles:** start `New Chat`; after first user message, derive from first few words
  (slice) - **no LLM call** for titling.
- **Lifecycle:** create, close, switch; send disabled while a request is pending.

---

## 7. Final portfolio context design

`src/utils/portfolioContext.ts` - **server-only** (uses `fs`; never imported by client; only
the API route imports it).

- **Source reuse:** section list from `pages.ts`; body from existing `public/readmes/*.md`.
  No duplicated bio content.
- **Curated builder (not raw dump):** strip markdown noise - remove images, reduce
  `[text](url)` -> `text`, strip HTML tags, drop heading markers, collapse blank
  lines/whitespace.
- **Structure:** assemble `{ name, headline, bio, education, experience, affiliations,
  projects, skills, links, contact }` mapped from readmes + `links.tsx`.
- **Size cap:** total serialized context capped (~**8 KB**) so each request stays small;
  truncate longest sections first.
- **Grounding:** the system prompt instructs answer-only-from-context and "I don't see that in
  the portfolio context" when absent (spec Phase 12).

---

## 8. Final responsive behavior plan

Explicit `useMediaQuery` pixel queries (theme `breakpoints` object left intact for existing
`sx`):

- **Desktop >= 1200px:** Explorer + Editor + Agents all visible; Agents toggleable (collapse
  to reclaim width).
- **Tablet 768-1199px:** Explorer visible (collapsible); **Agents collapsed by default**,
  opens as an overlay/toggle.
- **Mobile < 768px:** Explorer and Agents become **temporary drawers/sheets** (MUI `Drawer`);
  **Editor full-width**; **tabs scroll horizontally**; **no horizontal page overflow**;
  top-bar controls don't crowd (overflow into menu if needed). Drawers: focus-trapped,
  Escape/back-drop closes, focus returns.

---

## 9. Final styling / theme plan

- **Tokens (dark):** app bg near-black, panels slightly lifted, editor surface dark-neutral,
  borders subtle gray, primary text off-white, secondary muted, **minimal accent** (no heavy
  VS Code blue).
- **Light mode:** preserved and **readability-checked**; secondary emphasis.
- **Theme correctness:** no mutation of `theme.palette.mode` in handlers; single source of
  truth (`darkMode` state -> `useMemo(createTheme)`); keep `CssBaseline enableColorScheme`.
- **Token usage:** components read palette tokens, not hardcoded hex (touch `AppButtons`,
  `AppTree`, `Footer`, new components).
- **Dark-mode init:** keep mount-effect init + `"darkMode"` key; accept a minor first-paint
  flash (a blocking inline script/cookie is **out of scope**).

---

## 10. Final testing / build checklist

- **Commands (spec Phase 19):** `pnpm format` -> `pnpm lint` -> `pnpm build`.
- **Routing/content:** `/`, `/overview`, `/education`, `/experience`, `/affiliations`,
  `/projects`, `/skills`, `/github`, `/founders`, `/brain` all load; markdown intact; tabs
  open/close; selection matches route.
- **Theme:** toggle works, persists across reload, no palette-mutation regression; light mode
  readable.
- **Responsive:** 360 / 768 / 1200 / 1440 px - drawers open/close + focus behavior; tab
  overflow scrolls; no horizontal overflow.
- **Agents (no key):** unset `OPENAI_API_KEY` -> panel + suggestions render; send shows "not
  configured"; **build passes; no crash.**
- **Agents (with key):** happy path returns a reply; grounded answers; "not in context"
  behavior.
- **API validation:** empty message, >2000 chars, >10 messages, non-POST, oversized body,
  rate-limit trip - all return correct codes; no key/provider details leaked.
- **Storage:** 5-tab cap (UI + util), corrupt-JSON reset, session-scoped persistence, titles
  without LLM.
- **A11y:** keyboard nav, visible focus, aria-labels, live-region updates, reduced motion.

---

## 11. Out of Scope (explicit)

Database; authentication; RAG/vector search; added analytics (existing GoogleAnalytics
untouched, none added); Convex/Clerk/Inngest; WebContainer/code execution; full command
palette (visual affordance only); multi-agent orchestration; fake/simulated AI responses;
**any** server-side chat persistence; new LLM dependency/SDK; new routed content (Featured
Projects links only to existing `/projects`); full directory/file rename; `NEXT_PUBLIC_*` LLM
key; no-flash theme via inline script/cookie.

---

## 12. Phase 1 (Phase A) starting instructions

1. In `src/ui/Theme.tsx`, introduce named Cursor Dark+ tokens (app/panel/editor surfaces,
   border, primary/secondary text, single accent) and route the existing `palette`/`components`
   overrides through them; replace hardcoded `#1e1e1e`/`#007acc`; verify light-mode values
   remain readable; leave the `breakpoints` object unchanged.
2. In `src/app/globals.css`, align CSS variables and the glow gradients to the new dark
   palette and add a `@media (prefers-reduced-motion: reduce)` block.
3. Do **not** alter layout structure, routing, or component files in this phase.
4. Run `pnpm format && pnpm lint && pnpm build`; confirm the app renders unchanged
   structurally with the new palette before starting Phase B.

---

```
Ready for implementation. Do not proceed until explicitly instructed.
```
