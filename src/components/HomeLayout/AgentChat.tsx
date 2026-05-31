"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { AgentTab } from "@/utils/agentStorage";
import AgentPromptSuggestions from "./AgentPromptSuggestions";

interface Props {
	tab: AgentTab | null;
	pending: boolean;
	onPromptSelect: (prompt: string) => void;
}

type AgentStatus = "checking" | "unavailable" | "standby" | "ready";

const FAILURE_SNIPPETS = [
	"Portfolio Agent is not configured.",
	"Portfolio Agent isn't connected yet",
	"temporarily unavailable",
	"returned an empty response"
];

function isSuccessfulAssistantMessage(content: string): boolean {
	const lower = content.toLowerCase();
	return !FAILURE_SNIPPETS.some(snippet => lower.includes(snippet.toLowerCase()));
}

export default function AgentChat({ tab, pending, onPromptSelect }: Props) {
	const isEmpty = !tab || tab.messages.length === 0;
	const bottomRef = useRef<HTMLDivElement>(null);
	const [configured, setConfigured] = useState<boolean | null>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [tab?.messages, pending]);

	useEffect(() => {
		let cancelled = false;
		fetch("/api/portfolio-agent")
			.then(res => (res.ok ? res.json() : { configured: false }))
			.then((data: { configured?: unknown }) => {
				if (!cancelled) setConfigured(Boolean(data.configured));
			})
			.catch(() => {
				if (!cancelled) setConfigured(false);
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const hasSuccessfulReply = useMemo(
		() =>
			tab?.messages.some(m => m.role === "assistant" && isSuccessfulAssistantMessage(m.content)) ?? false,
		[tab?.messages]
	);

	const agentStatus: AgentStatus = useMemo(() => {
		if (configured === null) return "checking";
		if (!configured) return "unavailable";
		if (hasSuccessfulReply) return "ready";
		return "standby";
	}, [configured, hasSuccessfulReply]);

	const statusPresentation = {
		checking: { dotColor: "text.disabled", label: "Checking…" },
		unavailable: { dotColor: "warning.main", label: "Unavailable" },
		standby: { dotColor: "text.secondary", label: "Standby" },
		ready: { dotColor: "success.main", label: "Ready" }
	} as const;

	const { dotColor, label } = statusPresentation[agentStatus];

	return (
		<Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
			{isEmpty ? (
				<Box sx={{ p: 1.5 }}>
					{/* Active agent card */}
					<Box sx={{ border: 1, borderColor: "divider", borderRadius: 1.5, p: 1.5, mb: 1.5 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
							<Box
								aria-hidden
								sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: dotColor, flexShrink: 0 }}
							/>
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								Portfolio Agent
							</Typography>
							<Typography variant="caption" sx={{ ml: "auto", color: "text.secondary" }} aria-live="polite">
								{label}
							</Typography>
						</Box>
						<Typography variant="caption" sx={{ color: "text.secondary" }}>
							Ask about Pratyush&rsquo;s projects, experience, research, skills, resume, and background.
						</Typography>
					</Box>
					<AgentPromptSuggestions onSelect={onPromptSelect} />
				</Box>
			) : (
				<Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
					{tab!.messages.map((m, i) => (
						<Box
							key={i}
							sx={{
								alignSelf: m.role === "user" ? "flex-end" : "flex-start",
								maxWidth: "88%",
								px: 1.25,
								py: 0.75,
								borderRadius: 1.5,
								border: 1,
								borderColor: "divider",
								backgroundColor: m.role === "user" ? "action.selected" : "background.default",
								color: "text.primary",
								fontSize: "0.82rem",
								lineHeight: 1.5,
								whiteSpace: "pre-wrap",
								wordBreak: "break-word"
							}}>
							{m.content}
						</Box>
					))}
					{pending && (
						<Box
							aria-live="polite"
							sx={{
								alignSelf: "flex-start",
								display: "flex",
								alignItems: "center",
								gap: 1,
								color: "text.secondary"
							}}>
							<CircularProgress size={12} color="inherit" />
							<Typography variant="caption">Thinking&hellip;</Typography>
						</Box>
					)}
					<div ref={bottomRef} />
				</Box>
			)}
		</Box>
	);
}
