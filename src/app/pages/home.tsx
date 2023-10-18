import { Box, Divider, Grid, IconButton, Link, Stack, Tooltip, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
// import logo from '../../static/favicon.png';
import { links } from "./links";
import styled from "styled-components";

interface Props {
	setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}

const Iframe = styled("iframe")(() => ({
	border: "none",
	maxHeight: "80px",
	borderRadius: "13px",
	margin: "7px 0px",
	width: "400px"
}));

const NeverSayNeverComponent = () => {
	return (
		<Grid display="flex" justifyContent={{ xs: "flex-start" }}>
			<Iframe
				src="https://open.spotify.com/embed/track/5rAUZy2eDdegBxUVYxePK2?utm_source=generator"
				allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
				loading="lazy"
			></Iframe>
			{/* </Typography> */}
		</Grid>
	);
};

export default function Home({ setSelectedIndex }: Props) {
	const { pathname } = useLocation();
	useEffect(() => {
		setSelectedIndex(-1);
	}, [setSelectedIndex]);

	useEffect(() => {
		document.title = process.env.REACT_APP_NAME!;
	}, [pathname]);

	const iconLink = (link: any) => {
		return (
			<Tooltip key={link.index} title={link.title} arrow>
				<Link target="_blank" href={link.href} underline="none" color="inherit">
					<IconButton color="inherit">{link.icon}</IconButton>
				</Link>
			</Tooltip>
		);
	};

	type BorderPosition = "TopRight" | "TopLeft" | "BottomRight" | "BottomLeft";
	type BorderProperties = {
		borderTopColor?: string;
		borderRightColor?: string;
		borderLeftColor?: string;
		borderBottomColor?: string;
	};

	const border = (color: string, position: BorderPosition) => {
		const properties: BorderProperties = {};
		position.includes("Top") && (properties.borderTopColor = color);
		position.includes("Right") && (properties.borderRightColor = color);
		position.includes("Left") && (properties.borderLeftColor = color);
		position.includes("Bottom") && (properties.borderBottomColor = color);
		return properties;
	};

	return (
		<Grid
			container
			spacing={0}
			marginTop={{ xs: -20, sm: -8 }}
			marginLeft={{ xs: 2, sm: -3 }}
			direction="column"
			alignItems="center"
			justifyContent="center"
			sx={{ minHeight: `calc(100vh - 20px - 33px)` }}
		>
			<Grid item xs={3}>
				<Stack direction={{ xs: "column", sm: "row-reverse" }} spacing={2}>
					<Box
						display="flex"
						sx={{
							justifyContent: "center",
							display: { xs: "none", md: "block" }
						}}
					>
						{/* <img
                            src={logo}
                            width="170px"
                            height="170px"
                            alt="logo"
                            style={{
                                objectFit: 'cover',
                                borderRadius: '12px',
                                marginTop: '15px',
                                border: '5px solid',
                                ...border('orange', 'TopRight'),
                                ...border('teal', 'BottomLeft'),
                            }}
                        /> */}
					</Box>
					<Box>
						<Grid display="flex" justifyContent={{ xs: "center", sm: "flex-start" }}>
							<Typography variant="h3">{process.env.REACT_APP_NAME}</Typography>
						</Grid>
						<NeverSayNeverComponent />
						<Grid display="flex" justifyContent={"flex-start"}>
							<Stack direction="row" spacing={2.2}>
								{links.filter(link => link.type === "professional").map(link => iconLink(link))}
								<Divider sx={{ m: 0.5 }} orientation={"vertical"} />
								{links.filter(link => link.type === "social").map(link => iconLink(link))}
							</Stack>
						</Grid>
					</Box>
				</Stack>
			</Grid>
		</Grid>
	);
}
