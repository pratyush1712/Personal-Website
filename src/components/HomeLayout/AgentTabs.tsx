"use client";
import { Box, IconButton, Tooltip } from "@mui/material";
import { VscAdd, VscChromeClose } from "react-icons/vsc";
import { BiComment } from "react-icons/bi";

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
		<Box
			sx={{
				flexShrink: 0,
				borderTop: "1px solid",
				borderColor: "divider",
				display: "flex",
				alignItems: "center",
				minHeight: 34,
				// Cursor uses a very slightly lighter bg for the tab bar
				backgroundColor: theme =>
					theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"
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
								gap: "3px",
								pl: "10px",
								pr: "6px",
								height: 34,
								cursor: "pointer",
								whiteSpace: "nowrap",
								position: "relative",
								userSelect: "none",
								// Active tab: slightly lighter bg + bottom accent line
								backgroundColor: active
									? theme =>
											theme.palette.mode === "dark"
												? "rgba(255,255,255,0.05)"
												: "rgba(0,0,0,0.04)"
									: "transparent",
								color: active ? "text.primary" : "text.secondary",
								// Bottom border as active indicator — Cursor uses a subtle 1px accent
								"&::after": active
									? {
											content: '""',
											position: "absolute",
											bottom: 0,
											left: 0,
											right: 0,
											height: "1px",
											backgroundColor: theme =>
												theme.palette.mode === "dark"
													? "rgba(255,255,255,0.3)"
													: theme.palette.primary.main
										}
									: {},
								"&:hover": {
									color: "text.primary",
									backgroundColor: theme =>
										theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"
								},
								// Right separator between tabs
								"&:not(:last-of-type)": {
									borderRight: "1px solid",
									borderColor: "divider"
								}
							}}>
							{/* Pencil icon — mirrors Cursor's edit icon on agent tabs */}
							<BiComment size={14} style={{ opacity: active ? 0.7 : 0.4, flexShrink: 0 }} />

							<Box
								component="span"
								sx={{
									fontSize: "0.8rem",
									maxWidth: 90,
									fontWeight: 500,
									overflow: "hidden",
									textOverflow: "ellipsis",
									color: "inherit"
								}}>
								{t.title}
							</Box>

							{/* Close button — appears on hover or when active */}
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
										backgroundColor: theme =>
											theme.palette.mode === "dark"
												? "rgba(255,255,255,0.12)"
												: "rgba(0,0,0,0.1)",
										color: "text.primary"
									}
								}}>
								<VscChromeClose size={16} />
							</Box>
						</Box>
					);
				})}
			</Box>

			{/* New chat button — always visible at the right end */}
			<Tooltip title={canCreate ? "New chat" : `Max ${MAX_TABS} tabs`} arrow>
				<span>
					<IconButton
						size="small"
						onClick={onCreate}
						disabled={!canCreate}
						aria-label="New chat"
						sx={{
							width: 28,
							height: 28,
							mx: 0.5,
							flexShrink: 0,
							borderRadius: "5px",
							color: "text.secondary",
							"&:hover": {
								color: "text.primary",
								backgroundColor: theme =>
									theme.palette.mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"
							},
							"&.Mui-disabled": { opacity: 0.3 }
						}}>
						<VscAdd size={14} />
					</IconButton>
				</span>
			</Tooltip>
		</Box>
	);
}
