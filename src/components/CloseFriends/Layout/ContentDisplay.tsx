import { AppBar, Box, Card, CardContent } from "@mui/material";
import { CardMedia, Chip, Container, Typography } from "@mui/material";
import Filters from "./Filters";
import { Content } from "@/types";
import Link from "next/link";

export default function ContentDisplay({
	params,
	data,
	admin = false
}: {
	params: {
		searchTerm: string | null | undefined;
		sortKey: string | null | undefined;
		filterKey: string | null | undefined;
		tagFilterKeys: string[] | null | undefined;
	};
	data: any;
	admin?: boolean;
}) {
	const { searchTerm, sortKey, filterKey, tagFilterKeys } = params;

	const homeURL = process.env.NEXT_PUBLIC_VERCEL_ENV! === "production" ? "/search" : "/close-friends/";
	const adminURL = process.env.NEXT_PUBLIC_VERCEL_ENV! === "production" ? "/admin" : "/close-friends/admin";
	const currentURL = process.env.NEXT_PUBLIC_VERCEL_ENV! === "production" ? "/" : "/close-friends/";

	// data is an array whose contents is sometimes wrapped in item
	if (data[0]?.item) {
		data = data.map((feature: { item: Content }) => feature.item);
	}

	const truncate = (input: string) => (input.length > 100 ? `${input.substring(0, 50)}...` : input);

	return (
		<Container disableGutters>
			{!admin ? (
				<AppBar
					sx={{
						minWidth: "100vw",
						px: 4,
						py: 1,
						pb: 3,
						background: "rgba(30, 30, 30, 0.998)",
						borderBottom: "2px solid rgba(219, 9, 20, 1)",
						boxShadow: "none"
					}}>
					<Filters searchTerm={searchTerm} sortKey={sortKey} filterKey={filterKey} tagFilterKeys={tagFilterKeys} url={homeURL} />
				</AppBar>
			) : (
				<Box sx={{ mt: 1, mb: 3 }}>
					<Filters searchTerm={searchTerm} sortKey={sortKey} filterKey={filterKey} tagFilterKeys={tagFilterKeys} url={adminURL} />
				</Box>
			)}
			<Typography variant="h5" sx={{ mb: 1, mt: 0, pt: 0 }}>
				Recent Posts...
			</Typography>
			<Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 2 }}>
				{data.map((feature: Content) => (
					<Card
						key={feature.id}
						sx={{ maxWidth: "100%", bgcolor: "background.paper" }}
						component={Link}
						href={`${currentURL}${feature?.__typename?.toLowerCase()}/${feature.id}`}>
						<CardMedia component="img" height="140" image={feature.image} alt={feature.title} />
						<CardContent>
							<Typography variant="h5" component="div">
								{feature.title}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{truncate(feature.details)}
							</Typography>
							<Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
								{feature.tags.map((tag: string) => (
									<Chip
										key={tag}
										label={tag}
										variant="outlined"
										sx={{
											borderRadius: 1.5,
											borderColor: "#E50914"
										}}
									/>
								))}
							</Box>
						</CardContent>
					</Card>
				))}
			</Box>
		</Container>
	);
}
