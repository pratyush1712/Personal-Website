"use client";
import { signIn } from "next-auth/react";
import { Container, Button, Typography } from "@mui/material";

export default function Login() {
	const handleLogin = async () => {
		await signIn("google", { callbackUrl: "/close-friends" });
	};

	return (
		<Container maxWidth="md" sx={{ pb: 1, minWidth: "100%" }}>
			<Typography variant="h3">Login</Typography>
			<Button variant="contained" onClick={handleLogin}>
				Login with Google
			</Button>
		</Container>
	);
}
