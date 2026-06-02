"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useLocalAgentTabs } from "@/utils/agents/useLocalAgentTabs";
import { TOKENS } from "@/ui/Theme";
import AgentTabs from "./AgentTabs";
import AgentChat from "./AgentChat";
import AgentInput from "./AgentInput";
import AgentPromptSuggestions from "./AgentPromptSuggestions";
import ResizeHandle from "./ResizeHandle";
import { useResizableWidth } from "@/utils/useResizableWidth";
import {
	consumeAgentRateLimit,
	formatResetDistance,
	getAgentRateLimitSnapshot,
	type RateLimitSnapshot
} from "@/utils/agents/agentRateLimit";
import { readAgentResponse } from "@/utils/agents/agentStreaming";

interface Props {
	onClose: () => void;
	currentPage?: string;
	/** When true, render a drag-to-resize handle (inline desktop layout only). */
	resizable?: boolean;
}

const MIN_WIDTH = 280;
const MAX_WIDTH = 560;
const DEFAULT_WIDTH = 380;

const UNAVAILABLE_MESSAGE =
	"Portfolio Agent is temporarily unavailable. You can still explore Pratyush's work from the files on the left.";

const STATUS_COPY = {
	connecting: "Reading portfolio context…",
	streaming: "Writing response…",
	stopping: "Stopping response…"
} as const;

type PendingState = {
	status: keyof typeof STATUS_COPY;
};

function isSuccessfulReply(text: string): boolean {
	const lower = text.toLowerCase();
	return ![
		"portfolio agent is not configured",
		"portfolio agent is temporarily unavailable",
		"portfolio agent returned an empty response",
		"hourly message limit reached"
	].some(snippet => lower.includes(snippet));
}

function titleFromPrompt(prompt: string): string {
	const cleaned = prompt
		.replace(/[^a-zA-Z0-9\s-]/g, "")
		.replace(/\s+/g, " ")
		.trim();
	const words = cleaned.split(" ").filter(Boolean).slice(0, 5);
	const title = words.join(" ") || "New chat";
	return title.length > 34 ? `${title.slice(0, 34)}…` : title;
}

export default function AgentsPanel({ onClose, currentPage, resizable = false }: Props) {
	const { width, isDragging, startDragging, onKeyDown } = useResizableWidth({
		storageKey: "agentsWidth",
		defaultWidth: DEFAULT_WIDTH,
		minWidth: MIN_WIDTH,
		maxWidth: MAX_WIDTH,
		side: "left"
	});
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

	const [pendingMap, setPendingMap] = useState<Record<string, PendingState>>({});
	const [streamingMap, setStreamingMap] = useState<Record<string, string>>({});
	const [rateLimit, setRateLimit] = useState<RateLimitSnapshot | null>(null);
	const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
	const titledRef = useRef<Set<string>>(new Set());

	useEffect(() => {
		if (hydrated && tabs.length === 0) createTab();
	}, [hydrated, tabs.length, createTab]);

	useEffect(() => {
		setRateLimit(getAgentRateLimitSnapshot());
	}, []);

	useEffect(() => {
		if (!rateLimit?.limited) return;
		const timer = window.setInterval(() => setRateLimit(getAgentRateLimitSnapshot()), 30_000);
		return () => window.clearInterval(timer);
	}, [rateLimit?.limited]);

	function handleCloseTab(id: string) {
		const isLastTab = tabs.length === 1;
		titledRef.current.delete(id);
		abortControllersRef.current.get(id)?.abort();
		abortControllersRef.current.delete(id);
		setStreamingMap(m => {
			const next = { ...m };
			delete next[id];
			return next;
		});
		setPendingMap(m => {
			const next = { ...m };
			delete next[id];
			return next;
		});
		closeTab(id);
		if (isLastTab) onClose();
	}

	const stopActiveResponse = useCallback(() => {
		if (!activeId) return;
		const controller = abortControllersRef.current.get(activeId);
		if (!controller) return;
		setPendingMap(m => ({ ...m, [activeId]: { status: "stopping" } }));
		controller.abort();
	}, [activeId]);

	async function send(text: string) {
		if (!activeTab) return;
		const id = activeTab.id;
		if (pendingMap[id]) return;

		const currentLimit = getAgentRateLimitSnapshot();
		if (currentLimit.limited) {
			setRateLimit(currentLimit);
			return;
		}

		const consumed = consumeAgentRateLimit();
		setRateLimit(consumed);

		const outgoing = [...activeTab.messages, { role: "user" as const, content: text }].slice(-10);
		const controller = new AbortController();
		abortControllersRef.current.set(id, controller);

		appendMessage(id, { role: "user", content: text });
		if (!titledRef.current.has(id)) {
			titledRef.current.add(id);
			setTabTitle(id, titleFromPrompt(text));
		}

		setStreamingMap(m => ({ ...m, [id]: "" }));
		setPendingMap(m => ({ ...m, [id]: { status: "connecting" } }));

		let accumulated = "";

		try {
			const res = await fetch("/api/portfolio-agent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: outgoing, currentPage, stream: true }),
				signal: controller.signal
			});

			accumulated = await readAgentResponse(res, {
				onChunk: chunk => {
					accumulated += chunk;
					setPendingMap(m => ({ ...m, [id]: { status: "streaming" } }));
					setStreamingMap(m => ({ ...m, [id]: accumulated }));
				}
			});

			const reply = accumulated.trim() || UNAVAILABLE_MESSAGE;
			appendMessage(id, { role: "assistant", content: reply });

			if (!isSuccessfulReply(reply)) {
				setRateLimit(getAgentRateLimitSnapshot());
			}
		} catch (err) {
			if (err instanceof DOMException && err.name === "AbortError") {
				if (accumulated.trim()) {
					appendMessage(id, { role: "assistant", content: `${accumulated.trim()}\n\n_Response stopped._` });
				} else {
					appendMessage(id, { role: "assistant", content: "Response stopped." });
				}
			} else {
				const message = err instanceof Error && err.message ? err.message : UNAVAILABLE_MESSAGE;
				appendMessage(id, { role: "assistant", content: message });
			}
		} finally {
			abortControllersRef.current.delete(id);
			setStreamingMap(m => {
				const next = { ...m };
				delete next[id];
				return next;
			});
			setPendingMap(m => {
				const next = { ...m };
				delete next[id];
				return next;
			});
		}
	}

	const pendingActive = activeId ? Boolean(pendingMap[activeId]) : false;
	const activeStatus = activeId && pendingMap[activeId] ? STATUS_COPY[pendingMap[activeId].status] : undefined;
	const activeStreamingReply = activeId ? (streamingMap[activeId] ?? "") : "";
	const isEmpty = !activeTab || activeTab.messages.length === 0;
	const pendingBooleanMap = useMemo(
		() => Object.fromEntries(Object.keys(pendingMap).map(id => [id, true])),
		[pendingMap]
	);

	const usageLabel = rateLimit
		? `${rateLimit.remaining}/${rateLimit.limit} messages left this hour`
		: "Enter to send · Shift+Enter for newline";
	const limitNotice = rateLimit?.limited
		? `Hourly limit reached. Try again in ${formatResetDistance(rateLimit.resetAt)}.`
		: undefined;
	const inputDisabled = Boolean(limitNotice);

	return (
		<Box
			component="aside"
			aria-label="Agents panel"
			sx={{
				position: "relative",
				width: resizable ? width : { xs: "100vw", sm: DEFAULT_WIDTH },
				maxWidth: "100vw",
				flexShrink: 0,
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderLeft: "1px solid",
				borderColor: theme => (theme.palette.mode === "dark" ? TOKENS.dark.border : TOKENS.light.border),
				backgroundColor: theme => (theme.palette.mode === "dark" ? TOKENS.dark.appBg : TOKENS.light.appBg),
				overflow: "hidden"
			}}>
			{hydrated && (
				<AgentTabs
					tabs={tabs}
					activeId={activeId}
					onSelect={selectTab}
					onClose={handleCloseTab}
					onCreate={createTab}
					canCreate={canCreate}
					pendingMap={pendingBooleanMap}
				/>
			)}

			<Box sx={{ px: "14px", py: "9px" }}>
				<Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "text.primary", lineHeight: 1.35 }}>
					Ask about Pratyush&apos;s work
				</Typography>
				<Typography sx={{ mt: "2px", fontSize: "0.7rem", color: "text.secondary", lineHeight: 1.35 }}>
					{currentPage ? `Context: ${currentPage}` : "Context-aware portfolio assistant"}
				</Typography>
			</Box>

			{isEmpty ? (
				<Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflowY: "auto" }}>
					<AgentInput
						onSend={send}
						onStop={stopActiveResponse}
						pending={pendingActive}
						disabled={inputDisabled}
						usageLabel={usageLabel}
						notice={limitNotice}
					/>
					<AgentPromptSuggestions onSelect={send} disabled={pendingActive || inputDisabled} />
				</Box>
			) : (
				<>
					<AgentChat
						tab={activeTab}
						pending={pendingActive}
						streamingReply={activeStreamingReply}
						statusText={activeStatus}
					/>
					<AgentInput
						onSend={send}
						onStop={stopActiveResponse}
						pending={pendingActive}
						disabled={inputDisabled}
						usageLabel={usageLabel}
						notice={limitNotice}
					/>
				</>
			)}

			{resizable && (
				<ResizeHandle
					side="left"
					active={isDragging}
					onPointerDown={startDragging}
					onKeyDown={onKeyDown}
					label="Resize agents panel"
					width={width}
					min={MIN_WIDTH}
					max={MAX_WIDTH}
				/>
			)}
		</Box>
	);
}
