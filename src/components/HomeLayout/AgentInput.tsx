"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { VscChevronDown, VscDebugStop, VscSend } from "react-icons/vsc";
import { TbInfinity } from "react-icons/tb";
import { TOKENS } from "@/ui/Theme";

interface Props {
	onSend: (text: string) => void;
	onStop?: () => void;
	disabled?: boolean;
	pending?: boolean;
	usageLabel?: string;
	notice?: string;
}

const MAX_CHARS = 2000;

export default function AgentInput({ onSend, onStop, disabled, pending, usageLabel, notice }: Props) {
	const [value, setValue] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (!textareaRef.current) return;
		textareaRef.current.style.height = "auto";
		textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 220) + "px";
	}, [value]);

	function submit() {
		const text = value.trim();
		if (!text || disabled || pending) return;
		onSend(text);
		setValue("");
	}

	function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	}

	const trimmedLength = value.trim().length;
	const canSend = !disabled && !pending && trimmedLength > 0;
	const remainingChars = MAX_CHARS - value.length;
	const helperText = pending
		? "Generating response…"
		: notice || usageLabel || "Enter to send · Shift+Enter for newline";

	return (
		<Box sx={{ flexShrink: 0, p: "12px 14px 12px" }}>
			<Box
				sx={{
					borderRadius: "10px",
					border: "1px solid",
					borderColor: theme => (theme.palette.mode === "dark" ? TOKENS.dark.border : "rgba(0,0,0,0.12)"),
					backgroundColor: theme =>
						theme.palette.mode === "dark" ? TOKENS.dark.elevated : TOKENS.light.surface,
					boxShadow: theme =>
						theme.palette.mode === "dark"
							? "0 2px 6px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
							: "0 2px 6px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.7)",
					display: "flex",
					flexDirection: "column",
					transition: "border-color 150ms ease, box-shadow 150ms ease, opacity 150ms ease",
					opacity: disabled && !pending ? 0.72 : 1,
					"&:focus-within": {
						borderColor: theme =>
							theme.palette.mode === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)",
						boxShadow: theme =>
							theme.palette.mode === "dark"
								? "0 3px 12px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(0,120,212,0.35)"
								: "0 3px 12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8), 0 0 0 1px rgba(0,95,184,0.3)"
					}
				}}>
				<Box
					ref={textareaRef}
					component="textarea"
					value={value}
					onChange={event => setValue(event.target.value)}
					onKeyDown={onKeyDown}
					disabled={disabled}
					rows={3}
					maxLength={MAX_CHARS}
					placeholder={
						disabled
							? "Agent is temporarily unavailable"
							: "Ask about projects, skills, experience, or role fit…"
					}
					aria-label="Message the Portfolio Agent"
					sx={{
						display: "block",
						width: "100%",
						resize: "none",
						backgroundColor: "transparent",
						color: "text.primary",
						border: "none",
						outline: "none",
						px: "14px",
						pt: "12px",
						pb: "8px",
						fontFamily: "inherit",
						fontSize: "0.8125rem",
						lineHeight: 1.55,
						minHeight: "72px",
						maxHeight: "220px",
						overflowY: "auto",
						scrollbarWidth: "none",
						"&::-webkit-scrollbar": { display: "none" },
						"&::placeholder": {
							color: "text.disabled",
							opacity: 1
						}
					}}
				/>

				<Box sx={{ display: "flex", alignItems: "center", px: "8px", pb: "7px", gap: "6px" }}>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: "4px",
							px: "8px",
							py: "3px",
							borderRadius: "999px",
							border: "1px solid",
							borderColor: theme => (theme.palette.mode === "dark" ? "#404040" : "rgba(0,0,0,0.12)"),
							backgroundColor: "transparent",
							color: theme =>
								theme.palette.mode === "dark" ? TOKENS.dark.textPrimary : TOKENS.light.textPrimary,
							fontSize: "0.72rem",
							fontWeight: 500,
							letterSpacing: "0.01em",
							userSelect: "none"
						}}>
						<TbInfinity size={12} style={{ opacity: 0.75, color: "currentColor" }} />
						Portfolio Agent
						<VscChevronDown size={10} style={{ opacity: 0.55 }} />
					</Box>

					<Box sx={{ flex: 1 }} />

					<Typography
						component="span"
						sx={{
							fontSize: "0.68rem",
							color: remainingChars < 160 ? "warning.main" : "text.disabled",
							display: value.length > MAX_CHARS * 0.72 ? "inline" : "none"
						}}>
						{remainingChars}
					</Typography>

					{pending ? (
						<Tooltip title="Stop response" arrow>
							<span>
								<IconButton
									aria-label="Stop response"
									onClick={onStop}
									disabled={!onStop}
									size="small"
									sx={iconButtonSx(Boolean(onStop), "error.main")}>
									<VscDebugStop size={14} />
								</IconButton>
							</span>
						</Tooltip>
					) : (
						<Tooltip title="Send (Enter)" arrow>
							<span>
								<IconButton
									aria-label="Send message"
									onClick={submit}
									disabled={!canSend}
									size="small"
									sx={iconButtonSx(canSend)}>
									<VscSend size={14} />
								</IconButton>
							</span>
						</Tooltip>
					)}
				</Box>
			</Box>

			<Typography
				aria-live="polite"
				sx={{
					mt: "6px",
					px: "2px",
					fontSize: "0.7rem",
					lineHeight: 1.35,
					color: notice ? "warning.main" : "text.disabled"
				}}>
				{helperText}
			</Typography>
		</Box>
	);
}

function iconButtonSx(enabled: boolean, activeColor?: string) {
	return {
		width: 28,
		height: 28,
		borderRadius: "6px",
		color: enabled
			? (activeColor ??
				((theme: any) => (theme.palette.mode === "dark" ? TOKENS.dark.accent : TOKENS.light.accent)))
			: "text.disabled",
		backgroundColor: "transparent",
		transition: "background-color 120ms ease, color 120ms ease",
		"&:hover": enabled
			? {
					backgroundColor: (theme: any) =>
						theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
				}
			: {},
		"&.Mui-disabled": {
			color: "text.disabled",
			backgroundColor: "transparent"
		}
	};
}
