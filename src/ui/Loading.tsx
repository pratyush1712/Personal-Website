"use client";
import { Backdrop, CircularProgress } from "@mui/material";

export default function Loading() {
	return (
		<Backdrop sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }} open={true}>
			<CircularProgress sx={{ color: "#E50914" }} />
		</Backdrop>
	);
}
