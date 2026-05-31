"use client";
import { useEffect, useMemo, useState } from "react";
import { Box, Container, CssBaseline, Drawer, ThemeProvider, useMediaQuery } from "@mui/material";
import createTheme, { TOKENS } from "@/ui/Theme";
import { isBrowser } from "react-device-detect";
import AgentsPanel from "./AgentsPanel";
import AppButtons from "./AppButtons";
import ExplorerPanel from "./ExplorerPanel";
import Footer from "./Footer";
import TopCommandBar from "./TopCommandBar";
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
	const [explorerOpen, setExplorerOpen] = useState(false);
	// Right-side agents panel. Toggled from the top bar; the panel content is built in Phase F.
	const [agentsOpen, setAgentsOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(routeToPage[params.slug as string]?.index ?? null);
	const [currentComponent, setCurrentComponent] = useState("");
	const [visiblePageIndexs, setVisiblePageIndexs] = useState(initVisiblePageIndexs(pages));
	const [darkMode, setDarkMode] = useState(true);
	const [visiblePages, setVisiblePages] = useState(pages);

	// Theme is derived purely from darkMode — no in-place palette mutation. Recreated only
	// when the mode flips.
	const theme = useMemo(() => createTheme(darkMode), [darkMode]);
	// Below 768px the side panels become temporary overlay drawers instead of inline columns.
	const isMobile = useMediaQuery("(max-width:767.98px)");
	function handleThemeChange() {
		setDarkMode(prev => {
			const next = !prev;
			localStorage.setItem("darkMode", JSON.stringify(next));
			return next;
		});
	}

	// Human-readable label of the current route for the top bar (normalizes "/overview" -> "overview").
	const currentPage = pathname && pathname !== "/" ? pathname.replace(/^\/+/, "") : "Home";

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

	useEffect(() => {
		document.documentElement.style.colorScheme = darkMode ? "dark" : "light";
	}, [darkMode]);

	// On first mount, collapse the side panels on a narrow viewport (they open as drawers there).
	// Keyed to mount only — not to isMobile — so a user-opened drawer is never force-closed.
	useEffect(() => {
		if (typeof window !== "undefined") {
			const isMobileViewport = window.matchMedia("(max-width:767.98px)").matches;
			setExplorerOpen(isBrowser && !isMobileViewport);
			setAgentsOpen(false);
		}
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

	// Defined once and rendered either inline (desktop) or inside a Drawer (mobile).
	const explorerPanel = (
		<ExplorerPanel
			pages={pages}
			visiblePages={visiblePages}
			selectedIndex={selectedIndex}
			setSelectedIndex={setSelectedIndex}
			currentComponent={currentComponent}
			setCurrentComponent={setCurrentComponent}
			visiblePageIndexs={visiblePageIndexs}
			setVisiblePageIndexs={setVisiblePageIndexs}
		/>
	);
	const agentsPanel = <AgentsPanel onClose={() => setAgentsOpen(false)} currentPage={currentPage} />;

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
					<TopCommandBar
						darkMode={darkMode}
						onThemeToggle={handleThemeChange}
						explorerOpen={explorerOpen}
						onExplorerToggle={() => setExplorerOpen(prev => !prev)}
						agentsOpen={agentsOpen}
						onAgentsToggle={() => setAgentsOpen(prev => !prev)}
						currentPage={currentPage}
					/>
					<Box sx={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>
						{/* Explorer sidebar (inline on desktop; a drawer on mobile — see below) */}
						{!isMobile && explorerOpen && explorerPanel}

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
									backgroundColor: darkMode ? TOKENS.dark.surface : TOKENS.light.surface
								}}>
								<Container sx={{ minHeight: "100%", overflowX: "hidden" }}>{children}</Container>
							</Box>
						</Box>

						{/* Right agents panel (inline on desktop; a drawer on mobile — see below) */}
						{!isMobile && agentsOpen && agentsPanel}

						{/* Mobile: side panels become temporary overlay drawers so they never
						    squeeze or overflow the content. */}
						{isMobile && (
							<>
								<Drawer
									anchor="left"
									open={explorerOpen}
									onClose={() => setExplorerOpen(false)}
									ModalProps={{ keepMounted: true }}>
									{explorerPanel}
								</Drawer>
								<Drawer
									anchor="right"
									open={agentsOpen}
									onClose={() => setAgentsOpen(false)}
									ModalProps={{ keepMounted: true }}>
									{agentsPanel}
								</Drawer>
							</>
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
