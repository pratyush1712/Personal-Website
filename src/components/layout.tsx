"use client";
import { useEffect, useState } from "react";
import { Container, CssBaseline, Grid, Stack, ThemeProvider, Typography, createTheme, darkScrollbar } from "@mui/material";
import { isBrowser } from "react-device-detect";
import AppButtons from "./AppButtons";
import AppTree from "./AppTree";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import pages, { routeToPage } from "@/lib/pages";
import { useParams, usePathname, useRouter } from "next/navigation";

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

export default function VSCodeLayout({ children }: { children: React.ReactNode }) {
	const [expanded, setExpanded] = useState(isBrowser);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [currentComponent, setCurrentComponent] = useState("");
	const [visiblePageIndexs, setVisiblePageIndexs] = useState(initVisiblePageIndexs(pages));
	const [darkMode, setDarkMode] = useState(true);
	const [visiblePages, setVisiblePages] = useState(pages);
	const paletteType = darkMode ? "dark" : "light";
	const router = useRouter();
	const params = useParams();
	const theme = createTheme({
		palette: {
			mode: paletteType,
			background: { default: paletteType === "light" ? "#FFFFFF" : "#1e1e1e" }
		},
		components: {
			MuiCssBaseline: { styleOverrides: { body: paletteType === "dark" ? darkScrollbar() : null } },
			MuiDivider: { styleOverrides: { root: { borderColor: "rgba(255, 255, 255, 0.12)" } } }
		}
	});

	function handleThemeChange() {
		setDarkMode(!darkMode);
		localStorage.setItem("theme", darkMode ? "light" : "dark");
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
	}, [visiblePageIndexs, router.push, selectedIndex, deletedIndex]);

	useEffect(() => {
		const index = routeToPage[params.slug as string]?.index;
		index && setSelectedIndex(index);
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline enableColorScheme />
			<Container sx={{ m: 0, p: 0, overflowY: "hidden" }} maxWidth={false} disableGutters>
				<Grid container sx={{ overflow: "auto", overflowY: "hidden" }}>
					<Grid container sx={{ overflow: "auto" }}>
						<Grid item sx={{ width: 50 }}>
							<Sidebar
								setExpanded={setExpanded}
								expanded={expanded}
								darkMode={darkMode}
								handleThemeChange={handleThemeChange}
							/>
						</Grid>
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
							<Grid item sx={{ height: "33px", mb: -0.2 }}>
								<AppButtons
									pages={visiblePages}
									selectedIndex={selectedIndex}
									setSelectedIndex={setSelectedIndex}
									currentComponent={currentComponent}
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
									background: "#1E1F1F"
								}}
							>
								<Container
									sx={{
										minHeight: "calc(100vh - 53px)",
										maxHeight: "calc(100vh - 53px)",
										overflowY: "auto",
										overflowX: "hidden"
									}}
								>
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
	);
}
