import { Container, Typography } from "@mui/material";
import { ContentDisplay } from "@/components/CloseFriends";

export default function AdminDashboard() {
	return (
		<Container maxWidth="lg">
			<Typography variant="h4" sx={{ my: 4 }}>
				Admin Dashboard
			</Typography>
			<ContentDisplay />
		</Container>
	);
}
