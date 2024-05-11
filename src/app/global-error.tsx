'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Container, Typography, Button, Box } from "@mui/material";
import { MdError } from "react-icons/md";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<Container
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				backgroundColor: "#f2f2f2"
			}}>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					p: 4,
					borderRadius: 2,
					backgroundColor: "#ffffff",
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"
				}}>
				<MdError size={60} color="#D32F2F" style={{ marginBottom: 16 }} />
				<Typography variant="h5" color="error" gutterBottom>
					Something went wrong!
				</Typography>
				<Typography variant="body1" sx={{ mb: 2 }}>
					{error.message}
				</Typography>
				{error.digest && (
					<Typography variant="caption" display="block" sx={{ mb: 2, color: "#666" }}>
						Error Code: {error.digest}
					</Typography>
				)}
				<Button
					variant="contained"
					color="error"
					onClick={reset}
					sx={{
						borderRadius: 20,
						px: 3,
						color: "#fff",
						"&:hover": {
							backgroundColor: "#C62828"
						}
					}}>
					Try Again
				</Button>
			</Box>
		</Container>
	);
}
