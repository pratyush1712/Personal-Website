import { Box, Divider, Grid, IconButton, Link, Stack, Tooltip, Typography } from "@mui/material";
import { links } from "@/utils/links";
import PlayList from "@/components/HomeLayout/PlayList";

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
		<Grid container direction="column" alignItems="center" spacing={0}>
			<Grid item xs={12} sx={{ mt: -2, mb: 1 }}>
				<Typography
					variant="h3"
					align="center"
					sx={{
						margin: "20px 0 0 0",
						fontSize: { xs: "1.5rem", sm: "2.5rem" }
					}}>
					Pratyush Sudhakar
				</Typography>
				<Typography
					variant="caption"
					align="center"
					sx={{
						backgroundColor: "rgba(0, 0, 0, 0.7)",
						borderRadius: "2px",
						padding: "5px",
						fontSize: { xs: "0.4rem", sm: "0.8rem" }
					}}>
					I strive to be known as the most approachable person. Always here for friends, nk. call me &#128524;
				</Typography>
			</Grid>
			{/* Links at the bottom */}
			<Grid item xs={12} sx={{ ml: { xs: -2, sm: 0 } }}>
				<Box sx={{ minWidth: "100%", display: "flex", justifyContent: "center" }}>
					<Stack direction="row" spacing={{ xs: 2, sm: 2.5 }} sx={{ mx: "auto" }}>
						{links.filter(link => link.type === "professional").map(iconLink)}
						<Divider orientation="vertical" flexItem />
						{links.filter(link => link.type === "social").map(iconLink)}
					</Stack>
				</Box>
			</Grid>

			{/* Playlist occupying most of the screen */}
			<Grid item xs={12} sx={{ flexGrow: 1, minWidth: "100%", justifyContent: "center" }}>
				<PlayList />
			</Grid>
		</Grid>
	);
}
