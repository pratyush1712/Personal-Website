"use client";
import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useLocalAgentTabs } from "@/utils/useLocalAgentTabs";
import { TOKENS } from "@/ui/Theme";
import AgentTabs from "./AgentTabs";
import AgentChat from "./AgentChat";
import AgentInput from "./AgentInput";
import AgentPromptSuggestions from "./AgentPromptSuggestions";

interface Props {
	onClose: () => void;
	currentPage?: string;
}

const UNAVAILABLE_MESSAGE =
	"Portfolio Agent isn't connected yet. You can still explore Pratyush's portfolio using the files in the explorer.";

const FAILURE_SNIPPETS = [
	"Portfolio Agent is not configured.",
	"Portfolio Agent isn't connected yet",
	"temporarily unavailable",
	"returned an empty response"
];

function isSuccessfulReply(text: string): boolean {
	const lower = text.toLowerCase();
	return !FAILURE_SNIPPETS.some(s => lower.includes(s.toLowerCase()));
}

/**
 * Ask the agent for a tight 3-5 word conversation title. Returns null on any failure so the
 * caller can keep the auto-derived fallback in place.
 */
async function generateTitle(firstUser: string, firstAssistant: string): Promise<string | null> {
	try {
		const res = await fetch("/api/portfolio-agent", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				messages: [
					{
						role: "user",
						content:
							"Generate a 3-5 word title for the following conversation. " +
							"Respond with ONLY the title — no quotes, no punctuation, no prefix like 'Title:'.\n\n" +
							`User: ${firstUser.slice(0, 400)}\nAssistant: ${firstAssistant.slice(0, 400)}`
					}
				]
			})
		});
		if (!res.ok) return null;
		const data = await res.json();
		const raw = typeof data?.reply === "string" ? data.reply.trim() : "";
		if (!raw) return null;
		// Strip any quotes/punctuation the model may add despite instructions
		const cleaned = raw
			.replace(/^["'`]+|["'`.]+$/g, "")
			.replace(/^title:\s*/i, "")
			.split(/\r?\n/)[0]
			.trim();
		if (!cleaned) return null;
		return cleaned.length > 34 ? `${cleaned.slice(0, 34)}…` : cleaned;
	} catch {
		return null;
	}
}

export default function AgentsPanel({ onClose, currentPage }: Props) {
	const {
		tabs,
		activeTab,
		activeId,
		hydrated,
		canCreate,
		createTab,
		closeTab,
		selectTab,
		appendMessage,
		setTabTitle
	} = useLocalAgentTabs();
	const [pendingMap, setPendingMap] = useState<Record<string, boolean>>({});
	// Track which tab IDs already had an AI title generated (or attempted) so we don't loop.
	const titledRef = useRef<Set<string>>(new Set());

	useEffect(() => {
		if (hydrated && tabs.length === 0) createTab();
	}, [hydrated, tabs.length, createTab]);

	function handleCloseTab(id: string) {
		const isLastTab = tabs.length === 1;
		titledRef.current.delete(id);
		closeTab(id);
		if (isLastTab) onClose();
	}

	async function send(text: string) {
		if (!activeTab) return;
		const id = activeTab.id;
		if (pendingMap[id]) return;
		// Cap to last 10 messages client-side so the body never exceeds the route's 32KB limit
		const outgoing = [...activeTab.messages, { role: "user" as const, content: text }].slice(-10);
		appendMessage(id, { role: "user", content: text });
		setPendingMap(m => ({ ...m, [id]: true }));
		try {
			const res = await fetch("/api/portfolio-agent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: outgoing, currentPage })
			});

			let errorMsg = UNAVAILABLE_MESSAGE;
			if (!res.ok) {
				try {
					const errJson = await res.json();
					if (errJson?.error) errorMsg = errJson.error;
				} catch {}
				throw new Error(errorMsg);
			}

			const data = await res.json();
			const reply = typeof data?.reply === "string" && data.reply.trim() ? data.reply : UNAVAILABLE_MESSAGE;
			appendMessage(id, { role: "assistant", content: reply });

			// Fire-and-forget: after the first successful exchange, ask the agent for a real title.
			if (!titledRef.current.has(id) && isSuccessfulReply(reply)) {
				titledRef.current.add(id);
				generateTitle(text, reply).then(title => {
					if (title) setTabTitle(id, title);
				});
			}
		} catch (err: any) {
			appendMessage(id, { role: "assistant", content: err.message || UNAVAILABLE_MESSAGE });
		} finally {
			setPendingMap(m => {
				const next = { ...m };
				delete next[id];
				return next;
			});
		}
	}

	const pendingActive = pendingMap[activeId ?? ""] ?? false;
	const isEmpty = !activeTab || activeTab.messages.length === 0;

	return (
		<Box
			component="aside"
			aria-label="Agents panel"
			sx={{
				width: 340,
				flexShrink: 0,
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderLeft: "1px solid",
				borderColor: theme => (theme.palette.mode === "dark" ? TOKENS.dark.border : TOKENS.light.border),
				backgroundColor: theme => (theme.palette.mode === "dark" ? TOKENS.dark.appBg : TOKENS.light.appBg),
				overflow: "hidden"
			}}>
			{/* ── Tab bar ── */}
			{hydrated && (
				<AgentTabs
					tabs={tabs}
					activeId={activeId}
					onSelect={selectTab}
					onClose={handleCloseTab}
					onCreate={createTab}
					canCreate={canCreate}
					pendingMap={pendingMap}
				/>
			)}

			{isEmpty ? (
				/*
				 * Empty state: input near the top, suggestions immediately below.
				 * The free space at the bottom mirrors Cursor's blank-chat layout.
				 */
				<Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflowY: "auto" }}>
					<AgentInput onSend={send} pending={pendingActive} />
					<AgentPromptSuggestions onSelect={send} />
				</Box>
			) : (
				/* Conversation: messages take the space, input pins to the bottom. */
				<>
					<AgentChat tab={activeTab} pending={pendingActive} />
					<AgentInput onSend={send} pending={pendingActive} />
				</>
			)}
		</Box>
	);
}
