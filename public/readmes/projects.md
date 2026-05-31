# 🧪 Projects

---

### [Personal Agent Homebase](https://github.com/pratyush1712/Personal-Agent-Homebase) 🔗

[`Code 🔗`](https://github.com/pratyush1712/Personal-Agent-Homebase) | _Technologies:_ `Python` `Docker` `LiteLLM` `Mem0` `Qdrant` `Caddy` `GitHub Actions` `AWS Lightsail` `Grafana` `Loki`

Self-hosted AI orchestration infrastructure for a sustained coding workflow, built around one premise: treat LLM inference like a scarce resource, not a convenience.

-   8-tier cost hierarchy across 12+ providers with ordered fallback chains; context-window exhaustion routes separately from general provider failure - different failure modes, different recovery paths.
-   14 role-typed agents (Sisyphus, Momus, Oracle, etc.), each with tuned temperature, system prompt constraints, and a model sequence - Momus intentionally runs on the free GLM model since adversarial brainstorming benefits from volume over quality.
-   Persistent vector memory via Mem0 + Qdrant (1536-dim embeddings) across sessions.
-   GitHub Actions CI/CD to AWS Lightsail VPS with preflight `bash -n` validation and commit-level rollback; `docker compose down -v` is explicitly forbidden in CI.

---

### [ADHD-Friendly Text Enhancer](https://chromewebstore.google.com/detail/adhd-friendly-text-enhancer/mnagpckgpcigjbenomcdpfifellpehnb) 🔗

[`Code 🔗`](https://github.com/pratyush1712/adhd-friendly-text-enhancer) | _Technologies:_ `JavaScript` `HTML` `CSS` `Chrome APIs`

Chrome extension applying bionic reading transforms to long-form web pages - built for my own ADHD, found out 80+ other people had the same problem.

-   Bolds the first few letters of each word, highlights alternating sentences; injected via content script with a toggle in the popup.
-   80+ active users from organic Chrome Web Store discovery.

---

### [TimeBite](https://timebite.herokuapp.com/) 🔗

[`Code 🔗`](https://github.com/pratyush1712/Timebite-Backend/) | _Technologies:_ `Flask` `Google OR-Tools` `HTML/CSS/JavaScript` `Docker` `GCP`

Schedule optimization web app - to-do list in, OR-Tools optimized ordering out, exported to Google Calendar.

-   Schedules tasks as a MILP with energy levels and context-switching costs modeled as constraints, not just minimizing total time.
-   The interesting problem: what does it mean to optimize a schedule for a human rather than a machine.

---

### [DTI GPT](https://github.com/cornell-dti/mlmn-findoc/)

[`Code 🔗`](https://github.com/cornell-dti/mlmn-findoc/) | _Technologies:_ `Supabase` `Next.js` `Flask` `LangChain` `Vector DB` `Azure`

RAG pipeline over Cornell course syllabi - natural language queries against PDFs, served from an Azure-hosted REST API at ~50ms average latency.

-   The non-trivial part was retrieval quality - vector similarity and actual relevance don't always align; chunking strategy and reranking required significant iteration to make responses useful.

---

### [Legacy Support Adjudication - Published OSS Agent Skill](https://github.com/pratyush1712/legacy-support-adjudication-skill) 🔗

_Technologies:_ `Python` `Semgrep` `Shell` `YAML` `Claude Code Skills API`

Published OSS agent skill for code-review agents deciding whether backward-compatibility code is safe to remove - built because agents routinely approve risky deletions based only on local static search.

-   5-verdict framework (RETAIN → DEPLOY OBSERVABILITY → DEPRECATE → QUARANTINE → REMOVE) with evidence scored across code, data, clients, configs, runtime telemetry, and owner history.
-   Core insight: absence of local references ≠ absence of consumers - old mobile clients, persisted rows, delayed jobs, and cached payloads all need separate evidence traces.
-   Tooling: no-dependency Python scanner, Semgrep rules for compatibility patterns, git-archaeology shell script, and an eval suite for output quality iteration.
-   Published to Skills CLI: `npx skills add pratyush1712/legacy-support-adjudication-skill`.

---

### [BrainDump - AI Thought-Mapping Canvas](https://braindump-zeta.vercel.app/) 🔗

[`Code 🔗`](https://github.com/pratyush1712/braindump) | _Technologies:_ `React 18` `TypeScript` `ReactFlow` `Socket.IO` `Node.js` `Express` `OpenAI GPT-4` `text-embedding-ada-002` `IndexedDB` `Vite`

AI-powered infinite canvas - freeform thoughts go in, the backend classifies and connects them automatically in real time.

-   GPT-4 for auto-categorization and roadmap generation; text-embedding-ada-002 for similarity scoring across 4 typed edge types (semantic, entity, temporal, causal) rendered in ReactFlow.
-   Socket.IO pipeline between React frontend and Node/Express backend - processing is async but fast enough that results land before the next thought.
-   IndexedDB for client-side persistence; no server-side storage by default.

---

### [Personal Blog & Private Video Platform](https://private.pratyushsudhakar.com/)

[`Code 🔗`](https://github.com/pratyush1712/personal-website/) | _Technologies:_ `Next.js 14` `Apollo` `GraphQL` `MongoDB` `Mux`

Private blog and live video sharing platform - Mux for streaming from a personal camera, GraphQL via Apollo for content querying.

---

### [Harmonious Sounds](https://nginx-devops-pratyush1712.cloud.okteto.net/)

[`Code 🔗`](https://github.com/pratyush1712/react-express/) | _Technologies:_ `React.js` `Express.js` `Docker` `Kubernetes` `GitHub Actions` `Nginx`

3-service microservices app (client / Express API / ML model) behind Nginx on Kubernetes, with GitHub Actions CI/CD - lint, build, containerize, deploy on merge.

---

### [Cornell Wushu Club Website](https://cornellwushu.github.io) 🔗

[`Code 🔗`](https://github.com/cornellwushu/cornellwushu.github.io/) | _Technologies:_ `React.js` `AWS Amplify` `AWS DynamoDB` `AWS IVS`

Rebuilt from scratch as VP - many-to-many member/event model on DynamoDB, live streaming via AWS IVS, CI/CD that auto-deploys on database writes.

---

### [CaseOwl](https://caseowl.in/) 🔗

_Technologies:_ `React` `Redux` `AWS Lambda` `AWS S3` `AWS Cognito`

Document and task management for Indian lawyers - S3 + Cognito with access control and audit trail requirements specific to legal workflows.

---

### [Boss Mode - Focus Timer](https://github.com/pratyush1712/)

_Technologies:_ `React Native` `Expo` `MongoDB Realm`

Cross-platform focus timer and task tracker with offline-first sync via MongoDB Realm - built on the premise that the user's main problem is starting, not organizing.

---

### [Wi-Find](https://github.com/Archit404Error/WiFindMobile/)

[`Backend 🔗`](https://github.com/Archit404Error/WiFindBackend/) | _Technologies:_ `React Native` `Expo` `Node.js` `MongoDB`

Crowdsourced wifi quality map for Cornell's ~20,000 students - aggregates user-reported location and bandwidth data, clusters it, and surfaces a campus-wide signal map.

---

### [Face Detect](https://cornell-detection.herokuapp.com/) 🔗

[`Code 🔗`](https://github.com/pratyush1712/face-detection/) | _Technologies:_ `Flask` `OpenCV` `Haar Cascades` `React` `Docker`

Flask backend running OpenCV Haar Cascade face/eye detection on webcam frames, React frontend - built to understand server-side image processing pipelines end to end.
