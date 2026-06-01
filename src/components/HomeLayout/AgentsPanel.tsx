"use client";
import { useEffect, useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { VscLayoutSidebarRight } from "react-icons/vsc";
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
	const [pending, setPending] = useState(false);

	useEffect(() => {
		if (hydrated && tabs.length === 0) createTab();
	}, [hydrated, tabs.length, createTab]);

	function handleCloseTab(id: string) {
		const isLastTab = tabs.length === 1;
		closeTab(id);
		if (isLastTab) onClose();
	}

	async function send(text: string) {
		if (!activeTab || pending) return;
		const id = activeTab.id;
		const outgoing = [...activeTab.messages, { role: "user" as const, content: text }];
		appendMessage(id, { role: "user", content: text });
		setPending(true);
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
			setPending(false);
		}
	}

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
				borderColor: "divider",
				// Same chrome tone as the explorer side bar (Cursor's side-bar background)
				backgroundColor: "background.paper",
				overflow: "hidden"
			}}>
			{/* ── Top bar: title + close ── */}
			<Box
				sx={{
					height: 35,
					flexShrink: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					px: 1.5,
					borderBottom: "1px solid",
					borderColor: "divider"
				}}>
				<Box
					sx={{
						fontSize: "0.72rem",
						fontWeight: 600,
						letterSpacing: "0.06em",
						textTransform: "uppercase",
						color: "text.secondary"
					}}>
					Chat
				</Box>
				<Tooltip title="Close panel" arrow>
					<IconButton
						size="small"
						onClick={onClose}
						aria-label="Close agents panel"
						sx={{
							p: "3px",
							color: "text.secondary",
							borderRadius: "4px",
							"&:hover": {
								color: "text.primary",
								backgroundColor: theme =>
									theme.palette.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"
							}
						}}>
						<VscLayoutSidebarRight size={15} />
					</IconButton>
				</Tooltip>
			</Box>

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

			{/* ── Message area ── */}
			<AgentChat tab={activeTab} pending={pending} onPromptSelect={send} />

			{/* ── Cursor-style input box ── */}
			<AgentInput onSend={send} pending={pending} />
		</Box>
	);
}
