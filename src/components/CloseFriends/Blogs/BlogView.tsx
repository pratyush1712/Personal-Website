import { Content } from "@/types";
import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Footer from "../Layout/Footer";

export default function BlogView({ blog }: { blog: Content }) {
	if (!blog) return null;
	const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric"
	});

	return (
		<Container sx={{ minWidth: "100%" }}>
			<Button variant="contained" sx={{ mt: 3, mx: 3 }} size="small">
				<Link href="/">Back to Home</Link>
			</Button>
			<Typography variant="h4" sx={{ px: 3, pb: 3, pt: 1 }}>
				{blog.title}
				<Typography variant="subtitle2" component="p">
					<strong>Tags</strong>: {blog.tags.join(", ")}
				</Typography>
				<Typography variant="caption" component="p" fontStyle="italic">
					Posted on {formattedDate}
				</Typography>
				<Typography variant="caption" component="p" fontStyle="italic">
					{blog.details}
				</Typography>
			</Typography>
			<Container sx={{ minWidth: "100%" }}>
				<Container
					sx={{
						width: "100%",
						minHeight: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center"
					}}
				>
					<Box sx={{ position: "relative", width: "100%", height: "400px" }}>
						<Image
							unoptimized={true}
							src={blog.image}
							alt={blog.title}
							fill
							quality={100}
							style={{
								objectFit: "contain",
								borderRadius: 2,
								padding: 0,
								margin: "auto"
							}}
						/>
					</Box>
					<Typography variant="caption" component="p" fontStyle="italic" align="center">
						{blog.title}
					</Typography>
				</Container>
				<Container disableGutters sx={{ mt: 2, px: 3, pb: 10 }}>
					<Typography variant="body1" dangerouslySetInnerHTML={{ __html: blog.htmlContent! }}></Typography>
				</Container>
			</Container>
			<Footer darkMode={false} loggedIn={false} />
		</Container>
	);
}
