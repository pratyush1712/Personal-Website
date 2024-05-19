"use client";
import { useEffect, useState } from "react";
import { Container, CssBaseline, Grid, Stack, ThemeProvider, Typography } from "@mui/material";
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

interface VSCodeLayoutProps {
	options: any;
	children: React.ReactNode;
}

export default function VSCodeLayout({ options, children }: VSCodeLayoutProps) {
	const router = useRouter();
	const params = useParams();
	const pathname = usePathname();
	const [expanded, setExpanded] = useState(isBrowser);
	const [selectedIndex, setSelectedIndex] = useState(routeToPage[params.slug as string]?.index ?? null);
	const [currentComponent, setCurrentComponent] = useState("");
	const [visiblePageIndexs, setVisiblePageIndexs] = useState(initVisiblePageIndexs(pages));
	const [darkMode, setDarkMode] = useState(true);
	const [visiblePages, setVisiblePages] = useState(pages);

	const theme = createTheme(darkMode);
	function handleThemeChange() {
		setDarkMode(!darkMode);
		theme.palette.mode = darkMode ? "dark" : "light";
		localStorage.setItem("darkMode", JSON.stringify(!darkMode));
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

	useEffect(() => {
		if (!isBrowser && pathname === "/") {
			router.push("/overview");
		}
	}, [router, pathname]);

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
				<Container sx={{ m: 0, p: 0, overflowY: "hidden" }} maxWidth={false} disableGutters>
					<Grid container sx={{ overflow: "auto", overflowY: "hidden" }}>
						<Grid container sx={{ overflow: "auto" }}>
							{isBrowser && (
								<Grid item sx={{ width: 50 }}>
									<Sidebar
										setExpanded={setExpanded}
										expanded={expanded}
										darkMode={darkMode}
										handleThemeChange={handleThemeChange}
									/>
								</Grid>
							)}
							{expanded && (
								<Grid item sx={{ backgroundColor: darkMode ? "#252527" : "#f3f3f3", width: 220 }}>
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
								</Grid>
							)}

							<Grid item xs zeroMinWidth sx={{ width: "100%" }}>
								<Grid item sx={{ height: "33px" }}>
									<AppButtons
										pages={visiblePages}
										selectedIndex={selectedIndex}
										setSelectedIndex={setSelectedIndex}
										// currentComponent={currentComponent}
										setCurrentComponent={setCurrentComponent}
										visiblePageIndexs={visiblePageIndexs}
										setVisiblePageIndexs={setVisiblePageIndexs}
									/>
								</Grid>
								<Grid
									sx={{
										scrollBehavior: "smooth",
										overflowY: "auto",
										maxHeight: "calc(100vh - 53px)",
										background: !darkMode ? "#FFFFFF" : "#1e1e1e"
									}}>
									<Container
										sx={{
											minHeight: "calc(100vh - 53px)",
											maxHeight: "calc(100vh - 53px)",
											overflowY: "auto",
											overflowX: "hidden"
										}}>
										{children}
									</Container>
								</Grid>
							</Grid>
						</Grid>
						<Grid item lg={12} md={12} sm={12} xs={12}>
							<Footer />
						</Grid>
					</Grid>
				</Container>
			</ThemeProvider>
		</CacheProvider>
	);
}
