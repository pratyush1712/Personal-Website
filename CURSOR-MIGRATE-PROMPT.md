# Project Prompt: Redesign Personal Website into a Cursor-Inspired AI-Native Portfolio Workspace

## Goal

Redesign my personal website from a traditional VS Code-themed portfolio into a modern Cursor-inspired, AI-native coding workspace UI.

The website has used a VS Code-inspired interface for several years. I want to evolve it into something that feels closer to modern AI coding tools like Cursor: cleaner, darker, more agentic, and more aligned with how software development feels in the age of AI-assisted programming.

This should still feel like a personal portfolio presented as an IDE/workspace. The goal is not to create a generic portfolio website. The goal is to modernize the current developer-portfolio-as-editor concept.

---

## Current Context

Current stack:

```txt
Next.js
React
TypeScript
Material UI
pnpm
```

Current UI concept:

* The site currently uses a VS Code-inspired shell.
* It has a left activity bar, explorer sidebar, editor tabs, markdown-like pages, and routed content.
* The root layout currently wraps the app in a `VSCodeLayout`-style shell.
* Existing content, routes, portfolio pages, links, resume access, dark/light mode behavior, and markdown/page structure should be preserved.

Important principle:

Do not rewrite the entire website from scratch. Refactor the existing layout incrementally and intentionally.

---

## Design Direction

Move the UI away from a classic VS Code clone and toward a Cursor-like dark editor workspace with an agentic development feel.

The updated site should feel like:

```txt
Cursor-inspired portfolio workspace
AI-native personal website
Modern developer cockpit
Interactive recruiter-facing portfolio shell
```

It should not feel like:

```txt
A generic landing page
A direct Cursor clone
A half-migrated VS Code theme
A fake SaaS dashboard
A heavy full-stack AI product
```

Preserve the existing “portfolio as an IDE” concept, but update the visual language and interaction model.

---

## Reference Inspiration

Use this repository as visual/interface inspiration:

```txt
https://github.com/code-with-antonio/polaris
```

Polaris can be used as inspiration for:

* Cursor-like IDE layout
* File explorer styling
* Split-pane workspace feel
* Agent/chat side panel concepts
* Editor-like visual hierarchy
* Dark, modern, AI-native interface patterns

Do not copy:

* backend architecture
* database setup
* authentication
* Convex
* Clerk
* Inngest
* full cloud IDE functionality
* WebContainer execution
* complex agent tooling

Only borrow frontend design ideas where useful.

---

# Phase 1: Inspect the Existing Codebase

Before making changes, inspect the current repo structure.

Identify the components responsible for:

* root layout shell
* current VS Code-style layout
* left sidebar/activity bar
* file explorer/tree
* editor tabs/open pages
* footer/status bar
* theme creation
* route/page definitions
* markdown/page rendering
* resume/contact/source links

Do not assume file paths blindly. Use the actual current structure.

Document briefly what files will be modified before implementing.

---

# Phase 2: Rename and Reframe the Layout

The current layout is VS Code-themed. Update the naming only where it makes sense.

Consider renaming:

```txt
VSCodeLayout
```

to one of:

```txt
CursorLayout
WorkspaceLayout
AgenticWorkspaceLayout
PortfolioWorkspaceLayout
```

Choose the name that best fits the existing codebase.

Guidelines:

* Rename only if it does not create unnecessary churn.
* Keep imports clean.
* Avoid breaking routes.
* Do not rename files just for aesthetics if the change becomes too large.
* Update comments/labels that explicitly say “VS Code” where the UI is no longer VS Code-themed.

---

# Phase 3: Redesign the Main Workspace Shell

Create a modern Cursor-inspired workspace shell.

Desktop layout should roughly be:

```txt
┌──────────────────────────────────────────────────────────────┐
│ Top command/title bar                                        │
├───────────────┬───────────────────────────────┬──────────────┤
│ Left Explorer │ Main Editor / Portfolio Page  │ Agents Panel │
│               │                               │              │
├───────────────┴───────────────────────────────┴──────────────┤
│                      footer/status bar                       │
└──────────────────────────────────────────────────────────────┘
```

Core requirements:

* The layout should feel like a modern editor workspace.
* The app background should be near-black in dark mode.
* Panels should have subtle contrast, not harsh VS Code blocks.
* Borders should be thin and muted.
* Spacing should be compact but readable.
* The main content should still be the visual focus.
* The layout must remain responsive.

Responsive behavior:

Desktop:

* left explorer visible
* main content visible
* right agents panel visible or toggleable

Tablet:

* right agents panel can collapse
* left explorer can shrink or collapse

Mobile:

* side panels should become drawers/toggleable panels
* main content should remain readable
* no horizontal overflow
* tabs and controls should not crowd the screen

---

# Phase 4: Replace the Traditional VS Code Activity Bar

The current site has a classic VS Code-like left activity icon rail. Redesign this.

Goal:

Move away from the traditional VS Code left activity bar and toward a cleaner Cursor-like layout.

Requirements:

* Remove, hide, or greatly reduce the narrow vertical activity bar.
* Do not rely on a tall icon-only navigation rail as the primary navigation.
* Move primary explorer controls to the top of the sidebar.
* If a minimal icon rail remains, it should feel intentional, modern, and subtle.
* Avoid the classic VS Code look of large stacked icons on the far left.

The sidebar should feel integrated into the workspace, not like a separate VS Code clone.

---

# Phase 5: Redesign the Left Explorer Sidebar

Create a Cursor-like explorer sidebar.

The sidebar should include top-level sections such as:

```txt
Open Editors
Portfolio Files
Projects
Experience
Education
Skills
Contact
```

The exact sections can be adjusted based on the current page/data structure.

Requirements:

* Use collapsible groups.
* Keep the existing routing/page system working.
* Clicking a portfolio file/page should navigate as before.
* Current selected page should have a clean active state.
* Hover states should be subtle.
* Text should be compact but readable.
* Use modern file/editor icons if already available.
* Avoid bright blue VS Code-style selections unless used very minimally.
* Prefer muted gray, off-white, and subtle accent states.

Possible structure:

```txt
OPEN EDITORS
  Home
  Projects
  Resume

PORTFOLIO FILES
  overview.md
  experience.md
  education.md
  projects.md
  skills.md

FEATURED PROJECTS
  Perfect Match
  HabitOS
  Personal Website
```

Do not overcomplicate the explorer. It should be useful, polished, and visually aligned with Cursor.

---

# Phase 6: Add a Modern Top Bar / Command Area

Add a Cursor-like top bar.

Possible contents:

* site/workspace name
* current page
* command/search affordance
* resume button
* GitHub/source link
* theme toggle
* agents panel toggle
* mobile sidebar toggle

Design expectations:

* Thin height
* Subtle border bottom
* Dark background
* Compact typography
* Modern command-palette-like input or button

Example visual text:

```txt
Pratyush Sudhakar / Portfolio Workspace
Search portfolio or ask agent...
Resume
GitHub
Theme
Agents
```

This does not need to implement a full command palette unless it is simple and useful. A visual command/search affordance is enough for this phase.

---

# Phase 7: Update the Main Editor / Content Area

Preserve the existing page rendering and content structure.

The main content area should feel like the editor surface.

Requirements:

* Existing pages/routes must continue to work.
* Existing content should remain accessible.
* Preserve markdown-like or page-like presentation.
* Update editor tab styling to feel more Cursor-like:

  * subdued tab background
  * cleaner active state
  * thin borders
  * muted inactive tabs
  * less classic VS Code blue
* Improve content spacing.
* Avoid making the editor area too cramped.
* Keep scroll behavior smooth and predictable.

If the current tab system is useful, keep it. If it creates too much old VS Code visual baggage, restyle it rather than removing functionality.

---

# Phase 8: Add the Right-Side Agents Panel

Add a right-side “Agents” panel inspired by Cursor’s AI/agent side window.

This should be a lightweight portfolio agent, not a full backend agent platform.

The panel should support both:

1. polished static UI when no LLM is configured
2. optional lightweight LLM chat when API configuration exists

---

## Agents Panel UI

The panel should include:

```txt
Header: Agents

Tabs:
- Portfolio Agent
- Optional additional local chats

Main sections:
- Active agent card
- Chat messages
- Suggested prompts
- Input box
- Send button
```

Default agent:

```txt
Name: Portfolio Agent
Status: Ready
Purpose: Ask about Pratyush’s projects, experience, research, skills, resume, and background.
```

Suggested starter prompts:

```txt
Summarize Pratyush’s background
What are his strongest projects?
Explain Perfect Match
What kind of roles is he a good fit for?
Show me his technical skills
What experience does he have with AI/backend/product work?
How can I contact him?
```

The panel should look useful even before the visitor sends a message.

---

# Phase 9: Add Optional Lightweight LLM Functionality

A visitor should be able to ask questions about me through the Portfolio Agent.

Important architecture constraints:

* Do not add a database.
* Do not add authentication.
* Do not store conversations on the server.
* Do not expose any LLM API key in the browser.
* Chat history should only be stored locally in the visitor’s browser using `sessionStorage` or `localStorage`.
* The actual LLM call must go through a server-side Next.js API route or server action.
* Keep the feature lightweight and portfolio-focused.

Recommended endpoint:

```txt
/api/portfolio-agent
```

Request body:

```ts
{
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
  currentPage?: string;
  selectedSection?: string;
}
```

Server-side behavior:

* Load portfolio context.
* Add a system prompt.
* Send the user’s messages and context to the LLM.
* Return the assistant response.
* Do not persist anything server-side.

The server should enforce:

* max message length
* max number of messages sent
* max response length
* graceful failure if no API key is configured
* graceful failure if the LLM request errors

If rate limiting is simple to add, add it. If it requires too much infrastructure, leave a clear TODO.

---

## LLM Provider

Use the simplest provider that fits the existing project.

Preferred options:

```txt
OpenAI API
or
Vercel AI SDK if already easy to add
```

Do not add a large dependency chain unless necessary.

Environment variable example:

```txt
OPENAI_API_KEY=
```

or another provider-specific key if chosen.

Important:

The API key must never be exposed client-side.

Do not use:

```txt
NEXT_PUBLIC_OPENAI_API_KEY
```

for private model calls.

---

# Phase 10: Local Chat Tabs

Allow visitors to create multiple local agent chats/tabs.

Requirements:

* Limit active chat tabs to 5 per browser session.
* Each tab should have:

  * local ID
  * title
  * messages
  * created timestamp
  * updated timestamp
* Store tab state locally in the browser.
* Use `sessionStorage` by default.
* `localStorage` is acceptable if there is a clear reason, but session-only storage is preferred.
* No server-side persistence.
* Add a way to close a tab.
* Add a way to create a new tab.
* If the visitor reaches 5 tabs, disable creating more and show:

```txt
Limit reached: 5 local agent tabs.
```

Suggested tab title behavior:

* New chats can start as `New Chat`.
* After the first user message, title can be generated from the first few words.
* Do not call the LLM just to title tabs.

---

# Phase 11: Portfolio Context for the Agent

Create a lightweight structured context source for the agent.

Preferred file:

```txt
src/utils/portfolioContext.ts
```

or another location that fits the repo structure.

The context should include:

```txt
bio
education
experience
projects
skills
research
awards
links
resume summary
contact information
```

Guidelines:

* Reuse existing website data/content where cleanly possible.
* Avoid manually duplicating large amounts of content if the repo already has structured data.
* Keep context concise enough to send with each LLM request.
* The LLM should answer only from this provided context.
* If information is not present, the LLM should say it does not see that information in the portfolio context.
* Do not invent dates, roles, awards, metrics, or contact details.

Possible context format:

```ts
export const portfolioContext = {
  name: "Pratyush Sudhakar",
  headline: "...",
  bio: "...",
  education: [...],
  experience: [...],
  projects: [...],
  skills: [...],
  links: {...}
};
```

---

# Phase 12: Portfolio Agent System Prompt

Use a system prompt similar to this on the server side:

```txt
You are Portfolio Agent, a helpful assistant embedded in Pratyush Sudhakar’s personal website.

Your job is to answer visitor questions about Pratyush using only the provided portfolio context.

Rules:
- Use only the portfolio context provided to you.
- Do not invent experience, projects, dates, awards, skills, metrics, links, or contact details.
- If the answer is not available in the context, say that you do not see that information in the portfolio context.
- Be concise, clear, and helpful.
- Write in third person unless the user specifically asks for first person wording.
- Help recruiters, collaborators, and visitors understand Pratyush’s background.
- When useful, guide visitors toward relevant sections such as Projects, Experience, Resume, GitHub, LinkedIn, or Contact.
- Do not claim to be Pratyush.
```

---

# Phase 13: Fallback Behavior

The site must not break if the LLM is not configured.

If no API key exists:

* The Agents panel should still render.
* Suggested prompts should still appear.
* The input can be disabled or show a clear message.
* Show a small message such as:

```txt
Portfolio Agent is not configured yet.
```

or:

```txt
Agent chat is currently unavailable, but you can still explore the portfolio sections.
```

Do not crash the page.

Do not fail the build.

---

# Phase 14: Theme and Visual System

Use a Cursor Dark+ inspired palette.

Dark mode direction:

```txt
App background: near black
Sidebar panels: slightly lighter black/gray
Editor surface: dark neutral
Borders: subtle gray
Primary text: off-white
Secondary text: muted gray
Accent: minimal, refined
```

Avoid:

* overusing bright VS Code blue
* harsh contrast
* large colorful UI blocks
* novelty animations
* cluttered dashboard styling

Light mode:

* Preserve light mode if it already exists.
* It does not need to be as visually emphasized as dark mode.
* It should remain readable and not broken.

---

# Phase 15: Accessibility and UX

Requirements:

* Keyboard-accessible buttons and inputs.
* Visible focus states.
* Proper `aria-label`s for icon buttons.
* Good contrast in dark mode.
* No tiny unreadable text.
* Chat input should submit on Enter.
* Shift+Enter should allow multiline input if multiline is implemented.
* Loading states should be clear.
* Error states should be understandable.
* Mobile layout should not trap the user in hidden panels.

---

# Phase 16: Implementation Guardrails

Do:

* Refactor incrementally.
* Preserve existing routes.
* Preserve existing content.
* Preserve current navigation behavior unless intentionally improved.
* Reuse Material UI where practical.
* Keep dependencies minimal.
* Keep the design polished and cohesive.
* Make the Agent panel feel useful even without LLM configuration.

Do not:

* Rewrite the entire app.
* Migrate the project to Tailwind.
* Add shadcn unless there is a very strong reason.
* Add authentication.
* Add a database.
* Store chats server-side.
* Expose API keys to the browser.
* Add WebContainer/code execution.
* Build a full Cursor clone.
* Break existing pages.
* Add fake AI behavior that pretends to be real.

---

# Phase 17: Suggested File/Component Plan

Adjust based on the actual repo structure after inspection.

Possible new or modified components:

```txt
WorkspaceLayout.tsx
TopCommandBar.tsx
ExplorerSidebar.tsx
OpenEditorsSection.tsx
PortfolioFileTree.tsx
EditorTabs.tsx
AgentsPanel.tsx
AgentTabs.tsx
AgentChat.tsx
AgentPromptSuggestions.tsx
AgentInput.tsx
```

Possible utilities/hooks:

```txt
portfolioContext.ts
useLocalAgentTabs.ts
agentStorage.ts
```

Possible API route:

```txt
src/app/api/portfolio-agent/route.ts
```

or the equivalent route path based on the current Next.js app structure.

---

# Phase 18: Acceptance Criteria

The redesign is successful if:

* The website no longer looks like a classic VS Code clone.
* The layout feels inspired by Cursor and modern AI coding tools.
* The left sidebar is cleaner and no longer depends on a heavy VS Code-style activity bar.
* Explorer controls live at the top of the sidebar.
* The main content still works as the portfolio editor surface.
* Existing pages, routing, links, and content still work.
* The right-side Agents panel exists on desktop.
* The Agents panel collapses gracefully on smaller screens.
* The Agents panel has polished static content and suggested prompts.
* If configured, the Portfolio Agent can answer questions using website/profile context.
* Chat conversations are stored only locally in the browser.
* Up to 5 local chat tabs can be created.
* No conversations are stored server-side.
* No API keys are exposed client-side.
* The site does not crash if no LLM API key is configured.
* The build passes.
* Formatting/linting pass or any existing lint issues are clearly documented.

---

# Phase 19: Final Checks

After implementation, run:

```bash
pnpm format
pnpm lint
pnpm build
```

If any command fails:

* Fix the issue if it is related to this change.
* If the failure is unrelated/pre-existing, document it clearly.

Final response should include:

* Summary of major UI changes
* Files changed
* Whether LLM functionality was implemented or only scaffolded
* How to configure the LLM API key
* Any follow-up polish ideas
* Any known limitations
