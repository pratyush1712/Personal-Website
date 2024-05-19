import { createTheme, darkScrollbar } from "@mui/material";

export default function theme(darkMode: boolean, paletteOverrides?: any) {
	const defaultPalette = {
		mode: darkMode ? "dark" : "light",
		background: { default: darkMode ? "#1e1e1e" : "#FFFFFF" },
		primary: { main: darkMode ? "#0e639c" : "#007acc" },
		secondary: { main: darkMode ? "#0e639c" : "#007acc" },
		text: { primary: darkMode ? "#FFFFFF" : "#000000" }
	};
	const palette = { ...defaultPalette, ...paletteOverrides?.palette };

	const baseComponents = {
		MuiCssBaseline: {
			styleOverrides: {
				body: darkMode ? darkScrollbar() : null,
				textDecorationColor: !darkMode ? "#000000" : "#FFFFFF",
				"@media (max-width:600px)": { fontSize: "0.875rem" }
			}
		},
		MuiPaper: { styleOverrides: { root: { backgroundColor: !darkMode ? "#FFFFFF" : "#1e1e1e" } } },
		MuiContainer: {
			styleOverrides: {
				root: {
					ownerState: { disableGutters: true },
					backgroundColor: !darkMode ? "#FFFFFF" : "#1e1e1e",
					textDecorationColor: !darkMode ? "#000000" : "#FFFFFF"
				}
			}
		},
		MuiButton: {
			styleOverrides: {
				root: {
					color: !darkMode ? "#000000" : "#FFFFFF",
					backgroundColor: !darkMode ? "#FFFFFF" : "#1e1e1e",
					"&:hover": { backgroundColor: !darkMode ? "#FFFFFF" : "#1e1e1e" },
					"@media (max-width:600px)": { padding: "4px 8px" }
				}
			}
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					color: !darkMode ? "#000000" : "#FFFFFF",
					backgroundColor: !darkMode ? "#FFFFFF" : "#1e1e1e",
					"&:hover": { backgroundColor: !darkMode ? "#FFFFFF" : "#1e1e1e" },
					"@media (max-width:600px)": { padding: "4px" }
				}
			}
		},
		MuiTabs: {
			styleOverrides: {
				root: {
					backgroundColor: !darkMode ? "#FFFFFF" : "#1e1e1e",
					color: !darkMode ? "#000000" : "#FFFFFF"
				}
			}
		},
		MuiTab: {
			styleOverrides: {
				root: {
					color: !darkMode ? "#000000" : "#FFFFFF",
					"&:hover": { color: !darkMode ? "#000000" : "#FFFFFF" },
					"@media (max-width:600px)": { fontSize: "0.425rem" }
				}
			}
		},
		MuiTypography: {
			styleOverrides: { root: { color: !darkMode ? "#000000" : "#FFFFFF" } }
		},
		MuiListItem: {
			styleOverrides: {
				root: {
					color: !darkMode ? "#000000" : "#FFFFFF",
					"&:hover": { color: !darkMode ? "#000000" : "#FFFFFF" },
					"@media (max-width:600px)": { padding: "4px 8px" }
				}
			}
		}
	};

	const components = { ...baseComponents, ...paletteOverrides?.components };

	return createTheme({
		palette,
		components,
		breakpoints: {
			values: {
				xs: 0,
				sm: 600,
				md: 960,
				lg: 1280,
				xl: 1920
			}
		}
	});
}
