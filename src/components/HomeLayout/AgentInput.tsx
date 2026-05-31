"use client";
import { useState, type KeyboardEvent } from "react";
import { Box, IconButton } from "@mui/material";
import { VscSend } from "react-icons/vsc";

interface Props {
	onSend: (text: string) => void;
	disabled?: boolean;
	pending?: boolean;
}

export default function AgentInput({ onSend, disabled, pending }: Props) {
	const [value, setValue] = useState("");

	function submit() {
		const text = value.trim();
		if (!text || disabled || pending) return;
		onSend(text);
		setValue("");
	}

	// Enter sends; Shift+Enter inserts a newline.
	function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	}

	return (
		<Box
			sx={{
				flexShrink: 0,
				borderTop: 1,
				borderColor: "divider",
				p: 1,
				display: "flex",
				gap: 0.5,
				alignItems: "flex-end"
			}}>
			<Box
				component="textarea"
				value={value}
				onChange={e => setValue(e.target.value)}
				onKeyDown={onKeyDown}
				disabled={disabled}
				rows={1}
				placeholder={disabled ? "Agent unavailable" : "Ask about Pratyush…"}
				aria-label="Message the Portfolio Agent"
				sx={{
					flex: 1,
					resize: "none",
					backgroundColor: "transparent",
					color: "text.primary",
					border: 1,
					borderColor: "divider",
					borderRadius: 1,
					px: 1,
					py: 0.75,
					fontFamily: "inherit",
					fontSize: "0.82rem",
					lineHeight: 1.4,
					maxHeight: 120,
					overflowY: "auto",
					"&:focus": { outline: "none", borderColor: "primary.main" },
					"&::placeholder": { color: "text.disabled" }
				}}
			/>
			<IconButton
				aria-label="Send message"
				onClick={submit}
				disabled={disabled || pending || !value.trim()}
				size="small"
				sx={{
					color: "primary.main",
					backgroundColor: "transparent",
					"&:hover": { backgroundColor: "action.hover" }
				}}>
				<VscSend size={16} />
			</IconButton>
		</Box>
	);
}
