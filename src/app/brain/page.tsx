import { Metadata } from "next";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NeurodivergentExperienceDiagram from "@/components/BrainLayout/Experience";
import AlexithymiaGraph from "@/components/BrainLayout/Alexithymia";
import AutismBrainGraph from "@/components/BrainLayout/Autism";

export const metadata: Metadata = {
	title: "Pratyush | Neurodivergent Brain",
	description: "Pratyush Sudhakar's neurodivergent experience diagram.",
	robots: "noindex, nofollow",
	keywords: [
		"Pratyush Sudhakar Neurodivergent",
		"Pratyush Sudhakar Neurodivergent Brain",
		"Pratyush Sudhakar Neurodivergent Experience",
		"Pratyush Neurodivergent",
		"Pratyush Neurodivergent Brain",
		"Pratyush Neurodivergent Experience"
	]
};

export default function Page() {
	return (
		<Box sx={{ flexGrow: 1, p: 4 }}>
			<Grid container spacing={2} alignItems="flex-start">
				<Grid container xs={12}>
					<Grid item xs={12} md={6}>
						<Typography variant="h5" align="center" gutterBottom>
							Neurodivergent Experience
						</Typography>
						<NeurodivergentExperienceDiagram />
					</Grid>

					<Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

					<Grid item xs={12} md={5}>
						<Typography variant="h5" align="center" gutterBottom>
							Alexithymia Map
						</Typography>
						<AlexithymiaGraph />
					</Grid>
				</Grid>

				<Divider orientation="horizontal" flexItem sx={{ mx: 2 }} />

				<Grid item xs={12}>
					<Typography variant="h5" align="center" gutterBottom>
						Autism & the Brain
					</Typography>
					<AutismBrainGraph />
				</Grid>
			</Grid>
		</Box>
	);
}
