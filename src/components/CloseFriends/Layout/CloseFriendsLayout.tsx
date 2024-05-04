"use client";
import { Container, Typography, ThemeProvider, CssBaseline, Box, Button } from "@mui/material";
import createTheme from "@/ui/Theme";
import { getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { User } from "@/types";
import Video from "@/ui/Video";
import Link from "next/link";
import Footer from "./Footer";
import Loading from "@/ui/Loading";

export default function CloseFriendsLayout({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const theme = createTheme(true, {
		palette: {
			type: "dark",
			primary: { main: "#E50914" },
			secondary: { main: "#E50914", dark: "#E50914" },
			info: { main: "#E50914" }
		},
		components: {
			MuiContainer: {
				styleOverrides: { root: (ownerState: { disableGutters: any }) => ({ minWidth: "100%" }) }
			}
		}
	});

	useEffect(() => {
		getSession()
			.then(session => {
				if (session?.user) {
					setUser(session.user);
				}
			})
			.finally(() => setLoading(false));
	}, []);

	let adminURL: string;
	if (process.env.NODE_ENV === "production") {
		adminURL = ``;
	} else {
		adminURL = `close-friends`;
	}

	if (loading) return <Loading />;

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline enableColorScheme />
			<Container disableGutters sx={{ width: "100vw", color: "#fff", minWidth: "100%" }}>
				<Container
					disableGutters
					sx={{
						position: "relative",
						overflow: "hidden",
						zIndex: 1,
						minHeight: 350,
						mb: 4,
						minWidth: "100%",
						p: 0
					}}
				>
					<Video src={"/videos/background.mp4"} autoPlay={true} loop={true} muted={true} />
					<Typography
						variant="h4"
						sx={{
							pt: 2,
							px: 6,
							width: "100vw",
							backgroundColor: "rgba(0, 0, 0, 0.9)",
							color: "white",
							zIndex: 1
						}}
					>
						Hi{" "}
						<Typography component="span" variant="inherit" sx={{ color: "#E50914" }}>
							{user?.name ?? "there"}
						</Typography>
						! 👋
					</Typography>
					<Typography
						variant="subtitle1"
						sx={{
							px: 6,
							pb: 2,
							width: "100vw",
							marginBottom: 4,
							borderBottom: `2px solid #E50914`,
							backgroundColor: "rgba(0, 0, 0, 0.9)",
							zIndex: 1
						}}
					>
						{user?.email
							? "Welcome to my Close Friends page! This is a private page for my close friends only. If you're seeing this, you're one of them! 🎉"
							: "Welcome to my blog and video sharing platform! 🎉"}
					</Typography>
				</Container>
				<Container disableGutters sx={{ height: "100%", minWidth: "100%", mb: 10 }}>
					{children}
				</Container>
				{user?.email === "pratyushsudhakar03@gmail.com" && (
					<Box sx={{ position: "fixed", bottom: 20, right: 30, zIndex: 1500 }}>
						<Link
							href={`${adminURL}/admin`}
							passHref
							style={{
								borderColor: "#E50914",
								padding: 10,
								borderWidth: 2,
								borderStyle: "solid",
								borderRadius: 5
							}}
						>
							Admin
						</Link>
					</Box>
				)}
				<Footer darkMode={true} loggedIn={!!user} />
			</Container>
		</ThemeProvider>
	);
}
