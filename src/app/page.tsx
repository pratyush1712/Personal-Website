import { Box, Divider, Grid, IconButton, Link, Stack, Tooltip, Typography } from "@mui/material";
import { links } from "../lib/links";
import Iframe from "react-iframe";

const NeverSayNeverComponent = () => {
	return (
		<Grid display="flex" justifyContent={{ xs: "flex-start" }}>
			<Iframe
				url="https://open.spotify.com/embed/track/5rAUZy2eDdegBxUVYxePK2?utm_source=generator"
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
				loading="lazy"
				styles={{ border: "none", maxHeight: "80px", borderRadius: "13px", margin: "7px 0px", width: "400px" }}
			></Iframe>
		</Grid>
	);
};

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
			spacing={0}
			marginTop={{ xs: -20, sm: -6.75 }}
			marginLeft={{ xs: 2, sm: -3 }}
			direction="column"
			alignItems="center"
			justifyContent="center"
			sx={{ minHeight: `calc(100vh)` }}
		>
			<Grid item xs={3}>
				<Stack direction={{ xs: "column", sm: "row-reverse" }} spacing={2}>
					<Box display="flex" sx={{ justifyContent: "center", display: { xs: "none", md: "block" } }}></Box>
					<Box>
						<Grid display="flex" justifyContent={{ xs: "center", sm: "flex-start" }}>
							<Typography variant="h3">Pratyush Sudhakar</Typography>
						</Grid>
						<NeverSayNeverComponent />
						<Grid display="flex" justifyContent={"flex-start"}>
							<Stack direction="row" spacing={2.2}>
								{links.filter(link => link.type === "professional").map(link => iconLink(link))}
								<Divider sx={{ m: 0.5 }} orientation={"vertical"} />
								{links.filter(link => link.type === "social").map(link => iconLink(link))}
							</Stack>
						</Grid>
					</Box>
				</Stack>
			</Grid>
		</Grid>
	);
}
