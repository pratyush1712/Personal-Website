"use client";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";

const ScrollingContainer = styled("div")({
	display: "flex",
	overflow: "hidden",
	maxWidth: "25vw",
	whiteSpace: "nowrap"
});

const ScrollingText = styled(Typography)(({ theme }) => ({
	display: "inline-block",
	paddingRight: "30%",
	animation: "scroll 8s linear infinite",
	fontSize: theme.breakpoints.down("sm") ? ".95rem" : "1.30rem",
	"@keyframes scroll": {
		"0%": { transform: "translateX(0)" },
		"100%": { transform: "translateX(-100%)" }
	}
}));

export default function AnimatedTextComponent() {
	return (
		<ScrollingContainer>
			<ScrollingText variant="caption">
				<i>Que Será, Será | Whatever will be, will be</i>
			</ScrollingText>
			<ScrollingText variant="caption" aria-hidden="true">
				<i>Que Será, Será | Whatever will be, will be</i>
			</ScrollingText>
		</ScrollingContainer>
	);
}
