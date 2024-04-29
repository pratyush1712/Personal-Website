"use client";
import { Container, Typography, ThemeProvider, CssBaseline, CardContent, Card, Box, CardMedia, Button } from "@mui/material";
import createTheme from "@/ui/theme";
import { getSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { User } from "@/types";
import "@mux/mux-player/themes/minimal";
import Video from "@/ui/Video";
import { usePathname } from "next/navigation";

export default function CloseFriendsLayout({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const path = usePathname();

	const theme = createTheme(true, {
		components: {
			MuiContainer: {
				styleOverrides: { root: (ownerState: { disableGutters: any }) => ({ minWidth: "100%" }) }
			}
		}
	});

	const handleSignOut = async () => {
		await signOut({ callbackUrl: "/" });
	};

	useEffect(() => {
		getSession().then(session => {
			if (session?.user) {
				setUser(session.user);
			}
		});
	}, []);

	if (path === "/close-friends/admin") {
		return (
			<ThemeProvider theme={theme}>
				<CssBaseline enableColorScheme />
				{children}
			</ThemeProvider>
		);
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline enableColorScheme />
			<Container disableGutters sx={{ width: "100vw", color: "#fff", minWidth: "100%" }}>
				<Container
					disableGutters
					sx={{ position: "relative", overflow: "hidden", zIndex: 1, minHeight: 350, mb: 4, minWidth: "100%", p: 0 }}
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
							{user?.name}
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
						Welcome to my Close Friends page! This is a private page for my close friends only. If you&apos;re seeing this,
						you&apos;re one of them! 🎉
					</Typography>
				</Container>
				<Container disableGutters sx={{ height: "100%", minWidth: "100%", mb: 7 }}>
					{children}
				</Container>
				<Box
					component="footer"
					sx={{
						position: "fixed",
						left: 0,
						bottom: 0,
						width: "100%",
						py: 2,
						px: 3,
						backgroundColor: "#141414",
						borderTop: `1px solid #E50914`,
						textAlign: "center",
						zIndex: 1000
					}}
				>
					<Typography variant="body2" sx={{ color: "#FFFFFF", opacity: 0.7 }}>
						Isn&apos;t it soo cool 🌟
						<Typography component="span" sx={{ color: "#E50914" }}>
							{" "}
							|{" "}
						</Typography>
						<Typography variant="body2" component="a" href="tel:+1 607 279 4794" sx={{ textDecoration: "none" }}>
							Call me!
							<Typography component="span" sx={{ color: "#E50914" }}>
								{" "}
								|{" "}
							</Typography>
						</Typography>
						<Typography variant="body2" component={Button} onClick={handleSignOut} sx={{ textDecoration: "none" }}>
							Logout
						</Typography>
					</Typography>
				</Box>
			</Container>
		</ThemeProvider>
	);
}
