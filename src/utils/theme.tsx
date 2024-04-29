import { PaletteOptions, createTheme, darkScrollbar } from "@mui/material";

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
			styleOverrides: { body: darkMode ? darkScrollbar() : null, textDecorationColor: !darkMode ? "#000000" : "#FFFFFF" }
		},
		MuiPaper: { styleOverrides: { root: { backgroundColor: !darkMode ? "#FFFFFF" : "#1e1e1e" } } },
		MuiContainer: {
			styleOverrides: {
				root: {
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
					"&:hover": { backgroundColor: !darkMode ? "#FFFFFF" : "#1e1e1e" }
				}
			}
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					color: !darkMode ? "#000000" : "#FFFFFF",
					backgroundColor: !darkMode ? "#FFFFFF" : "#1e1e1e",
					"&:hover": { backgroundColor: !darkMode ? "#FFFFFF" : "#1e1e1e" }
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
					"&:hover": { color: !darkMode ? "#000000" : "#FFFFFF" }
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
					"&:hover": { color: !darkMode ? "#000000" : "#FFFFFF" }
				}
			}
		}
	};
	const components = { ...baseComponents, ...paletteOverrides?.components };
	return createTheme({ palette, components });
}
