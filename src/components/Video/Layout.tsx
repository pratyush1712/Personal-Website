"use client";
import createTheme from "@/ui/Theme";
import { AppBar, Box, Container, CssBaseline, ThemeProvider, Toolbar, Typography } from "@mui/material";

const VideoLayout = ({ children }: { children: React.ReactNode }) => {
	const theme = createTheme(true, {
		palette: {
			type: "dark",
			primary: { main: "#DFDBD5" },
			secondary: { main: "#DFDBD5", dark: "#DFDBD5" },
			info: { main: "#DFDBD5" }
		},
		components: {
			MuiContainer: {
				/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
				styleOverrides: { root: (ownerState: { disableGutters: any }) => ({ minWidth: "100%" }) }
			}
		}
	});
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline enableColorScheme />
			<Container
				disableGutters
				sx={{
					width: "100vw",
					color: "#fff",
					minWidth: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					minHeight: "100vh"
				}}>
				<AppBar position="static" sx={{ background: "#E50914" }}>
					<Toolbar>
						<Typography variant="h6">
							<strong>CS 4701 Final Project Video</strong> - Predictvie Analysis of Depression based on
							Actigraphy Data
						</Typography>
					</Toolbar>
				</AppBar>
				{children}
				<Box sx={{ bgcolor: "#E50914", color: "#fff", p: 2 }}>
					<Container>
						<Typography variant="body1" align="center" gutterBottom>
							Predictive Analysis in Mental Health Using Sleep Activity Data
						</Typography>
						<Typography variant="subtitle1" align="center" color="textSecondary" component="p">
							Project Partners: Liam Du, Yiming Wang, Pratyush Sudhakar
						</Typography>
						<Typography variant="body2" align="center" color="textSecondary">
							CS 4701, Cornell University, 2024
						</Typography>
					</Container>
				</Box>
			</Container>
		</ThemeProvider>
	);
};

export default VideoLayout;
