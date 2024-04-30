"use client";
import { Box, Drawer, Toolbar, AppBar } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import client from "@/graphql/apolloClient";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const drawerWidth = 0;

	return (
		<ApolloProvider client={client}>
			<Box sx={{ display: "flex" }}>
				<Drawer
					variant="permanent"
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						[`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" }
					}}
				/>
				<Box component="main" sx={{ flexGrow: 1, px: 3 }}>
					<Toolbar />
					{children}
				</Box>
			</Box>
		</ApolloProvider>
	);
};

export default DashboardLayout;
