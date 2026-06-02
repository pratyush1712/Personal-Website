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
		<Box sx={{ display: "flex", flexDirection: "column" }}>
			{/* Section label - Cursor spec: 11px, all-caps, muted, 0.08em tracking */}
			<Typography
				sx={{
					fontSize: "0.6875rem", // 11px
					fontWeight: 700,
					letterSpacing: "0.08em",
					textTransform: "uppercase",
					color: "text.disabled",
					px: "14px",
					pt: "10px",
					pb: "4px"
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
						gap: "8px",
						px: "14px",
						py: "7px",
						borderRadius: 0, // Cursor uses flat full-width row chips
						cursor: disabled ? "default" : "pointer",
						opacity: disabled ? 0.4 : 1,
						color: "text.secondary",
						// Cursor spec: 13px for primary interactive labels
						fontSize: "0.8125rem",
						fontWeight: 400,
						lineHeight: 1.4,
						transition: "background-color 100ms ease, color 100ms ease",
						"&:hover": disabled
							? {}
							: {
									backgroundColor: theme =>
										theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
									color: theme => (theme.palette.mode === "dark" ? "#e0e0e0" : "#3b3b3b"),
									"& .chev": { opacity: 0.6 }
								},
						"&:active": disabled ? {} : { opacity: 0.75 },
						"&:focus-visible": {
							outline: "2px solid",
							outlineColor: "primary.main",
							outlineOffset: "-2px"
						}
					}}>
					<Box component="span" sx={{ flex: 1 }}>
						{prompt}
					</Box>
					{/* Cursor uses a small right-chevron at ~11px */}
					<VscChevronRight
						className="chev"
						size={11}
						style={{
							flexShrink: 0,
							opacity: 0.3,
							transition: "opacity 100ms ease"
						}}
					/>
				</Box>
			))}
		</Box>
	);
}
