import { Box, Card, CardContent, CardMedia, Chip, Container, SelectChangeEvent, Typography } from "@mui/material";
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
	let url;
	if (process.env.NODE_ENV === "production") {
		url = `https://${process.env.NEXT_PUBLIC_PRIVATE_DOMAIN}`;
	} else {
		url = `http://${process.env.NEXT_PUBLIC_PRIVATE_DOMAIN}/close-friends`;
	}

	if (admin) {
		url += "/admin";
	}

	// data is an array whose contents is sometimes wrapped in item
	if (data[0]?.item) {
		data = data.map((feature: { item: Content }) => feature.item);
	}

	return (
		<Container disableGutters>
			<Filters searchTerm={searchTerm} sortKey={sortKey} filterKey={filterKey} tagFilterKeys={tagFilterKeys} url={url} />
			<Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 2 }}>
				{data.map((feature: Content) => (
					<Card key={feature.id} sx={{ maxWidth: 345, bgcolor: "background.paper" }}>
						<Link key={feature.id} href={`${url}/${feature?.__typename?.toLocaleLowerCase()}/${feature.id}`}>
							<CardMedia component="img" height="140" image={feature.image} alt={feature.title} />
							<CardContent>
								<Typography variant="h5" component="div">
									{feature.title}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{feature.details}
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
						</Link>
					</Card>
				))}
			</Box>
		</Container>
	);
}
