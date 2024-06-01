/* eslint-disable @next/next/no-img-element */
import { links } from "@/utils/links";
import { Grid, IconButton, Typography, Link } from "@mui/material";
import GitHubCalendar from "react-github-calendar";
import { FaGithub } from "react-icons/fa";

export default function GitHubPortfolio() {
	return (
		<Grid container direction="column" alignItems="center" spacing={0}>
			<Grid item xs={12} sx={{ mt: -3, mb: 1 }}>
				<Link target="_blank" href={links[0].href} underline="none" color="inherit">
					<Typography
						variant="h3"
						align="center"
						sx={{ margin: "30px 0 0 0", fontSize: { xs: "1.5rem", sm: "2.5rem" } }}>
						GitHub Portfolio
						<IconButton color="inherit">
							<FaGithub size={30} />
						</IconButton>
					</Typography>
				</Link>
			</Grid>
			<Grid
				item
				xs={12}
				sx={{ display: "flex", flexGrow: 1, minWidth: "100%", justifyContent: "center", alignItems: "center" }}>
				<GitHubCalendar username="pratyush1712" blockSize={15} blockMargin={2} maxLevel={7} />
			</Grid>
			<Grid
				item
				xs={12}
				sx={{
					display: "flex",
					mt: 2,
					flexGrow: 1,
					justifyContent: "center",
					alignItems: "center"
				}}>
				<Grid container alignItems="center" spacing={1} justifyContent={"center"} xs={9}>
					<Grid item>
						<img
							src="https://img.shields.io/badge/-JavaScript-%23323330?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"
							alt="JavaScript"
						/>
					</Grid>
					<Grid item>
						<img
							src="https://img.shields.io/badge/-TypeScript-%23007ACC?style=for-the-badge&logo=typescript&logoColor=white"
							alt="TypeScript"
						/>
					</Grid>
					<Grid item>
						<img
							src="https://img.shields.io/badge/-C++-%2300599C?style=for-the-badge&logo=c%2B%2B&logoColor=white"
							alt="C++"
						/>
					</Grid>
					<Grid item>
						<img
							src="https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white"
							alt="GraphQL"
						/>
					</Grid>
					<Grid item>
						<img
							src="https://img.shields.io/badge/-Python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54"
							alt="Python"
						/>
					</Grid>
					<Grid item>
						<img
							src="https://img.shields.io/badge/-Java-%23ED8B00.svg?style=for-the-badge&logo=java&logoColor=white"
							alt="Java"
						/>
					</Grid>
					<Grid item>
						<img
							src="https://img.shields.io/badge/-Shell_Script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white"
							alt="Shell Script"
						/>
					</Grid>
					<Grid item>
						<img
							src="https://img.shields.io/badge/-C-%2300599C.svg?style=for-the-badge&logo=c&logoColor=white"
							alt="C"
						/>
					</Grid>
					<Grid item>
						<img
							src="https://img.shields.io/badge/-HTML5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white"
							alt="HTML5"
						/>
					</Grid>
					<Grid item>
						<img
							src="https://img.shields.io/badge/-CSS3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white"
							alt="CSS3"
						/>
					</Grid>
					<Grid item>
						<img
							src="https://img.shields.io/badge/-PHP-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white"
							alt="PHP"
						/>
					</Grid>
					<Grid item>
						<img
							src="https://img.shields.io/badge/dart-%230175C2.svg?style=for-the-badge&logo=dart&logoColor=white"
							alt="Dart"
						/>
					</Grid>
					<Grid item>
						<img
							src="https://img.shields.io/badge/latex-%23008080.svg?style=for-the-badge&logo=latex&logoColor=white"
							alt="LaTeX"
						/>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} sx={{ mt: 2 }}>
				<Grid container direction="row" justifyContent="space-between">
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
