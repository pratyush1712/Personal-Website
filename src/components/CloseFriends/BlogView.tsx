import { Content } from "@/types";
import { Box, Button, Container, Divider, Paper, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

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
			<Typography variant="h4" sx={{ p: 3 }}>
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
			<Container>
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
					<Image
						src={blog.image}
						alt={blog.title}
						objectFit="cover"
						width={800}
						height={500}
						quality={100}
						style={{
							borderRadius: 2,
							padding: 0,
							margin: "auto"
						}}
					/>
					<Typography variant="caption" component="p" fontStyle="italic" align="center">
						{blog.title}
					</Typography>
				</Container>
				<Container disableGutters sx={{ my: 2, px: 3 }}>
					<Typography variant="body1" dangerouslySetInnerHTML={{ __html: blog.htmlContent! }}></Typography>
				</Container>
			</Container>
		</Container>
	);
}
