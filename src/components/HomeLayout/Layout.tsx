"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Container, CssBaseline, Stack, ThemeProvider, Typography } from "@mui/material";
import createTheme from "@/ui/Theme";
import { isBrowser } from "react-device-detect";
import AppButtons from "./AppButtons";
import AppTree from "./AppTree";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import pages, { routeToPage } from "@/utils/pages";
import { useParams, usePathname, useRouter } from "next/navigation";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";

interface Page {
	index: number;
	name: string;
	route: string;
}

function initVisiblePageIndexs(pages: Page[]) {
	const tabs = [];
	for (let i = 0; i < pages.length; i++) {
		const page = pages[i];
		tabs.push(page.index);
	}
	return tabs;
}

interface WorkspaceLayoutProps {
	options: any;
	children: React.ReactNode;
}

export default function WorkspaceLayout({ options, children }: WorkspaceLayoutProps) {
	const router = useRouter();
	const params = useParams();
	const pathname = usePathname();
	const [explorerOpen, setExplorerOpen] = useState(isBrowser);
	// Right-side agents panel slot. Reserved here in the shell; the toggle is wired up in
	// Phase C (top bar) and the panel itself is built in Phase F.
	const [agentsOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(routeToPage[params.slug as string]?.index ?? null);
	const [currentComponent, setCurrentComponent] = useState("");
	const [visiblePageIndexs, setVisiblePageIndexs] = useState(initVisiblePageIndexs(pages));
	const [darkMode, setDarkMode] = useState(true);
	const [visiblePages, setVisiblePages] = useState(pages);

	// Theme is derived purely from darkMode — no in-place palette mutation. Recreated only
	// when the mode flips.
	const theme = useMemo(() => createTheme(darkMode), [darkMode]);
	function handleThemeChange() {
		setDarkMode(prev => {
			const next = !prev;
			localStorage.setItem("darkMode", JSON.stringify(next));
			return next;
		});
	}

	const deletedIndex: number | undefined = visiblePages.find(x => !visiblePageIndexs.includes(x.index))?.index;
	useEffect(() => {
		const newPages = [];

		for (const index of visiblePageIndexs) {
			const page = pages.find(x => x.index === index);
			if (page) newPages.push(page);
		}
		setVisiblePages(newPages);

		if (visiblePageIndexs.length === 0) {
			setSelectedIndex(-1);
			router.push("/");
		} else if (deletedIndex === selectedIndex && deletedIndex > Math.max(...visiblePageIndexs)) {
			setSelectedIndex(Math.max(...visiblePageIndexs));
			const page = pages.find(x => x.index === Math.max(...visiblePageIndexs));
			if (page) router.push(page.route, { scroll: false });
		} else if (deletedIndex === selectedIndex && deletedIndex < Math.max(...visiblePageIndexs)) {
			setSelectedIndex(Math.min(...visiblePageIndexs));
			const page = pages.find(x => x.index === Math.min(...visiblePageIndexs));
			if (page) router.push(page.route, { scroll: false });
		} else {
		}
	}, [visiblePageIndexs, router, selectedIndex, deletedIndex]);

	useEffect(() => {
		setDarkMode(JSON.parse(localStorage.getItem("darkMode") || "true"));
	}, []);

	const [{ cache, flush }] = useState(() => {
		const cache = createCache(options);
		cache.compat = true;
		const prevInsert = cache.insert;
		let inserted: string[] = [];
		cache.insert = (...args) => {
			const serialized = args[1];
			if (cache.inserted[serialized.name] === undefined) {
				inserted.push(serialized.name);
			}
			return prevInsert(...args);
		};
		const flush = () => {
			const prevInserted = inserted;
			inserted = [];
			return prevInserted;
		};
		return { cache, flush };
	});

	useServerInsertedHTML(() => {
		const names = flush();
		if (names.length === 0) {
			return null;
		}
		let styles = "";
		for (const name of names) {
			styles += cache.inserted[name];
		}
		return (
			<style
				key={cache.key}
				data-emotion={`${cache.key} ${names.join(" ")}`}
				dangerouslySetInnerHTML={{
					__html: styles
				}}
			/>
		);
	});

	return (
		<CacheProvider value={cache}>
			<ThemeProvider theme={theme}>
				<CssBaseline enableColorScheme />
				{/* Workspace shell: a fixed-height column of [main row] + [status bar]. The main
				    row lays out the workspace regions horizontally. */}
				<Box
					sx={{
						height: "100vh",
						overflow: "hidden",
						display: "flex",
						flexDirection: "column",
						backgroundColor: "background.default"
					}}>
					<Box sx={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>
						{/* Left activity rail (replaced by the top bar in Phase C) */}
						{isBrowser && (
							<Box sx={{ width: 50, flexShrink: 0 }}>
								<Sidebar
									setExpanded={setExplorerOpen}
									expanded={explorerOpen}
									darkMode={darkMode}
									handleThemeChange={handleThemeChange}
								/>
							</Box>
						)}

						{/* Explorer sidebar (restyled in Phase D) */}
						{explorerOpen && (
							<Box
								sx={{
									width: 220,
									flexShrink: 0,
									backgroundColor: darkMode ? "#252527" : "#f3f3f3"
								}}>
								<Stack sx={{ mt: 1 }}>
									<Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
										EXPLORER
									</Typography>
									<AppTree
										pages={pages}
										selectedIndex={selectedIndex}
										setSelectedIndex={setSelectedIndex}
										currentComponent={currentComponent}
										setCurrentComponent={setCurrentComponent}
										visiblePageIndexs={visiblePageIndexs}
										setVisiblePageIndexs={setVisiblePageIndexs}
									/>
								</Stack>
							</Box>
						)}

						{/* Editor / portfolio content surface */}
						<Box
							sx={{
								flex: 1,
								minWidth: 0,
								display: "flex",
								flexDirection: "column",
								overflow: "hidden"
							}}>
							<Box sx={{ height: "33px", flexShrink: 0 }}>
								<AppButtons
									pages={visiblePages}
									selectedIndex={selectedIndex}
									setSelectedIndex={setSelectedIndex}
									setCurrentComponent={setCurrentComponent}
									visiblePageIndexs={visiblePageIndexs}
									setVisiblePageIndexs={setVisiblePageIndexs}
								/>
							</Box>
							<Box
								sx={{
									flex: 1,
									minHeight: 0,
									scrollBehavior: "smooth",
									overflowY: "auto",
									overflowX: "hidden",
									background: !darkMode ? "#FFFFFF" : "#1e1e1e"
								}}>
								<Container sx={{ minHeight: "100%", overflowX: "hidden" }}>{children}</Container>
							</Box>
						</Box>

						{/* Right agents panel — reserved slot, populated in Phase F */}
						{agentsOpen && (
							<Box sx={{ width: 320, flexShrink: 0, borderLeft: 1, borderColor: "divider" }} />
						)}
					</Box>

					{/* Status bar */}
					<Box sx={{ flexShrink: 0 }}>
						<Footer />
					</Box>
				</Box>
			</ThemeProvider>
		</CacheProvider>
	);
}
