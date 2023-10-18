import { Container, CssBaseline, Grid, Stack, ThemeProvider, Typography, createTheme, darkScrollbar } from "@mui/material";
import { useEffect, useState } from "react";
import { isBrowser } from "react-device-detect";
import MDContainer from "../components/MDContainer";
import usePageTracking from "../hooks/usePageTracking";
import AppButtons from "./AppButtons";
import AppTree from "./AppTree";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import pages from "@/app/pages/pages";

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

export default function App() {
	const [expanded, setExpanded] = useState(isBrowser);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [currentComponent, setCurrentComponent] = useState("");
	const [visiblePageIndexs, setVisiblePageIndexs] = useState(initVisiblePageIndexs(pages));
	const [darkMode, setDarkMode] = useState(false);
	const [visiblePages, setVisiblePages] = useState(pages);
	const paletteType = darkMode ? "dark" : "light";
	usePageTracking();
	const theme = createTheme({
		palette: {
			mode: paletteType,
			background: {
				default: paletteType === "light" ? "#FFFFFF" : "#1e1e1e"
			}
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					body: paletteType === "dark" ? darkScrollbar() : null
				}
			},
			MuiDivider: {
				styleOverrides: {
					root: {
						borderColor: "rgba(255, 255, 255, 0.12)"
					}
				}
			}
		}
	});

	function handleThemeChange() {
		setDarkMode(!darkMode);
		localStorage.setItem("theme", darkMode ? "light" : "dark");
	}

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
							<Grid
								item
								sx={{
									backgroundColor: darkMode ? "#252527" : "#f3f3f3",
									width: 220
								}}
							>
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

						<Grid item xs zeroMinWidth>
							<Grid
								sx={{
									height: "33px"
								}}
							>
								<AppButtons
									// pages={pages}
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
									// overflow: 'scroll',
									overflowY: "auto",
									height: `calc(100vh - 20px - 33px)`
								}}
							></Grid>
						</Grid>
					</Grid>
					<Grid item lg={12} md={12} sm={12} xs={12}>
						<Footer />
					</Grid>
				</Grid>
			</Container>
			{/* </Router> */}
		</ThemeProvider>
	);
}
