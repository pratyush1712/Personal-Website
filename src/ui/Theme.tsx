import { createTheme, darkScrollbar } from "@mui/material";

// Cursor Dark+ inspired design tokens. Phase A foundation: surfaces, text, borders and the
// accent all flow from here, so later phases recolor by adjusting tokens rather than touching
// individual components. Ordering from darkest to lightest in dark mode: appBg < panel < surface.
export const TOKENS = {
	dark: {
		appBg: "#0d0d0f", // near-black app background (root / gaps between panels)
		panel: "#161618", // sidebar + side panels, slightly lifted off black
		surface: "#1a1a1c", // editor / content surface, dark neutral
		elevated: "#202024", // hover / raised state
		border: "#2a2a2e", // subtle, muted divider
		textPrimary: "#e6e6e6", // off-white
		textSecondary: "#8a8a92", // muted gray
		accent: "#4d9cf0" // minimal, refined accent — used sparingly
	},
	light: {
		appBg: "#ffffff",
		panel: "#f5f5f5",
		surface: "#ffffff",
		elevated: "#ececec",
		border: "#e2e2e2",
		textPrimary: "#1a1a1a",
		textSecondary: "#5f5f5f",
		accent: "#007acc"
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
		divider: t.border
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
					"&:hover": { backgroundColor: t.surface },
					"@media (max-width:600px)": { padding: "4px 8px" }
				}
			}
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					color: t.textPrimary,
					backgroundColor: t.surface,
					"&:hover": { backgroundColor: t.surface },
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
