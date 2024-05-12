"use client";
import { signIn } from "next-auth/react";
import { Container, Button, Typography, AppBar } from "@mui/material";
import Image from "next/image";
import { Box } from "@mui/system";
import { BiLogIn } from "react-icons/bi";
import { FaGlobeAmericas } from "react-icons/fa";

export default function Login() {
	const handleLogin = async () => {
		await signIn("google", { callbackUrl: process.env.NEXT_PUBLIC_VERCEL_ENNV !== "production" ? "/close-friends" : "/" });
	};

	return (
		<Container
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				height: "100vh",
				minWidth: "100vw",
				background: "linear-gradient(135deg, rgba(209, 10, 10, 0.4) 0%, rgba(189, 9, 20, 0.1) 100%)"
			}}>
			<AppBar
				position="static"
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-around",
					minWidth: "100vw",
					px: 4,
					py: 1.5,
					background: "none",
					borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
					boxShadow: "none"
				}}>
				<Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "row" }}>
					<BiLogIn size={24} color="white" />
					<Typography variant="body1" sx={{ color: "white", px: 1 }}>
						My Blog and Video Sharing Platform
					</Typography>
				</Box>
				<Box sx={{ minWidth: "max-content", height: "100%", display: "flex", flexDirection: "row" }}>
					<FaGlobeAmericas size={22} color="white" />
					<Typography variant="body1" sx={{ color: "white", px: 1 }}>
						A Hub for Sharing Content
					</Typography>
				</Box>
			</AppBar>
			<Box sx={{ mb: 4, mt: 4, overflow: "hidden", width: 400, height: 248, position: "relative" }}>
				<Image src="/images/login-background.png" fill alt="logo" style={{ borderRadius: 2, border: "1px solid white" }} />
			</Box>
			<Typography variant="h5">Welcome back</Typography>
			<Typography variant="h6" sx={{ mb: 2, color: "#95a5a6" }}>
				Login to your account
			</Typography>
			<Button
				variant="contained"
				onClick={handleLogin}
				sx={{
					borderRadius: 20,
					px: 5,
					minWidth: "40%",
					background: "rgba(229, 9, 20, 1)",
					"&:hover": { background: "rgba(229, 9, 20, 0.6)" }
				}}>
				Sign in with Google
			</Button>
		</Container>
	);
}
