"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
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

/** Animated three-dot "thinking" indicator, mirroring Cursor's style */
function ThinkingDots() {
	return (
		<Box
			aria-live="polite"
			aria-label="Thinking"
			sx={{
				display: "flex",
				alignItems: "center",
				gap: "4px",
				pl: 0.5,
				py: 0.5
			}}>
			{[0, 1, 2].map(i => (
				<Box
					key={i}
					sx={{
						width: 5,
						height: 5,
						borderRadius: "50%",
						backgroundColor: "text.disabled",
						animation: "agentPulse 1.2s ease-in-out infinite",
						animationDelay: `${i * 0.2}s`,
						"@keyframes agentPulse": {
							"0%, 80%, 100%": { opacity: 0.25, transform: "scale(0.85)" },
							"40%": { opacity: 1, transform: "scale(1)" }
						}
					}}
				/>
			))}
		</Box>
	);
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
		() => tab?.messages.some(m => m.role === "assistant" && isSuccessfulAssistantMessage(m.content)) ?? false,
		[tab?.messages]
	);

	const agentStatus: AgentStatus = useMemo(() => {
		if (configured === null) return "checking";
		if (!configured) return "unavailable";
		if (hasSuccessfulReply) return "ready";
		return "standby";
	}, [configured, hasSuccessfulReply]);

	// Status indicator colors — subtle, editor-native
	const statusDotColor: Record<AgentStatus, string> = {
		checking: "rgba(255,255,255,0.2)",
		unavailable: "#e5a050",
		standby: "rgba(255,255,255,0.25)",
		ready: "#4caf7d"
	};
	const statusLabel: Record<AgentStatus, string> = {
		checking: "Checking…",
		unavailable: "Unavailable",
		standby: "Standby",
		ready: "Ready"
	};

	return (
		<Box
			sx={{
				flex: 1,
				minHeight: 0,
				overflowY: "auto",
				overflowX: "hidden",
				scrollbarWidth: "thin",
				scrollbarColor: theme =>
					`${theme.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"} transparent`,
				"&::-webkit-scrollbar": { width: 4 },
				"&::-webkit-scrollbar-thumb": {
					borderRadius: 2,
					backgroundColor: theme =>
						theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
				}
			}}>
			{isEmpty ? (
				<Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
					{/* Agent identity card — Cursor-style compact card */}
					<Box
						sx={{
							borderRadius: "8px",
							border: "1px solid",
							borderColor: theme =>
								theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
							backgroundColor: theme =>
								theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
							p: "12px 14px"
						}}>
						<Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "6px" }}>
							{/* Status dot */}
							<Box
								aria-hidden
								sx={{
									width: 7,
									height: 7,
									borderRadius: "50%",
									backgroundColor: statusDotColor[agentStatus],
									flexShrink: 0,
									// Subtle glow for "ready" state
									...(agentStatus === "ready" && {
										boxShadow: "0 0 0 2px rgba(76,175,125,0.2)"
									})
								}}
							/>
							<Typography
								sx={{
									fontSize: "0.78rem",
									fontWeight: 600,
									color: "text.primary",
									letterSpacing: "0.01em"
								}}>
								Portfolio Agent
							</Typography>
							<Box
								aria-live="polite"
								sx={{
									ml: "auto",
									fontSize: "0.68rem",
									color: "text.disabled",
									letterSpacing: "0.02em"
								}}>
								{statusLabel[agentStatus]}
							</Box>
						</Box>
						<Typography
							sx={{
								fontSize: "0.72rem",
								color: "text.secondary",
								lineHeight: 1.55,
								letterSpacing: "0.01em"
							}}>
							Ask about Pratyush&rsquo;s projects, experience, research, skills, resume, and background.
						</Typography>
					</Box>

					{/* Suggested prompts */}
					<AgentPromptSuggestions onSelect={onPromptSelect} />
				</Box>
			) : (
				<Box
					sx={{
						px: 2,
						py: 1.5,
						display: "flex",
						flexDirection: "column",
						gap: "2px"
					}}>
					{tab!.messages.map((m, i) => {
						const isUser = m.role === "user";
						return (
							<Box
								key={i}
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: isUser ? "flex-end" : "flex-start",
									// Group consecutive messages with tighter spacing
									mb:
										i < tab!.messages.length - 1 && tab!.messages[i + 1].role !== m.role
											? "10px"
											: "2px"
								}}>
								{isUser ? (
									// User message: right-aligned pill with subtle bg
									<Box
										sx={{
											maxWidth: "85%",
											px: "12px",
											py: "7px",
											borderRadius: "12px 12px 2px 12px",
											backgroundColor: theme =>
												theme.palette.mode === "dark"
													? "rgba(255,255,255,0.08)"
													: "rgba(0,0,0,0.06)",
											border: "1px solid",
											borderColor: theme =>
												theme.palette.mode === "dark"
													? "rgba(255,255,255,0.1)"
													: "rgba(0,0,0,0.08)",
											fontSize: "0.78rem",
											lineHeight: 1.55,
											color: "text.primary",
											whiteSpace: "pre-wrap",
											wordBreak: "break-word"
										}}>
										{m.content}
									</Box>
								) : (
									// Assistant message: left-aligned, no bg — editor-native prose
									<Box
										sx={{
											maxWidth: "100%",
											fontSize: "0.78rem",
											lineHeight: 1.65,
											color: "text.primary",
											whiteSpace: "pre-wrap",
											wordBreak: "break-word",
											// Subtle left accent line for AI responses
											pl: "10px",
											borderLeft: "2px solid",
											borderColor: theme =>
												theme.palette.mode === "dark"
													? "rgba(255,255,255,0.12)"
													: "rgba(0,0,0,0.1)"
										}}>
										{m.content}
									</Box>
								)}
							</Box>
						);
					})}

					{pending && (
						<Box sx={{ display: "flex", alignItems: "flex-start", pl: "10px" }}>
							<ThinkingDots />
						</Box>
					)}

					<div ref={bottomRef} />
				</Box>
			)}
		</Box>
	);
}
