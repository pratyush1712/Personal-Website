"use client";
import { Box, Typography, Button } from "@mui/material";
import { signOut } from "next-auth/react";

export default function Footer({ darkMode = true, loggedIn = true }: { darkMode: boolean; loggedIn: boolean }) {
	const handleSignOut = async () => {
		await signOut({ callbackUrl: "/login" });
	};

	return (
		<Box
			component="footer"
			sx={{
				position: "fixed",
				left: 0,
				bottom: 0,
				width: "100%",
				py: 2,
				px: 3,
				backgroundColor: darkMode ? "#141414" : "#fff",
				borderTop: `1px solid #E50914`,
				textAlign: "center",
				zIndex: 1000
			}}>
			<Typography variant="body2" sx={{ color: darkMode ? "#FFFFFF" : "#000000", opacity: 1 }}>
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
				{loggedIn && (
					<Typography
						variant="body2"
						component={Button}
						onClick={handleSignOut}
						sx={{ textDecoration: "none" }}>
						Logout
					</Typography>
				)}
			</Typography>
		</Box>
	);
}
