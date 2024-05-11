'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Container, Typography, Button, Box } from "@mui/material";
import { MdError } from "react-icons/md";

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

const dummyError = {
	name: "error",
	message: "An error occured",
	digest: "434356"
};
const handleReset = () => {
	console.log("Resetting error...");
};

export default function Error({ error = dummyError, reset = handleReset }: ErrorProps) {
	useEffect(() => console.error(error), [error]);

	return (
		<Container
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "100vh",
				minWidth: "100vw",
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
				{error.digest && (
					<Typography variant="caption" display="block" sx={{ mb: 1, color: "#d2d2d2" }}>
						Error Code: {error?.digest || "error"}
					</Typography>
				)}
				<Typography variant="body1" sx={{ mb: 2, color: "#E57373" }}>
					{error.message ?? "An error occurred"}
				</Typography>
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
