import Video from "@/ui/Video";
import { Button, Container, Typography } from "@mui/material";
import Footer from "../Layout/Footer";

export default function VideoDisplay({ video }: { video: any }) {
	return (
		<Container sx={{ minWidth: "100%" }}>
			<Button variant="contained" sx={{ mt: 3, mx: 3 }} size="small">
				Back to Home
			</Button>
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
