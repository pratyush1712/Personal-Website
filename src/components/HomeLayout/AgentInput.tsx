"use client";
import { useRef, useState, type KeyboardEvent } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { VscChevronDown, VscSend } from "react-icons/vsc";
import { TbInfinity } from "react-icons/tb";
import { TOKENS } from "@/ui/Theme";

interface Props {
	onSend: (text: string) => void;
	disabled?: boolean;
	pending?: boolean;
}

export default function AgentInput({ onSend, disabled, pending }: Props) {
	const [value, setValue] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	function submit() {
		const text = value.trim();
		if (!text || disabled || pending) return;
		onSend(text);
		setValue("");
		// Reset textarea height
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}
	}

	function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	}

	/** Auto-grow the textarea as the user types */
	function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		setValue(e.target.value);
		const el = e.target;
		el.style.height = "auto";
		el.style.height = Math.min(el.scrollHeight, 220) + "px";
	}

	const canSend = !disabled && !pending && value.trim().length > 0;

	return (
		<Box
			sx={{
				flexShrink: 0,
				p: "12px 14px 12px"
			}}>
			{/* Outer card - elevated #2d2d2d well. The layered shadow (soft drop + tight contact +
			    inset top highlight) lifts it off the panel and gives the field the "text sits inside
			    it" depth Cursor's composer has. */}
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
					transition: "border-color 150ms ease, box-shadow 150ms ease",
					"&:focus-within": {
						borderColor: theme =>
							theme.palette.mode === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.2)",
						boxShadow: theme =>
							theme.palette.mode === "dark"
								? "0 3px 12px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(0,120,212,0.35)"
								: "0 3px 12px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8), 0 0 0 1px rgba(0,95,184,0.3)"
					}
				}}>
				{/* Textarea */}
				<Box
					ref={textareaRef}
					component="textarea"
					value={value}
					onChange={handleChange}
					onKeyDown={onKeyDown}
					disabled={disabled}
					rows={3}
					maxLength={2000}
					placeholder={disabled ? "Agent unavailable" : "Ask about Pratyush's projects, experience, skills…"}
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
						fontSize: "0.8125rem", // 13px – Cursor input text size
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

				{/* Bottom toolbar: Agent pill + send button */}
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						px: "8px",
						pb: "7px",
						gap: "6px"
					}}>
					{/* "Agent" mode pill - cosmetic, mirrors Cursor's model selector */}
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
							fontSize: "0.72rem", // 11.5px
							fontWeight: 500,
							letterSpacing: "0.01em",
							userSelect: "none",
							cursor: "default",
							transition: "background-color 120ms ease, border-color 120ms ease",
							"&:hover": {
								backgroundColor: theme =>
									theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
								borderColor: theme => (theme.palette.mode === "dark" ? "#555555" : "rgba(0,0,0,0.2)")
							}
						}}>
						<TbInfinity size={12} style={{ opacity: 0.75, color: "currentColor" }} />
						Agent
						<VscChevronDown size={10} style={{ opacity: 0.65 }} />
					</Box>

					{/* Spacer */}
					<Box sx={{ flex: 1 }} />

					{/* Send - turns accent blue when there's text to send */}
					<Tooltip title="Send (Enter)" arrow>
						<span>
							<IconButton
								aria-label="Send message"
								onClick={submit}
								disabled={!canSend}
								size="small"
								sx={{
									width: 28,
									height: 28,
									borderRadius: "6px",
									color: canSend
										? theme =>
												theme.palette.mode === "dark" ? TOKENS.dark.accent : TOKENS.light.accent
										: "text.disabled",
									backgroundColor: "transparent",
									transition: "background-color 120ms ease, color 120ms ease",
									"&:hover": canSend
										? {
												backgroundColor: theme =>
													theme.palette.mode === "dark"
														? "rgba(255,255,255,0.08)"
														: "rgba(0,0,0,0.06)"
											}
										: {},
									"&.Mui-disabled": {
										color: "text.disabled",
										backgroundColor: "transparent"
									}
								}}>
								<VscSend size={14} />
							</IconButton>
						</span>
					</Tooltip>
				</Box>
			</Box>
		</Box>
	);
}
