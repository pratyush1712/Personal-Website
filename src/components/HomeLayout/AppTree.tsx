"use client";
import * as React from "react";
import { useEffect } from "react";
import { Box } from "@mui/material";
import { VscArrowDown } from "react-icons/vsc";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Page {
	index: number;
	name: string;
	route: string;
	description: string;
}

interface Props {
	pages: Page[];
	selectedIndex: number;
	setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
	currentComponent: string;
	setCurrentComponent: React.Dispatch<React.SetStateAction<string>>;
	visiblePageIndexs: number[];
	setVisiblePageIndexs: React.Dispatch<React.SetStateAction<number[]>>;
}

// Flat, Cursor-style file list (the "Portfolio Files" tree). Collapsing is owned by the
// parent ExplorerPanel section, so this no longer needs the VS Code SimpleTreeView wrapper.
export default function AppTree({
	pages,
	selectedIndex,
	setSelectedIndex,
	currentComponent,
	setCurrentComponent,
	visiblePageIndexs,
	setVisiblePageIndexs
}: Props) {
	const pathname = usePathname();
	// Normalize "/overview" -> "overview" so the active route actually matches page.route.
	const currentRoute = pathname ? pathname.replace(/^\/+/, "") : "";
	const activePage = pages.find(x => x.route === currentRoute);

	useEffect(() => {
		if (activePage) setSelectedIndex(activePage.index);
	}, [activePage, setSelectedIndex]);

	function openPage(index: number) {
		if (!visiblePageIndexs.includes(index)) {
			setVisiblePageIndexs([...visiblePageIndexs, index]);
		}
		setSelectedIndex(index);
		setCurrentComponent("tree");
	}

	return (
		<Box role="list" aria-label="Portfolio files">
			{pages.map(({ index, name, route }) => {
				const active = selectedIndex === index;
				return (
					<Link key={index} href={route} style={{ textDecoration: "none" }}>
						<Box
							role="listitem"
							aria-current={active ? "page" : undefined}
							onClick={() => openPage(index)}
							sx={{
								display: "flex",
								alignItems: "center",
								gap: "6px",
								paddingLeft: "20px",
								paddingRight: "12px",
								paddingTop: 0,
								paddingBottom: 0,
								height: "22px",
								lineHeight: "22px",
								fontSize: "13px",
								fontWeight: 400,
								fontStyle: "normal",
								cursor: "pointer",
								userSelect: "none",
								color: "#cccccc",
								backgroundColor: active ? "rgba(255,255,255,0.08)" : "transparent",
								"&:hover": {
									backgroundColor: active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)"
								}
							}}>
							<Box component="span" sx={{ display: "inline-flex", color: "#4fc1ff", flexShrink: 0 }}>
								<VscArrowDown size={14} />
							</Box>
							{name}
						</Box>
					</Link>
				);
			})}
		</Box>
	);
}
