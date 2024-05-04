import { CircularProgress, Typography } from "@mui/material";

export default function Loading() {
	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
			<div>
				<CircularProgress sx={{ color: "#E50914" }} />
			</div>
		</div>
	);
}
