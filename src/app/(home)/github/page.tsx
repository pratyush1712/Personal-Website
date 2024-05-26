/* eslint-disable @next/next/no-img-element */
import { Box, Grid, Typography } from "@mui/material";
import GitHubCalendar from "react-github-calendar";

export default function GitHubPortfolio() {
	return (
		<Grid container direction="column" alignItems="center" spacing={0}>
			<Grid item xs={12} sx={{ mt: -2, mb: 1 }}>
				<Typography
					variant="h3"
					align="center"
					sx={{ margin: "30px 0 0 0", fontSize: { xs: "1.5rem", sm: "2.5rem" } }}>
					GitHub Portfolio
				</Typography>
			</Grid>
			<Grid
				item
				xs={12}
				sx={{ display: "flex", flexGrow: 1, minWidth: "100%", justifyContent: "center", alignItems: "center" }}>
				<GitHubCalendar username="pratyush1712" blockSize={15} blockMargin={2} maxLevel={7} />
			</Grid>
			<Grid item xs={12} sx={{ mt: 2 }}>
				<Grid container direction="row" alignItems="center" spacing={8}>
					<Grid item>
						<img
							src="https://api.githubtrends.io/user/svg/pratyush1712/repos?time_range=one_year&loc_metric=changed&theme=dark"
							alt="GitHub Repositories"
						/>
					</Grid>
					<Grid item>
						<img
							src="https://api.githubtrends.io/user/svg/pratyush1712/langs?time_range=one_year&include_private=True&loc_metric=changed&theme=dark"
							alt="GitHub Languages"
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
}
