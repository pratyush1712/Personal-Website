"use client";
import { useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { Box, Button, Collapse, IconButton, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { VscMarkdown, VscChromeClose, VscRepo } from "react-icons/vsc";
import Link from "next/link";
import AppTree from "./AppTree";
import { Page } from "@/types";

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

// Featured work, sourced from real entries in public/readmes/projects.md. These intentionally
// link to the existing /projects route — no new routed content is introduced.
const FEATURED_PROJECTS = ["Personal Agent Homebase", "BrainDump", "ADHD-Friendly Text Enhancer"];

function fileRowSx(active: boolean) {
	return {
		display: "flex",
		alignItems: "center",
		gap: 0.75,
		pl: 3,
		pr: 0.5,
		py: 0.4,
		fontSize: "0.82rem",
		cursor: "pointer",
		userSelect: "none",
		color: active ? "text.primary" : "text.secondary",
		backgroundColor: active ? "action.selected" : "transparent",
		"&:hover": { backgroundColor: active ? "action.selected" : "action.hover", color: "text.primary" }
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
	return (
		<Box sx={{ mb: 0.5 }}>
			<Button
				onClick={() => setOpen(o => !o)}
				disableRipple
				aria-expanded={open}
				fullWidth
				sx={{
					justifyContent: "flex-start",
					gap: 0.5,
					px: 0.5,
					py: 0.25,
					minHeight: 0,
					textTransform: "none",
					color: "text.secondary",
					backgroundColor: "transparent",
					"&:hover": { backgroundColor: "transparent", color: "text.primary" }
				}}>
				{open ? <ExpandMoreIcon sx={{ fontSize: 16 }} /> : <ChevronRightIcon sx={{ fontSize: 16 }} />}
				<Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.06em", color: "inherit" }}>
					{title}
				</Typography>
			</Button>
			<Collapse in={open} unmountOnExit>
				<Box sx={{ pb: 0.5 }}>{children}</Box>
			</Collapse>
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
				backgroundColor: "background.paper",
				borderRight: 1,
				borderColor: "divider",
				pt: 0.5
			}}>
			<Section title="OPEN EDITORS">
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
									<Box component="span" sx={{ display: "inline-flex", color: "text.secondary" }}>
										<VscMarkdown />
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
				{FEATURED_PROJECTS.map(name => (
					<Link key={name} href="/projects" style={{ textDecoration: "none" }}>
						<Box sx={fileRowSx(false)}>
							<Box component="span" sx={{ display: "inline-flex", color: "text.secondary" }}>
								<VscRepo />
							</Box>
							<Box
								component="span"
								sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
								{name}
							</Box>
						</Box>
					</Link>
				))}
			</Section>
		</Box>
	);
}
