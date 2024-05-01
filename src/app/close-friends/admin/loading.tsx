import { CircularProgress, Typography } from "@mui/material";

export default function Loading() {
	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
			<div>
				<CircularProgress />
				<Typography variant="h6">Loading...</Typography>
			</div>
		</div>
	);
}
