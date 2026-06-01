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
		el.style.height = Math.min(el.scrollHeight, 120) + "px";
	}

	const canSend = !disabled && !pending && value.trim().length > 0;

	return (
		<Box
			sx={{
				flexShrink: 0,
				p: "10px 10px 12px"
				// Cursor's input sits flush against the bottom edge with no visible top border — the
				// container card itself provides separation.
			}}>
			{/* Outer card — mirrors Cursor's rounded input container, elevated off the panel */}
			<Box
				sx={{
					borderRadius: "10px",
					border: "1px solid",
					borderColor: theme =>
						theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
					backgroundColor: theme =>
						theme.palette.mode === "dark" ? TOKENS.dark.surface : TOKENS.light.surface,
					display: "flex",
					flexDirection: "column",
					transition: "border-color 150ms ease",
					"&:focus-within": {
						borderColor: theme =>
							theme.palette.mode === "dark" ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.28)"
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
					rows={1}
					maxLength={2000}
					placeholder={disabled ? "Agent unavailable" : "Ask about Pratyush…"}
					aria-label="Message the Portfolio Agent"
					sx={{
						display: "block",
						width: "100%",
						resize: "none",
						backgroundColor: "transparent",
						color: "text.primary",
						border: "none",
						outline: "none",
						px: "12px",
						pt: "10px",
						pb: "6px",
						fontFamily: "inherit",
						fontSize: "0.8rem",
						lineHeight: 1.5,
						minHeight: "36px",
						maxHeight: "120px",
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
					{/* "Agent" mode pill — cosmetic, mirrors Cursor's model selector */}
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: "4px",
							px: "8px",
							py: "3px",
							borderRadius: "20px",
							border: "1px solid",
							borderColor: theme =>
								theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
							backgroundColor: theme =>
								theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
							color: "text.secondary",
							fontSize: "0.67rem",
							fontWeight: 500,
							letterSpacing: "0.02em",
							userSelect: "none",
							cursor: "default"
						}}>
						<TbInfinity size={11} />
						Agent
						<VscChevronDown size={10} style={{ opacity: 0.7 }} />
					</Box>

					{/* Spacer */}
					<Box sx={{ flex: 1 }} />

					{/* Send */}
					<Tooltip title="Send (Enter)" arrow>
						<span>
							<IconButton
								aria-label="Send message"
								onClick={submit}
								disabled={!canSend}
								size="small"
								sx={{
									width: 26,
									height: 26,
									borderRadius: "6px",
									color: canSend ? "text.primary" : "text.disabled",
									backgroundColor: canSend
										? theme =>
												theme.palette.mode === "dark"
													? "rgba(255,255,255,0.12)"
													: "rgba(0,0,0,0.08)"
										: "transparent",
									transition: "background-color 120ms ease, color 120ms ease",
									"&:hover": canSend
										? {
												backgroundColor: theme =>
													theme.palette.mode === "dark"
														? "rgba(255,255,255,0.2)"
														: "rgba(0,0,0,0.14)"
										  }
										: {},
									"&.Mui-disabled": {
										color: "text.disabled",
										backgroundColor: "transparent"
									}
								}}>
								<VscSend size={13} />
							</IconButton>
						</span>
					</Tooltip>
				</Box>
			</Box>
		</Box>
	);
}
