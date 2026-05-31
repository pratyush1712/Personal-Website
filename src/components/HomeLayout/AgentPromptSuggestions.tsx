"use client";
import { Box, Chip, Typography } from "@mui/material";

// Starter prompts (from the spec). Clicking one sends it as the first message.
const PROMPTS = [
	"Summarize Pratyush's background",
	"What are his strongest projects?",
	"What kind of roles is he a good fit for?",
	"Show me his technical skills",
	"What experience does he have with AI/backend work?",
	"How can I contact him?"
];

interface Props {
	onSelect: (prompt: string) => void;
	disabled?: boolean;
}

export default function AgentPromptSuggestions({ onSelect, disabled }: Props) {
	return (
		<Box>
			<Typography variant="caption" sx={{ display: "block", mb: 0.75, color: "text.secondary" }}>
				Suggested prompts
			</Typography>
			<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
				{PROMPTS.map(prompt => (
					<Chip
						key={prompt}
						label={prompt}
						size="small"
						variant="outlined"
						clickable={!disabled}
						disabled={disabled}
						onClick={() => !disabled && onSelect(prompt)}
						sx={{
							height: "auto",
							py: 0.4,
							borderColor: "divider",
							color: "text.secondary",
							"& .MuiChip-label": { px: 1, fontSize: "0.72rem", whiteSpace: "normal" },
							"&:hover": {
								borderColor: "primary.main",
								color: "text.primary",
								backgroundColor: "action.hover"
							}
						}}
					/>
				))}
			</Box>
		</Box>
	);
}
