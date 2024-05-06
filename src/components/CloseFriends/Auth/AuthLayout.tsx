"use client";
import "@/app/globals.css";
import createTheme from "@/ui/Theme";
import { ThemeProvider, CssBaseline } from "@mui/material";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	const theme = createTheme(true, {
		palette: {
			type: "dark",
			primary: { main: "#E50914" },
			secondary: { main: "#E50914", dark: "#E50914" },
			info: { main: "#E50914" }
		}
	});
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}
