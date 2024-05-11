"use client";
import { Box, Drawer, Toolbar, Tab, Tabs, ThemeProvider, CssBaseline, Icon } from "@mui/material";
import Link from "next/link";
import createTheme from "@/ui/Theme";
import ApolloProvider from "@/graphql/client/apolloProvider";
import { useEffect, useState } from "react";
import { RiDashboardFill } from "react-icons/ri";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	const drawerWidth = 0;
	const [value, setValue] = useState<number | null>(1);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const theme = createTheme(true, {
		palette: {
			type: "dark",
			primary: { main: "#E50914" },
			secondary: { main: "#E50914", dark: "#E50914" },
			info: { main: "#E50914" }
		},
		components: {
			MuiContainer: {
				styleOverrides: { root: (ownerState: { disableGutters: any }) => ({ minWidth: "100%" }) }
			}
		}
	});

	useEffect(() => {
		const path = window.location.pathname;
		if (path.includes("/blogs")) setValue(2);
		else if (path.includes("/videos")) setValue(3);
	}, []);

	// if in production, baseURL is /admin and in dev, it is /close-friends/admin
	const currentUrl = process.env.NODE_ENV === "production" ? "/admin" : "/close-friends/admin";

	return (
		<ApolloProvider>
			<ThemeProvider theme={theme}>
				<CssBaseline />
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
						<div className="p-12 m-12 flex">
							NODE_ENV = {process.env.NODE_ENV} &#187; <br />
							<mark>const currentUrl = process.env.NODE_ENV === production ? /admin : /close-friends/admin</mark> <br />
							{process.env.NODE_ENV === "production" ? "/admin" : "/close-friends/admin"}
						</div>
						<Toolbar sx={{ p: 0, margin: "auto", mt: 2 }}>
							<Tabs
								value={value}
								onChange={handleChange}
								aria-label="dashboard tabs"
								variant="fullWidth"
								textColor="inherit"
								TabIndicatorProps={{ style: { backgroundColor: "#E50914" } }}
								sx={{
									minWidth: "100%",
									borderTopLeftRadius: "180px",
									borderBottomLeftRadius: "180px"
								}}>
								<Tab
									icon={
										<Icon>
											<RiDashboardFill />
										</Icon>
									}
									iconPosition="start"
									component={Link}
									href={`${currentUrl.replace("/admin", "/")}`}
									sx={{ maxWidth: "1px", background: "#E50914", borderRadius: "180px" }}
								/>
								<Tab label="General Settings" component={Link} href={`${currentUrl}/`} />
								<Tab label="Blogs Page" component={Link} href={`${currentUrl}/blogs`} />
								<Tab label="Videos Page" component={Link} href={`${currentUrl}/videos`} />
							</Tabs>
						</Toolbar>
						{children}
					</Box>
				</Box>
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default DashboardLayout;
