"use client";
import { useId, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { Box, Button, Collapse, IconButton, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { VscArrowDown, VscChromeClose, VscRepo } from "react-icons/vsc";
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

// Featured work is sourced from real headings in public/readmes/projects.md.
// Each item deep-links to its heading in the existing projects file to avoid duplicating project content.
const FEATURED_PROJECTS = [
	"Personal Agent Homebase",
	"BrainDump - AI Thought-Mapping Canvas",
	"ADHD-Friendly Text Enhancer"
];

function fileRowSx(active: boolean) {
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
		color: "#cccccc",
		backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent",
		"&:hover": { backgroundColor: active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)" }
	} as const;
}

function Section({
	title,
	children,
	defaultOpen = true
}: {
	title: string;
	children: ReactNode;
	defaultOpen?: boolean;
}) {
	const [open, setOpen] = useState(defaultOpen);
	const panelId = useId();
	const contentId = `${panelId.replace(/:/g, "")}-content`;

	return (
		<Box>
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
					py: 0,
					height: "22px",
					minHeight: 0,
					borderRadius: 0,
					textTransform: "none",
					backgroundColor: "transparent",
					"&:hover": { backgroundColor: "rgba(255,255,255,0.05)" }
				}}>
				{open ? (
					<ExpandMoreIcon sx={{ fontSize: "10px", color: "#c5c5c5", flexShrink: 0 }} />
				) : (
					<ChevronRightIcon sx={{ fontSize: "10px", color: "#c5c5c5", flexShrink: 0 }} />
				)}
				<Typography
					sx={{
						fontSize: "11px",
						fontWeight: 700,
						textTransform: "uppercase",
						letterSpacing: "0.08em",
						color: "#bbbbbb",
						lineHeight: "22px"
					}}>
					{title}
				</Typography>
			</Button>
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
	return (
		<Box
			component="nav"
			aria-label="Portfolio explorer"
			sx={{
				width: 240,
				flexShrink: 0,
				height: "100%",
				overflowY: "auto",
				backgroundColor: "#1e1e1e",
				borderRight: "1px solid #3a3a3a",
				pt: 0
			}}>
			<Section title="OPEN EDITORS" defaultOpen={false}>
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
									sx={fileRowSx(active)}>
									<Box
										component="span"
										sx={{ display: "inline-flex", color: "#4fc1ff", flexShrink: 0 }}>
										<VscArrowDown size={14} />
									</Box>
									<Box
										component="span"
										sx={{
											flex: 1,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap"
										}}>
										{p.name}
									</Box>
									<IconButton
										size="small"
										aria-label={`Close ${p.name}`}
										onClick={e => {
											e.preventDefault();
											e.stopPropagation();
											setVisiblePageIndexs(visiblePageIndexs.filter(x => x !== p.index));
										}}
										sx={{
											p: 0.25,
											ml: 0.5,
											color: "text.secondary",
											backgroundColor: "transparent",
											"&:hover": { backgroundColor: "action.hover", color: "text.primary" }
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
									if (projectsPage && !visiblePageIndexs.includes(projectsPage.index)) {
										setVisiblePageIndexs([...visiblePageIndexs, projectsPage.index]);
									}
									if (projectsPage) setSelectedIndex(projectsPage.index);
									setCurrentComponent("featured-projects");
								}}
								sx={fileRowSx(false)}>
								<Box component="span" sx={{ display: "inline-flex", color: "#858585", flexShrink: 0 }}>
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
