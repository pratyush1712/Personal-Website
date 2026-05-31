"use client";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { LuPanelLeft, LuPanelRight, LuSearch } from "react-icons/lu";
import Link from "next/link";
import { links } from "@/utils/links";

interface Props {
	darkMode: boolean;
	onThemeToggle: () => void;
	explorerOpen: boolean;
	onExplorerToggle: () => void;
	agentsOpen: boolean;
	onAgentsToggle: () => void;
	currentPage: string;
}

export default function TopCommandBar({
	darkMode,
	onThemeToggle,
	explorerOpen,
	onExplorerToggle,
	agentsOpen,
	onAgentsToggle,
	currentPage
}: Props) {
	const professional = links.filter(link => link.type === "professional");
	const resume = professional.find(link => link.href.endsWith(".pdf"));
	const iconLinks = professional.filter(link => link !== resume);

	const iconButtonSx = {
		color: "text.secondary",
		backgroundColor: "transparent",
		"&:hover": { backgroundColor: "action.hover", color: "text.primary" }
	};

	return (
		<Box
			component="header"
			sx={{
				height: 44,
				flexShrink: 0,
				display: "flex",
				alignItems: "center",
				gap: 1,
				px: 1,
				borderBottom: 1,
				borderColor: "divider",
				backgroundColor: "background.paper"
			}}>
			{/* Left: explorer toggle + workspace identity */}
			<Tooltip title={explorerOpen ? "Hide explorer" : "Show explorer"} arrow>
				<IconButton
					size="small"
					onClick={onExplorerToggle}
					aria-label={explorerOpen ? "Hide explorer" : "Show explorer"}
					aria-pressed={explorerOpen}
					sx={iconButtonSx}>
					<LuPanelLeft size={18} />
				</IconButton>
			</Tooltip>

			<Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, minWidth: 0 }}>
				<Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
					Pratyush Sudhakar
				</Typography>
				<Typography
					variant="body2"
					sx={{ color: "text.secondary", whiteSpace: "nowrap", display: { xs: "none", sm: "block" } }}>
					/ Portfolio Workspace
				</Typography>
				<Typography
					variant="caption"
					sx={{
						color: "text.secondary",
						whiteSpace: "nowrap",
						display: { xs: "none", md: "block" },
						ml: 0.5
					}}>
					— {currentPage}
				</Typography>
			</Box>

			{/* Center: command/search affordance (presentational this phase — no command palette) */}
			<Box sx={{ flex: 1, display: { xs: "none", sm: "flex" }, justifyContent: "center", px: 2 }}>
				<Box
					aria-hidden
					sx={{
						display: "flex",
						alignItems: "center",
						gap: 1,
						width: "100%",
						maxWidth: 420,
						height: 28,
						px: 1.5,
						borderRadius: 1.5,
						border: 1,
						borderColor: "divider",
						color: "text.secondary",
						fontSize: "0.8rem",
						userSelect: "none"
					}}>
					<LuSearch size={14} />
					<span>Search portfolio or ask agent…</span>
				</Box>
			</Box>

			{/* Right: relocated professional links + toggles */}
			<Box sx={{ display: "flex", alignItems: "center", gap: 0.25, ml: "auto" }}>
				{resume && (
					<Button
						component={Link}
						href={resume.href}
						target="_blank"
						size="small"
						startIcon={resume.icon}
						sx={{
							textTransform: "none",
							color: "text.primary",
							backgroundColor: "transparent",
							"&:hover": { backgroundColor: "action.hover" },
							display: { xs: "none", sm: "inline-flex" }
						}}>
						Resume
					</Button>
				)}

				<Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 0.25 }}>
					{iconLinks.map(link => (
						<Tooltip key={link.index} title={link.title} arrow>
							<IconButton
								component={Link}
								href={link.href}
								target="_blank"
								size="small"
								aria-label={link.title}
								sx={iconButtonSx}>
								{link.icon}
							</IconButton>
						</Tooltip>
					))}
				</Box>

				<Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"} arrow>
					<IconButton
						size="small"
						onClick={onThemeToggle}
						aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
						sx={iconButtonSx}>
						{darkMode ? (
							<LightModeOutlinedIcon fontSize="small" />
						) : (
							<DarkModeOutlinedIcon fontSize="small" />
						)}
					</IconButton>
				</Tooltip>

				<Tooltip title={agentsOpen ? "Hide agents panel" : "Show agents panel"} arrow>
					<IconButton
						size="small"
						onClick={onAgentsToggle}
						aria-label={agentsOpen ? "Hide agents panel" : "Show agents panel"}
						aria-pressed={agentsOpen}
						sx={{ ...iconButtonSx, color: agentsOpen ? "primary.main" : "text.secondary" }}>
						<LuPanelRight size={18} />
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	);
}
