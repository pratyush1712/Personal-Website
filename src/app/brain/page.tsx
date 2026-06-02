import { Metadata } from "next";
import Grid from "@mui/material/Grid";
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
			{/* Sections are separated by Grid spacing rather than Dividers so the columns read as
			    related views of one diagram instead of being chopped apart by hard rules. */}
			<Grid container spacing={4} alignItems="flex-start">
				<Grid container item xs={12} spacing={4}>
					<Grid item xs={12} md={6}>
						<Typography variant="h5" align="center" gutterBottom>
							Neurodivergent Experience
						</Typography>
						<NeurodivergentExperienceDiagram />
					</Grid>

					<Grid item xs={12} md={6}>
						<Typography variant="h5" align="center" gutterBottom>
							Alexithymia Map
						</Typography>
						<AlexithymiaGraph />
					</Grid>
				</Grid>

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
