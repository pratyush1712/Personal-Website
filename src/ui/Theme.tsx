import { createTheme, darkScrollbar } from "@mui/material";

// Cursor Dark (VS Code "Dark Modern") design tokens. Phase A foundation: surfaces, text, borders
// and the accent all flow from here, so later phases recolor by adjusting tokens rather than
// touching individual components. Values mirror Cursor's default dark theme exactly.
export const TOKENS = {
	dark: {
		appBg: "#1e1e1e", // outer window shell background
		panel: "#252526", // elevated panels — toolbar, tab strip, search dropdown
		surface: "#1e1e1e", // editor content surface (active tab + scroll area)
		elevated: "#2d2d2d", // hover / raised state
		border: "#3a3a3a", // universal divider between regions
		textPrimary: "#cccccc",
		textSecondary: "#858585",
		accent: "#0078d4"
	},
	light: {
		appBg: "#f8f8f8", // window chrome — title bar, activity/side bar, tab strip, status bar
		panel: "#f8f8f8", // side panels (explorer / agents); same chrome tone as the activity bar
		surface: "#ffffff", // editor content surface (active tab + scroll area)
		elevated: "#e8e8e8", // hover / raised state
		border: "#e5e5e5", // universal divider between regions
		textPrimary: "#3b3b3b", // editor foreground
		textSecondary: "#6e6e6e", // muted — inactive tabs, descriptions
		accent: "#005fb8" // Cursor / VS Code "Light Modern" accent blue
	}
};

export default function theme(darkMode: boolean, paletteOverrides?: any) {
	const t = darkMode ? TOKENS.dark : TOKENS.light;

	const defaultPalette = {
		mode: darkMode ? "dark" : "light",
		background: { default: t.appBg, paper: t.panel },
		primary: { main: t.accent },
		secondary: { main: t.accent },
		text: { primary: t.textPrimary, secondary: t.textSecondary },
		divider: t.border,
		action: darkMode
			? { hover: "rgba(255,255,255,0.05)", selected: "rgba(255,255,255,0.08)", active: "#ffffff" }
			: { hover: "rgba(0,0,0,0.04)", selected: "rgba(0,0,0,0.08)", active: "#000000" }
	};
	const palette = { ...defaultPalette, ...paletteOverrides?.palette };

	const baseComponents = {
		MuiCssBaseline: {
			styleOverrides: {
				body: darkMode ? darkScrollbar() : null,
				textDecorationColor: t.textPrimary,
				"@media (max-width:600px)": { fontSize: "0.875rem" }
			}
		},
		MuiPaper: { styleOverrides: { root: { backgroundColor: t.panel } } },
		MuiContainer: {
			styleOverrides: {
				root: {
					ownerState: { disableGutters: true },
					backgroundColor: t.surface,
					textDecorationColor: t.textPrimary
				}
			}
		},
		MuiButton: {
			styleOverrides: {
				root: {
					color: t.textPrimary,
					backgroundColor: t.surface,
					"&:hover": { backgroundColor: t.elevated },
					"@media (max-width:600px)": { padding: "4px 8px" }
				}
			}
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					color: t.textPrimary,
					backgroundColor: t.surface,
					"&:hover": { backgroundColor: t.elevated },
					"@media (max-width:600px)": { padding: "4px" }
				}
			}
		},
		MuiTabs: {
			styleOverrides: {
				root: {
					backgroundColor: t.surface,
					color: t.textPrimary
				}
			}
		},
		MuiTab: {
			styleOverrides: {
				root: {
					color: t.textPrimary,
					"&:hover": { color: t.textPrimary },
					"@media (max-width:600px)": { fontSize: "0.425rem" }
				}
			}
		},
		MuiTypography: {
			styleOverrides: { root: { color: t.textPrimary } }
		},
		MuiListItem: {
			styleOverrides: {
				root: {
					color: t.textPrimary,
					"&:hover": { color: t.textPrimary },
					"@media (max-width:600px)": { padding: "4px 8px" }
				}
			}
		}
	};

	const components = { ...baseComponents, ...paletteOverrides?.components };

	return createTheme({
		palette,
		components,
		typography: {
			fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
			allVariants: { fontStyle: "normal" }
		},
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
