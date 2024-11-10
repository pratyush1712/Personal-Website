import { Box, Divider, Grid, IconButton, Link, Stack, Tooltip, Typography } from "@mui/material";
import { links } from "@/utils/links";
import Image from "next/image";
import AnimatedTextComponent from "@/ui/HomePageCaption";

export default function Home() {
	const iconLink = (link: any) => {
		return (
			<Tooltip key={link.index} title={link.title} arrow>
				<Link target="_blank" href={link.href} underline="none" color="inherit">
					<IconButton color="inherit">{link.icon}</IconButton>
				</Link>
			</Tooltip>
		);
	};

	return (
		<Grid container alignItems="center" justifyContent="center" spacing={0} sx={{ mr: 0 }}>
			<Grid
				item
				sx={{
					mt: 20,
					alignItems: "flex-start",
					display: "flex",
					flexDirection: "column"
				}}>
				<Grid item xs={12} sx={{ mt: 2 }}>
					<Typography variant="h1" sx={{ ml: { xs: -2, sm: 0 }, fontSize: { xs: "1.5rem", sm: "3.5rem" } }}>
						Pratyush Sudhakar
					</Typography>
				</Grid>
				<AnimatedTextComponent />
				{/* Links at the bottom */}
				<Grid item xs={12} sx={{ ml: { xs: -2, sm: -0.4 } }}>
					<Box sx={{ minWidth: "100%", display: "flex", justifyContent: "center" }}>
						<Stack direction="row" spacing={{ xs: 2, sm: 2.5 }} sx={{ mx: "auto" }}>
							{links.filter(link => link.type === "professional").map(iconLink)}
							<Divider orientation="vertical" flexItem />
							{links.filter(link => link.type === "social").map(iconLink)}
						</Stack>
					</Box>
				</Grid>
			</Grid>
			<Grid item sx={{ mt: 23 }}>
				<Image
					src="/favicon.png"
					alt="Pratyush Sudhakar"
					width={120}
					height={120}
					style={{ border: 2, borderRadius: "80%" }}
				/>
			</Grid>
		</Grid>
	);
}
