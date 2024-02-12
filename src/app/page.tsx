import { Box, Divider, Grid, IconButton, Link, Stack, Tooltip, Typography } from "@mui/material";
import { links } from "@/utils/links";
import PlayList from "@/components/PlayList/index";

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
		<Grid
			container
			direction="column"
			alignItems="center"
			justifyContent="center"
			spacing={0}
			sx={{ minHeight: `calc(100vh)`, width: "100%" }}
		>
			<Grid item xs={12}>
				<Typography variant="h3" align="center" sx={{ margin: "20px 0" }}>
					Pratyush Sudhakar
				</Typography>
			</Grid>

			{/* Playlist occupying most of the screen */}
			<Grid item xs={12} sx={{ flexGrow: 1, width: "100%", height: "20vh" }}>
				<PlayList />
			</Grid>

			{/* Links at the bottom */}
			<Grid item xs={12}>
				<Box sx={{ width: "100%", display: "flex", justifyContent: "center", padding: "20px 0" }}>
					<Stack direction="row" spacing={2}>
						{links.filter(link => link.type === "professional").map(iconLink)}
						<Divider orientation="vertical" flexItem />
						{links.filter(link => link.type === "social").map(iconLink)}
					</Stack>
				</Box>
			</Grid>
		</Grid>
	);
}
