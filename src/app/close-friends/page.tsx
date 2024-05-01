import { Container } from "@mui/material";
import { ContentDisplay } from "@/components/CloseFriends";

export default function CloseFriends() {
	return (
		<Container maxWidth="md" sx={{ minWidth: "100%", margin: "auto" }}>
			<ContentDisplay />
		</Container>
	);
}
