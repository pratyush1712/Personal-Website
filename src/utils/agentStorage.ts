// Client-only persistence for local agent chat tabs. Stored in sessionStorage (per the spec:
// session-scoped, no server persistence), behind a versioned key, with schema validation and
// corrupt-storage recovery. The 5-tab cap is enforced here, not just in the UI.

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
	role: ChatRole;
	content: string;
}

export interface AgentTab {
	id: string;
	title: string;
	messages: ChatMessage[];
	createdAt: number;
	updatedAt: number;
}

const STORAGE_KEY = "pa_agent_tabs_v1";
export const MAX_TABS = 5;
export const DEFAULT_TITLE = "New Chat";

function isMessage(value: unknown): value is ChatMessage {
	if (typeof value !== "object" || value === null) return false;
	const m = value as Record<string, unknown>;
	return (m.role === "user" || m.role === "assistant") && typeof m.content === "string";
}

function isTab(value: unknown): value is AgentTab {
	if (typeof value !== "object" || value === null) return false;
	const t = value as Record<string, unknown>;
	return (
		typeof t.id === "string" &&
		typeof t.title === "string" &&
		Array.isArray(t.messages) &&
		t.messages.every(isMessage) &&
		typeof t.createdAt === "number" &&
		typeof t.updatedAt === "number"
	);
}

export function loadTabs(): AgentTab[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.sessionStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) throw new Error("corrupt: expected an array");
		return parsed.filter(isTab).slice(0, MAX_TABS);
	} catch {
		// Corrupt / unreadable storage — reset rather than crash.
		try {
			window.sessionStorage.removeItem(STORAGE_KEY);
		} catch {
			/* ignore */
		}
		return [];
	}
}

export function saveTabs(tabs: AgentTab[]): void {
	if (typeof window === "undefined") return;
	try {
		window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tabs.slice(0, MAX_TABS)));
	} catch {
		/* sessionStorage unavailable or full — non-fatal, chat just won't persist */
	}
}

export function createId(): string {
	try {
		if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	} catch {
		/* ignore */
	}
	return `tab-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

export function newTab(): AgentTab {
	const now = Date.now();
	return { id: createId(), title: DEFAULT_TITLE, messages: [], createdAt: now, updatedAt: now };
}

// Title derived from the first user message — no LLM call (per the spec).
export function deriveTitle(content: string): string {
	const words = content.trim().split(/\s+/).slice(0, 6).join(" ");
	if (!words) return DEFAULT_TITLE;
	return words.length > 34 ? `${words.slice(0, 34)}…` : words;
}
