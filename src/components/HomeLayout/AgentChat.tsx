"use client";
import { Box, CircularProgress, Typography } from "@mui/material";
import { AgentTab } from "@/utils/agentStorage";
import AgentPromptSuggestions from "./AgentPromptSuggestions";

interface Props {
	tab: AgentTab | null;
	pending: boolean;
	onPromptSelect: (prompt: string) => void;
}

export default function AgentChat({ tab, pending, onPromptSelect }: Props) {
	const isEmpty = !tab || tab.messages.length === 0;

	return (
		<Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
			{isEmpty ? (
				<Box sx={{ p: 1.5 }}>
					{/* Active agent card */}
					<Box sx={{ border: 1, borderColor: "divider", borderRadius: 1.5, p: 1.5, mb: 1.5 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
							<Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "success.main" }} />
							<Typography variant="body2" sx={{ fontWeight: 600 }}>
								Portfolio Agent
							</Typography>
							<Typography variant="caption" sx={{ ml: "auto", color: "text.secondary" }}>
								Ready
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
				</Box>
			)}
		</Box>
	);
}
