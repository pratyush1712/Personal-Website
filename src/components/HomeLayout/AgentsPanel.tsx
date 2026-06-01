"use client";
import { useEffect, useState } from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { VscLayoutSidebarRight, VscSettingsGear } from "react-icons/vsc";
import { LuMessageSquare } from "react-icons/lu";
import { useLocalAgentTabs } from "@/utils/useLocalAgentTabs";
import AgentTabs from "./AgentTabs";
import AgentChat from "./AgentChat";
import AgentInput from "./AgentInput";

interface Props {
	onClose: () => void;
	currentPage?: string;
}

const UNAVAILABLE_MESSAGE =
	"Portfolio Agent isn't connected yet. You can still explore Pratyush's portfolio using the files in the explorer.";

export default function AgentsPanel({ onClose, currentPage }: Props) {
	const { tabs, activeTab, activeId, hydrated, canCreate, createTab, closeTab, selectTab, appendMessage } =
		useLocalAgentTabs();
	const [pendingMap, setPendingMap] = useState<Record<string, boolean>>({});

	useEffect(() => {
		if (hydrated && tabs.length === 0) createTab();
	}, [hydrated, tabs.length, createTab]);

	function handleCloseTab(id: string) {
		const isLastTab = tabs.length === 1;
		closeTab(id);
		if (isLastTab) onClose();
	}

	async function send(text: string) {
		if (!activeTab) return;
		const id = activeTab.id;
		if (pendingMap[id]) return;
		// Cap to last 10 messages client-side so the body never exceeds the route's 32KB limit
		const outgoing = [...activeTab.messages, { role: "user" as const, content: text }].slice(-10);
		appendMessage(id, { role: "user", content: text });
		setPendingMap(m => ({ ...m, [id]: true }));
		try {
			const res = await fetch("/api/portfolio-agent", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: outgoing, currentPage })
			});

			let errorMsg = UNAVAILABLE_MESSAGE;
			if (!res.ok) {
				try {
					const errJson = await res.json();
					if (errJson?.error) errorMsg = errJson.error;
				} catch {}
				throw new Error(errorMsg);
			}

			const data = await res.json();
			const reply = typeof data?.reply === "string" && data.reply.trim() ? data.reply : UNAVAILABLE_MESSAGE;
			appendMessage(id, { role: "assistant", content: reply });
		} catch (err: any) {
			appendMessage(id, { role: "assistant", content: err.message || UNAVAILABLE_MESSAGE });
		} finally {
			setPendingMap(m => {
				const next = { ...m };
				delete next[id];
				return next;
			});
		}
	}

	// Cursor-spec header icon button — 26×26, no bg by default
	const headerIconSx = {
		width: 26,
		height: 26,
		borderRadius: "5px",
		color: "text.secondary",
		backgroundColor: "transparent",
		"&:hover": {
			color: "text.primary",
			backgroundColor: (theme: any) =>
				theme.palette.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"
		}
	};

	return (
		<Box
			component="aside"
			aria-label="Agents panel"
			sx={{
				width: 340,
				flexShrink: 0,
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderLeft: "1px solid",
				// Cursor uses #2d2d2d for dividers in the dark theme
				borderColor: theme => (theme.palette.mode === "dark" ? "#2d2d2d" : "divider"),
				// Cursor Agent panel bg is #252526 — slightly lighter than the editor chrome (#1e1e1e)
				backgroundColor: theme => (theme.palette.mode === "dark" ? "#252526" : "#f3f3f3"),
				overflow: "hidden"
			}}>
			{/* ── Tab bar ── */}
			{hydrated && (
				<AgentTabs
					tabs={tabs}
					activeId={activeId}
					onSelect={selectTab}
					onClose={handleCloseTab}
					onCreate={createTab}
					canCreate={canCreate}
				/>
			)}

			{/* ── Message / chat area ── */}
			<AgentChat tab={activeTab} pending={pendingMap[activeId ?? ""] ?? false} onPromptSelect={send} />

			{/* ── Cursor-style input box ── */}
			<AgentInput onSend={send} pending={pendingMap[activeId ?? ""] ?? false} />
		</Box>
	);
}
