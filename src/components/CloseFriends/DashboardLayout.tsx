import { Box, Drawer, Toolbar, AppBar } from "@mui/material";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const drawerWidth = 0;

	return (
		<Box sx={{ display: "flex" }}>
			<AppBar position="fixed">App bar content</AppBar>
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" }
				}}
			/>
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				{children}
			</Box>
		</Box>
	);
};

export default DashboardLayout;
