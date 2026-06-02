"use client";

import { Box, Typography } from "@mui/material";
import { VscChevronRight } from "react-icons/vsc";

const PROMPTS = [
	"Summarize Pratyush for a recruiter",
	"Which projects show backend strength?",
	"Explain Perfect Match technically",
	"What roles is he strongest for?",
	"Show AI and data engineering experience",
	"How should I contact him?"
];

interface Props {
	onSelect: (prompt: string) => void;
	disabled?: boolean;
}

export default function AgentPromptSuggestions({ onSelect, disabled }: Props) {
	return (
		<Box sx={{ display: "flex", flexDirection: "column" }}>
			<Box sx={{ px: "14px", pt: "12px", pb: "8px" }}>
				<Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "text.primary", mb: "3px" }}>
					Portfolio Agent
				</Typography>
				<Typography sx={{ fontSize: "0.74rem", lineHeight: 1.45, color: "text.secondary" }}>
					Ask concise questions about projects, skills, experience, or role fit. Answers stream in as they are
					written.
				</Typography>
			</Box>

			<Typography
				sx={{
					fontSize: "0.6875rem",
					fontWeight: 600,
					letterSpacing: "0.08em",
					textTransform: "uppercase",
					color: "text.disabled",
					px: "14px",
					pt: "6px",
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
						borderRadius: 0,
						cursor: disabled ? "default" : "pointer",
						opacity: disabled ? 0.4 : 1,
						color: "text.secondary",
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
