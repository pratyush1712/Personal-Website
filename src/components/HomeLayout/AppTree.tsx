"use client";
import * as React from "react";
import { TreeView } from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeItem } from "@mui/x-tree-view";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { VscMarkdown } from "react-icons/vsc";
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

export default function AppTree({
	pages,
	selectedIndex,
	setSelectedIndex,
	currentComponent,
	setCurrentComponent,
	visiblePageIndexs,
	setVisiblePageIndexs
}: Props) {
	const theme = useTheme();
	const pathname = usePathname();
	const page: Page = pages.find(x => x.route === pathname)!;

	useEffect(() => {
		if (page) setSelectedIndex(page.index);
	}, [page, setSelectedIndex]);

	function renderTreeItemBgColor(index: number) {
		if (theme.palette.mode === "dark") {
			return selectedIndex === index ? "rgba(144,202,249,0.16)" : "#252527";
		} else {
			return selectedIndex === index ? "#295fbf" : "#f3f3f3";
		}
	}

	function renderTreeItemColor(index: number) {
		if (theme.palette.mode === "dark") {
			return selectedIndex === index && currentComponent === "tree" ? "white" : "#bdc3cf";
		} else {
			return selectedIndex === index ? "#e2ffff" : "#69665f";
		}
	}

	return (
		<TreeView
			aria-label="file system navigator"
			defaultCollapseIcon={
				<Link href="/" style={{ alignItems: "center", justifyContent: "center", display: "flex" }}>
					<ExpandMoreIcon />
				</Link>
			}
			defaultExpandIcon={<ChevronRightIcon />}
			sx={{ minWidth: 220 }}
			defaultExpanded={["-1"]}>
			<TreeItem
				nodeId="-1"
				label={
					<Link href="/">
						<span style={{ textDecoration: "none", color: "inherit" }}>Home</span>
					</Link>
				}
				sx={{
					color: renderTreeItemColor(-2),
					backgroundColor: renderTreeItemBgColor(-2)
				}}
				onClick={() => {
					setSelectedIndex(-1);
				}}>
				{pages.map(({ index, name, route }) => (
					<TreeItem
						key={index}
						nodeId={index.toString()}
						label={
							<Link href={route}>
								<span style={{ textDecoration: "none", color: "inherit" }}>{name}</span>
							</Link>
						}
						sx={{
							color: renderTreeItemColor(index),
							backgroundColor: renderTreeItemBgColor(index),
							"&& .Mui-selected": { backgroundColor: renderTreeItemBgColor(index) }
						}}
						icon={<VscMarkdown color="#6997d5" />}
						onClick={(e: any) => {
							e.preventDefault();
							if (!visiblePageIndexs.includes(index)) {
								const newIndexs = [...visiblePageIndexs, index];
								setVisiblePageIndexs(newIndexs);
							}
							setSelectedIndex(index);
							setCurrentComponent("tree");
						}}
					/>
				))}
			</TreeItem>
		</TreeView>
	);
}
