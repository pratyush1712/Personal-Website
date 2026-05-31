"use client";
import { useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { VscClose } from "react-icons/vsc";
import { useLocalAgentTabs } from "@/utils/useLocalAgentTabs";
import AgentTabs from "./AgentTabs";
import AgentChat from "./AgentChat";
import AgentInput from "./AgentInput";

interface Props {
	onClose: () => void;
	currentPage?: string;
}

// Shown when the agent endpoint is missing/unconfigured or errors. The panel never crashes the
// page; it degrades to this message and the visitor can keep exploring the portfolio.
const UNAVAILABLE_MESSAGE =
	"Portfolio Agent isn't connected yet. You can still explore Pratyush's portfolio using the files in the explorer.";

export default function AgentsPanel({ onClose, currentPage }: Props) {
	const { tabs, activeTab, activeId, hydrated, canCreate, createTab, closeTab, selectTab, appendMessage } =
		useLocalAgentTabs();
	const [pending, setPending] = useState(false);

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
				borderLeft: 1,
				borderColor: "divider",
				backgroundColor: "background.paper"
			}}>
			<Box
				sx={{
					height: 44,
					flexShrink: 0,
					display: "flex",
					alignItems: "center",
					px: 1.5,
					borderBottom: 1,
					borderColor: "divider"
				}}>
				<Typography variant="body2" sx={{ fontWeight: 600 }}>
					Agents
				</Typography>
				<Tooltip title="Hide agents panel" arrow>
					<IconButton
						size="small"
						onClick={onClose}
						aria-label="Hide agents panel"
						sx={{ ml: "auto", color: "text.secondary", backgroundColor: "transparent" }}>
						<VscClose size={16} />
					</IconButton>
				</Tooltip>
			</Box>

			{hydrated && (
				<AgentTabs
					tabs={tabs}
					activeId={activeId}
					onSelect={selectTab}
					onClose={closeTab}
					onCreate={createTab}
					canCreate={canCreate}
				/>
			)}

			<AgentChat tab={activeTab} pending={pending} onPromptSelect={send} />
			<AgentInput onSend={send} pending={pending} />
		</Box>
	);
}
