import Video from "@/ui/Video";
import { Button, Container, Typography } from "@mui/material";
import Footer from "../Layout/Footer";
import Link from "next/link";

export default function VideoDisplay({ video }: { video: any }) {
	return (
		<Container sx={{ minWidth: "100%" }}>
			<Link href={process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ? "/home" : "/close-friends"} passHref>
				<Button variant="contained" sx={{ mt: 3, mx: 3 }} size="small">
					Back to Home
				</Button>
			</Link>
			<Typography variant="h4" sx={{ px: 3, pb: 3, pt: 1 }}>
				{video.title}
				<Typography variant="subtitle2" component="p">
					<strong>Tags</strong>: {video.tags.join(", ")}
				</Typography>
				<Typography variant="caption" component="p" fontStyle="italic">
					Posted on {new Date(video.createdAt).toDateString()}
				</Typography>
				<Typography variant="caption" component="p" fontStyle="italic">
					{video.details}
				</Typography>
			</Typography>
			<Container sx={{ minWidth: "100%", minHeight: "100%" }}>
				<Container
					sx={{
						width: "100%",
						minHeight: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center"
					}}>
					<Video
						src={video.videoUrl}
						controls={true}
						width="70%"
						height="100%"
						style={{
							borderRadius: 2,
							padding: 0,
							marginBottom: 100
						}}
					/>
					<Footer darkMode={false} loggedIn={false} />
				</Container>
			</Container>
		</Container>
	);
}
