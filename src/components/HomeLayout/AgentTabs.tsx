"use client";

import { Box, IconButton, Tooltip, type Theme } from "@mui/material";
import { type SystemStyleObject } from "@mui/system";
import { VscAdd, VscChromeClose, VscLoading } from "react-icons/vsc";
import { LuMessageSquare } from "react-icons/lu";

import { AgentTab, MAX_TABS } from "@/utils/agents/agentStorage";
import { TOKENS } from "@/ui/Theme";

interface Props {
	tabs: AgentTab[];
	activeId: string | null;
	onSelect: (id: string) => void;
	onClose: (id: string) => void;
	onCreate: () => void;
	canCreate: boolean;
	pendingMap?: Record<string, boolean>;
}

export default function AgentTabs({ tabs, activeId, onSelect, onClose, onCreate, canCreate, pendingMap = {} }: Props) {
	return (
		<Box sx={barSx}>
			<Box role="tablist" aria-label="Agent chat tabs" sx={tabListSx}>
				{tabs.map(t => {
					const active = t.id === activeId;
					const isPending = !!pendingMap[t.id];

					return (
						<Box
							key={t.id}
							onClick={() => onSelect(t.id)}
							onKeyDown={e => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									onSelect(t.id);
								}
							}}
							role="tab"
							tabIndex={active ? 0 : -1}
							aria-selected={active}
							aria-busy={isPending}
							sx={tabSx(active)}>
							<Box component="span" sx={tabIconSx(isPending, active)}>
								{isPending ? <VscLoading size={13} /> : <LuMessageSquare size={14} />}
							</Box>

							<Box component="span" sx={tabTitleSx(active)} title={t.title}>
								{t.title}
							</Box>

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
										e.preventDefault();
										e.stopPropagation();
										onClose(t.id);
									}
								}}
								sx={closeButtonSx(active)}>
								<VscChromeClose size={10} />
							</Box>
						</Box>
					);
				})}
			</Box>

			<Box sx={actionClusterSx}>
				<Tooltip title={canCreate ? "New chat" : `Max ${MAX_TABS} chats`} arrow>
					<span>
						<IconButton
							size="small"
							onClick={onCreate}
							disabled={!canCreate}
							aria-label="New chat"
							sx={actionButtonSx}>
							<VscAdd size={14} />
						</IconButton>
					</span>
				</Tooltip>
			</Box>
		</Box>
	);
}

const barSx: SystemStyleObject<Theme> = {
	flexShrink: 0,
	// Use appBg (the outer panel chrome tone) so the tab strip is flush with the
	// AgentsPanel wrapper below it — no visible seam between the two regions.
	backgroundColor: theme => (theme.palette.mode === "dark" ? TOKENS.dark.appBg : TOKENS.light.appBg),
	display: "flex",
	alignItems: "center",
	height: 33,
	minHeight: 33
};

const tabListSx: SystemStyleObject<Theme> = {
	display: "flex",
	alignItems: "stretch",
	flex: 1,
	overflowX: "auto",
	scrollbarWidth: "none",
	"&::-webkit-scrollbar": { display: "none" }
};

function tabSx(active: boolean): SystemStyleObject<Theme> {
	return {
		display: "flex",
		alignItems: "center",
		gap: "6px",
		pl: "14px",
		pr: "8px",
		height: 33,
		minHeight: 33,
		cursor: "pointer",
		whiteSpace: "nowrap",
		position: "relative",
		userSelect: "none",
		// Match the close button's 120ms timing so hover feels uniform across the tab strip.
		transition: "background-color 120ms ease, color 120ms ease",
		backgroundColor: active
			? theme => (theme.palette.mode === "dark" ? TOKENS.dark.appBg : TOKENS.light.appBg)
			: "transparent",
		color: active
			? theme => (theme.palette.mode === "dark" ? TOKENS.dark.textPrimary : TOKENS.light.textPrimary)
			: theme => (theme.palette.mode === "dark" ? "#bbbbbb" : "#666666"),
		"&::before": active
			? {
					content: '""',
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: "1px",
					backgroundColor: theme => (theme.palette.mode === "dark" ? TOKENS.dark.accent : TOKENS.light.accent)
				}
			: {},
		...(active && {
			borderLeft: "1px solid",
			borderRight: "1px solid",
			borderColor: theme => (theme.palette.mode === "dark" ? TOKENS.dark.border : TOKENS.light.border),
			ml: "-1px"
		}),
		"&:hover": {
			color: "text.primary",
			backgroundColor: theme =>
				active
					? theme.palette.mode === "dark"
						? TOKENS.dark.appBg
						: TOKENS.light.appBg
					: theme.palette.mode === "dark"
						? "rgba(255,255,255,0.04)"
						: "rgba(0,0,0,0.03)"
		},
		"&:focus-visible": {
			outline: "2px solid",
			outlineColor: "primary.main",
			outlineOffset: "-2px"
		}
	};
}

function tabIconSx(isPending: boolean, active: boolean): SystemStyleObject<Theme> {
	return {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		width: 14,
		height: 14,
		flexShrink: 0,
		opacity: isPending ? 1 : active ? 1 : 0.75,
		color: isPending
			? theme => (theme.palette.mode === "dark" ? TOKENS.dark.textPrimary : TOKENS.light.textPrimary)
			: "inherit",
		"@keyframes agentTabSpin": {
			from: { transform: "rotate(0deg)" },
			to: { transform: "rotate(360deg)" }
		},
		"& > svg": isPending ? { animation: "agentTabSpin 1.1s linear infinite" } : {}
	};
}

function tabTitleSx(active: boolean): SystemStyleObject<Theme> {
	return {
		fontSize: "0.8rem",
		maxWidth: 124,
		fontWeight: active ? 500 : 400,
		overflow: "hidden",
		textOverflow: "ellipsis",
		color: "inherit"
	};
}

function closeButtonSx(active: boolean): SystemStyleObject<Theme> {
	return {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		width: 16,
		height: 16,
		borderRadius: "3px",
		flexShrink: 0,
		opacity: active ? 0.6 : 0,
		color: "text.secondary",
		transition: "opacity 120ms ease, background-color 120ms ease",
		".MuiBox-root:hover &": { opacity: 0.6 },
		"&:hover": {
			opacity: "1 !important",
			backgroundColor: theme => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"),
			color: "text.primary"
		},
		"&:focus-visible": {
			outline: "2px solid",
			outlineColor: "primary.main",
			outlineOffset: "1px",
			opacity: 1
		}
	};
}

const actionClusterSx: SystemStyleObject<Theme> = {
	display: "flex",
	alignItems: "center",
	gap: "1px",
	px: "5px",
	flexShrink: 0
};

const actionButtonSx: SystemStyleObject<Theme> = {
	width: 22,
	height: 22,
	borderRadius: "4px",
	color: theme => (theme.palette.mode === "dark" ? "#c5c5c5" : "#555555"),
	backgroundColor: "transparent",
	"&:hover": {
		color: theme => (theme.palette.mode === "dark" ? "#ffffff" : "#000000"),
		backgroundColor: theme => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)")
	},
	"&.Mui-disabled": { opacity: 0.4 }
};
