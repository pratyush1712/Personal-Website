"use client";
import { Box, Typography } from "@mui/material";
import { VscChevronRight } from "react-icons/vsc";

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
		<Box sx={{ display: "flex", flexDirection: "column", gap: "1px" }}>
			<Typography
				sx={{
					fontSize: "0.67rem",
					fontWeight: 600,
					letterSpacing: "0.07em",
					textTransform: "uppercase",
					color: "text.disabled",
					mb: "6px"
				}}>
				Suggested
			</Typography>

			{PROMPTS.map(prompt => (
				<Box
					key={prompt}
					role="button"
					tabIndex={disabled ? -1 : 0}
					aria-disabled={disabled}
					onClick={() => !disabled && onSelect(prompt)}
					onKeyDown={e => {
						if (!disabled && (e.key === "Enter" || e.key === " ")) {
							e.preventDefault();
							onSelect(prompt);
						}
					}}
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						gap: 1,
						px: "10px",
						py: "7px",
						borderRadius: "6px",
						cursor: disabled ? "default" : "pointer",
						opacity: disabled ? 0.4 : 1,
						color: "text.secondary",
						fontSize: "0.74rem",
						lineHeight: 1.4,
						transition: "background-color 100ms ease, color 100ms ease",
						"&:hover": disabled
							? {}
							: {
									backgroundColor: theme =>
										theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
									color: "text.primary"
							  },
						"&:focus-visible": {
							outline: "2px solid",
							outlineColor: "primary.main",
							outlineOffset: "1px"
						}
					}}>
					<Box component="span" sx={{ flex: 1 }}>
						{prompt}
					</Box>
					<VscChevronRight size={12} style={{ flexShrink: 0, opacity: 0.4 }} />
				</Box>
			))}
		</Box>
	);
}
