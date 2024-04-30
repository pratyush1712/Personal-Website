"use client";
import { Box, Drawer, Toolbar, AppBar, Tab, Tabs, useTheme } from "@mui/material";
import Link from "next/link";

import { useEffect, useState } from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const drawerWidth = 0;
	const [value, setValue] = useState<number | null>(null);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	useEffect(() => {
		const path = window.location.pathname;
		if (path.includes("/blogs")) {
			setValue(1);
		} else if (path.includes("/videos")) {
			setValue(2);
		}
	}, []);

	// if in production, baseURL is /admin and in dev, it is /close-friends/admin
	const currentUrl = process.env.NODE_ENV === "production" ? "/admin" : "/close-friends/admin";

	return (
		<Box sx={{ display: "flex" }}>
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					[`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" }
				}}
			/>
			<Box component="main" sx={{ flexGrow: 1, margin: "auto" }}>
				<Toolbar sx={{ p: 0, margin: "auto" }}>
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label="dashboard tabs"
						variant="fullWidth"
						textColor="inherit"
						TabIndicatorProps={{ style: { backgroundColor: "#E50914" } }}
						sx={{ minWidth: "100%" }}
					>
						<Tab label="General Settings" component={Link} href={`${currentUrl}/`} />
						<Tab label="Blogs Page" component={Link} href={`${currentUrl}/blogs`} />
						<Tab label="Videos Page" component={Link} href={`${currentUrl}/videos`} />
					</Tabs>
				</Toolbar>

				{children}
			</Box>
		</Box>
	);
};

export default DashboardLayout;
