"use client";
import { useId, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { Box, Button, Collapse, IconButton, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
	VscMarkdown,
	VscChromeClose,
	VscCloseAll,
	VscRepo,
	VscFiles,
	VscSearch,
	VscSourceControl,
	VscExtensions,
	VscChevronDown
} from "react-icons/vsc";
import { DiMarkdown } from "react-icons/di";
import Link from "next/link";
import AppTree from "./AppTree";
import { Page } from "@/types";
import { slugifyHeading } from "@/utils/markdownAnchors";

interface Props {
	pages: Page[];
	visiblePages: Page[];
	selectedIndex: number;
	setSelectedIndex: Dispatch<SetStateAction<number>>;
	currentComponent: string;
	setCurrentComponent: Dispatch<SetStateAction<string>>;
	visiblePageIndexs: number[];
	setVisiblePageIndexs: Dispatch<SetStateAction<number[]>>;
}

const FEATURED_PROJECTS = [
	"Personal Agent Homebase",
	"BrainDump - AI Thought-Mapping Canvas",
	"ADHD-Friendly Text Enhancer"
];

function fileRowSx(active: boolean, dark: boolean) {
	const activeBg = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
	const hoverBg = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
	return {
		display: "flex",
		alignItems: "center",
		gap: "6px",
		paddingLeft: "20px",
		paddingRight: "4px",
		paddingTop: 0,
		paddingBottom: 0,
		height: "22px",
		lineHeight: "22px",
		fontSize: "13px",
		fontWeight: 400,
		fontStyle: "normal",
		cursor: "pointer",
		userSelect: "none",
		color: dark ? "#cccccc" : "#3b3b3b",
		backgroundColor: active ? activeBg : "transparent",
		"&:hover": { backgroundColor: active ? activeBg : hoverBg }
	} as const;
}

function Section({
	title,
	children,
	defaultOpen = true,
	actions
}: {
	title: string;
	children: ReactNode;
	defaultOpen?: boolean;
	/** Optional action buttons rendered on the right of the section header (visible on hover). */
	actions?: ReactNode;
}) {
	const [open, setOpen] = useState(defaultOpen);
	const panelId = useId();
	const contentId = `${panelId.replace(/:/g, "")}-content`;
	const theme = useTheme();
	const dark = theme.palette.mode === "dark";

	return (
		<Box>
			<Box
				sx={{
					position: "relative",
					"& .section-actions": { opacity: 0, transition: "opacity 100ms ease" },
					"&:hover .section-actions": { opacity: 1 },
					"&:focus-within .section-actions": { opacity: 1 }
				}}>
				<Button
					onClick={() => setOpen(o => !o)}
					disableRipple
					aria-expanded={open}
					aria-controls={contentId}
					fullWidth
					sx={{
						justifyContent: "flex-start",
						gap: "4px",
						px: "8px",
						pr: actions ? "44px" : "8px",
						py: 0,
						height: "22px",
						minHeight: 0,
						borderRadius: 0,
						textTransform: "none",
						backgroundColor: "transparent",
						"&:hover": { backgroundColor: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }
					}}>
					{open ? (
						<ExpandMoreIcon sx={{ fontSize: "10px", color: dark ? "#d4d4d4" : "#555555", flexShrink: 0 }} />
					) : (
						<ChevronRightIcon
							sx={{ fontSize: "10px", color: dark ? "#d4d4d4" : "#555555", flexShrink: 0 }}
						/>
					)}
					<Typography
						sx={{
							fontSize: "11px",
							fontWeight: 600,
							textTransform: "uppercase",
							letterSpacing: "0.08em",
							color: dark ? "#d4d4d4" : "#555555",
							lineHeight: "22px"
						}}>
						{title}
					</Typography>
				</Button>
				{actions && (
					<Box
						className="section-actions"
						sx={{
							position: "absolute",
							right: "4px",
							top: 0,
							height: "22px",
							display: "flex",
							alignItems: "center",
							gap: "2px",
							pointerEvents: "auto"
						}}
						// Don't toggle the section when interacting with action buttons.
						onClick={e => e.stopPropagation()}>
						{actions}
					</Box>
				)}
			</Box>
			<Box id={contentId}>
				<Collapse in={open} unmountOnExit>
					<Box sx={{ pb: 0.5 }}>{children}</Box>
				</Collapse>
			</Box>
		</Box>
	);
}

export default function ExplorerPanel({
	pages,
	visiblePages,
	selectedIndex,
	setSelectedIndex,
	currentComponent,
	setCurrentComponent,
	visiblePageIndexs,
	setVisiblePageIndexs
}: Props) {
	const theme = useTheme();
	const dark = theme.palette.mode === "dark";

	const sidebarBg = dark ? "#1e1e1e" : "#f3f3f3";
	const borderStyle = dark ? "1px solid #3a3a3a" : `1px solid ${theme.palette.divider}`;
	const iconActive = dark ? "#ffffff" : "#333333";
	const iconActiveBg = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";
	const iconActiveHover = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.07)";
	const iconInactive = dark ? "#c5c5c5" : "#5a5a5a";
	const iconHoverBg = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
	const iconHoverColor = dark ? "#cccccc" : "#333333";
	const closeHoverBg = dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
	const closeHoverColor = dark ? "#ffffff" : "#111111";

	return (
		<Box
			component="nav"
			aria-label="Portfolio explorer"
			sx={{
				width: 240,
				flexShrink: 0,
				height: "100%",
				overflowY: "auto",
				backgroundColor: sidebarBg,
				borderRight: borderStyle,
				pt: 0
			}}>
			{/* Activity toolbar */}
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					height: "35px",
					px: "8px",
					gap: "2px",
					borderBottom: borderStyle,
					flexShrink: 0
				}}>
				<Tooltip title="Explorer" arrow>
					<IconButton
						size="small"
						disableRipple
						sx={{
							color: iconActive,
							backgroundColor: iconActiveBg,
							borderRadius: "4px",
							p: "4px",
							"&:hover": { backgroundColor: iconActiveHover }
						}}>
						<VscFiles size={16} />
					</IconButton>
				</Tooltip>

				<Tooltip title="Search" arrow>
					<IconButton
						size="small"
						disableRipple
						onClick={() => window.dispatchEvent(new CustomEvent("focus-sidebar-search"))}
						sx={{
							color: iconInactive,
							borderRadius: "4px",
							p: "4px",
							"&:hover": { backgroundColor: iconHoverBg, color: iconHoverColor }
						}}>
						<VscSearch size={16} />
					</IconButton>
				</Tooltip>

				<Tooltip title="Source Control" arrow>
					<IconButton
						size="small"
						disableRipple
						component={Link}
						href="https://github.com/pratyush1712/Personal-Website"
						target="_blank"
						sx={{
							color: iconInactive,
							borderRadius: "4px",
							p: "4px",
							"&:hover": { backgroundColor: iconHoverBg, color: iconHoverColor }
						}}>
						<VscSourceControl size={16} />
					</IconButton>
				</Tooltip>

				<Tooltip title="Skills" arrow>
					<IconButton
						size="small"
						disableRipple
						component={Link}
						href="/skills"
						sx={{
							color: iconInactive,
							borderRadius: "4px",
							p: "4px",
							"&:hover": { backgroundColor: iconHoverBg, color: iconHoverColor }
						}}>
						<VscExtensions size={16} />
					</IconButton>
				</Tooltip>

				<Tooltip title="More actions" arrow>
					<IconButton
						size="small"
						disableRipple
						sx={{
							color: iconInactive,
							borderRadius: "4px",
							p: "4px",
							ml: "auto",
							"&:hover": { backgroundColor: iconHoverBg, color: iconHoverColor }
						}}>
						<VscChevronDown size={16} />
					</IconButton>
				</Tooltip>
			</Box>

			<Section
				title="OPEN EDITORS"
				defaultOpen={false}
				actions={
					visiblePages.length > 0 ? (
						<Tooltip title="Close All Editors" arrow>
							<IconButton
								size="small"
								disableRipple
								aria-label="Close all editors"
								onClick={() => setVisiblePageIndexs([])}
								sx={{
									width: 22,
									height: 22,
									borderRadius: "4px",
									color: iconInactive,
									"&:hover": { backgroundColor: iconHoverBg, color: iconHoverColor }
								}}>
								<VscCloseAll size={22} />
							</IconButton>
						</Tooltip>
					) : null
				}>
				{visiblePages.length === 0 ? (
					<Typography variant="caption" sx={{ display: "block", pl: 3, color: "text.disabled" }}>
						No open editors
					</Typography>
				) : (
					visiblePages.map(p => {
						const active = selectedIndex === p.index;
						return (
							<Link key={p.index} href={p.route} style={{ textDecoration: "none" }}>
								<Box
									aria-current={active ? "page" : undefined}
									onClick={() => {
										setSelectedIndex(p.index);
										setCurrentComponent("tree");
									}}
									sx={{
										...fileRowSx(active, dark),
										paddingRight: "8px",
										justifyContent: "space-between",
										"& .explorer-close-btn": { opacity: 0, transition: "opacity 80ms" },
										"&:hover .explorer-close-btn": { opacity: 1 }
									}}>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: "6px",
											minWidth: 0,
											flex: 1
										}}>
										<Box
											component="span"
											sx={{ display: "inline-flex", color: "#519aba", flexShrink: 0 }}>
											<VscMarkdown size={16} />
										</Box>
										<Box
											component="span"
											sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
											{p.name}
										</Box>
									</Box>
									<IconButton
										size="small"
										className="explorer-close-btn"
										aria-label={`Close ${p.name}`}
										onClick={e => {
											e.preventDefault();
											e.stopPropagation();
											setVisiblePageIndexs(visiblePageIndexs.filter(x => x !== p.index));
										}}
										sx={{
											p: "2px",
											width: 16,
											height: 16,
											borderRadius: "3px",
											flexShrink: 0,
											color: iconInactive,
											backgroundColor: "transparent",
											"&:hover": { backgroundColor: closeHoverBg, color: closeHoverColor }
										}}>
										<VscChromeClose size={12} />
									</IconButton>
								</Box>
							</Link>
						);
					})
				)}
			</Section>

			<Section title="PORTFOLIO FILES">
				<AppTree
					pages={pages}
					selectedIndex={selectedIndex}
					setSelectedIndex={setSelectedIndex}
					currentComponent={currentComponent}
					setCurrentComponent={setCurrentComponent}
					visiblePageIndexs={visiblePageIndexs}
					setVisiblePageIndexs={setVisiblePageIndexs}
				/>
			</Section>

			<Section title="FEATURED PROJECTS" defaultOpen={false}>
				{FEATURED_PROJECTS.map(name => {
					const projectsPage = pages.find(page => page.route === "projects");
					const projectHref = `/projects#${slugifyHeading(name)}`;
					return (
						<Link key={name} href={projectHref} style={{ textDecoration: "none" }}>
							<Box
								onClick={() => {
									if (projectsPage && !visiblePageIndexs.includes(projectsPage.index))
										setVisiblePageIndexs([...visiblePageIndexs, projectsPage.index]);
									if (projectsPage) setSelectedIndex(projectsPage.index);
									setCurrentComponent("featured-projects");
								}}
								sx={fileRowSx(false, dark)}>
								<Box
									component="span"
									sx={{ display: "inline-flex", color: iconInactive, flexShrink: 0 }}>
									<VscRepo size={14} />
								</Box>
								<Box
									component="span"
									sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
									{name}
								</Box>
							</Box>
						</Link>
					);
				})}
			</Section>
		</Box>
	);
}
