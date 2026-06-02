"use client";
import { Box, IconButton, Tooltip } from "@mui/material";
import { VscAdd, VscChromeClose, VscHistory, VscEllipsis, VscLoading } from "react-icons/vsc";

import { AgentTab, MAX_TABS } from "@/utils/agentStorage";
import { LuMessageSquare } from "react-icons/lu";
import { TOKENS } from "@/ui/Theme";

interface Props {
	tabs: AgentTab[];
	activeId: string | null;
	onSelect: (id: string) => void;
	onClose: (id: string) => void;
	onCreate: () => void;
	canCreate: boolean;
	/** Map of tab id → whether that agent is currently responding. */
	pendingMap?: Record<string, boolean>;
}

export default function AgentTabs({ tabs, activeId, onSelect, onClose, onCreate, canCreate, pendingMap = {} }: Props) {
	// Shared style for the right-side icon buttons (+, history, ellipsis)
	const actionBtnSx = {
		width: 24,
		height: 24,
		borderRadius: "4px",
		color: (theme: any) => (theme.palette.mode === "dark" ? "#c5c5c5" : "#555555"),
		backgroundColor: "transparent",
		"&:hover": {
			color: (theme: any) => (theme.palette.mode === "dark" ? "#ffffff" : "#000000"),
			backgroundColor: (theme: any) =>
				theme.palette.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"
		},
		"&.Mui-disabled": { opacity: 0.4 }
	};

	return (
		<Box
			sx={{
				flexShrink: 0,
				// Cursor: tab bar bg matches panel bg (#1e1e1e); active tab is the lighter #2d2d2d card
				backgroundColor: theme => (theme.palette.mode === "dark" ? TOKENS.dark.appBg : TOKENS.light.appBg),
				display: "flex",
				alignItems: "center",
				height: 35, // ~35px per Cursor spec
				borderBottom: "1px solid",
				borderColor: theme => (theme.palette.mode === "dark" ? TOKENS.dark.border : TOKENS.light.border)
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
					const isPending = !!pendingMap[t.id];
					return (
						<Box
							key={t.id}
							onClick={() => onSelect(t.id)}
							role="tab"
							aria-selected={active}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: "6px",
								pl: "12px",
								pr: "8px",
								height: 35,
								cursor: "pointer",
								whiteSpace: "nowrap",
								position: "relative",
								userSelect: "none",
								// Active tab: lifts to elevated bg (#2d2d2d); inactive stays at panel bg
								backgroundColor: active
									? (theme: any) => (theme.palette.mode === "dark" ? TOKENS.dark.elevated : "#ffffff")
									: "transparent",
								color: active
									? (theme: any) =>
											theme.palette.mode === "dark"
												? TOKENS.dark.textPrimary
												: TOKENS.light.textPrimary
									: (theme: any) => (theme.palette.mode === "dark" ? "#bbbbbb" : "#666666"),
								// Cursor active-tab TOP accent line in accent blue
								"&::before": active
									? {
											content: '""',
											position: "absolute",
											top: 0,
											left: 0,
											right: 0,
											height: "1px",
											backgroundColor: (theme: any) =>
												theme.palette.mode === "dark" ? TOKENS.dark.accent : TOKENS.light.accent
										}
									: {},
								// Subtle side borders on active tab to seat it inside the bar
								...(active && {
									borderLeft: "1px solid",
									borderRight: "1px solid",
									borderColor: (theme: any) =>
										theme.palette.mode === "dark" ? TOKENS.dark.border : TOKENS.light.border,
									ml: "-1px"
								}),
								"&:hover": {
									color: "text.primary",
									backgroundColor: (theme: any) =>
										active
											? theme.palette.mode === "dark"
												? TOKENS.dark.elevated
												: "#ffffff"
											: theme.palette.mode === "dark"
												? "rgba(255,255,255,0.04)"
												: "rgba(0,0,0,0.03)"
								},
								// Vertical separator between tabs (skip on active, it has its own borders)
								"&:not(:last-of-type)": !active
									? {
											borderRight: "1px solid",
											borderColor: (theme: any) =>
												theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "divider"
										}
									: {}
							}}>
							{/* Codicon speech-bubble — swaps to a spinner while the agent is responding */}
							<Box
								component="span"
								sx={{
									display: "inline-flex",
									alignItems: "center",
									justifyContent: "center",
									width: 14,
									height: 14,
									flexShrink: 0,
									opacity: isPending ? 1 : active ? 1 : 0.75,
									color: isPending
										? (theme: any) =>
												theme.palette.mode === "dark"
													? TOKENS.dark.textPrimary
													: TOKENS.light.textPrimary
										: "inherit",
									"@keyframes agentTabSpin": {
										from: { transform: "rotate(0deg)" },
										to: { transform: "rotate(360deg)" }
									},
									"& > svg": isPending ? { animation: "agentTabSpin 1.1s linear infinite" } : {}
								}}>
								{isPending ? <VscLoading size={13} /> : <LuMessageSquare size={14} />}
							</Box>

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

							{/* Close button - appears on hover or when the tab is active */}
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

				{/* Chat history - Codicon "history" (circular clock) */}
				<Tooltip title="Chat history" arrow>
					<IconButton size="small" aria-label="Chat history" sx={actionBtnSx}>
						<VscHistory size={14} />
					</IconButton>
				</Tooltip>

				{/* More options - Codicon "ellipsis" (⋯) */}
				<Tooltip title="More options" arrow>
					<IconButton size="small" aria-label="More options" sx={actionBtnSx}>
						<VscEllipsis size={14} />
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	);
}
