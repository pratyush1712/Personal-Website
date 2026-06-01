"use client";
import { Box, IconButton, Tooltip } from "@mui/material";
import { VscAdd, VscChromeClose, VscHistory, VscEllipsis } from "react-icons/vsc";

import { AgentTab, MAX_TABS } from "@/utils/agentStorage";
import { LuMessageSquare } from "react-icons/lu";

interface Props {
	tabs: AgentTab[];
	activeId: string | null;
	onSelect: (id: string) => void;
	onClose: (id: string) => void;
	onCreate: () => void;
	canCreate: boolean;
}

export default function AgentTabs({ tabs, activeId, onSelect, onClose, onCreate, canCreate }: Props) {
	// Shared style for the right-side icon buttons (+, history, ellipsis)
	const actionBtnSx = {
		width: 24,
		height: 24,
		borderRadius: "4px",
		color: "text.secondary",
		backgroundColor: "transparent",
		"&:hover": {
			color: "text.primary",
			backgroundColor: (theme: any) =>
				theme.palette.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"
		},
		"&.Mui-disabled": { opacity: 0.3 }
	};

	return (
		<Box
			sx={{
				flexShrink: 0,
				// Cursor: tab bar bg matches panel bg (#252526), active tab dips to #1e1e1e
				backgroundColor: theme => (theme.palette.mode === "dark" ? "#252526" : "#f3f3f3"),
				display: "flex",
				alignItems: "center",
				height: 35, // ~35px per Cursor spec
				borderBottom: "1px solid",
				borderColor: theme => (theme.palette.mode === "dark" ? "#2d2d2d" : "divider")
			}}>
			{/* Scrollable tab list */}
			<Box
				role="tablist"
				aria-label="Agent chat tabs"
				sx={{
					display: "flex",
					alignItems: "stretch",
					flex: 1,
					overflowX: "auto",
					scrollbarWidth: "none",
					"&::-webkit-scrollbar": { display: "none" }
				}}>
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
								gap: "4px",
								pl: "10px",
								pr: "6px",
								height: 35,
								cursor: "pointer",
								whiteSpace: "nowrap",
								position: "relative",
								userSelect: "none",
								// Active tab: drops to editor bg (#1e1e1e); inactive stays at panel bg
								backgroundColor: active
									? (theme: any) => (theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff")
									: "transparent",
								color: active
									? (theme: any) => (theme.palette.mode === "dark" ? "#d4d4d4" : "#3b3b3b")
									: "text.secondary",
								// Cursor active-tab bottom accent line
								"&::after": active
									? {
											content: '""',
											position: "absolute",
											bottom: 0,
											left: 0,
											right: 0,
											height: "1px",
											backgroundColor: (theme: any) =>
												theme.palette.mode === "dark"
													? "rgba(255,255,255,0.25)"
													: theme.palette.primary.main
										}
									: {},
								"&:hover": {
									color: "text.primary",
									backgroundColor: (theme: any) =>
										theme.palette.mode === "dark" ? "#2a2a2a" : "rgba(0,0,0,0.03)"
								},
								// Vertical separator between tabs
								"&:not(:last-of-type)": {
									borderRight: "1px solid",
									borderColor: (theme: any) => (theme.palette.mode === "dark" ? "#2d2d2d" : "divider")
								}
							}}>
							{/* Codicon speech-bubble — mirrors Cursor's "comment" tab icon */}
							<LuMessageSquare size={14} style={{ opacity: active ? 0.75 : 0.4, flexShrink: 0 }} />

							<Box
								component="span"
								sx={{
									fontSize: "0.8125rem", // 13px per Cursor spec
									maxWidth: 90,
									fontWeight: active ? 500 : 400,
									overflow: "hidden",
									textOverflow: "ellipsis",
									color: "inherit"
								}}>
								{t.title}
							</Box>

							{/* Close button — appears on hover or when the tab is active */}
							<Box
								component="span"
								role="button"
								tabIndex={0}
								aria-label={`Close ${t.title}`}
								onClick={e => {
									e.stopPropagation();
									onClose(t.id);
								}}
								onKeyDown={e => {
									if (e.key === "Enter" || e.key === " ") {
										e.stopPropagation();
										onClose(t.id);
									}
								}}
								sx={{
									display: "inline-flex",
									alignItems: "center",
									justifyContent: "center",
									width: 16,
									height: 16,
									borderRadius: "3px",
									flexShrink: 0,
									// Cursor: close icon visible when tab is active; fades in on hover
									opacity: active ? 0.6 : 0,
									color: "text.secondary",
									transition: "opacity 120ms ease, background-color 120ms ease",
									".MuiBox-root:hover &": { opacity: 0.6 },
									"&:hover": {
										opacity: "1 !important",
										backgroundColor: (theme: any) =>
											theme.palette.mode === "dark"
												? "rgba(255,255,255,0.12)"
												: "rgba(0,0,0,0.1)",
										color: "text.primary"
									},
									"&:focus-visible": {
										outline: "2px solid",
										outlineColor: "primary.main",
										outlineOffset: "1px",
										opacity: 1
									}
								}}>
								{/* Cursor uses a 10px thin ✕, slightly smaller than the tab icon */}
								<VscChromeClose size={10} />
							</Box>
						</Box>
					);
				})}
			</Box>

			{/* ── Right-side action cluster: + · history · ellipsis ── */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: "1px",
					px: "5px",
					flexShrink: 0
				}}>
				{/* New chat */}
				<Tooltip title={canCreate ? "New chat" : `Max ${MAX_TABS} tabs`} arrow>
					<span>
						<IconButton
							size="small"
							onClick={onCreate}
							disabled={!canCreate}
							aria-label="New chat"
							sx={actionBtnSx}>
							<VscAdd size={14} />
						</IconButton>
					</span>
				</Tooltip>

				{/* Chat history — Codicon "history" (circular clock) */}
				<Tooltip title="Chat history" arrow>
					<IconButton size="small" aria-label="Chat history" sx={actionBtnSx}>
						<VscHistory size={14} />
					</IconButton>
				</Tooltip>

				{/* More options — Codicon "ellipsis" (⋯) */}
				<Tooltip title="More options" arrow>
					<IconButton size="small" aria-label="More options" sx={actionBtnSx}>
						<VscEllipsis size={14} />
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	);
}
