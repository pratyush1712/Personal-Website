import { Box, Link, Typography } from "@mui/material";
import { VscRemote, VscError, VscWarning, VscBell, VscFeedback, VscCheck } from "react-icons/vsc";
import { IoIosGitBranch } from "react-icons/io";

const itemSx = {
	display: "flex",
	alignItems: "center",
	gap: "4px",
	px: "4px",
	color: "inherit",
	textDecoration: "none",
	"&:hover": { backgroundColor: "rgba(255,255,255,0.12)" }
} as const;

const labelSx = { fontSize: "12px", color: "inherit", lineHeight: 1 } as const;

export default function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				height: "22px",
				display: "flex",
				alignItems: "center",
				gap: "8px",
				px: "8px",
				backgroundColor: "#007acc",
				color: "#ffffff",
				flexShrink: 0
			}}>
			<Box
				component={Link}
				href="https://github.com/pratyush1712"
				target="_blank"
				underline="none"
				sx={{ ...itemSx, cursor: "pointer" }}>
				<VscRemote fontSize="0.8rem" />
				<IoIosGitBranch fontSize="0.8rem" />
				<Typography sx={labelSx}>master</Typography>
			</Box>

			<Box sx={itemSx}>
				<VscError fontSize="0.8rem" />
				<Typography sx={labelSx}>0</Typography>
				<VscWarning fontSize="0.8rem" />
				<Typography sx={labelSx}>0</Typography>
			</Box>

			<Box sx={{ flex: 1 }} />

			<Box sx={{ ...itemSx, cursor: "pointer" }}>
				<VscCheck fontSize="0.8rem" />
				<Typography sx={labelSx}>Prettier</Typography>
			</Box>
			<Box sx={{ ...itemSx, cursor: "pointer" }}>
				<VscFeedback fontSize="0.8rem" />
			</Box>
			<Box sx={{ ...itemSx, cursor: "pointer" }}>
				<VscBell fontSize="0.8rem" />
			</Box>
		</Box>
	);
}
