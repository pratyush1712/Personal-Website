"use client";
import { Box, Divider, Grid, IconButton, Link, Stack, Tooltip, Typography } from "@mui/material";
import { links } from "@/utils/links";
import Image from "next/image";
import AnimatedTextComponent from "@/ui/HomePageCaption";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// eslint-disable-next-line @next/next/no-async-client-component
export default async function Home(props: { params: Params; searchParams: SearchParams }) {
	const params = await props.params;
	const searchParams = await props.searchParams;

	if (searchParams && searchParams["feedback"]) {
		setTimeout(() => {
			window.location.href = process.env.NEXT_PUBLIC_FEEDBACK_FORM_URL!;
		}, 5000);
	}

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
					<Typography variant="h1" sx={{ ml: { xs: 2, sm: 0 }, fontSize: { xs: "1.5rem", sm: "3.5rem" } }}>
						Pratyush Sudhakar
					</Typography>
				</Grid>
				<Grid item xs={12} sx={{ ml: { xs: 2.45, sm: 0.45 }, overflow: "hidden" }}>
					<AnimatedTextComponent />
				</Grid>
				{/* Links at the bottom */}
				<Grid item xs={12} sx={{ ml: { xs: 1.8, sm: -0.3 } }}>
					<Box sx={{ minWidth: "100%", display: "flex", justifyContent: "center" }}>
						<Stack direction="row" spacing={{ xs: 1.25, sm: 2.2 }} sx={{ mx: "auto" }}>
							{links.filter(link => link.type === "professional").map(iconLink)}
							<Divider orientation="vertical" flexItem />
							{links.filter(link => link.type === "social").map(iconLink)}
						</Stack>
					</Box>
				</Grid>
			</Grid>
			<Grid item sx={{ mt: { xs: 4, sm: 23 } }}>
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
