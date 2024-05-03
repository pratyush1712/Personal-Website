import { Button, Container, Typography } from "@mui/material";

export default function VideoDisplay() {
	return (
		<Container sx={{ minWidth: "100%" }}>
			<Button variant="contained" sx={{ mt: 3, mx: 3 }} size="small">
				Back to Home
			</Button>
			<Typography variant="h4" sx={{ px: 3, pb: 3, pt: 1 }}>
				Video Title
				<Typography variant="subtitle2" component="p">
					<strong>Tags</strong>: Tag1, Tag2
				</Typography>
				<Typography variant="caption" component="p" fontStyle="italic">
					Posted on 2021-10-10
				</Typography>
				<Typography variant="caption" component="p" fontStyle="italic">
					Video Description
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
					<video
						src="https://www.w3schools.com/html/mov_bbb.mp4"
						controls
						width={800}
						height={500}
						style={{
							borderRadius: 2,
							padding: 0,
							margin: "auto"
						}}
					/>
					<Typography variant="caption" component="p" fontStyle="italic" align="center">
						Video Title
					</Typography>
				</Container>
			</Container>
		</Container>
	);
}
