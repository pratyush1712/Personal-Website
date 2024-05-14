"use client";
import { Container, Typography, ThemeProvider, CssBaseline, Box } from "@mui/material";
import createTheme from "@/ui/Theme";
import { getSession } from "next-auth/react";
import { useState, useEffect, startTransition } from "react";
import { User } from "@/types";
import Video from "@/ui/Video";
import Link from "next/link";
import Footer from "./Footer";
import Loading from "@/ui/Loading";
import { RiExternalLinkLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

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
	const router = useRouter();

	useEffect(() => {
		getSession()
			.then(session => {
				if (session?.user) {
					setUser(session.user);
				}
			})
			.finally(() => setLoading(false));
	}, []);

	const adminURL = process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "/admin" : "/close-friends/admin";
	const [showText, setShowText] = useState(false);
	const [widthState, setWidthState] = useState("80%");

	useEffect(() => {
		const interval = setInterval(() => {
			setWidthState(widthState => {
				if (widthState === "100%") {
					clearInterval(interval);
					return "fit-content";
				}
				const width = parseInt(widthState.replace("%", "")) + 0.5;
				return `${width}%`;
			});
		}, 150);
		const timer = setTimeout(() => {
			setShowText(true);
			clearTimeout(timer);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	const handleClickMore = (e: any) => {
		e.preventDefault();
		const url = window.location.href;
		const offset = new URLSearchParams(url.split("?")[1]).get("offset");
		const limit = new URLSearchParams(url.split("?")[1]).get("limit");
		const URL = new URLSearchParams(url.split("?")[1]);
		URL.set("offset", parseInt(offset ?? "0").toString());
		URL.set("limit", (parseInt(limit ?? "5") + 5).toString());
		startTransition(() => {
			router.replace(`${url.split("?")[0]}?${URL.toString()}`, { scroll: false });
		});
	};

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
						minHeight: 500,
						mb: 2,
						minWidth: "100%",
						p: 0
					}}>
					<Video src={"/videos/background.mp4"} autoPlay={true} loop={true} muted={true} />
					<Typography
						variant="h4"
						sx={{
							position: "absolute",
							bottom: "5%",
							left: "10%",
							transform: "translate(-10%, -5%)",
							backgroundColor: "rgba(255, 255, 255, 0.6)",
							py: 2,
							px: 6,
							width: "100vw",
							borderBottom: `2px solid #E50914`,
							color: "black",
							zIndex: 1
						}}>
						<strong>
							Hi{" "}
							<Typography component="span" variant="inherit" sx={{ color: "#E50914" }}>
								{user?.name ?? "there"}
							</Typography>
							! 👋{" "}
						</strong>
						<Typography
							variant="subtitle1"
							sx={{
								width: "100vw",
								marginBottom: 2,
								fontStyle: "italic",
								zIndex: 1,
								color: "black"
							}}>
							<strong>
								{user?.email
									? "Welcome to my Close Friends page! This is a private page for my close friends only. If you're seeing this, you're one of them! 🎉"
									: "Welcome to my blog and video sharing platform! 🎉"}
							</strong>
						</Typography>
						<Box
							sx={{
								borderRadius: 2,
								py: 0,
								my: 0,
								fontSize: "0.35em",
								maxWidth: "fit-content",
								cursor: "pointer",
								zIndex: 1,
								transition: "transform 0.4s ease-in-out",
								"&:hover": {
									transform: "scale(1.04)"
								}
							}}>
							<Link
								href="/blog/latest" // regardless of the href, the link will always redirect to the /blog/latest page because on production it links to domain/blog/latest and on development it links to close-friends/blog/latest: both of which are the same page
								style={{
									display: "flex",
									alignItems: "center",
									height: "50px",
									color: "white",
									width: showText ? "100%" : widthState,
									letterSpacing: 0,
									backgroundColor: "rgba(0, 0, 0, 0.98)",
									paddingTop: 3,
									marginBottom: 12,
									paddingBottom: 3,
									paddingRight: 4,
									transition: "width 1s ease, opacity 1s ease",
									textDecoration: "none"
								}}>
								<span
									style={{
										display: "inline-block",
										textAlign: "center",
										backgroundColor: `rgba(229, 9, 20, 1)`,
										border: "2px solid #E50914",
										minWidth: "4px",
										paddingTop: "35px",
										paddingBottom: "35px",
										left: 0,
										position: "relative",
										animation: "pulse 2s infinite"
									}}></span>
								<span
									style={{
										position: "relative",
										display: "flex",
										width: showText ? "100%" : 0,
										overflow: "hidden",
										fontSize: "1.25em",
										marginRight: 25,
										left: 15,
										whiteSpace: "nowrap",
										verticalAlign: "middle",
										transition: "width 1s ease, opacity 1s ease",
										opacity: showText ? 1 : 0
									}}>
									Checkout my latest blog post!
									<RiExternalLinkLine size={17} style={{ marginLeft: 2, color: "#E50914" }} />
								</span>
								<span
									style={{
										display: "inline-block",
										textAlign: "center",
										backgroundColor: `rgba(229, 9, 20, 1)`,
										border: "2px solid #E50914",
										maxWidth: "1px",
										paddingTop: "24px",
										paddingBottom: "22px",
										right: -4,
										left: showText ? "auto" : 0,
										position: "relative",
										animation: "pulse 2s infinite"
									}}></span>
							</Link>
						</Box>
					</Typography>
					<Box
						sx={{
							position: "absolute",
							bottom: 50,
							left: 100,
							borderRadius: 2,
							height: "50px",
							cursor: "pointer",
							zIndex: 1,
							transition: "transform 0.4s ease-in-out",
							"&:hover": {
								transform: "scale(1.04)"
							}
						}}></Box>
				</Container>
				<Container disableGutters sx={{ height: "100%", minWidth: "100%", mb: 10 }}>
					{children}
					<Typography variant="body1" sx={{ textAlign: "center", cursor: "pointer", mt: 5, mb: 2 }} onClick={handleClickMore}>
						Click here to view more...
					</Typography>
				</Container>
				{user?.email === "pratyushsudhakar03@gmail.com" && (
					<Box sx={{ position: "fixed", bottom: 20, right: 30, zIndex: 1500 }}>
						<Link
							href={`${adminURL}`}
							passHref
							style={{
								borderColor: "#E50914",
								padding: 10,
								borderWidth: 2,
								borderStyle: "solid",
								borderRadius: 5
							}}>
							Admin
						</Link>
					</Box>
				)}
				<Footer darkMode={true} loggedIn={!!user} />
			</Container>
		</ThemeProvider>
	);
}
