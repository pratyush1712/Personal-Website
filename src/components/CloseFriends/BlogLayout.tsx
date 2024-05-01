"use client";
import "@/app/globals.css";
import createTheme from "@/ui/Theme";
import { ThemeProvider, CssBaseline } from "@mui/material";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
	const theme = createTheme(false);
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}
