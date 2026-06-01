"use client";
import { Box, Button, ClickAwayListener, IconButton, InputBase, Paper, Tooltip, Typography } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { LuPanelLeft, LuPanelRight, LuSearch } from "react-icons/lu";
import { VscMarkdown } from "react-icons/vsc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { links } from "@/utils/links";
import { highlightText } from "@/utils/searchHighlight";

interface Props {
	darkMode: boolean;
	onThemeToggle: () => void;
	explorerOpen: boolean;
	onExplorerToggle: () => void;
	agentsOpen: boolean;
	onAgentsToggle: () => void;
	currentPage: string;
}

type SearchResult = {
	file: string;
	title: string;
	route: string;
	href: string;
	snippet: string;
	score: number;
};

type SearchResponse = {
	query: string;
	results: SearchResult[];
};

function isSearchResponse(value: unknown): value is SearchResponse {
	if (!value || typeof value !== "object") return false;
	const candidate = value as { query?: unknown; results?: unknown };
	return typeof candidate.query === "string" && Array.isArray(candidate.results);
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
	const router = useRouter();
	const searchListId = useId();
	const searchInputRef = useRef<HTMLInputElement>(null);
	const professional = links.filter(link => link.type === "professional");
	const resume = professional.find(link => link.href.endsWith(".pdf"));
	const iconLinks = professional.filter(link => link !== resume);
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const trimmedQuery = query.trim();

	const activeResults = useMemo(() => results.filter(result => result.href), [results]);

	useEffect(() => {
		if (!trimmedQuery) {
			setResults([]);
			setError("");
			setLoading(false);
			return;
		}

		const controller = new AbortController();
		const timeout = window.setTimeout(() => {
			setLoading(true);
			setError("");
			fetch(`/api/portfolio-search?q=${encodeURIComponent(trimmedQuery)}`, { signal: controller.signal })
				.then(response => {
					if (!response.ok) throw new Error(`Search failed with status ${response.status}`);
					return response.json() as Promise<unknown>;
				})
				.then(data => {
					if (!isSearchResponse(data)) throw new Error("Search returned an unexpected response.");
					setResults(data.results);
					setOpen(true);
				})
				.catch(fetchError => {
					if (fetchError instanceof DOMException && fetchError.name === "AbortError") return;
					setError(fetchError instanceof Error ? fetchError.message : "Search failed.");
					setResults([]);
					setOpen(true);
				})
				.finally(() => setLoading(false));
		}, 180);

		return () => {
			window.clearTimeout(timeout);
			controller.abort();
		};
	}, [trimmedQuery]);

	useEffect(() => {
		const handler = () => {
			searchInputRef.current?.focus();
			if (trimmedQuery) setOpen(true);
		};
		window.addEventListener("focus-sidebar-search", handler);
		return () => window.removeEventListener("focus-sidebar-search", handler);
	}, [trimmedQuery]);

	function navigateToResult(result: SearchResult) {
		setOpen(false);
		router.push(`${result.href}?q=${encodeURIComponent(trimmedQuery)}`);
	}

	function handleSubmit() {
		if (activeResults[0]) navigateToResult(activeResults[0]);
	}

	const iconButtonSx = {
		color: "text.secondary",
		backgroundColor: "transparent",
		"&:hover": { backgroundColor: "action.hover", color: "text.primary" }
	};

	return (
		<Box
			component="header"
			sx={{
				height: 35,
				flexShrink: 0,
				display: "flex",
				alignItems: "center",
				gap: 1,
				px: 1,
				borderBottom: darkMode ? "1px solid #3a3a3a" : "1px solid #e5e5e5",
				backgroundColor: darkMode ? "#252526" : "#f3f3f3"
			}}>
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

			<Box sx={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
				<Typography
					sx={{
						fontSize: "13px",
						fontWeight: 400,
						color: darkMode ? "#e0e0e0" : "#333333",
						whiteSpace: "nowrap",
						lineHeight: 1
					}}>
					Pratyush Sudhakar
				</Typography>
				<Typography
					sx={{
						fontSize: "13px",
						fontWeight: 400,
						color: darkMode ? "#858585" : "#717171",
						whiteSpace: "nowrap",
						lineHeight: 1,
						display: { xs: "none", sm: "block" }
					}}>
					/ Portfolio Workspace
				</Typography>
				<Typography
					sx={{
						fontSize: "13px",
						fontWeight: 400,
						color: darkMode ? "#858585" : "#717171",
						whiteSpace: "nowrap",
						lineHeight: 1,
						display: { xs: "none", md: "block" }
					}}>
					- {currentPage}
				</Typography>
			</Box>

			<Box sx={{ flex: 1, display: { xs: "none", sm: "flex" }, justifyContent: "center", px: 2 }}>
				<ClickAwayListener onClickAway={() => setOpen(false)}>
					<Box
						component="form"
						role="search"
						onSubmit={event => event.preventDefault()}
						sx={{ position: "relative", width: "100%", maxWidth: 460 }}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1,
								height: 30,
								px: 1.25,
								borderRadius: 1.5,
								border: 1,
								borderColor: open ? "primary.main" : "divider",
								color: "text.secondary",
								backgroundColor: "background.default",
								transition: "border-color 160ms ease, background-color 160ms ease"
							}}>
							<LuSearch size={14} />
							<InputBase
								inputRef={searchInputRef}
								value={query}
								onChange={event => {
									setQuery(event.target.value);
									setOpen(true);
								}}
								onFocus={() => trimmedQuery && setOpen(true)}
								onKeyDown={event => {
									if (event.key === "Enter") {
										event.preventDefault();
										handleSubmit();
									}
									if (event.key === "Escape") setOpen(false);
								}}
								placeholder="Search portfolio files..."
								inputProps={{
									"aria-label": "Search portfolio files",
									"aria-controls": searchListId,
									"aria-expanded": open
								}}
								sx={{ flex: 1, fontSize: "0.8rem", color: "text.primary", minWidth: 0 }}
							/>
						</Box>

						{open && trimmedQuery && (
							<Paper
								id={searchListId}
								role="listbox"
								elevation={8}
								sx={{
									position: "absolute",
									top: 36,
									left: 0,
									right: 0,
									zIndex: theme => theme.zIndex.modal,
									overflow: "hidden",
									border: 1,
									borderColor: "divider",
									backgroundColor: "background.paper"
								}}>
								{loading && (
									<Typography
										variant="caption"
										sx={{ display: "block", px: 1.5, py: 1, color: "text.secondary" }}>
										Searching files...
									</Typography>
								)}
								{error && (
									<Typography
										variant="caption"
										sx={{ display: "block", px: 1.5, py: 1, color: "error.main" }}>
										{error}
									</Typography>
								)}
								{!loading && !error && results.length === 0 && (
									<Typography
										variant="caption"
										sx={{ display: "block", px: 1.5, py: 1, color: "text.secondary" }}>
										No matching portfolio files.
									</Typography>
								)}
								{!error &&
									results.map(result => (
										<Box
											key={result.file}
											component="button"
											type="button"
											role="option"
											onClick={() => navigateToResult(result)}
											sx={{
												width: "100%",
												border: 0,
												borderBottom: 1,
												borderColor: "divider",
												backgroundColor: "transparent",
												color: "text.primary",
												textAlign: "left",
												px: 1.5,
												py: 1,
												cursor: "pointer",
												"&:hover, &:focus-visible": {
													backgroundColor: "action.hover",
													outline: "none"
												},
												"&:active": { transform: "translateY(1px)" }
											}}>
											<Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.25 }}>
												<Box
													component="span"
													sx={{ color: "text.secondary", display: "inline-flex" }}>
													<VscMarkdown size={14} />
												</Box>
												<Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
													{highlightText(result.file, trimmedQuery)}
												</Typography>
											</Box>
											<Typography
												variant="caption"
												sx={{ color: "text.secondary", display: "block", lineHeight: 1.4 }}>
												{highlightText(result.snippet, trimmedQuery)}
											</Typography>
										</Box>
									))}
							</Paper>
						)}
					</Box>
				</ClickAwayListener>
			</Box>

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
