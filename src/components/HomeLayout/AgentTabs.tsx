"use client";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { VscAdd, VscChromeClose } from "react-icons/vsc";
import { AgentTab, MAX_TABS } from "@/utils/agentStorage";

interface Props {
	tabs: AgentTab[];
	activeId: string | null;
	onSelect: (id: string) => void;
	onClose: (id: string) => void;
	onCreate: () => void;
	canCreate: boolean;
}

export default function AgentTabs({ tabs, activeId, onSelect, onClose, onCreate, canCreate }: Props) {
	return (
		<Box sx={{ flexShrink: 0, borderBottom: 1, borderColor: "divider" }}>
			<Box
				role="tablist"
				aria-label="Agent chat tabs"
				sx={{ display: "flex", alignItems: "stretch", overflowX: "auto", scrollbarWidth: "thin" }}>
				{" "}
				{tabs.map(t => {
					const active = t.id === activeId;
					return (
						<Box
							key={t.id}
							onClick={() => onSelect(t.id)}
							role="tab"
							aria-selected={active}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 0.5,
								pl: 1,
								pr: 0.5,
								py: 0.5,
								cursor: "pointer",
								whiteSpace: "nowrap",
								borderRight: 1,
								borderColor: "divider",
								borderTop: "2px solid",
								borderTopColor: active ? "primary.main" : "transparent",
								backgroundColor: active ? "background.default" : "transparent",
								color: active ? "text.primary" : "text.secondary",
								"&:hover": { color: "text.primary" }
							}}>
							<Typography
								variant="caption"
								sx={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", color: "inherit" }}>
								{t.title}
							</Typography>
							<Box
								component="span"
								role="button"
								aria-label={`Close ${t.title}`}
								onClick={e => {
									e.stopPropagation();
									onClose(t.id);
								}}
								sx={{
									display: "inline-flex",
									alignItems: "center",
									borderRadius: 0.5,
									p: 0.25,
									"&:hover": { backgroundColor: "action.hover", color: "text.primary" }
								}}>
								<VscChromeClose size={11} />
							</Box>
						</Box>
					);
				})}
				<Tooltip title={canCreate ? "New chat" : `Limit reached: ${MAX_TABS} local agent tabs.`} arrow>
					<span style={{ display: "inline-flex", alignItems: "center" }}>
						<IconButton
							size="small"
							onClick={onCreate}
							disabled={!canCreate}
							aria-label="New chat"
							sx={{ mx: 0.25, color: "text.secondary", backgroundColor: "transparent" }}>
							<VscAdd size={13} />
						</IconButton>
					</span>
				</Tooltip>
			</Box>
			{!canCreate && (
				<Typography variant="caption" sx={{ display: "block", px: 1, py: 0.25, color: "text.disabled" }}>
					Limit reached: {MAX_TABS} local agent tabs.
				</Typography>
			)}
		</Box>
	);
}
