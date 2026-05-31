import { Box, Link, Paper, Typography } from "@mui/material";
import { VscRemote, VscError, VscWarning, VscBell, VscFeedback, VscCheck } from "react-icons/vsc";
import { IoIosGitBranch } from "react-icons/io";

// Muted Cursor-style status bar: panel background with a thin top border, secondary text
// that brightens on hover. No VS Code blue/green blocks.
const itemSx = {
	display: "flex",
	alignItems: "center",
	gap: 0.4,
	px: 0.5,
	color: "text.secondary",
	"&:hover": { color: "text.primary" }
} as const;

const labelSx = { fontSize: "0.62rem", color: "inherit" } as const;

export default function Footer() {
	return (
		<Box
			component={Paper}
			square
			elevation={0}
			sx={{
				height: "22px",
				display: "flex",
				alignItems: "center",
				gap: 1,
				px: 1,
				backgroundColor: "background.paper",
				borderTop: 1,
				borderColor: "divider",
				color: "text.secondary"
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
